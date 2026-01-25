import memfs from 'memfs';
import type OpenAI from 'openai';

const OpenAIMock = vi.fn(() => ({
	chat: {
		completions: {
			create: CompletionMock,
		},
	},
}));

const createCompletion = (text: string) =>
	({
		id: 'fake',
		model: 'fake',
		created: 0,
		object: 'chat.completion',
		choices: [
			{
				message: {
					content: text,
					role: 'assistant',
					refusal: null,
				},
				finish_reason: 'length',
				index: 0,
				logprobs: null,
			},
		],
	}) satisfies OpenAI.Chat.Completions.ChatCompletion;

const CompletionMock = vi.fn(async () => {
	return createCompletion('');
});

vi.mock('openai', () => {
	return {
		default: OpenAIMock,
	};
});

vi.mock('fs', async () => {
	const { fs } = await import('memfs');

	return { default: fs };
});

vi.mock('fs/promises', async () => {
	const { fs } = await import('memfs');

	return { default: fs.promises };
});

beforeEach(() => {
	memfs.vol.reset();
	CompletionMock.mockClear();
});

test('Write content when flag -w is provided', async () => {
	const filePath = '/var/file.txt';
	const fileText = 'Hello world';
	memfs.vol.fromJSON({
		[filePath]: fileText,
	});

	CompletionMock.mockReturnValueOnce(Promise.resolve(createCompletion('Updated text')));

	const { default: proofreadCommand } = await import('./proofread');
	await proofreadCommand(() => ({
		token: 'API_TOKEN',
		model: 'MODEL_NAME',
		baseUrl: 'BASE_URL',
	})).parseAsync(['-w', filePath], { from: 'user' });

	expect(OpenAIMock).toBeCalledWith({
		apiKey: 'API_TOKEN',
		baseURL: 'BASE_URL',
	});

	expect(CompletionMock).toBeCalledWith(
		expect.objectContaining({
			model: 'MODEL_NAME',
			messages: [
				{ content: expect.any(String), role: 'system' },
				{ content: fileText, role: 'user' },
			],
		}),
	);

	expect(memfs.vol.readFileSync(filePath, { encoding: 'utf8' })).toBe('Updated text');
});

test('Print content', async () => {
	const filePath = '/var/file.txt';
	const fileText = 'Hello world';
	memfs.vol.fromJSON({
		[filePath]: fileText,
	});

	CompletionMock.mockReturnValueOnce(Promise.resolve(createCompletion('Updated text')));

	const { default: proofreadCommand } = await import('./proofread');
	await proofreadCommand(() => ({
		token: 'API_TOKEN',
		model: 'MODEL_NAME',
		baseUrl: 'BASE_URL',
	})).parseAsync([filePath], { from: 'user' });

	expect(OpenAIMock).toBeCalledWith({
		apiKey: 'API_TOKEN',
		baseURL: 'BASE_URL',
	});

	expect(CompletionMock).toBeCalledWith(
		expect.objectContaining({
			model: 'MODEL_NAME',
			messages: [
				{ content: expect.any(String), role: 'system' },
				{ content: fileText, role: 'user' },
			],
		}),
	);

	expect(memfs.vol.readFileSync(filePath, { encoding: 'utf8' })).toBe(fileText);
});
