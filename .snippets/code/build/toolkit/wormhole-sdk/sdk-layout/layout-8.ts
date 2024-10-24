const serializedNested = serializeLayout(nestedLayout, message);
const deserializedNested = deserializeLayout(nestedLayout, serializedNested);

console.log(deserializedNested);
