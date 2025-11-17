---
title: Integrate CCTP with Executor
description: Learn how to integrate Circle CCTP with the Executor framework for permissionless, quote-based USDC relaying and cross-chain execution.
categories: CCTP, Transfer, Executor
---

# CCTP Executor Integration

The [Executor](/docs/products/messaging/concepts/executor-overview/){target=\_blank} extends Circle’s [Cross-Chain Transfer Protocol (CCTP)](/docs/products/token-transfers/cctp/overview/){target=\_blank} by enabling permissionless, quote-based relaying and execution of USDC burns and redeems. Instead of relying on a dedicated relayer, applications obtain a signed quote from an open network of relay providers, which then perform the redeem and optional follow-up execution on the destination chain.

This guide focuses on front-end integration between CCTP and Executor: generating relay instructions, requesting a signed execution quote, wiring that quote into the sending transaction, and tracking relay status. It covers EVM, SVM, and Sui, and highlights the differences between CCTPv1 (`ERC1`) and CCTPv2 (`ERC2`) flows.

## Prerequisites

Before integrating CCTP with Executor, ensure you have:

- Verified that both the source and destination chains are supported and that the required CCTP relay type — CCTP v1 (`ERC1`) or CCTP v2 (`ERC2`) — is enabled on the destination chain. You can confirm this using the capabilities endpoint:
    ```sh
    GET https://executor-testnet.labsapis.com/v0/capabilities
    ```
    The response includes:
      - Supported source and destination chains.
      - Enabled CCTP relay types (ERC1 or ERC2) for the destination chain.
      - Gas drop-off limits, which define the maximum gas the relay provider can allocate.

    !!!note
          The relay provider will only respect the first `GasDropOffInstruction` and will drop off the lesser of the requested amount and the configured limit.

## References

Use the following resources throughout this guide:

