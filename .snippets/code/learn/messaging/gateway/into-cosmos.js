import * as wh from '@certusone/wormhole-sdk';

// ...

const transferDetails = {
  gateway_transfer: {  // This is a simple transfer, no additional payload 
    chain: 4000,       // Chain Id of the Cosmos chain we're sending to
    // Address of recipient (base64 encoded bech32)
    recipient: "<cosmos-chain-recipient-address>",  
    fee: 0,            // Fee for transfer (0 for now)
    nonce: 0,                                        
  }
}

const ibcTranslatorAddress = "wormhole14ejqjyq8um4p3xfqj74yld5waqljf88fz25yxnma0cngspxe3les00fpjx"
// Convert the transfer details to a Uint8Array for sending
const payload = new Uint8Array(Buffer.from(JSON.stringify(transferDetails)))

// Send transfer transaction on Ethereum
await txReceipt = wh.transferFromEth(
  wh.consts.TESTNET.eth.token_bridge // source chain token bridge address
  wallet,                            // signer for eth tx
  "0xdeadbeef...",                   // address of token being transferred
  10000000n,                         // amount of token in its base units
  wh.consts.CHAINS.wormchain,        // chain id we're sending to
  // The address of the ibc-translator contract on the Gateway
  ibcTranslatorAddress,  
  0,                                 // relayer fee, 0 for now
  {},                                // tx overrides (gas fees, etc...)
  payload                   // The payload Gateway uses to route transfers
);

// ...