Simple CLI for proofread text files via LLM.

# Usage

Install package as global CLI program via `npm i -g pedantify`

Create `.env` file in working directory and configure it. You may copy template below.

```
OPENAI_BASE_URL=https://openrouter.ai/api/v1
OPENAI_MODEL=openai/gpt-4o-mini
OPENAI_API_KEY=YOUR_KEY_HERE
```

Alternatively, you may pass this values as env variables when run a command.

Done. Now, you can proofread text files.

```sh
# Will proofread file and write result back to file
pedantify ./README.md -w
```

# License

Code is under MIT license.

Contributions are welcome.