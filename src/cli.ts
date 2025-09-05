import { getLLMConfig } from './getLLMConfig';
import proofreadCommand from './proofread';

proofreadCommand(getLLMConfig).parse();
