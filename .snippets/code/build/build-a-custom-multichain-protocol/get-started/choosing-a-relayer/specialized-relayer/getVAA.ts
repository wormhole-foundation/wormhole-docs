import {
  getSignedVAAWithRetry,
  parseVAA,
  CHAIN_ID_SOLANA,
  CHAIN_ID_ETH,
} from '@certusone/wormhole-sdk';

const RPC_HOSTS = [
  /* ...*/
];

async function getVAA(
  emitter: string,
  sequence: string,
  chainId: number
): Promise<Uint8Array> {
  // Wait for the VAA to be ready and fetch it from the guardian network
  const { vaaBytes } = await getSignedVAAWithRetry(
    RPC_HOSTS,
    chainId,
    emitter,
    sequence
  );
  return vaaBytes;
}

const vaaBytes = await getVAA('INSERT-EMITTER-ADDRESS', 1, CHAIN_ID_ETH);
