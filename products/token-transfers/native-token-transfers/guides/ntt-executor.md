---
title: Integrate Native Token Transfers with Executor
description: TODO
categories: NTT, Transfer, Executor
---
<!-- grammarly -->
# Native Token Transfers Executor Integration

The [Executor](#){target=\_blank} extends [Native Token Transfers (NTT)](#){target=\_blank} by enabling permissionless, quote-based relaying and cross-chain execution. Instead of relying on a dedicated relayer, applications can now request a signed quote from an open network of relay providers to automatically complete token redemptions on supported destination chains.

This guide focuses on the front-end integration between NTT and Executor, demonstrating how to:

1. Generate relay instructions for EVM and Solana (SVM) chains.  
2. Request a signed execution quote from the Executor Relay Provider.  
3. Submit transfers through your NTT Manager or helper programs.  
4. Track the relay status and verify on-chain execution.
<!-- review -->

The Wormhole [NTT TypeScript SDK](#){target=\_blank} now includes a built-in [route for NTT with Executor](#){target=\_blank}, making it straightforward to integrate into existing workflows.

## Prerequisites

Before starting, ensure the following setup is complete:

- NTT deployed on both the source and destination chains.  <!-- review -->
- The Executor Relay Provider supports your source and destination pair.  <!-- link -->
- Install the SDK definitions package:

    ```sh
    npm i @wormhole-foundation/sdk-definitions
    ```

## Check Capabilities

Before generating relay instructions, verify that both source and destination chains are supported and that NTT with Executor (`ERN1`) is enabled on the destination chain.

Use the Executor capabilities endpoint:

```sh
GET https://executor-testnet.labsapis.com/v0/capabilities
```

The response lists:

- Supported source and destination chains.
- Available relay types (e.g., `wormhole` or `ERN1`).
- Gas drop-off limits, which define the maximum gas the relay provider can allocate.

The relay provider will only respect the first `GasDropOffInstruction` and will drop off the lesser of the requested amount and the configured limit.

Executor Endpoints: <!-- review -->

- Mainnet `https://executor.labsapis.com`       
- Testnet `https://executor-testnet.labsapis.com` 

These endpoints are used to request signed quotes, check status, and retrieve relay capabilities.

!!! note
    For development and testing, use the Testnet endpoint. The Mainnet relay provider is reserved for production-ready deployments.

## Generate relay instructions

[Layouts](https://github.com/wormhole-foundation/wormhole-sdk-ts/blob/b9035ad835d70bb19df366662682d3510461d72b/core/definitions/src/protocols/executor/relayInstruction.ts){target=\_blank} for the Executor RelayInstructions are provided by the Wormhole TypeScript SDK

Executor uses RelayInstructions defined by the Wormhole TypeScript SDK.

After having installed the sdk definitions, serialize the layout as follows: <!-- review -->
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

**EVM**
<!-- intro -->

- `gasLimit` defines the redeeming transaction gas limit on the destination chain.
The actual gas usage depends on token configuration, manager setup, and chain parameters.
- `msgValue` is not used by NTT’s `receiveMessage` and should always be set to 0.

**SVM**

For Solana and other SVM chains:

- `gasLimit` represents the total Compute Units required across all transactions, plus a 20% buffer.
- The relayer estimates required compute units using logic similar to [`determineComputeBudget`](https://github.com/wormhole-foundation/wormhole-sdk-ts/blob/2cf3749f01c09e97693fc8872180db442c09c778/platforms/solana/src/signer.ts#L357){target=\_blank}.
- `msgValue must` exceed the lamports + priority fees for the transaction.

!!!note
    Transfers to Solana are redeemed to an [associated token account (ATA)](https://www.solana-program.com/docs/associated-token-account){target=\_blank}, which must exist before redemption. If missing, the relayer will automatically create the ATA — increasing rent cost and required `msgValue`.

    When using a non-zero `GasDropOffInstruction` for a new wallet, the drop-off amount must be greater than the `getMinimumBalanceForRentExemption` lamports. Wormhole's relayer will ignore drop-offs to new accounts if they are below the minimum, as the transaction would fail.

## Request a SignedQuote

Next, request a SignedQuote from the Relay Provider. This quote authorizes and prices the relay execution for your transfer.

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

```sh
{
  "signedQuote": "0x455130315241c9276698439fef2780dbab76fec90b633fbd000000000000000000000000f7122c001b3e07d7fafd8be3670545135859954a271227140000000067dd750f00000000000003e80000000000514b7c000011bbaf716200000011bbaf716200f86edc3960908d257472836d5b1c33c457bf17af67a758d9984356e7166bec8162faa0e07f991d061b93e4f033895c71134a30d9ca369c606fcabba0b742d2431c",
  "estimatedCost": "1431935000000"
}
```

Signed Quotes have an expiry time and must be generated for each request. The Executor contract will revert if the quote expires before on-chain submission.

**EVM**
**SVM**

## Call your sending contract

**EVM**
**SVM**

## Status the transaction

**EVM**
**SVM**

## Conclusion

## References 
- [NTT With Executor Addresses](/docs/products/reference/executor-addresses/#ntt-with-executor){target=\_blank}
- [Definitions](https://github.com/wormhole-foundation/native-token-transfers/blob/main/sdk/definitions/src/nttWithExecutor.ts){target=\_blank}
- [EVM Implementation](https://github.com/wormhole-foundation/native-token-transfers/blob/2aaa82baeb2c0fa513f41f0561cd5613d265ddea/evm/ts/src/nttWithExecutor.ts#L63){target=\_blank}
- [SVM Implementation](https://github.com/wormhole-foundation/native-token-transfers/blob/main/solana/ts/sdk/nttWithExecutor.ts){target=\_blank}
