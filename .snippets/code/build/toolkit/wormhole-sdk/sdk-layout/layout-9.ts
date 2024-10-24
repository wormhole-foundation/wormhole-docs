const SIZE_32 = 32;
const UINT_TYPE = 'uint';

// Example layout using constants
const exampleLayout = [
  { name: 'orderSender', binary: 'bytes', size: SIZE_32 },
  { name: 'sourceChain', binary: UINT_TYPE, size: 2 },
] as const;