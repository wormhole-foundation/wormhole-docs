const commonLayout = [
  { name: 'chainId', binary: 'uint', size: 2 },
  { name: 'address', binary: 'bytes', size: 32 },
] as const satisfies Layout;

// Reuse the common layout in different contexts
const exampleLayout = [
  ...commonLayout,
  { name: 'sequence', binary: 'uint', size: 8 },
];
