const ntt = await s.getProtocol("Ntt", {
  ntt: {
    chain: "Solana",
    manager: ...,
    token: ...,
    transceiver: { wormhole: ... },
  },
});
...
// as of this writing, there's only one tx on Solana
const txs = ntt.transfer(
  new SolanaAddress(payer.publicKey),
  1n,
  {
    chain: "Sepolia",
    address: new UniversalAddress(
      recipientWallet,
      "hex"
    ),
  },
  { queue: false, automatic: false }
);
for await (const tx of txs) {
	// https://github.com/wormhole-foundation/native-token-transfers/blob/b4aa0e34755f735fca40e4566e07c17ac6b2b812/solana/ts/sdk/ntt.ts#L970C8-L970C20
	if (tx.description === "Ntt.Transfer") {
		// Not sure if the first signer will always be the outbox
	  const outboxKeypair = tx.transaction.signers[0];
	  // Get the lookup tables configured on the NTT manager
	  const luts: AddressLookupTableAccount[] = [];
	  try {
	    // @ts-ignore
	    luts.push(await ntt.getAddressLookupTable());
	  } catch (e) {
	    console.log(e.message);
	  }
	  // Decompile the message
	  const message = TransactionMessage.decompile(
	    tx.transaction.transaction.message,
	    { addressLookupTableAccounts: luts }
	  );
	  // Add the execution request to the message
	  const exampleNttWithExecutorProgram = new Program<ExampleNttWithExecutor>(
      ExampleNttWithExecutorIdl as ExampleNttWithExecutor,
      provider
    );
    message.instructions.push(
      await exampleNttWithExecutorProgram.methods
        .relayNttMesage({
          execAmount: new BN(estimate.toString()),
          recipientChain: chainToChainId("Sepolia"),
          signedQuoteBytes,
          relayInstructions: Buffer.from(relayInstructions.substring(2), "hex"),
        })
        .accounts({
          payee: new web3.PublicKey(signedQuoteBytes.subarray(24, 56)),
          nttProgramId,
          nttPeer: web3.PublicKey.findProgramAddressSync(
            [
              Buffer.from("peer"),
              encoding.bignum.toBytes(chainToChainId("Sepolia")),
            ],
            nttProgramId
          )[0],
          nttMessage: outboxKeypair.publicKey,
        })
        .instruction()
    );
    // If the canonical NTT manager lookup table did not exist
    if (luts.length === 0) {
      // This should probably check the program version and only do this for versions without the canonical lookup table
      // Otherwise, it should call `initializeLut` on the manager(?)
      // I'm not sure if that is already checked somewhere in the SDK
      console.log("no manager lookup table found, checking helper program");
      const exampleNttSvmLutProgram = new Program<ExampleNttSvmLut>(
        ExampleNttSvmLutIdl as ExampleNttSvmLut,
        provider
      );
      const lutPointerAddress = web3.PublicKey.findProgramAddressSync(
        [Buffer.from("lut"), nttProgramId.toBuffer()],
        exampleNttSvmLutProgram.programId
      )[0];
      let lutPointer = await exampleNttSvmLutProgram.account.lut.fetchNullable(
        lutPointerAddress
      );
      if (!lutPointer) {
        console.log("no helper program lookup table found, initializing...");
        const recentSlot =
          (await exampleNttSvmLutProgram.provider.connection.getSlot()) - 1;
        const tx = await exampleNttSvmLutProgram.methods
          .initializeLut(new BN(recentSlot))
          .accounts({
            nttProgramId,
          })
          .rpc();
        console.log(`initialized lookup table: ${tx}`);
        while (!lutPointer) {
          // wait for lut to warm up
          await new Promise((resolve) => setTimeout(resolve, 2000));
          lutPointer = await exampleNttSvmLutProgram.account.lut.fetchNullable(
            lutPointerAddress
          );
        }
      }
      const response = await connection.getAddressLookupTable(
        lutPointer.address
      );
      if (!response.value) {
        throw new Error("unable to fetch lookup table");
      }
      luts.push(response.value);
    }
    // Recompile the message with the lookup table (whether manager or helper)
    tx.transaction.transaction.message = message.compileToV0Message(luts);
    // Broadcast
    const hash = await provider.sendAndConfirm(
      tx.transaction.transaction,
      tx.transaction.signers,
      { commitment: "confirmed" }
    );
  }
}