// ==UserScript==
// @name         jira-issue-navigate
// @version      0.5.0
// @description  Go to the next/prev issue using buttons
// @author       Amin Yahyaabadi
// @match        https://*.atlassian.net/browse/*
// @match        https://*.atlassian.net/jira/software/projects/*
// @grant        none
// @license      MIT
// @namespace    AminYa
// @homepage https://github.com/aminya/jira-issue-navigate
// ==/UserScript==

import { parseIssueUrl } from "./jira-issue-url"

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
  buttonIcon.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 20.633 20.633" style="enable-background:new 0 0 20.633 20.633" xml:space="preserve">
    <path d="M15.621 9.844 5.971.195A.652.652 0 0 0 5.5 0a.664.664 0 0 0-.473.195l-.013.012a.677.677 0 0 0-.197.475v4.682c0 .178.071.348.197.471l4.481 4.482-4.481 4.479a.667.667 0 0 0-.197.475v4.68c0 .18.071.354.197.475l.013.01a.664.664 0 0 0 .947 0l9.647-9.646a.671.671 0 0 0 0-.946z" />
</svg>`
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
