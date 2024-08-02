// Its possible to convert a string address to its Native address
const ethAddr: NativeAddress<'Evm'> = toNative('Ethereum', '0xbeef...');

// A common type in the SDK is the `ChainAddress` which provides
// the additional context of the `Chain` this address is relevant for.
const senderAddress: ChainAddress = Wormhole.chainAddress(
  'Ethereum',
  '0xbeef...'
);
const receiverAddress: ChainAddress = Wormhole.chainAddress(
  'Solana',
  'Sol1111...'
);

// Convert the ChainAddress back to its canonical string address format
const strAddress = Wormhole.canonicalAddress(senderAddress); // => '0xbeef...'

// Or if the ethAddr above is for an emitter and you need the UniversalAddress
const emitterAddr = ethAddr.toUniversalAddress().toString();