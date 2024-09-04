import * as wh from '@certusone/wormhole-sdk';

const transferDetails = {
  gateway_transfer: {
    // This is a simple transfer with no additional payload
    chain: 4000, // Chain ID of the Cosmos destination chain
    recipient: 'INSERT_COSMOS_RECIPIENT_ADDRESS', // Base64 encoded bech32
    fee: 0, // Fee for transfer (0 for now)
    nonce: 0,
  },
};

// The address of the ibc-translator contract on the Gateway
const ibcTranslatorAddress =
  'wormhole14ejqjyq8um4p3xfqj74yld5waqljf88fz25yxnma0cngspxe3les00fpjx';

// Convert the transfer details to a Uint8Array for sending
const payload = new Uint8Array(Buffer.from(JSON.stringify(transferDetails)));

// Send transfer transaction on Ethereum
const txReceipt = await wh.transferFromEth(
  wh.consts.TESTNET.eth.token_bridge, // Source chain token bridge address
  wallet, // Signer for eth tx
  'INSERT_TOKEN_ADDRESS', // Address of token being transferred
  10000000n, // Amount of token in its base units
  wh.consts.CHAINS.wormchain, // Chain ID of destimation chain
  ibcTranslatorAddress, 
  0, // Relayer fee, 0 for now
  {}, // Transaction overrides (gas fees, etc...)
  payload // The payload Gateway uses to route transfers
);