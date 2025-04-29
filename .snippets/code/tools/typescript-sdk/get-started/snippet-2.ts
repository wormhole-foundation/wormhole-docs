import { Wormhole } from '@wormhole-foundation/sdk';

const wh = await Wormhole.init('Testnet');
const eth = wh.getChain('Ethereum');
const tokenBridge = await eth.getTokenBridge();

console.log('Token Bridge address:', tokenBridge.address);
console.log('Contract functions:', Object.keys(tokenBridge.contract.methods));
