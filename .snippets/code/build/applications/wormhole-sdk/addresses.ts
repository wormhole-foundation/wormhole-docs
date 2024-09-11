// It's possible to convert a string address to its native address
const ethAddr: NativeAddress<'Evm'> = toNative('Ethereum', '0xbeef...');

// The `ChainAddress` is the parsed address for a given chain along with the chain context
const senderAddress: ChainAddress = Wormhole.chainAddress(
  'Ethereum',
  '0xbeef...'
);
const receiverAddress: ChainAddress = Wormhole.chainAddress(
  'Solana',
  'Sol1111...'
);

// Convert the `ChainAddress` back to its canonical string address format
const strAddress = Wormhole.canonicalAddress(senderAddress); // => '0xbeef...'

// Or if the `ethAddr` is for an emitter and you need the UniversalAddress
const emitterAddr = ethAddr.toUniversalAddress().toString();
