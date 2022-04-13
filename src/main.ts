// ==UserScript==
// @name         jira-issue-navigate
// @version      0.3.0
// @description  Go to the next issue using a button
// @author       Amin Yahyaabadi
// @match        https://*.atlassian.net/browse/*
// @match        https://*.atlassian.net/jira/software/projects/*
// @grant        none
// @license      MIT
// @namespace    AminYa
// ==/UserScript==

function main() {
  const currentURL = window.location.href

  // parse the URL
  const urlMatch = /(.*)\.atlassian\.net\/(browse|jira\/software\/projects)\/(.*)-(\d*)(\?.*)?/
  const res = urlMatch.exec(currentURL)
  // if the url doesn't match return
  if (res === null) {
    return
  }
  const [, company, middle, project, issue, queries] = res

  const issueNumber = parseInt(issue, 10)

  // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
  const queriesString = queries === undefined ? "" : queries

  // create a button to go to the next issue
  const nextButton = document.createElement("button")
  nextButton.id = "next-issue-btn"
  nextButton.setAttribute("aria-label", "Go to next issue")
  nextButton.setAttribute("aria-expanded", "false")
  nextButton.setAttribute("aria-haspopup", "true")
  nextButton.setAttribute("type", "button")
  nextButton.style.borderRadius = "2px"
  const buttonIcon = document.createElement("div")
  buttonIcon.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 20.633 20.633" style="enable-background:new 0 0 20.633 20.633" xml:space="preserve">
    <path d="M15.621 9.844 5.971.195A.652.652 0 0 0 5.5 0a.664.664 0 0 0-.473.195l-.013.012a.677.677 0 0 0-.197.475v4.682c0 .178.071.348.197.471l4.481 4.482-4.481 4.479a.667.667 0 0 0-.197.475v4.68c0 .18.071.354.197.475l.013.01a.664.664 0 0 0 .947 0l9.647-9.646a.671.671 0 0 0 0-.946z" />
</svg>`
  nextButton.style.background = "none"
  nextButton.style.border = "none"
  // attach the icon
  nextButton.appendChild(buttonIcon)

  // create a tooltip for the button that shows "Go to next issue" on hover
  const buttonTooltip = document.createElement("div")
  buttonTooltip.id = "next-issue-btn-tooltip"
  buttonTooltip.setAttribute("style", `position: relative;`)
  nextButton.prepend(buttonTooltip)

  const buttonTooltipText = document.createElement("div")
  buttonTooltipText.innerHTML = "Next"
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

  // set the the button class
  const likeButtonSelector = "#jira-issue-header-actions > div > div > div:nth-child(4)"
  const likeButton = document.querySelector(likeButtonSelector)
  if (likeButton !== null) {
    console.debug(`${likeButtonSelector} was not found`)
    nextButton.className = likeButton.className
  }

  // button functionality
  nextButton.addEventListener("click", () => {
    // get the next issue number
    const nextIssueNumber = issueNumber + 1

    // create the next issue url
    const nextIssueURL = `${company}.atlassian.net/${middle}/${project}-${nextIssueNumber}${queriesString}`

    // navigate to the next issue
    window.location.href = nextIssueURL
  })

  nextButton.addEventListener("mouseover", () => {
    nextButton.style.background = "#091e4214"
    buttonTooltipText.style.visibility = "visible"
  })

  nextButton.addEventListener("mouseleave", () => {
    nextButton.style.background = "none"
    buttonTooltipText.style.visibility = "hidden"
  })

  // attach the button to the toolbar
  const toolbarSelector = "#jira-issue-header-actions > div > div"
  const toolbar = document.querySelector(toolbarSelector)
  if (toolbar === null) {
    console.debug(`${toolbarSelector} was not found`)
    return
  }
  toolbar.prepend(nextButton)
}

setTimeout(main, 2000)
