const customPayloadLayout = [
  { name: 'protocolId', binary: 'uint', size: 4 },
  { name: 'payload', binary: 'bytes', lengthSize: 4 },
] as const satisfies Layout;

const serializedCustomPayload = serializeLayout(customPayloadLayout, {
  protocolId: 1234,
  payload: new Uint8Array([0x01, 0x02, 0x03]),
});
