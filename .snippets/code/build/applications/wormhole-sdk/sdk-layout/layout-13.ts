export const signatureItem = {
  binary: 'bytes',
  layout: signatureLayout,
  custom: {
    to: (val: LayoutToType<typeof signatureLayout>) =>
      new Signature(val.r, val.s, val.v),
    from: (val: Signature) => ({ r: val.r, s: val.s, v: val.v }),
  } satisfies CustomConversion<LayoutToType<typeof signatureLayout>, Signature>,
} as const satisfies BytesLayoutItem;
