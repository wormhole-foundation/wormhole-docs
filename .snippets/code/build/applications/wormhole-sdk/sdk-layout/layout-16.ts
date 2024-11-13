const vaaLayout = [
  { name: 'version', binary: 'uint', size: 1 },
  { name: 'guardianSetIndex', binary: 'uint', size: 4 },
  { name: 'timestamp', binary: 'uint', size: 4 },
  { name: 'emitterChain', binary: 'uint', size: 2 },
  { name: 'emitterAddress', binary: 'bytes', size: 32 },
  { name: 'sequence', binary: 'uint', size: 8 },
  { name: 'consistencyLevel', binary: 'uint', size: 1 },
] as const satisfies Layout;
