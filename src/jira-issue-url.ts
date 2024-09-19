export function parseIssueUrl() {
  const currentURL = window.location.href

  // parse the URL
  const urlMatch = /(.*)\.atlassian\.net\/(browse|jira\/software\/projects)\/(.*)-(\d*)(\?.*)?/
  const res = urlMatch.exec(currentURL)
  // if the url doesn't match return
  if (res === null) {
    return null
  }
  const [, company, middle, project, issue, queries] = res

  const issueNumber = parseInt(issue, 10)

  // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
  const queriesString = queries ?? ""

  return {
    company,
    middle,
    project,
    issueNumber,
    queriesString,
  }
}
