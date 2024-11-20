const signatureLayout = [
  { name: 'r', binary: 'uint', size: 32 },
  { name: 's', binary: 'uint', size: 32 },
  { name: 'v', binary: 'uint', size: 1 },
] as const satisfies Layout;
