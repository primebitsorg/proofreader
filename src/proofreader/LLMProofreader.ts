import OpenAI from 'openai';
import { ChatCompletionMessageParam } from 'openai/resources';

import { Proofreader } from './Proofreader';

export class LLMProofreader implements Proofreader {
	constructor(
		private readonly openai: OpenAI,
		private readonly config: { model: string; prompt: ChatCompletionMessageParam[] },
	) {}

	public async proofread(content: string) {
		const resp = await this.openai.chat.completions.create({
			model: this.config.model,
			messages: [...this.config.prompt, { role: 'user', content }],
			temperature: 0,
		});

		return resp.choices[0].message?.content ?? content;
	}
}
