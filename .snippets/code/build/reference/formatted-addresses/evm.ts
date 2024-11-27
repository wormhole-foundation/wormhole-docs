import { toNative } from '@wormhole-foundation/sdk-core';

const ethAddress: NativeAddress<'Evm'> = toNative(
  'Ethereum',
  '0x0C99567DC6f8f1864cafb580797b4B56944EEd28'
);
const universalAddress = ethAddress.toUniversalAddress().toString();
console.log('Universal Address (EVM):', universalAddress);
