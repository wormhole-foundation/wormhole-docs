declare module '@wormhole-foundation/sdk-connect' {
  export namespace WormholeRegistry {
    interface PlatformToNativeAddressMapping {
      Evm: EvmAddress;
    }
  }
}

registerNative(_platform, EvmAddress);
