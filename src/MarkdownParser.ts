const blogPostMarkdown: string = `# control

*humans should focus on bigger problems*

## Setup

\`\`\`bash
git clone git@github.com:anysphere/control
\`\`\`

\`\`\`bash
./init.sh
\`\`\`

## Folder structure

**The most important folders are:**

1. \`vscode\`: this is our fork of vscode, as a submodule.
2. \`milvus\`: this is where our Rust server code lives.
3. \`schema\`: this is our Protobuf definitions for communication between the client and the server.

Each of the above folders should contain fairly comprehensive README files; please read them. If something is missing, or not working, please add it to the README!

Some less important folders:

1. \`release\`: this is a collection of scripts and guides for releasing various things.
2. \`infra\`: infrastructure definitions for the on-prem deployment.
3. \`third_party\`: where we keep our vendored third party dependencies.

## Miscellaneous things that may or may not be useful

##### Where to find rust-proto definitions

They are in a file called \`aiserver.v1.rs\`. It might not be clear where that file is. Run \`rg --files --no-ignore bazel-out | rg aiserver.v1.rs\` to find the file.

## Releasing

Within \`vscode/\`:

- Bump the version
- Then:

\`\`\`
git checkout build-todesktop
git merge main
git push origin build-todesktop
\`\`\`

- Wait for 14 minutes for gulp and ~30 minutes for todesktop
- Go to todesktop.com, test the build locally and hit release
`

let currentContainer: HTMLElement | null = null
// Do not edit this method
function runStream() {
  currentContainer = document.getElementById("markdownContainer")!

  // this randomly split the markdown into tokens between 2 and 20 characters long
  // simulates the behavior of an ml model thats giving you weirdly chunked tokens
  const tokens: string[] = []
  let remainingMarkdown = blogPostMarkdown
  while (remainingMarkdown.length > 0) {
    const tokenLength = Math.floor(Math.random() * 18) + 2
    const token = remainingMarkdown.slice(0, tokenLength)
    tokens.push(token)
    remainingMarkdown = remainingMarkdown.slice(tokenLength)
  }

  const toCancel = setInterval(() => {
    const token = tokens.shift()
    if (token) {
      addToken(token)
    } else {
      clearInterval(toCancel)
    }
  }, 20)
}

// dont be afraid of using globals for state
let currentLineType: string | null = null
let symbolStore: string = ""

/*YOUR CODE HERE
this does token streaming with no styling right now
your job is to write the parsing logic to make the styling work
 */

// i need to parse the content manually
enum LineType {
  BOLD,
  HEADING_1,
  HEADING_2,
  HEADING_3,
  HEADING_4,
  CODEBLOCK,
  UL,
  OL,
}

// https://markdowntohtml.com/

const mdMap = {
  "**": "<i>",
  "*": "<b>",
  "#": "<h1>",
  "##": "<h2>",
  "###": "<h3>",
  "####": "<h4>",

  "```": "<code>",

  "1": "<li>",
  "-": "<li>",
  // TODO: ``: should be <pre></pre>
}
// this method is too labourous, lets try css way:

function addToken(token: string) {
  console.log({ token })

  token = token.replace("\n", "<br>")

  if (!currentContainer) return

  const span = document.createElement("span")

  // Check for heading
  if (token.startsWith("#")) {
    currentLineType = "heading"
    span.classList.add(`h-${token.length.toString()}`)
  } else {
    currentLineType = null
  }

  if (token.startsWith("```")) {
    if (currentLineType === "code") {
      currentLineType = null
      span.classList.remove("code")
    } else {
      currentLineType = "code"
      span.classList.add("code")
      // TODO: code class
    }
  }

  if (token.startsWith("**")) {
    if (currentLineType === "italic") {
      currentLineType = null
      span.classList.remove("italic")
    } else {
      currentLineType = "italic"
      span.classList.add("i")
    }
  }

  if (token.startsWith("*") && token[1] != "*") {
    if (currentLineType === "bold") {
      currentLineType = null
      span.classList.remove("font-bold")
    } else {
      currentLineType = "bold"
      span.classList.add("font-bold")
    }
  }

  span.innerText = token

  currentContainer.appendChild(span)
}
