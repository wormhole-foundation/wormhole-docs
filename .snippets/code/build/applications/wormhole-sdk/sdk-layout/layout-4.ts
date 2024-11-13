const examplePayload = {
  sourceChain: 6,
  orderSender: new Uint8Array(32),
  redeemer: new Uint8Array(32),
  redeemerMessage: new Uint8Array([0x01, 0x02, 0x03]),
};

const serializedData = serializeLayout(exampleLayout, examplePayload);
console.log(serializedData);
