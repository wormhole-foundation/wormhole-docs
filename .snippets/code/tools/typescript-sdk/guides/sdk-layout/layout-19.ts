const examplePayloadLayout = [
  { name: 'type', binary: 'uint', size: 1 },
  { name: 'data', binary: 'bytes', lengthSize: 2 },
] as const satisfies Layout;
