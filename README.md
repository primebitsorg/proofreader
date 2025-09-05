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

Done. Now, you can proofread text files.

```sh
# Will proofread file and write result back to file
pedantify ./README.md -w
```

# License

Code is under the MIT license.

Contributions are welcome.