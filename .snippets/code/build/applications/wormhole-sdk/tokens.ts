const sourceToken: TokenId = Wormhole.tokenId('Ethereum', '0xbeef...');

const gasToken: TokenId = Wormhole.tokenId('Ethereum', 'native');

const strAddress = Wormhole.canonicalAddress(senderAddress); // => '0xbeef...'