import { generate } from "@userscripters/generate-headers/dist/generate.js"
import { dirname, join } from "path"
import { readFile, writeFile } from "fs/promises"
import desm from "desm"

const __dirname = desm(import.meta.url)

async function main() {
  const content = await generate("tampermonkey", {
    packagePath: join(dirname(__dirname), "package.json"),
    output: "./a.js",
    direct: true,
    matches: ["https://*.atlassian.net/browse/*", "https://*.atlassian.net/jira/software/projects/*"],
    run: "end",
    collapse: false,
    eol: "\n",
  })

  const file = join(dirname(__dirname), "dist", "jira-issue-navigate.js");

  // prepend the header to the file
  const fileContent = await readFile(file, "utf-8")
  await writeFile(file, `${content}\n${fileContent}`)
}

main().catch((err) => {
  throw err
})
