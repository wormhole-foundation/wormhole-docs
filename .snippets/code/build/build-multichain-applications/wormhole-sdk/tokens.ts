// Returns a TokenId
const sourceToken: TokenId = Wormhole.tokenId('Ethereum', '0xbeef...');

// Whereas the ChainAddress is limited to valid addresses, a TokenId may
// have the string literal 'native' to consistently denote the native
// gas token of the chain
const gasToken: TokenId = Wormhole.tokenId('Ethereum', 'native');

// the same method can be used to convert the TokenId back to its canonical string address format
const strAddress = Wormhole.canonicalAddress(senderAddress); // => '0xbeef...'