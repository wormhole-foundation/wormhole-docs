export function layoutDiscriminator<B extends boolean = false>(
  layouts: readonly Layout[],
  allowAmbiguous?: B
): Discriminator<B> {
  // Internal logic to determine distinguishable layouts
  const [distinguishable, discriminator] = internalBuildDiscriminator(layouts);
  if (!distinguishable && !allowAmbiguous) {
    throw new Error('Cannot uniquely distinguish the given layouts');
  }

  return (
    !allowAmbiguous
      ? (encoded: BytesType) => {
          const layout = discriminator(encoded);
          return layout.length === 0 ? null : layout[0];
        }
      : discriminator
  ) as Discriminator<B>;
}
