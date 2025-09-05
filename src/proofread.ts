import 'dotenv/config';

import { Command } from 'commander';
import OpenAI from 'openai';
import { z } from 'zod';

import { FileProofreader } from './FileProofreader';
import { ConfigProvider } from './getLLMConfig';
import { LLMProofreader } from './proofreader/LLMProofreader';

export default (getConfig: ConfigProvider) => {
	const command = new Command();

	command
		.description('Proofread for Markdown posts')
		.argument('<file>', 'Markdown file path')
		.option('-w, --write', 'Write output to file', false)
		.action(async (...args) => {
			const [file, opts] = z
				.tuple([
					z.string().min(1),
					z.object({
						write: z.boolean(),
					}),
				])
				.rest(z.any())
				.parse(args);

			const llm = getConfig();
			const proofreader = new LLMProofreader(
				new OpenAI({
					baseURL: llm.baseUrl,
					apiKey: llm.token,
				}),
				{
					model: llm.model,
					prompt: [
						{
							role: 'system',
							content: `
						You are a proofreader. Fix grammar and style, preserve markdown. Do not add any comments and only return fixed markdown text.
	
						You must never replace computer terms.
						You must never add a dots at end of lists.
	
						Do not use character ";", prefer comma instead.
	
						You must never change the tone of text. If text is a bit aggressive, you must leave this style.
						You must never up promises. If text promises "to make great", you must never replace it to something like "to ensure great".
	
						You must not never move a dot inside quotemark like that \`"foo bar."\` as fix for \`"foo bar".\`
						`,
						},
					],
				},
			);

			await new FileProofreader(proofreader).fix(file, opts);
		});

	return command;
};
