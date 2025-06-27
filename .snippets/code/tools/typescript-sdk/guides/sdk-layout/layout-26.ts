try {
  const deserialized = deserializeLayout(fillLayout, data);
} catch (error) {
  console.error('Deserialization failed:', error);
}
