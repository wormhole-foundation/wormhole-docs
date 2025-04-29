import { Wormhole } from '@wormhole-foundation/sdk';

const wh = await Wormhole.init('Testnet');
const chain = wh.getChain('Ethereum');

console.log('Wormhole chain ID for Ethereum:', chain.chainId);
