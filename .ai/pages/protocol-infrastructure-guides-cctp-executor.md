---
title: Integrate CCTP with Executor
description: Learn how to integrate Circle CCTP with the Executor framework for permissionless, quote-based USDC relaying and cross-chain execution.
categories: CCTP, Transfer, Executor
url: https://wormhole.com/docs/protocol/infrastructure-guides/cctp-executor/
---

# CCTP Executor Integration

The [Executor](/docs/protocol/infrastructure/relayers/executor-framework/){target=\_blank} extends Circle’s [Cross-Chain Transfer Protocol (CCTP)](/docs/products/cctp-bridge/overview/){target=\_blank} by enabling permissionless, quote-based relaying and execution of USDC burns and redeems. Instead of relying on a dedicated relayer, applications obtain a signed quote from an open network of relay providers, which then perform the redeem and, optionally, the follow-up execution on the destination chain.

This guide covers the core flow for integrating CCTP with Executor, including relay instruction generation, quote requests, contract wiring, and transaction status checks, applicable across all supported execution environments. 

## Prerequisites

Before integrating CCTP with Executor, ensure that:

- Both the source and destination chains are supported.
- The required CCTP relay type (CCTPv1 `ERC1` or CCTPv2 `ERC2`) is enabled for the destination chain. 

