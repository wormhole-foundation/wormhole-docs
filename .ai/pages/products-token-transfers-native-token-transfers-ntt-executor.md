---
title: Integrate Native Token Transfers with Executor
description: Learn how to integrate Native Token Transfers (NTT) with the Executor framework for permissionless, quote-based cross-chain token relaying and execution.
categories: NTT, Transfer, Executor
url: https://wormhole.com/docs/products/token-transfers/native-token-transfers/ntt-executor/
---

# Native Token Transfers Executor Integration

The [Executor](/docs/products/messaging/concepts/executor-overview/){target=\_blank} extends [Native Token Transfers (NTT)](/docs/products/token-transfers/native-token-transfers/overview/){target=\_blank} by enabling permissionless, quote-based relaying and cross-chain execution. Instead of relying on a dedicated relayer, applications can now request a signed quote from an open network of relay providers to automatically complete token redemptions on supported destination chains.

This guide focuses on front-end integration between NTT and Executor. It walks through generating relay instructions, requesting a signed execution quote, invoking your sending contracts, and tracking relay status on-chain, with dedicated implementation details for both EVM and Solana (SVM) chains.

The Wormhole [NTT TypeScript SDK](https://github.com/wormhole-foundation/native-token-transfers/tree/main/sdk){target=_blank} now includes a built-in route for NTT with Executor, with implementations for both [EVM](https://github.com/wormhole-foundation/native-token-transfers/blob/2aaa82baeb2c0fa513f41f0561cd5613d265ddea/evm/ts/src/nttWithExecutor.ts#L63){target=_blank} and [Solana (SVM)](https://github.com/wormhole-foundation/native-token-transfers/blob/main/solana/ts/sdk/nttWithExecutor.ts){target=_blank}, making it straightforward to integrate into existing workflows.

## Prerequisites

Before starting, ensure you have:

- [NTT deployed](/docs/products/token-transfers/native-token-transfers/get-started/){target=\_blank} on both the source and destination chains.
- Verified that both source and destination chains are supported and that NTT with Executor (`ERN1`) is enabled on the destination chain. You can confirm this using the capabilities endpoint:
  ```sh
  GET https://executor-testnet.labsapis.com/v0/capabilities
  ```
  The response includes:
    - Supported source and destination chains.
    - Available relay types (e.g., `wormhole` or `ERN1`).
    - Gas drop-off limits, which define the maximum gas the relay provider can allocate.

    !!!note
        The relay provider will only respect the first `GasDropOffInstruction` and will drop off the lesser of the requested amount and the configured limit.

## References
Use the following resources throughout this guide:

- [**NTT With Executor Addresses**](/docs/products/reference/executor-addresses/#ntt-with-executor){target=_blank} : List of deployed contracts for NTT with Executor.  
- **Executor Endpoints** : Used for quote requests, transaction status checks, and capability queries.

    | Environment | URL                                                                            |
    |-------------|--------------------------------------------------------------------------------|
    | **Mainnet** | [https://executor.labsapis.com](https://executor.labsapis.com)                 |
    | **Testnet** | [https://executor-testnet.labsapis.com](https://executor-testnet.labsapis.com) |

    !!! note
        For development and testing, use the **Testnet** endpoint. The **Mainnet** relay provider is reserved for production-ready deployments.

## Generate relay instructions

Relay instructions define how the Executor should perform the relay on the destination chain - including parameters such as gas limits, message value, or additional execution options. They are serialized into a compact byte format that can be passed to the Executor contract when submitting a transfer.

Before generating relay instructions, install the SDK [Definitions](https://github.com/wormhole-foundation/native-token-transfers/blob/main/sdk/definitions/src/nttWithExecutor.ts){target=\_blank} package:

```sh
npm i @wormhole-foundation/sdk-definitions
```

[Layouts](https://github.com/wormhole-foundation/wormhole-sdk-ts/blob/b9035ad835d70bb19df366662682d3510461d72b/core/definitions/src/protocols/executor/relayInstruction.ts){target=\_blank} for the Executor `RelayInstructions` are provided by the Wormhole TypeScript SDK.

Once installed, use the `serializeLayout` helper to construct and encode your relay instructions:
​
```ts
const relayInstructions = serializeLayout(relayInstructionsLayout, {
    requests: [{
    request: {
	      type: "GasInstruction",
	      gasLimit: 500000n,
	      msgValue: 0n,
	    },
	  }],
  });
```

??? interface "Parameters"

    `type` ++"GasInstruction"++

    Defines the instruction to allocate gas for the relay.

    —

    `gasLimit` ++"uint"++

    Specifies the maximum gas available for executing the redeem transaction on the destination chain.

    —

    `msgValue` ++"uint"++

    Represents the amount of native token (e.g., ETH, SOL) to forward with the transaction, this should typically be set to 0 for NTT transfers.


Relay instructions can include multiple requests (e.g., for gas, value transfer, or drop-off). For NTT transfers, only a single gas instruction is required.

| Instruction             | Description                                                               | Fields                 | 
| ----------------------- | ------------------------------------------------------------------------- | ---------------------- |
| `GasInstruction`        | Defines gas allocation for relay execution                                | `gasLimit`, `msgValue` |
| `GasDropOffInstruction` | Drops native tokens to a wallet on the destination chain                  | `dropOff`, `recipient` |
| `RelayInstruction`      | Switch-type layout that encapsulates either a gas or drop-off instruction | `type`, `request`      | 
| `RelayInstructions`     | Array of one or more `RelayInstruction` objects                           | `requests`             | 

**EVM**

For EVM-based destination chains:

- `gasLimit` defines the redeeming transaction gas limit on the destination chain. The actual gas usage depends on token configuration, manager setup, and chain parameters.
- `msgValue` is not used by NTT Transceivers’ `receiveMessage` function and should be set to 0.

**SVM**

For Solana and other SVM chains:

- `gasLimit` represents the total Compute Units required across all transactions, plus a 20% buffer.
- The relayer estimates required compute units using logic similar to [`determineComputeBudget`](https://github.com/wormhole-foundation/wormhole-sdk-ts/blob/2cf3749f01c09e97693fc8872180db442c09c778/platforms/solana/src/signer.ts#L357){target=\_blank}, which simulates the transaction and sets the budget to 120% of the simulated `unitsConsumed`. This allows the relayer to automatically determine the budget required for each transaction in the series needed to perform an NTT redeem.
- `msgValue` must cover the lamports required for the transaction, including priority fees and rent.

!!!note
    Transfers to Solana are redeemed to an [associated token account (ATA)](https://www.solana-program.com/docs/associated-token-account){target=\_blank}, which must exist before redemption. If missing, the relayer will automatically create the ATA, increasing rent cost and required `msgValue`.

    When using a non-zero `GasDropOffInstruction` for a new wallet, the drop-off amount must be greater than the `getMinimumBalanceForRentExemption` lamports. Wormhole's relayer will ignore drop-offs to new accounts if they are below the minimum, as the transaction would fail.

## Request a SignedQuote

Once your relay instructions are generated, request a `SignedQuote` from the Executor Relay Provider. A signed quote authorizes the relay provider to execute the transfer and includes the estimated cost of execution.

The following is an example of a quote request from Sepolia to Base Sepolia. See the full list of supported [chain IDs](/docs/products/reference/chain-ids/){target=\_blank}.

```ts
const EXECUTOR_URL = "https://executor-testnet.labsapis.com"
const { signedQuote: quote, estimatedCost: estimate } = (
  await axios.post(`${EXECUTOR_URL}/v0/quote`, {
    srcChain: 10002,
    dstChain: 10004,
    relayInstructions,
  })
).data;
```

??? interface "Parameters"

    `srcChain` ++"uint16"++

    Specify the Wormhole chain IDs for the source networks.

    —

    `dstChain` ++"uint16"++

    Specify the Wormhole chain IDs for the destination networks.

    —

    `relayInstructions` ++"Uint8Array"++

    Encodes the execution parameters you generated in the previous step.

Example response:

```sh
{
  "signedQuote": "0x455130315241c9276698439fef2780dbab76fec90b633fbd000000000000000000000000f7122c001b3e07d7fafd8be3670545135859954a271227140000000067dd750f00000000000003e80000000000514b7c000011bbaf716200000011bbaf716200f86edc3960908d257472836d5b1c33c457bf17af67a758d9984356e7166bec8162faa0e07f991d061b93e4f033895c71134a30d9ca369c606fcabba0b742d2431c",
  "estimatedCost": "1431935000000"
}
```

??? interface "Returns"

    `signedQuote` ++"string"++

    A signed authorization used in the on-chain call to the Executor. Includes quote data and a 65-byte ECDSA signature.

    —

    `estimatedCost` ++"string"++

    The total estimated gas or lamport cost for the relay.


Signed Quotes have an expiry time and must be generated for each request. The Executor contract will revert if the quote expires before on-chain submission.

## Call your sending contract

Once you have generated your relay instructions and received a signed quote, use them to call your sending-side contract. Refer to the [NTT With Executor Addresses](/docs/products/reference/executor-addresses/#ntt-with-executor){target=\_blank} page for the full list of deployed helper contracts.

**EVM**

For EVM-based transfers, an `NttManagerWithExecutor` contract combines the standard NTT `transfer` and the Executor’s `requestExecution` into a single call. The `INttManagerWithExecutor` interface is defined as follows:

```sol
// SPDX-License-Identifier: Apache 2
pragma solidity ^0.8.19;

struct ExecutorArgs {
    // The msg value to be passed into the Executor.
    uint256 value;
    // The refund address used by the Executor.
    address refundAddress;
    // The signed quote to be passed into the Executor.
    bytes signedQuote;
    // The relay instructions to be passed into the Executor.
    bytes instructions;
}

struct FeeArgs {
    // The fee in tenths of basis points.
    uint16 dbps;
    // To whom the fee should be paid (the "referrer").
    address payee;
}

interface INttManagerWithExecutor {
    /// @notice Error when the refund to the sender fails.
    error RefundFailed(uint256 refundAmount);

    /// @notice Transfer tokens using the Executor for relaying.
    /// @param nttManager The NTT manager used for the transfer.
    /// @param amount The amount to transfer.
    /// @param recipientChain The Wormhole chain ID for the destination.
    /// @param recipientAddress The recipient address.
    /// @param refundAddress The address to which unused gas is refunded.
    /// @param shouldQueue Whether the transfer should be queued if the outbound limit is hit.
    /// @param encodedInstructions Additional instructions for the destination chain.
    /// @param executorArgs The arguments to be passed into the Executor.
    /// @param feeArgs The arguments used to compute and pay the referrer fee.
    /// @return msgId The resulting message ID of the transfer.
    function transfer(
        address nttManager,
        uint256 amount,
        uint16 recipientChain,
        bytes32 recipientAddress,
        bytes32 refundAddress,
        bool shouldQueue,
        bytes memory encodedInstructions,
        ExecutorArgs calldata executorArgs,
        FeeArgs calldata feeArgs
    ) external payable returns (uint64 msgId);
}
```

If the NTT Manager is configured with a Transceiver that supports Standard Relayer, the `encodedInstructions` should be set to turn off relaying, since the Executor will handle it. This can be done by setting automatic to false.

**SVM**

For Solana and other SVM-based chains, two helper programs are available to assist with generating and submitting NTT execution requests:

- [example-ntt-svm-lut](https://github.com/wormholelabs-xyz/example-ntt-svm-lut){target=\_blank}: Manages Lookup Tables for NTT programs without canonical LUTs.
- [example-ntt-with-executor-svm](https://github.com/wormholelabs-xyz/example-ntt-with-executor-svm){target=\_blank}: Generates and attaches Executor relay instructions on-chain to reduce transaction size.

Together, these helpers allow you to compose and send a full NTT with Executor transaction using the Wormhole TypeScript SDK. Below is a simplified example adapted from the SDK implementation:

```ts
const ntt = await s.getProtocol("Ntt", {
  ntt: {
    chain: "Solana",
    manager: ...,
    token: ...,
    transceiver: { wormhole: ... },
  },
});

// Generate transfer transactions
const txs = ntt.transfer(
  new SolanaAddress(payer.publicKey),
  1n,
  {
    chain: "Sepolia",
    address: new UniversalAddress(recipientWallet, "hex"),
  },
  { queue: false, automatic: false }
);

for await (const tx of txs) {
  if (tx.description === "Ntt.Transfer") {
    const outboxKeypair = tx.transaction.signers[0];
    const luts: AddressLookupTableAccount[] = [];

    try {
      // @ts-ignore
      luts.push(await ntt.getAddressLookupTable());
    } catch (e) {
      console.log(e.message);
    }

    // Decompile the transaction message
    const message = TransactionMessage.decompile(
      tx.transaction.transaction.message,
      { addressLookupTableAccounts: luts }
    );

    // Append Executor relay instruction
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

    // If no canonical LUT exists, check helper program and initialize if needed
    if (luts.length === 0) {
      console.log("No manager lookup table found, checking helper program...");
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
        console.log("No helper LUT found, initializing...");
        const recentSlot =
          (await exampleNttSvmLutProgram.provider.connection.getSlot()) - 1;
        const tx = await exampleNttSvmLutProgram.methods
          .initializeLut(new BN(recentSlot))
          .accounts({
            nttProgramId,
          })
          .rpc();

        console.log(`Initialized lookup table: ${tx}`);

        // Wait for LUT warm-up
        while (!lutPointer) {
          await new Promise((resolve) => setTimeout(resolve, 2000));
          lutPointer = await exampleNttSvmLutProgram.account.lut.fetchNullable(
            lutPointerAddress
          );
        }
      }

      const response = await connection.getAddressLookupTable(
        lutPointer.address
      );
      if (!response.value) throw new Error("Unable to fetch lookup table");
      luts.push(response.value);
    }

    // Recompile and broadcast
    tx.transaction.transaction.message = message.compileToV0Message(luts);
    const hash = await provider.sendAndConfirm(
      tx.transaction.transaction,
      tx.transaction.signers,
      { commitment: "confirmed" }
    );
  }
}
```

## Status the transaction

After submitting your transaction, you can query the relay provider to check its execution status. This allows you to confirm whether the transfer has been processed and finalized by the Executor.

```ts
const res = await axios.post(`${EXECUTOR_URL}/v0/status/tx`, {
  txHash,
  chainId,
})
```

You can also link directly to the transaction in the Explorer:

```ts
`https://wormholelabs-xyz.github.io/executor-explorer/#/chain/${chainId}tx/${txHash}?endpoint=${encodeURIComponent(EXECUTOR_URL)}`
```

## Conclusion

Integrating Executor with NTT enables permissionless, quote-based execution of cross-chain transfers. By combining NTT’s native transfer mechanism with Executor’s open relay network, applications can achieve automated, end-to-end redemption across EVM and Solana chains without relying on centralized relayers.
