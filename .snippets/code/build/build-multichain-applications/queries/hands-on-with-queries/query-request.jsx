const request = new QueryRequest(
  0, // nonce
  [
    new PerChainQueryRequest(
      2, // Ethereum Wormhole Chain ID
      new EthCallQueryRequest(latestBlock, [callData])
    ),
  ]
);