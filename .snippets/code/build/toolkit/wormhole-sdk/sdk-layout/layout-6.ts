const nestedLayout = [
  {
    name: 'source',
    binary: 'object',
    layout: [
      { name: 'chainId', binary: 'uint', size: 2 },
      { name: 'sender', binary: 'bytes', size: 32 },
    ],
  },
  {
    name: 'redeemer',
    binary: 'object',
    layout: [
      { name: 'address', binary: 'bytes', size: 32 },
      { name: 'message', binary: 'bytes', lengthSize: 4 },
    ],
  },
] as const satisfies Layout;
