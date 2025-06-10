declare module '../../registry.js' {
  export namespace WormholeRegistry {
    interface ProtocolToInterfaceMapping<N, C> {
      TokenBridge: TokenBridge<N, C>;
    }
    interface ProtocolToPlatformMapping {
      TokenBridge: EmptyPlatformMap<'TokenBridge'>;
    }
  }
}
