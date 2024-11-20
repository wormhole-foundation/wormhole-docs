export const fixedChainItem = <const C extends Chain>(chain: C) => ({
  ...chainItemBase, // Builds on the base structure
  custom: {
    to: chain,
    from: chainToChainId(chain),
  },
});
