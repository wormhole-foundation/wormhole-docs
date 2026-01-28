export const transferWithPayloadLayout = <
  const P extends CustomizableBytes = undefined
>(
  customPayload?: P
) =>
  [
    payloadIdItem(3),
    ...transferCommonLayout,
    { name: 'from', ...universalAddressItem },
    customizableBytes({ name: 'payload' }, customPayload),
  ] as const;
