import { signSendWait } from '@wormhole-foundation/sdk';

// ...

const tb = await srcChain.getTokenBridge(); // => TokenBridge<'Evm'>

const token = '0xdeadbeef...';
const txGenerator = tb.createAttestation(token); // => AsyncGenerator<UnsignedTransaction, ...>
const txids = await signSendWait(srcChain, txGenerator, src.signer); // => TxHash[]