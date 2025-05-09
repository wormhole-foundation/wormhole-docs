import { wormhole } from '@wormhole-foundation/sdk';
import evm from '@wormhole-foundation/sdk/evm';

const wh = await wormhole('Testnet', [evm]);
const chain = wh.getChain('Ethereum');

console.log('Wormhole chain ID for Ethereum:', chain.config.chainId);
