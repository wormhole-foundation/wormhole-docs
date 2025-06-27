const fixedConversionLayout = {
  binary: 'uint',
  size: 2,
  custom: {
    to: 'Ethereum',
    from: chainToChainId('Ethereum'),
  },
} as const satisfies Layout;
