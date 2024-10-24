const omittedFieldLayout = [
  { name: 'sourceChain', binary: 'uint', size: 2, omit: true }, // omitted from deserialization
] as const satisfies Layout;
