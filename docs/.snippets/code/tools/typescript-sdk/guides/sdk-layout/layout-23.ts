const [header, envelopeOffset] = deserializeLayout(headerLayout, data, {
  consumeAll: false,
});

const [envelope, payloadOffset] = deserializeLayout(envelopeLayout, data, {
  offset: envelopeOffset,
  consumeAll: false,
});

const [payloadLiteral, payload] =
  typeof payloadDet === 'string'
    ? [
        payloadDet as PayloadLiteral,
        deserializePayload(payloadDet as PayloadLiteral, data, payloadOffset),
      ]
    : deserializePayload(
        payloadDet as PayloadDiscriminator,
        data,
        payloadOffset
      );

return {
  ...header,
  ...envelope,
  payloadLiteral,
  payload,
} satisfies VAA;