- [**CCTP with Executor Addresses**](/docs/products/messaging/reference/executor-addresses/#cctp-with-executor){target=\_blank}: List of deployed contracts for CCTP with Executor.
- **Executor Endpoints** : Used for quote requests, transaction status checks, and capability queries.

    | Environment | URL                                                                            |
    |-------------|--------------------------------------------------------------------------------|
    | **Mainnet** | [https://executor.labsapis.com](https://executor.labsapis.com)                 |
    | **Testnet** | [https://executor-testnet.labsapis.com](https://executor-testnet.labsapis.com) |

    !!! note
        For development and testing, use the **Testnet** endpoint. The **Mainnet** relay provider is reserved for production-ready deployments.

## Generate your relay instructions

Relay instructions define how the Executor should perform the relay on the destination chain - including parameters such as gas limits, or additional execution options. They are serialized into a compact byte format that can be passed to the Executor contract when submitting a transfer. Before generating relay instructions, install the SDK [Definitions](https://github.com/wormhole-foundation/native-token-transfers/blob/main/sdk/definitions/src/nttWithExecutor.ts){target=\_blank} package:

```sh
npm i @wormhole-foundation/sdk-definitions
```

[Layouts](https://github.com/wormhole-foundation/wormhole-sdk-ts/blob/b9035ad835d70bb19df366662682d3510461d72b/core/definitions/src/protocols/executor/relayInstruction.ts) for the Executor RelayInstructions are provided by the Wormhole TypeScript SDK. Once installed, use the `serializeLayout` helper to construct and encode your relay instructions:

```tsx
const relayInstructions = serializeLayout(relayInstructionsLayout, {
    requests: [{
    request: {
	      type: "GasInstruction",
	      gasLimit: 250000n,
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

Relay instructions can include multiple requests (e.g., for gas, value transfer, or drop-off). For most CCTP with Executor flows, a single `GasInstruction` is sufficient.

| Instruction             | Description                                                               | Fields                 |
| ----------------------- | ------------------------------------------------------------------------- | ---------------------- |
| `GasInstruction`        | Defines gas allocation for relay execution                                | `gasLimit`, `msgValue` |
| `GasDropOffInstruction` | Drops native tokens to a wallet on the destination chain                  | `dropOff`, `recipient` |
| `RelayInstruction`      | Switch-type layout that encapsulates either a gas or drop-off instruction | `type`, `request`      |
| `RelayInstructions`     | Array of one or more `RelayInstruction` objects                           | `requests`             |

**EVM**

For EVM destinations:

- `gasLimit` is the gas limit set on the redeeming transaction. Actual gas consumption depends on whether a gas drop-off instruction is included(in addition to the normal differences between various EVM chains).
- `msgValue` is not used by CCTP’s `receiveMessage` entrypoints and should be set to zero for standard CCTP flows.

**SVM**

For Solana and other SVM chains:

- `gasLimit` represents the number of compute units to allocate to the transaction.
- The total relay cost is determined by:
  - The CUs consumed by the transaction.
  - The [priority fee](https://solana.com/developers/guides/advanced/how-to-use-priority-fees){target=\_blank} used by the relay provider.
- `msgValue` must cover all lamports required for:
  - Transaction fees
  - Priority fees
  - Any rent required for new accounts

CCTP transfers to Solana are redeemed into a USDC token account that must exist before redemption. If the associated token account (ATA) for the recipient does not exist, it can be created by the relayer, but this increases rent and `msgValue` requirements. To allow the relayer to create the ATA automatically:

1. Target the associated token account for the recipient.
2. Before sending, check whether the ATA exists.
3. If it does not exist, include a zero-value `GasDropOffInstruction` for the wallet owner (not the ATA). This gives the relayer enough information to re-derive and create the ATA.

!!!note
    If a non-zero `GasDropOffInstruction` is used for a new wallet, the drop-off amount must be greater than `getMinimumBalanceForRentExemption` for the token account. Drop-offs below this threshold for new accounts are ignored to avoid guaranteed transaction failure.

**Sui**

For Sui:

- `gasLimit` represents the [gas budget](https://sdk.mystenlabs.com/typescript/transaction-building/gas#budget){target=\_blank} for the transaction.
- As with native Sui transactions, the budget often needs to exceed the actual cost to account for variable execution and storage usage.
- A direct gas budget is used instead of a simulated CU-style model due to the [non-linear gas cost structure](https://docs.sui.io/concepts/tokenomics/gas-in-sui#gas-prices){target=\_blank} on Sui.

## Request a SignedQuote

Once you have your relay instructions ready, request a `SignedQuote` from the Executor Relay Provider. The quote authorizes a provider to perform the relay and includes an estimated cost. The below example requests a quote from Sepolia to Base Sepolia:

```ts
--8<-- 'code/products/messaging/guides/executor/signedQuote.ts'
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

```bash
{
  "signedQuote": "0x455130315241c9276698439fef2780dbab76fec90b633fbd000000000000000000000000f7122c001b3e07d7fafd8be3670545135859954a271227140000000067dd750f00000000000003e80000000000514b7c000011bbaf716200000011bbaf716200f86edc3960908d257472836d5b1c33c457bf17af67a758d9984356e7166bec8162faa0e07f991d061b93e4f033895c71134a30d9ca369c606fcabba0b742d2431c",
  "estimatedCost": "1431935000000"
}
```

Signed Quotes have an expiry time and must be generated for each request. The Executor contract will revert if the quote expires before on-chain submission.

## Call your sending contract

With relay instructions and a signed quote, the sending transaction can initiate both the CCTP burn and the Executor request, which instructs the relay provider to redeem and optionally execute on the destination chain.

**EVM**

For EVM chains, helper contracts wrap the CCTP calls and the Executor request into a single entrypoint. These helpers perform the CCTP burn via `depositForBurn`, followed by a `requestExecution` through the Executor using the signed quote and relay instructions you generated earlier.

Two variants are available:

- `CCTPv1WithExecutor`: Integrates CCTP v1 (`ERC1`) with Executor.
- `CCTPv2WithExecutor`: Integrates CCTP v2 (`ERC2`) with Executor.

Both versions share the same `ExecutorArgs` and `FeeArgs` structs:

```sol
--8<-- 'code/products/messaging/guides/executor/cctp/ICCTPv1WithExecutor.sol:1:18'
```

For CCTP v1, the helper interface is:

??? interface "ICCTPv1WithExecutor"

    ```sol
    --8<-- 'code/products/messaging/guides/executor/cctp/ICCTPv1WithExecutor.sol:20'
    ```

For CCTP v2, the helper interface is:

??? interface "ICCTPv2WithExecutor"

    ```sol
    --8<-- 'code/products/messaging/guides/executor/cctp/ICCTPv2WithExecutor.sol:20'
    ```

In both cases, you pass:

- `executorArgs.signedQuote`: The `signedQuote` returned by the Executor `/v0/quote` endpoint.
- `executorArgs.instructions`: The serialized relay instructions from the previous step.
- `executorArgs.refundAddress`: The address that should receive any unused funds refunded by the Executor.
- `feeArgs`: Optional referrer fee configuration, if your integration charges a fee on transfers.

**SVM with CCTP v1**

For CCTP v1, an `example_cctp_with_executor` program is available to help compose a full CCTP Executor request directly on-chain. The program reads the latest nonce published by the CCTP `MessageTransmitter` and issues a relay request using that value.

??? interface "example_cctp_with_executor.json"

    ```json
    --8<-- 'code/products/messaging/guides/executor/cctp/example_cctp_with_executor.json'
    ```

??? interface "example_cctp_with_executor.ts"

    ```tsx
    --8<-- 'code/products/messaging/guides/executor/cctp/example_cctp_with_executor.ts'
    ```
    
To integrate this with your existing CCTP `depositForBurn` transaction, add `relayLastMessage` as a `postInstruction`:

```tsx
const shimProgram = new Program<ExampleCctpWithExecutor>(
  ExampleCctpWithExecutorIdl,
  provider
);

// ... your CCTP depositForBurn builder ...

.postInstructions([
  await shimProgram.methods
    .relayLastMessage({
      execAmount: new BN(estimate),
      recipientChain: dstChain,
      signedQuoteBytes,
      relayInstructions: Buffer.from(relayInstructions.substring(2), "hex"),
    })
    .accounts({
      messageTransmitter: new web3.PublicKey(
        "BWrwSWjbikT3H7qHAkUEbLmwDQoB4ZDJ4wcSEhSPTZCu"
      ),
      payee: new web3.PublicKey(signedQuoteBytes.subarray(24, 56)),
    })
    .instruction(),
])
...
```

??? interface "Parameters"

    `execAmount` ++"u64"++  

    The execution budget passed to the Executor. This should be set to the `estimatedCost` returned by the `/v0/quote` endpoint.

    —

    `recipientChain` ++"uint16"++  

    The Wormhole chain ID of the destination chain where the USDC redemption should occur.

    —

    `signedQuoteBytes` ++"bytes"++  

    The signed quote returned from the Executor `/v0/quote` endpoint. Must be passed as raw bytes (without the `0x` prefix).

    —

    `relayInstructions` ++"bytes"++  

    The serialized relay instructions generated earlier, typically created by converting the hex string into a byte buffer.

    —

    `messageTransmitter` ++"pubkey"++  

    The CCTP `MessageTransmitter` program account on Solana.

    —

    `payee` ++"pubkey"++  

    The address extracted from the signed quote that receives refunds or drop-offs.


This combines the CCTP burn and the Executor request atomically in a single Solana transaction.

**SVM with CCTP v2**

CCTP v2 on Solana does not require a dedicated helper program. The integration can be implemented entirely client-side:

1. Call `depositForBurn` or `depositForBurnWithHook`.
2. Followed by the `requestForExecution` call.

For CCTP v2, the Executor request uses a fixed request prefix:

```ts
const requestBytes = Buffer.from("4552433201", "hex"); 
```

You pass `requestBytes`, the `signedQuote` from the quote endpoint, the serialized `relayInstructions`, and the estimated cost (as lamports) as `execAmount`.

If needed, you can fetch the on-chain IDLs for both programs:

```bash
anchor idl --provider.cluster m fetch CCTPV2Sm4AdWt5296sk4P66VBZ7bEhcARwFaaS9YPbeC
anchor idl --provider.cluster m fetch execXUrAsMnqMmTHj5m7N1YQgsDz3cwGLYCYyuDRciV
```

This allows CCTP v2 with Executor to be composed entirely in your client transaction builder without additional on-chain infrastructure.

**Sui**

On Sui, an `executor_requests` helper module is deployed so that, using [Programmable Transaction Blocks (PTB)](https://docs.sui.io/guides/developer/sui-101/building-ptb){target=\_blank}, no integration-specific Move module is required. You can extend an existing `deposit_for_burn` PTB by deriving the CCTP message fields and then issuing an Executor request.

The following example shows how to:

1. Call `deposit_for_burn` and capture the returned CCTP message.
2. Read the `source_domain` and `nonce` from the message.
3. Build CCTP v1 request bytes via `executor_requests::make_cctp_v1_request`.
4. Split off a coin to pay the Executor using the `estimatedCost` from the quote.
5. Call `executor::request_execution` with the quote, request bytes, and relay instructions.

```tsx
--8<-- 'code/products/messaging/guides/executor/cctp/sui_contract_call.ts'
```

## Status the transaction

After submitting your transaction, you can query the relay provider to check its execution status. This allows you to confirm whether the transfer has been processed and finalized by the Executor.

```ts
const res = await axios.post(`${EXECUTOR_URL}/v0/status/tx`, {
  txHash,
  chainId,
});
```

You can also link directly to the transaction in the Explorer:

```ts
`https://wormholelabs-xyz.github.io/executor-explorer/#/chain/${chainId}tx/${txHash}?endpoint=${encodeURIComponent(EXECUTOR_URL)}`;
```

## Conclusion

Integrating CCTP with Executor enables permissionless, quote-based relaying and execution for USDC across EVM, SVM, and Sui. CCTP continues to provide the canonical burn-and-mint flow for USDC, while Executor coordinates cross-chain execution through a network of relay providers rather than a single dedicated relayer.

Applications can build end-to-end CCTP transfers where the redeem and any follow-up logic are handled automatically on the destination chain. This pattern lets you keep CCTP as the source of truth for USDC movement, while using Executor to flexibly manage gas, drop-offs, and execution behavior across multiple environments.