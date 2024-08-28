const wallet = await DirectSecp256k1HdWallet.fromMnemonic(faucet.mnemonic);
const client = await SigningStargateClient.connectWithSigner(
  simapp.tendermintUrl,
  wallet,
  defaultSigningClientOptions
);

const memo = JSON.stringify({
  gateway_ibc_token_bridge_payload: {
    gateway_transfer: {
      chain: 0, // Chain ID of receiver
      recipient: 'INSERT_RECEIVER_ADDRESS',
      fee: 0, // Fee to cover transfer
      nonce: 0,
    },
  },
});
const ibcTranslatorAddress =
  'wormhole14ejqjyq8um4p3xfqj74yld5waqljf88fz25yxnma0cngspxe3les00fpjx';
const result = await client.sendIbcTokens(
  faucet.address0, // Sender address
  ibcTranslatorAddress, // Receiver address
  coin(INSERT_AMOUNT, 'INSERT_COIN'), // Amount and coin
  'transfer', // Source port
  'channel-2186', // Source channel
  timeoutHeight, 
  timeoutTimestamp,
  0, // Fee to cover transaction
  memo // Formatted payload with details about transfer
);