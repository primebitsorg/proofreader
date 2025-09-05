import path from 'path';

import { readFile, writeFile } from 'fs/promises';
import { LLMProofreader } from './proofreader/LLMProofreader';

export class FileProofreader {
	constructor(private readonly proofreader: LLMProofreader) {}

	public async fix(file: string, opts: { write?: boolean } = {}) {
		const fullPath = path.resolve(file);
		const original = await readFile(fullPath, 'utf-8');
		const fixed = await this.proofreader.proofread(original);

		if (fixed.trim() === original.trim()) {
			console.log('No changes needed.');
			return;
		}

		console.log('--- Proofread Output ---\n');
		console.log(fixed);

		if (opts.write) {
			await writeFile(fullPath, fixed, 'utf-8');
			console.log(`File updated: ${fullPath}`);
		}
	}
}
