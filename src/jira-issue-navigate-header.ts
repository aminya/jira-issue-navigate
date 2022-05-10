import { generate } from "@userscripters/generate-headers/dist/generate"
import { dirname, join } from "path"

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
  console.log(content)
}

main().catch((err) => {
  throw err
})
