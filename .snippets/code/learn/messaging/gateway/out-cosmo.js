const wallet = await DirectSecp256k1HdWallet.fromMnemonic(faucet.mnemonic);
const client = await SigningStargateClient.connectWithSigner(
  simapp.tendermintUrl,
  wallet,
  defaultSigningClientOptions
);

const memo = JSON.stringify({
    gateway_ibc_token_bridge_payload:{
        gateway_transfer:{
            chain:     0,   // chain id of receiver
            recipient: "",  // address of receiver
            fee:       0,   // fee to cover transfer
            nonce:     0,   // 
        }
    }
})
const ibcTranslatorAddress = "wormhole14ejqjyq8um4p3xfqj74yld5waqljf88fz25yxnma0cngspxe3les00fpjx"
const result = await client.sendIbcTokens(
  faucet.address0,     // sender address
  ibcTranslatorAddress,// receiver address
  coin(1234, "ucosm"), // amount and coin
  "transfer",          // source port
  "channel-2186",      // source channel, TODO: fill in once deployed
  timeoutHeight,       // 
  timeoutTimestamp,    // 
  0,                   // fee to cover transaction 
  memo                 // formatted payload with details about transfer
);