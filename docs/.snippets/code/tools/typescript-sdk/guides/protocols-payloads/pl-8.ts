declare module '../../registry.js' {
  export namespace WormholeRegistry {
    interface PayloadLiteralToLayoutMapping
      extends RegisterPayloadTypes<
        'TokenBridge',
        typeof tokenBridgeNamedPayloads
      > {}
  }
}

registerPayloadTypes('TokenBridge', tokenBridgeNamedPayloads);
