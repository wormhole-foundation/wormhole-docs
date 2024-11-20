import { serialize } from '@wormhole-foundation/sdk-core/vaa/functions';

const vaaData = {
  guardianSet: 1,
  signatures: [{ guardianIndex: 0, signature: new Uint8Array(65).fill(0) }],
  timestamp: 1633000000,
  nonce: 42,
  emitterChain: 2, // Ethereum
  emitterAddress: new Uint8Array(32).fill(0),
  sequence: BigInt(1),
  consistencyLevel: 1,
  payloadLiteral: 'SomePayloadType',
  payload: { key: 'value' },
};

const serializedVAA = serialize(vaaData);