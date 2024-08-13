import { signSendWait } from '@wormhole-foundation/sdk';

const tb = await srcChain.getTokenBridge(); 

const token = '0xdeadbeef...';
const txGenerator = tb.createAttestation(token); 
const txids = await signSendWait(srcChain, txGenerator, src.signer);