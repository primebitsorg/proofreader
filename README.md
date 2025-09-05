Simple CLI for proofreading text files via LLM.

# Usage

Install the package as a global CLI program via `npm i -g pedantify`

Create a `.env` file in the working directory and configure it. You may copy the template below.

```
OPENAI_BASE_URL=https://openrouter.ai/api/v1
OPENAI_MODEL=openai/gpt-4o-mini
OPENAI_API_KEY=YOUR_KEY_HERE
```

Alternatively, you may pass these values as env variables when running a command.

Done. Now, you can proofread text files via `pedantify -w ./README.md`

Run `pedantify -h` for more info:
```sh
Usage: pedantify [options] <file>

Fix typos, grammar and style errors in target text file

Example:
  # Proofread a file and write result back to file
  pedantify -w ./README.md
  # Proofread a file and print in console a fixed text
  pedantify ./README.md

Arguments:
  file         Text file path

Options:
  -w, --write  Write output to file. If not enabled, content will only be printed in stdout (default: false)
  -h, --help   display help for command
```

# License

Code is under the MIT license.

Contributions are welcome.