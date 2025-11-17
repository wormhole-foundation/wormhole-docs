---
title: Integrate CCTP with Executor
description: Learn how to integrate Circle CCTP with the Executor framework for permissionless, quote-based USDC relaying and cross-chain execution.
categories: CCTP, Transfer, Executor
---
<!-- move snippets, link to this page -->
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

**EVM**

For EVM destination chains, the `gasLimit` is the gas limit that will be set on the redeeming transaction. The gas used may vary based on whether including a gas drop-off instruction or not (in addition to the normal differences between various EVM chains).

`msgValue` is not used by CCTP’s `receiveMessage` function and should be set to 0.

**SVM**

For SVM destination chains, such as Solana, the `gasLimit` is the number of Compute Units that will be set on the transaction. This will impact the total cost based on the [Priority Fee](https://solana.com/developers/guides/advanced/how-to-use-priority-fees) included in the quote and must cover the actual Compute Units used by the transaction.

`msgValue` must exceed the lamports required for the transaction *in addition to* the Priority Fee (e.g. fee and rent). See 


Transfers to SVM are designated to a token account which *must exist* before the redeeming the transfer. In order to support transfers to a wallet for which a USDC token account does not exist, we can dynamically create the associated token account for a wallet *if* the relay instructions include a `GasDropOffInstruction` for that wallet (even if the drop-off amount is set to zero). This provides the relayer the necessary information to re-derive and create the associated token account. So, we recommend following this pattern.

1. Always send to the associated token account.
2. Before sending, check if the associated token account exists. If it does not, add a zero value `GasDropOffInstruction` to the wallet so the relayer can create it automatically.

If using a non-zero `GasDropOffInstruction` to a ***new*** wallet, the drop-off amount must be greater than the `getMinimumBalanceForRentExemption` lamports. Our relayer will ignore drop-offs to new accounts if they are less than the minimum as otherwise the transaction would fail.

**Sui**

For Sui destination chains, the `gasLimit` represents the [gas budget](https://sdk.mystenlabs.com/typescript/transaction-building/gas#budget) to be set on the transaction. Similar to transactions submitted directly to Sui, this may require setting a budget that is higher than the actual cost. This approach of directly setting the gas budget was taken due to the [complex and non-linear cost of gas on Sui](https://docs.sui.io/concepts/tokenomics/gas-in-sui#gas-prices).

## Request a SignedQuote

Request a SignedQuote from our Relay Provider. For example, this requests a quote from Sepolia to Base Sepolia.

```tsx
const EXECUTOR_URL = "https://executor-testnet.labsapis.com"
const { signedQuote: quote, estimatedCost: estimate } = (
  await axios.post(`${EXECUTOR_URL}/v0/quote`, {
    srcChain: 10002,
    dstChain: 10004,
    relayInstructions,
  })
).data;
```

Example Result:

```bash
{
  "signedQuote": "0x455130315241c9276698439fef2780dbab76fec90b633fbd000000000000000000000000f7122c001b3e07d7fafd8be3670545135859954a271227140000000067dd750f00000000000003e80000000000514b7c000011bbaf716200000011bbaf716200f86edc3960908d257472836d5b1c33c457bf17af67a758d9984356e7166bec8162faa0e07f991d061b93e4f033895c71134a30d9ca369c606fcabba0b742d2431c",
  "estimatedCost": "1431935000000"
}
```

Signed Quotes have an expiry time and should be generated with each request and submitted promptly on-chain. The Executor contract will revert if the expiry time has passed. 


# Call your sending contract

Use the provided estimate, signed quote, and relay instructions to invoke your sending side contract. See [[Public] Executor Addresses       ](https://www.notion.so/Public-Executor-Addresses-1f93029e88cb80df940eeb8867a01081?pvs=21) for a full list of helpers contracts.

**EVM**

`CCTPv1WithExecutor` and `CCTPv2WithExecutor` contracts have been developed which call `depositForBurn` followed by `requestExecution`. Attached below are the interface files.

[ICCTPv1WithExecutor.sol](attachment:981c4962-a1ca-409d-a0e6-f9f9bb78f5cd:ICCTPv1WithExecutor.sol)

[ICCTPv2WithExecutor.sol](attachment:5a1975a4-bc3b-4855-8416-99c30c35c408:ICCTPv2WithExecutor.sol)

**SVM**

### CCTP v1

An `example_cctp_with_executor` program has been developed which requests a relay for the last nonce the CCTP Message Transmitter published by reading the message transmitter state account.

- `example_cctp_with_executor.json`
    
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
    
- `example_cctp_with_executor.ts`
    
    ```tsx
    /**
     * Program IDL in camelCase format in order to be used in JS/TS.
     *
     * Note that this is only a type helper and is not the actual IDL. The original
     * IDL can be found at `target/idl/example_cctp_with_executor.json`.
     */
    export type ExampleCctpWithExecutor = {
      "address": "CXGRA5SCc8jxDbaQPZrmmZNu2JV34DP7gFW4m31uC1zs",
      "metadata": {
        "name": "exampleCctpWithExecutor",
        "version": "0.1.0",
        "spec": "0.1.0",
        "description": "Created with Anchor"
      },
      "instructions": [
        {
          "name": "relayLastMessage",
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
              "name": "messageTransmitter"
            },
            {
              "name": "executorProgram",
              "address": "Ax7mtQPbNPQmghd7C3BHrMdwwmkAXBDq7kNGfXNcc7dg"
            },
            {
              "name": "systemProgram",
              "address": "11111111111111111111111111111111"
            }
          ],
          "args": [
            {
              "name": "args",
              "type": {
                "defined": {
                  "name": "relayLastMessageArgs"
                }
              }
            }
          ]
        }
      ],
      "accounts": [
        {
          "name": "messageTransmitter",
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
          "name": "messageTransmitter",
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
                "name": "pendingOwner",
                "type": "pubkey"
              },
              {
                "name": "attesterManager",
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
                "name": "localDomain",
                "type": "u32"
              },
              {
                "name": "version",
                "type": "u32"
              },
              {
                "name": "signatureThreshold",
                "type": "u32"
              },
              {
                "name": "enabledAttesters",
                "type": {
                  "vec": "pubkey"
                }
              },
              {
                "name": "maxMessageBodySize",
                "type": "u64"
              },
              {
                "name": "nextAvailableNonce",
                "type": "u64"
              }
            ]
          }
        },
        {
          "name": "relayLastMessageArgs",
          "type": {
            "kind": "struct",
            "fields": [
              {
                "name": "recipientChain",
                "type": "u16"
              },
              {
                "name": "execAmount",
                "type": "u64"
              },
              {
                "name": "signedQuoteBytes",
                "type": "bytes"
              },
              {
                "name": "relayInstructions",
                "type": "bytes"
              }
            ]
          }
        }
      ]
    };
    
    ```
    

Simply add the `relayLastMessage` instruction as a `postInstruction` on your `depositForBurn` transaction.

```tsx
const shimProgram = new Program<ExampleCctpWithExecutor>(
  ExampleCctpWithExecutorIdl,
  provider
);
...
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

### CCTP v2

Using CCTP v2 with Executor on SVM does not inherently require a specialized on-chain smart contract and may be integrated entirely client-side. Simply call `depositForBurn` or `depositForBurnWithHook` followed by `requestForExecution` with `requestBytes: Buffer.from("4552433201", "hex")`. The same can be done on-chain. The IDL for `TokenMessengerMinterV2` and `Executor` can be pulled from on-chain with the following command.

```bash
anchor idl --provider.cluster m fetch CCTPV2Sm4AdWt5296sk4P66VBZ7bEhcARwFaaS9YPbeC
anchor idl --provider.cluster m fetch execXUrAsMnqMmTHj5m7N1YQgsDz3cwGLYCYyuDRciV
```

**Sui**

An `executor_requests` helper module has been deployed to Sui so that, using the power and flexibility of [Programmable Transaction Blocks](https://docs.sui.io/guides/developer/sui-101/building-ptb), no integration-specific module is needed. Simply add the following to your existing `deposit_for_burn` transaction. 

```tsx
// grab the message NestedResult
const [_, message] = tx.moveCall({
    target: `${tokenMessengerId}::deposit_for_burn::deposit_for_burn`,
...
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
    tx.pure.address("0x0"),
    tx.pure.address(signer.getPublicKey().toSuiAddress()),
    tx.pure.vector("u8", Buffer.from(quote.substring(2), "hex")),
    requestBytes,
    tx.pure.vector("u8", Buffer.from(relayInstructions.substring(2), "hex")),
  ],
});
```

# Status the transaction

Our Relay Provider currently relies on you to status transaction after submitting.

```bash
const res = await axios.post(`${EXECUTOR_URL}/v0/status/tx`, {
  txHash,
  chainId,
})
```

You can also link to the explorer with

```tsx
`https://wormholelabs-xyz.github.io/executor-explorer/#/chain/${
	chainId
}tx/${
  txHash
}?endpoint=${encodeURIComponent(EXECUTOR_URL)}`
```

## Conclusion



<!-- other
There’s a work-in-progress explorer here:

- [Testnet](https://wormholelabs-xyz.github.io/executor-explorer/#/?endpoint=https%3A%2F%2Fexecutor-testnet.labsapis.com&env=Testnet)
- [Mainnet](https://wormholelabs-xyz.github.io/executor-explorer/#/?endpoint=https%3A%2F%2Fexecutor.labsapis.com&env=Mainnet)

-->