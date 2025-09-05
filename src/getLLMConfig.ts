import 'dotenv/config';

import { z } from 'zod';

export const getLLMConfig = () =>
	z
		.object({
			baseUrl: z.string().optional(),
			token: z.string(),
			model: z.string().optional().default('openai/gpt-4o-mini'),
		})
		.parse({
			baseUrl: process.env.OPENAI_BASE_URL,
			token: process.env.OPENAI_API_KEY,
			model: process.env.OPENAI_MODEL,
		});

export type ConfigProvider = typeof getLLMConfig;
