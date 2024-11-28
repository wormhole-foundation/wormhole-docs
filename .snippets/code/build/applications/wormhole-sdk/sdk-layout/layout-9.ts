export const chainItem = <
  const C extends readonly Chain[] = typeof chains,
  const N extends boolean = false,
>(opts?: {
  allowedChains?: C;
  allowNull?: N;
}) =>
  ({
    ...chainItemBase, // Builds on the base structure
    custom: {
      to: (val: number): AllowNull<C[number], N> => { ... },
      from: (val: AllowNull<C[number], N>): number => { ... },
    },
  });