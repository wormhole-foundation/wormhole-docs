const exampleLayout = [
  { name: 'sourceChain', binary: 'uint', size: 2 },
  { name: 'orderSender', binary: 'bytes', size: 32 },
  { name: 'redeemer', binary: 'bytes', size: 32 },
  { name: 'redeemerMessage', binary: 'bytes', lengthSize: 4 },
] as const;
