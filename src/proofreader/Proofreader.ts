export interface Proofreader {
	proofread(content: string): Promise<string>;
}
