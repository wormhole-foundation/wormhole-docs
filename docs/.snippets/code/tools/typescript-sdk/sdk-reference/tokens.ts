// Get the TokenId for an ERC-20 token
const sourceToken: TokenId = Wormhole.tokenId('Ethereum', '0xbeef...');
// Get the TokenId for native ETH
const gasToken: TokenId = Wormhole.tokenId('Ethereum', 'native');
// Convert a TokenId back to a string
const strAddress = Wormhole.canonicalAddress(senderAddress); // => '0xbeef...'