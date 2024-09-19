import { generate } from "@userscripters/generate-headers/dist/generate.js"
import { dirname, join } from "path"
import desm from "desm"

const __dirname = desm(import.meta.url)

async function main() {
  const file = join(dirname(__dirname), "dist", "jira-issue-navigate.js")

  await generate("tampermonkey", {
    packagePath: join(dirname(__dirname), "package.json"),
    output: file,
    matches: ["https://*.atlassian.net/browse/*", "https://*.atlassian.net/jira/software/projects/*"],
    namespace: "AminYa",
    homepage: "https://github.com/aminya/jira-issue-navigate",
    run: "end",
    collapse: false,
    eol: "\n",
  })
}

main().catch((err) => {
  throw err
})
