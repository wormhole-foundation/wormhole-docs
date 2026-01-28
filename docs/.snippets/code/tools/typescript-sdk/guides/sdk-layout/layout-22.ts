import { deserialize } from '@wormhole-foundation/sdk-core/vaa/functions';

const serializedVAA = new Uint8Array([
  /* Serialized VAA binary data */
]);

const vaaPayloadType = 'SomePayloadType'; // The payload type expected for this VAA
const deserializedVAA = deserialize(vaaPayloadType, serializedVAA);
