const tokenBridgePayloads = ['Transfer', 'TransferWithPayload'] as const;

export const getTransferDiscriminator = lazyInstantiate(() =>
  payloadDiscriminator([_protocol, tokenBridgePayloads])
);
