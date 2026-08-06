import { toNative } from '@wormhole-foundation/sdk-core';

const solAddress: NativeAddress<'Solana'> = toNative(
  'Solana',
  '6zZHv9EiqQYcdg52ueADRY6NbCXa37VKPngEHaokZq5J'
);
const universalAddressSol = solAddress.toUniversalAddress().toString();
console.log('Universal Address (Solana):', universalAddressSol);
