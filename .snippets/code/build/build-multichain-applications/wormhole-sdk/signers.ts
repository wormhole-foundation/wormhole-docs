// A Signer is an interface that must be provided to certain methods
// in the SDK to sign transactions. It can be either a SignOnlySigner
// or a SignAndSendSigner depending on circumstances.
// A Signer can be implemented by wrapping an existing offline wallet
// or a web wallet
export type Signer = SignOnlySigner | SignAndSendSigner;

// A SignOnlySender is for situations where the signer is not
// connected to the network or does not wish to broadcast the
// transactions themselves
export interface SignOnlySigner {
  chain(): ChainName;
  address(): string;
  // Accept an array of unsigned transactions and return
  // an array of signed and serialized transactions.
  // The transactions may be inspected or altered before
  // signing.
  // Note: The serialization is chain specific, if in doubt,
  // see the example implementations linked below
  sign(tx: UnsignedTransaction[]): Promise<SignedTx[]>;
}

// A SignAndSendSigner is for situations where the signer is
// connected to the network and wishes to broadcast the
// transactions themselves
export interface SignAndSendSigner {
  chain(): ChainName;
  address(): string;
  // Accept an array of unsigned transactions and return
  // an array of transaction ids in the same order as the
  // UnsignedTransactions array.
  signAndSend(tx: UnsignedTransaction[]): Promise<TxHash[]>;
}