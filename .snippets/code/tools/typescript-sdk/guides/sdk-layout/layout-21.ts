const layout = [
  ...baseLayout, // Header and envelope layout
  payloadLiteralToPayloadItemLayout(vaa.payloadLiteral), // Payload layout
] as const;

return serializeLayout(layout, vaa as LayoutToType<typeof layout>);
