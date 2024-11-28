export const payloadFactory = new Map<LayoutLiteral, Layout>();

export function registerPayloadType(
  protocol: ProtocolName,
  name: string,
  layout: Layout
) {
  const payloadLiteral = composeLiteral(protocol, name);
  if (payloadFactory.has(payloadLiteral)) {
    throw new Error(`Payload type ${payloadLiteral} already registered`);
  }
  payloadFactory.set(payloadLiteral, layout);
}
