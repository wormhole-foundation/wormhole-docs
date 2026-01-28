const message: NestedMessage = {
  source: {
    chainId: 6,
    sender: new Uint8Array(32),
  },
  redeemer: {
    address: new Uint8Array(32),
    message: new Uint8Array([0x01, 0x02, 0x03]),
  },
};
