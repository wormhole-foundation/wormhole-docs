try {
  deserializeLayout(fillLayout, corruptedData);
} catch (error) {
  console.error('Error during deserialization:', error.message);
}