!!! note 
    Circle’s Cross-Chain Transfer Protocol supports two versions: CCTPv1 and CCTPv2. These versions differ in how transfers are finalized and how execution can be composed on the destination chain. For a detailed explanation of the differences between CCTPv1 and CCTPv2, see [Circle’s overview](https://www.circle.com/blog/cctp-v2-the-future-of-cross-chain){target=\_blank}. 

??? info "How to verify chain and relay type support"

    You can confirm chain and relay type support using the capabilities endpoint:

    ```sh
    GET https://executor-testnet.labsapis.com/v0/capabilities
    ```
    The response includes:

      - Supported source and destination chains
      - Enabled CCTP relay types (`ERC1` or `ERC2`) for the destination chain
      - Gas drop-off limits, which define the maximum gas the relay provider can allocate

    The relay provider will only respect the first `GasDropOffInstruction` and will drop off the lesser of the requested amount and the configured limit.

## References

Use the following resources throughout this guide:

- [**CCTP with Executor addresses**](/docs/products/messaging/reference/executor-addresses/#cctp-with-executor){target=\_blank}: List of deployed contracts for CCTP with Executor.
- **Executor endpoints**: Used for quote requests, transaction status checks, and capability queries.

    | Environment | URL                                                                            |
    |-------------|--------------------------------------------------------------------------------|
    | **Mainnet** | <pre>```https://executor.labsapis.com```</pre> |
    | **Testnet** | <pre>```https://executor-testnet.labsapis.com```</pre> |

    For development and testing, use the testnet endpoint. The mainnet relay provider is reserved for production-ready deployments.

## Generate Relay Instructions

Relay instructions define how the Executor should perform the relay on the destination chain, including gas limits and optional native token drop-offs. They are serialized into a compact byte format and passed to the Executor contract when submitting a transfer. Before generating relay instructions, install the SDK [Definitions](https://github.com/wormhole-foundation/native-token-transfers/blob/main/sdk/definitions/src/nttWithExecutor.ts){target=\_blank} package:

```sh
npm i @wormhole-foundation/sdk-definitions
```

[Layouts](https://github.com/wormhole-foundation/wormhole-sdk-ts/blob/main/core/definitions/src/protocols/executor/relayInstruction.ts){target=\_blank} for the Executor `relayInstructions` are provided by the Wormhole TypeScript SDK. Once installed, use the `serializeLayout` helper to construct and encode your relay instructions:

```tsx
import {
  encoding,
  serializeLayout,
  UniversalAddress,
} from "@wormhole-foundation/sdk-connect";
import { relayInstructionsLayout } from "@wormhole-foundation/sdk-definitions";

const relayInstructions = serializeLayout(relayInstructionsLayout, {
  requests: [
    {
      request: {
	      type: "GasInstruction",
	      gasLimit: 250000n,
	      msgValue: 0n,
	    },
	  }
  ],
});
```

??? interface "Parameters"

    `type` ++"GasInstruction"++

    Defines the instruction to allocate gas for the relay.

    ---

    `gasLimit` ++"uint"++

    Specifies the maximum gas available for executing the redeem transaction on the destination chain.

    ---

    `msgValue` ++"uint"++

    Represents the amount of native token (e.g., ETH, SOL) to forward with the transaction; this should typically be set to 0 for NTT transfers.

Relay instructions are encoded using the `relayInstructionsLayout`, which always expects an array of instruction objects. Each array element is a `RelayInstruction` whose `request.type` determines the specific variant:

| Instruction             | Description                                                               | Fields                 |
| ----------------------- | ------------------------------------------------------------------------- | ---------------------- |
| `GasInstruction`        | Defines gas allocation for relay execution                                | `gasLimit`, `msgValue` |
| `GasDropOffInstruction` | Drops native tokens to a wallet on the destination chain                  | `dropOff`, `recipient` |

Relay instructions can include multiple requests (e.g., for gas, value transfer, or drop-off). For most CCTP with Executor flows, a single `GasInstruction` is sufficient.

### EVM

For EVM destinations:

- `gasLimit` is the gas limit set on the redeeming transaction. Actual gas consumption depends on whether a gas drop-off instruction is included (in addition to the normal differences across various EVM chains).
- `msgValue` is not used by CCTP’s `receiveMessage` entrypoints and should be set to zero for standard CCTP flows.

### SVM

For Solana and other SVM chains:

- `gasLimit` represents the number of compute units to allocate to the transaction.
- The total relay cost is determined by:
    - The CUs consumed by the transaction
    - The [prioritization fee](https://solana.com/docs/core/fees#prioritization-fee){target=\_blank} used by the relay provider
- `msgValue` must cover all lamports required for:
    - Transaction fees
    - Priority fees
    - Any rent required for new accounts

CCTP transfers to Solana are redeemed into a USDC token account that must exist before redemption. If the recipient's associated token account (ATA) does not exist, the relayer can create it, but this increases the rent and `msgValue` requirements. To allow the relayer to create the ATA automatically:

1. Target the associated token account for the recipient.
2. Before sending, check whether the ATA exists.
3. If it does not exist, include a zero-value `GasDropOffInstruction` for the wallet owner (not the ATA). This gives the relayer enough information to re-derive and create the ATA.

!!!note
    If a non-zero `GasDropOffInstruction` is used for a new wallet, the drop-off amount must be greater than `getMinimumBalanceForRentExemption` for the token account. Drop-offs below this threshold for new accounts are ignored to avoid guaranteed transaction failure.

### Sui

For Sui:

- `gasLimit` represents the [gas budget](https://sdk.mystenlabs.com/typescript/transaction-building/gas#budget){target=\_blank} for the transaction.
- As with native Sui transactions, the budget often needs to exceed the actual cost to account for variable execution and storage usage.
- A direct gas budget is used instead of a simulated CU-style model due to the [non-linear gas cost structure](https://docs.sui.io/concepts/tokenomics/gas-in-sui#gas-prices){target=\_blank} on Sui.

## Request a Signed Quote

Once you have your relay instructions ready, request a `SignedQuote` from the Executor Relay Provider. The quote authorizes a provider to perform the relay and includes an estimated cost. The example below requests a quote from Sepolia to Base Sepolia:

```ts
const EXECUTOR_URL = 'https://executor-testnet.labsapis.com';
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

    ---

    `dstChain` ++"uint16"++

    Specify the Wormhole chain IDs for the destination networks.

    ---

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

## Call Sending Contract

With relay instructions and a signed quote, the sending transaction can initiate both the CCTP burn and the Executor request, which instructs the relay provider to redeem and optionally execute on the destination chain.

### EVM

For EVM chains, helper contracts wrap the CCTP calls and the Executor request into a single entry point. These helpers perform the CCTP burn via `depositForBurn`, followed by a `requestExecution` through the Executor using the signed quote and relay instructions you generated earlier. A version specific helper contract is used depending on whether your integration relies on CCTPv1 (`CCTPv1WithExecutor`) or CCTPv2 (`CCTPv2WithExecutor`).

Both versions share the same `ExecutorArgs` and `FeeArgs` structs:

```sol
// SPDX-License-Identifier: Apache 2
pragma solidity ^0.8.19;

struct ExecutorArgs {
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
```

The helper interfaces are as follows:

??? interface "ICCTPv1WithExecutor"

    ```sol
    interface ICCTPv1WithExecutor {
        /// @notice Deposits and burns tokens from sender to be minted on destination domain using the Executor for relaying.
        /// @param amount amount of tokens to burn
        /// @param destinationChain destination chain ID
        /// @param destinationDomain destination domain (ETH = 0, AVAX = 1)
        /// @param mintRecipient address of mint recipient on destination domain
        /// @param burnToken address of contract to burn deposited tokens, on local domain
        /// @param executorArgs The arguments to be passed into the Executor.
        /// @param feeArgs The arguments used to compute and pay the referrer fee.
        /// @return nonce Circle nonce reserved by message
        ///
        function depositForBurn(
            uint256 amount,
            uint16 destinationChain,
            uint32 destinationDomain,
            bytes32 mintRecipient,
            address burnToken,
            ExecutorArgs calldata executorArgs,
            FeeArgs calldata feeArgs
        ) external payable returns (uint64 nonce);
    }
    ```

??? interface "ICCTPv2WithExecutor"

    ```sol
    interface ICCTPv2WithExecutor {
        /**
         * @notice Deposits and burns tokens from sender to be minted on destination domain.
         * Emits a `DepositForBurn` event.
         * @dev reverts if:
         * - given burnToken is not supported
         * - given destinationDomain has no TokenMessenger registered
         * - transferFrom() reverts. For example, if sender's burnToken balance or approved allowance
         * to this contract is less than `amount`.
         * - burn() reverts. For example, if `amount` is 0.
         * - maxFee is greater than or equal to `amount`.
         * - MessageTransmitterV2#sendMessage reverts.
         * @param amount amount of tokens to burn
         * @param destinationChain destination chain ID
         * @param destinationDomain destination domain to receive message on
         * @param mintRecipient address of mint recipient on destination domain
         * @param burnToken token to burn `amount` of, on local domain
         * @param destinationCaller authorized caller on the destination domain, as bytes32. If equal to bytes32(0),
         * any address can broadcast the message.
         * @param maxFee maximum fee to pay on the destination domain, specified in units of burnToken
         * @param minFinalityThreshold the minimum finality at which a burn message will be attested to.
         * @param executorArgs The arguments to be passed into the Executor.
         * @param feeArgs The arguments used to compute and pay the referrer fee.
         */
        function depositForBurn(
            uint256 amount,
            uint16 destinationChain,
            uint32 destinationDomain,
            bytes32 mintRecipient,
            address burnToken,
            bytes32 destinationCaller,
            uint256 maxFee,
            uint32 minFinalityThreshold,
            ExecutorArgs calldata executorArgs,
            FeeArgs calldata feeArgs
        ) external payable;
    }
    ```

In both cases, you pass:

- `executorArgs.signedQuote`: The `signedQuote` returned by the Executor `/v0/quote` endpoint.
- `executorArgs.instructions`: The serialized relay instructions from the previous step.
- `executorArgs.refundAddress`: The address that should receive any unused funds refunded by the Executor.
- `feeArgs`: Optional referrer fee configuration, if your integration charges a fee on transfers.

### SVM with CCTPv1

For CCTPv1, an `ExampleCCTPExecutor` program is available to help compose a full CCTP Executor request directly on-chain. The program reads the latest nonce published by the CCTP `MessageTransmitter` and issues a relay request using that value.

??? interface "ExampleCCTPExecutor.json"

    ```json
    {
      "address": "CXGRA5SCc8jxDbaQPZrmmZNu2JV34DP7gFW4m31uC1zs",
      "metadata": {
        "name": "example_cctp_with_executor",
        "version": "0.1.0",
        "spec": "0.1.0",
        "description": "Created with Anchor"
      },
      "instructions": [
        {
          "name": "relay_last_message",
          "discriminator": [
            68,
            157,
            251,
            90,
            201,
            66,
            40,
            60
          ],
          "accounts": [
            {
              "name": "payer",
              "docs": [
                "Payer will pay the Executor"
              ],
              "writable": true,
              "signer": true
            },
            {
              "name": "payee",
              "writable": true
            },
            {
              "name": "message_transmitter"
            },
            {
              "name": "executor_program",
              "address": "Ax7mtQPbNPQmghd7C3BHrMdwwmkAXBDq7kNGfXNcc7dg"
            },
            {
              "name": "system_program",
              "address": "11111111111111111111111111111111"
            }
          ],
          "args": [
            {
              "name": "args",
              "type": {
                "defined": {
                  "name": "RelayLastMessageArgs"
                }
              }
            }
          ]
        }
      ],
      "accounts": [
        {
          "name": "MessageTransmitter",
          "discriminator": [
            71,
            40,
            180,
            142,
            19,
            203,
            35,
            252
          ]
        }
      ],
      "types": [
        {
          "name": "MessageTransmitter",
          "docs": [
            "Main state of the MessageTransmitter program"
          ],
          "type": {
            "kind": "struct",
            "fields": [
              {
                "name": "owner",
                "type": "pubkey"
              },
              {
                "name": "pending_owner",
                "type": "pubkey"
              },
              {
                "name": "attester_manager",
                "type": "pubkey"
              },
              {
                "name": "pauser",
                "type": "pubkey"
              },
              {
                "name": "paused",
                "type": "bool"
              },
              {
                "name": "local_domain",
                "type": "u32"
              },
              {
                "name": "version",
                "type": "u32"
              },
              {
                "name": "signature_threshold",
                "type": "u32"
              },
              {
                "name": "enabled_attesters",
                "type": {
                  "vec": "pubkey"
                }
              },
              {
                "name": "max_message_body_size",
                "type": "u64"
              },
              {
                "name": "next_available_nonce",
                "type": "u64"
              }
            ]
          }
        },
        {
          "name": "RelayLastMessageArgs",
          "type": {
            "kind": "struct",
            "fields": [
              {
                "name": "recipient_chain",
                "type": "u16"
              },
              {
                "name": "exec_amount",
                "type": "u64"
              },
              {
                "name": "signed_quote_bytes",
                "type": "bytes"
              },
              {
                "name": "relay_instructions",
                "type": "bytes"
              }
            ]
          }
        }
      ]
    }
    ```

??? interface "ExampleCCTPExecutor.ts"

    ```tsx
    /**
     * Program IDL in camelCase format in order to be used in JS/TS.
     *
     * Note that this is only a type helper and is not the actual IDL. The original
     * IDL can be found at `target/idl/example_cctp_with_executor.json`.
     */
    export type ExampleCctpWithExecutor = {
      address: 'CXGRA5SCc8jxDbaQPZrmmZNu2JV34DP7gFW4m31uC1zs';
      metadata: {
        name: 'exampleCctpWithExecutor';
        version: '0.1.0';
        spec: '0.1.0';
        description: 'Created with Anchor';
      };
      instructions: [
        {
          name: 'relayLastMessage';
          discriminator: [68, 157, 251, 90, 201, 66, 40, 60];
          accounts: [
            {
              name: 'payer';
              docs: ['Payer will pay the Executor'];
              writable: true;
              signer: true;
            },
            {
              name: 'payee';
              writable: true;
            },
            {
              name: 'messageTransmitter';
            },
            {
              name: 'executorProgram';
              address: 'Ax7mtQPbNPQmghd7C3BHrMdwwmkAXBDq7kNGfXNcc7dg';
            },
            {
              name: 'systemProgram';
              address: '11111111111111111111111111111111';
            }
          ];
          args: [
            {
              name: 'args';
              type: {
                defined: {
                  name: 'relayLastMessageArgs';
                };
              };
            }
          ];
        }
      ];
      accounts: [
        {
          name: 'messageTransmitter';
          discriminator: [71, 40, 180, 142, 19, 203, 35, 252];
        }
      ];
      types: [
        {
          name: 'messageTransmitter';
          docs: ['Main state of the MessageTransmitter program'];
          type: {
            kind: 'struct';
            fields: [
              {
                name: 'owner';
                type: 'pubkey';
              },
              {
                name: 'pendingOwner';
                type: 'pubkey';
              },
              {
                name: 'attesterManager';
                type: 'pubkey';
              },
              {
                name: 'pauser';
                type: 'pubkey';
              },
              {
                name: 'paused';
                type: 'bool';
              },
              {
                name: 'localDomain';
                type: 'u32';
              },
              {
                name: 'version';
                type: 'u32';
              },
              {
                name: 'signatureThreshold';
                type: 'u32';
              },
              {
                name: 'enabledAttesters';
                type: {
                  vec: 'pubkey';
                };
              },
              {
                name: 'maxMessageBodySize';
                type: 'u64';
              },
              {
                name: 'nextAvailableNonce';
                type: 'u64';
              }
            ];
          };
        },
        {
          name: 'relayLastMessageArgs';
          type: {
            kind: 'struct';
            fields: [
              {
                name: 'recipientChain';
                type: 'u16';
              },
              {
                name: 'execAmount';
                type: 'u64';
              },
              {
                name: 'signedQuoteBytes';
                type: 'bytes';
              },
              {
                name: 'relayInstructions';
                type: 'bytes';
              }
            ];
          };
        }
      ];
    };

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

    ---

    `recipientChain` ++"uint16"++  

    The Wormhole chain ID of the destination chain where the USDC redemption should occur.

    ---

    `signedQuoteBytes` ++"bytes"++  

    The signed quote returned from the Executor `/v0/quote` endpoint. Must be passed as raw bytes (without the `0x` prefix).

    ---

    `relayInstructions` ++"bytes"++  

    The serialized relay instructions generated earlier, typically created by converting the hex string into a byte buffer.

    ---

    `messageTransmitter` ++"pubkey"++  

    The CCTP `MessageTransmitter` program account on Solana.

    ---

    `payee` ++"pubkey"++  

    The address extracted from the signed quote that receives refunds or drop-offs.


This combines the CCTP burn and the Executor request atomically in a single Solana transaction.

### SVM with CCTPv2

CCTPv2 on Solana does not require a dedicated helper program. The integration can be implemented entirely client-side:

1. Call `depositForBurn` or `depositForBurnWithHook`.
2. Follow by calling `requestForExecution` with `requestBytes: Buffer.from("4552433201", "hex")`
3. Pass `requestBytes`, the `signedQuote` from the quote endpoint, the serialized `relayInstructions`, and the estimated cost (as lamports) as `execAmount`.

If needed, you can fetch the on-chain IDLs for both programs:

```bash
anchor idl --provider.cluster m fetch CCTPV2Sm4AdWt5296sk4P66VBZ7bEhcARwFaaS9YPbeC
anchor idl --provider.cluster m fetch execXUrAsMnqMmTHj5m7N1YQgsDz3cwGLYCYyuDRciV
```

This allows CCTPv2 with Executor to be composed entirely in your client transaction builder without additional on-chain infrastructure.

### Sui

On Sui, an `executor_requests` helper module is deployed so that, using [Programmable Transaction Blocks (PTB)](https://docs.sui.io/guides/developer/sui-101/building-ptb){target=\_blank}, no integration-specific Move module is required. You can extend an existing `deposit_for_burn` PTB by deriving the CCTP message fields and then issuing an Executor request.

The following example shows how to:

1. Call `deposit_for_burn` and capture the returned CCTP message.
2. Read the `source_domain` and `nonce` from the message.
3. Build CCTPv1 request bytes via `executor_requests::make_cctp_v1_request`.
4. Split off a coin to pay the Executor using the `estimatedCost` from the quote.
5. Call `executor::request_execution` with the quote, request bytes, and relay instructions.

```tsx
// grab the message NestedResult
const [_, message] = tx.moveCall({
  target: `${tokenMessengerId}::deposit_for_burn::deposit_for_burn`,
  // ... existing CCTP args ...
});

const [source_domain] = tx.moveCall({
  target: `${messageTransmitterId}::message::source_domain`,
  arguments: [message],
});

const [nonce] = tx.moveCall({
  target: `${messageTransmitterId}::message::nonce`,
  arguments: [message],
});

const [requestBytes] = tx.moveCall({
  target: `${executorRequestsId}::executor_requests::make_cctp_v1_request`,
  arguments: [source_domain, nonce],
});

const [executorCoin] = tx.splitCoins(tx.gas, [tx.pure.u64(BigInt(estimate))]);

tx.moveCall({
  target: `${executorId}::executor::request_execution`,
  arguments: [
    executorCoin,
    tx.object(SUI_CLOCK_OBJECT_ID),
    tx.pure.u16(dstChain),
    tx.pure.address('0x0'),
    tx.pure.address(signer.getPublicKey().toSuiAddress()),
    tx.pure.vector('u8', Buffer.from(quote.substring(2), 'hex')),
    requestBytes,
    tx.pure.vector('u8', Buffer.from(relayInstructions.substring(2), 'hex')),
  ],
});

```

## Check the Transaction Status

After submitting your transaction, you can query the relay provider to check its execution status. This allows you to confirm whether the transfer has been processed and finalized by the Executor.

```ts
const res = await axios.post(`${EXECUTOR_URL}/v0/status/tx`, {
  txHash,
  chainId,
});
```

You can also link directly to the transaction in the explorer:

```ts
`https://wormholelabs-xyz.github.io/executor-explorer/#/chain/${chainId}tx/${txHash}?endpoint=${encodeURIComponent(EXECUTOR_URL)}`;
```

## Conclusion

Integrating CCTP with Executor enables permissionless, quote-based relaying and execution for USDC across EVM, SVM, and Sui. CCTP continues to provide the canonical burn-and-mint flow for USDC, while Executor coordinates cross-chain execution through a network of relay providers rather than a single dedicated relayer.

Applications can build end-to-end CCTP transfers, with redeem and any follow-up logic handled automatically on the destination chain. This pattern lets you keep CCTP as the source of truth for USDC movement, while using Executor to flexibly manage gas, drop-offs, and execution behavior across multiple environments.
