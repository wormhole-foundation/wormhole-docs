const chainCustomConversion = {
  to: (chainId: number) => toChain(chainId),
  from: (chain: Chain) => chainToChainId(chain),
} satisfies CustomConversion<number, Chain>;
