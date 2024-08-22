export type Signer = SignOnlySigner | SignAndSendSigner;

export interface SignOnlySigner {
  chain(): ChainName;
  address(): string;
  // Accept an array of unsigned transactions and return
  // an array of signed and serialized transactions.
  // The transactions may be inspected or altered before
  // signing.
  sign(tx: UnsignedTransaction[]): Promise<SignedTx[]>;
}

export interface SignAndSendSigner {
  chain(): ChainName;
  address(): string;
  // Accept an array of unsigned transactions and return
  // an array of transaction ids in the same order as the
  // unsignedTransactions array.
  signAndSend(tx: UnsignedTransaction[]): Promise<TxHash[]>;
}