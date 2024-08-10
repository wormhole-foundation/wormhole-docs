export type Signer = SignOnlySigner | SignAndSendSigner;

export interface SignOnlySigner {
  chain(): ChainName;
  address(): string;
  // Accept an array of unsigned transactions and return
  // An array of signed and serialized transactions.
  // The transactions may be inspected or altered before
  // Signing.
  sign(tx: UnsignedTransaction[]): Promise<SignedTx[]>;
}

export interface SignAndSendSigner {
  chain(): ChainName;
  address(): string;
  // Accept an array of unsigned transactions and return
  // An array of transaction ids in the same order as the
  // UnsignedTransactions array.
  signAndSend(tx: UnsignedTransaction[]): Promise<TxHash[]>;
}