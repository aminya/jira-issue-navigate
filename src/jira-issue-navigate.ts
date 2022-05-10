import { parseIssueUrl } from "./jira-issue-url"
// @ts-ignore
import * as rightArrow from "bundle-text:./right-arrow.svg"

function createButton(
  company: string,
  middle: string,
  project: string,
  issueNumber: number,
  queriesString: string,
  direction: "next" | "prev"
) {
  // create a button to go to the next issue
  const button = document.createElement("a")
  button.id = `${direction}-issue-btn`
  button.setAttribute("aria-label", `Go to ${direction} issue`)
  button.setAttribute("aria-expanded", "false")
  button.setAttribute("aria-haspopup", "true")
  button.setAttribute("type", "button")
  button.style.borderRadius = "2px"
  button.style.alignSelf = "center"
  button.style.padding = "7px"
  const buttonIcon = document.createElement("div")
  buttonIcon.innerHTML = rightArrow as string
  button.style.background = "none"
  button.style.border = "none"

  // rotate the icon if it's the prev button
  if (direction === "prev") {
    buttonIcon.style.transform = "rotate(180deg) translate(0px, 3px)"
  }

  // attach the icon
  button.appendChild(buttonIcon)

  // set the the button class
  const likeButtonSelector = "#jira-issue-header-actions > div > div > div:nth-child(4)"
  const likeButton = document.querySelector(likeButtonSelector)
  if (likeButton !== null) {
    console.debug(`${likeButtonSelector} was not found`)
    button.className = likeButton.className
  }

  // issue number
  let targetIssueNumber: number
  if (direction === "next") {
    targetIssueNumber = issueNumber + 1
  } else {
    targetIssueNumber = issueNumber - 1
  }

  // create the next issue url
  const issueURL = `${company}.atlassian.net/${middle}/${project}-${targetIssueNumber}${queriesString}`
  // navigate to the next issue on click
  button.setAttribute("href", issueURL)

  // create a tooltip for the button that shows "Go to next issue" on hover
  addTooltip(button, direction)

  return button
}

function addTooltip(button: HTMLAnchorElement, direction: "next" | "prev" = "next") {
  // create a tooltip for the button that shows "Go to next issue" on hover
  const buttonTooltip = document.createElement("div")
  buttonTooltip.id = `${direction}-issue-btn-tooltip`
  buttonTooltip.setAttribute("style", `position: relative;`)

  const buttonTooltipText = document.createElement("div")
  buttonTooltipText.innerHTML = direction[0].toUpperCase() + direction.slice(1)
  buttonTooltipText.setAttribute(
    "style",
    `width: 50px;
     text-align: center;
     border-radius: 4px;
     padding: 1px 0;
     font-size: small;
     background: #172B4D;
     color: white;
     
     position: absolute;
     z-index: 1;
     bottom: 100%;
     left: 50%;
     margin-left: -30px;
     margin-bottom: 15px;
     `
  )
  buttonTooltipText.style.visibility = "hidden"
  buttonTooltip.prepend(buttonTooltipText)

  button.addEventListener("mouseover", () => {
    button.style.background = "#091e4214"
    buttonTooltipText.style.visibility = "visible"
  })

  button.addEventListener("mouseleave", () => {
    button.style.background = "none"
    buttonTooltipText.style.visibility = "hidden"
  })

  button.prepend(buttonTooltip)
}

function main() {
  const parseResult = parseIssueUrl()
  if (parseResult === null) {
    return
  }
  const { company, middle, project, issueNumber, queriesString } = parseResult

  // create a button to go to the next issue
  const nextButton = createButton(company, middle, project, issueNumber, queriesString, "next")
  const prevButton = createButton(company, middle, project, issueNumber, queriesString, "prev")

  // get the toolbar
  const toolbarSelector = "#jira-issue-header-actions > div > div"
  const toolbar = document.querySelector(toolbarSelector)
  if (toolbar === null) {
    console.debug(`${toolbarSelector} was not found`)
    return
  }

  // attach the button to the toolbar
  toolbar.prepend(prevButton)
  toolbar.prepend(nextButton)
}

setTimeout(main, 2000)
