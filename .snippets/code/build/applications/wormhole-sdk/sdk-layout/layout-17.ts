const vaaData = {
  version: 1,
  guardianSetIndex: 5,
  timestamp: 1633000000,
  emitterChain: 2, // Ethereum
  emitterAddress: new Uint8Array(32).fill(0),
  sequence: BigInt(1),
  consistencyLevel: 1,
};

const serializedVAA = serializeLayout(vaaLayout, vaaData);
