import { wormhole } from '@wormhole-foundation/sdk';
import evm from '@wormhole-foundation/sdk/evm';

const wh = await wormhole('Mainnet', [evm]);
const eth = wh.getChain('Ethereum');
const tokenBridge = await eth.getTokenBridge();

console.log('Token Bridge:', tokenBridge);
