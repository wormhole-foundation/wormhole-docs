export const envelopeLayout = [
  { name: 'timestamp', binary: 'uint', size: 4 },
  { name: 'nonce', binary: 'uint', size: 4 },
  { name: 'emitterChain', ...chainItem() },
  { name: 'emitterAddress', ...universalAddressItem },
  { name: 'sequence', ...sequenceItem },
  { name: 'consistencyLevel', binary: 'uint', size: 1 },
] as const satisfies Layout;
