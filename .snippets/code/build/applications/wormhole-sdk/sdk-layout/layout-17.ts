const guardianSignatureLayout = [
  { name: 'guardianIndex', binary: 'uint', size: 1 },
  { name: 'signature', ...signatureItem },
] as const satisfies Layout;

export const headerLayout = [
  { name: 'version', binary: 'uint', size: 1, custom: 1, omit: true },
  { name: 'guardianSet', ...guardianSetItem },
  {
    name: 'signatures',
    binary: 'array',
    lengthSize: 1,
    layout: guardianSignatureLayout,
  },
] as const satisfies Layout;
