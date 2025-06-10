import { deserializeLayout } from '@wormhole-foundation/sdk-base';
import {
  universalAddressItem,
  sequenceItem,
} from '@wormhole-foundation/core/layout-items/index.js';

export const envelopeLayout = [
  { name: 'timestamp', binary: 'uint', size: 4 },
  { name: 'nonce', binary: 'uint', size: 4 },
  { name: 'emitterChain', binary: 'uint', size: 2 },
  { name: 'emitterAddress', ...universalAddressItem },
  { name: 'sequence', ...sequenceItem },
  { name: 'consistencyLevel', binary: 'uint', size: 1 },
] as const satisfies Layout;

const encodedEnvelope = new Uint8Array([
  /* binary envelope data */
]);
const deserializedEnvelope = deserializeLayout(envelopeLayout, encodedEnvelope);
