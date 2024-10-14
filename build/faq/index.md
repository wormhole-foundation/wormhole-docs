---
title: FAQs
description: Find answers to frequently asked questions about Wormhole's features, including CCTP, custom relayers, token bridges, TypeScript SDK, and more.
---

# FAQs

## Wormholescan API

### How can I retrieve the history of previously bridged transactions?

To retrieve the history of previously bridged transactions, you can use the Wormholescan API. Use the following endpoint to query the transaction history for a specific address:

```bash
https://api.wormholescan.io/api/v1/operations?address=INSERT_ADDRESS
```

Simply replace `INSERT_ADDRESS_HERE` with the address you want to query. The API will return a list of operations, including details about previously bridged transactions.

???- example "Fetch transaction history for a specific address"
    ```bash
    curl -X GET "https://api.wormholescan.io/api/v1/operations?address=0x05c009C4C1F1983d4B915C145F4E782de23d3A38" -H "accept: application/json"
    ```

### How can I manually submit a VAA to a destination chain in the correct format?

To manually submit a VAA (Verifiable Action Approval) to a destination chain, follow these steps:

1. **Obtain the VAA in Base64 format** - navigate to the **Advanced** tab in [Wormholescan](https://wormholescan.io/){target=\_blank} to find the VAA associated with the transaction you want to submit and copy the VAA in base64 format

    ```bash
    https://wormholescan.io/#/tx/INSERT_TX_HASH?view=advanced
    ```

2. **Convert the VAA to hex** - you must convert the base64 VAA into a hexadecimal (hex) format before submitting it to the destination chain. This can be done using various online tools or via command-line utilities like `xxd` or a script in a language like Python

3. **Submit the VAA through Etherscan (for EVM chains)** - once the VAA is in hex format, go to the [Etherscan UI](https://etherscan.io/){target=\_blank} and submit it through the [`TokenBridge`](https://github.com/wormhole-foundation/wormhole-solidity-sdk/blob/main/src/interfaces/ITokenBridge.sol){target=\_blank} contract’s method (such as the `CompleteTransfer` function or `CompleteTransferWithPayload`)

    - The `TokenBridge` contract addresses for each chain are available in the [Wormhole contract addresses](/docs/build/reference/contract-addresses/){target=\_blank} section

    - Interact with the smart contract through the Etherscan UI by pasting the hex-encoded VAA into the appropriate field

Following these steps, you can manually submit a VAA in the proper format to a destination chain.

## TypeScript SDK

### Why does the `toNative` function in the TypeScript SDK return an error?

The `toNative` function may return an error if the platform-specific module (such as Solana or EVM) is not correctly imported or passed into the Wormhole constructor.

To fix this, ensure the relevant platform module is imported and included when initializing Wormhole. For example, if you're working with Solana, make sure to import the Solana module and pass it into the Wormhole constructor like this:

```typescript
import solana from '@wormhole-foundation/sdk/solana';
const wh = await wormhole('Testnet', [solana]);
```

## Relayer

### How do I start developing a custom relayer?

Previously referred to as specialized relayers, custom relayers allow you to build and tailor relayers to fit your specific use case. To get started, refer to the following resources:

 - [Custom Relayers documentation](/docs/learn/infrastructure/relayer/#custom-relayers){target=\_blank}
 - [Relayer Engine](/docs/infrastructure/relayers/run-relayer/#get-started-with-the-relayer-engine){target=\_blank}
 - [Run a Custom Relayer](/docs/infrastructure/relayers/run-relayer/){target=\_blank}

These resources will guide you through building and deploying custom relayers tailored to your use case.

## Token Bridge

### Can ownership of wrapped tokens be transferred from the Token Bridge?

No, you cannot transfer ownership of wrapped token contracts from the [Token Bridge](/learn/messaging/token-nft-bridge/){target=\_blank} because the Token Bridge deploys and retains ownership of these contracts and tokens.

 - **On EVM chains** - when you attest a token, the Token Bridge deploys a new ERC-20 contract as a beacon proxy. The upgrade authority for these contracts is the Token Bridge contract itself
 - **On Solana** - the Token Bridge deploys a new SPL token, where the upgrade authority is a Program Derived Address (PDA) controlled by the Token Bridge

The logic behind deploying these token contracts involves submitting an attestation VAA, which allows the Token Bridge to verify and deploy the wrapped token contract on the destination chain.

Relevant contracts:

 - [Ethereum ERC-20](https://github.com/wormhole-foundation/wormhole/blob/gateway-integration/ethereum/contracts/bridge/token/Token.sol){target=\_blank}
 - [Solana SPL](https://github.com/wormhole-foundation/wormhole/blob/gateway-integration/solana/modules/token_bridge/program/src/api/create_wrapped.rs#L128-L145){target=\_blank}
 - [Attestation VAA and Token Contract Deployment Logic](https://github.com/wormhole-foundation/wormhole/blob/gateway-integration/ethereum/contracts/bridge/Bridge.sol#L385-L431){target=\_blank}

## Queries

### What libraries are available to handle queries?

 - The [Query TypeScript SDK](https://npmjs.com/package/@wormhole-foundation/wormhole-query-sdk){target=\_blank} can be used to create query requests, mock query responses for testing, and parse query responses. The SDK also includes utilities for posting query responses

- The [Solidity `QueryResponse` abstract contract](https://github.com/wormhole-foundation/wormhole-solidity-sdk/blob/main/src/QueryResponse.sol){target=\_blank} can be used to parse and verify query responses on EVM chains. See the [Solana Stake Pool](https://github.com/wormholelabs-xyz/example-queries-solana-stake-pool){target=\_blank} repository as an example use case

- [`QueryTest.sol`](https://github.com/wormhole-foundation/wormhole-solidity-sdk/blob/main/src/testing/helpers/QueryTest.sol){target=\_blank} can be used for mocking query requests and responses in Forge tests

- The [Go query package](https://github.com/wormhole-foundation/wormhole/tree/main/node/pkg/query){target=\_blank} can also be used to create query requests and parse query responses

!!! note
    A Rust SDK for Solana is being actively investigated by the Wormhole contributors. See the [Solana Queries Verification](https://github.com/wormholelabs-xyz/example-queries-solana-verify){target=\_blank} repository as a proof of concept.

### Are there any query examples?

Certainly. You can find a complete guide on the [Use Queries page](/docs/build/applications/queries/use-queries). Additionally, you can find full code examples in the following repositories:

- [Basic Example Query Demo](https://github.com/wormholelabs-xyz/example-queries-demo/){target=\_blank}
- [Solana Stake Pool Example Query](https://github.com/wormholelabs-xyz/example-queries-solana-stake-pool){target=\_blank}
- [Solana Program Derived Address (PDA) / Token Account Balance Example Query](https://github.com/wormholelabs-xyz/example-queries-solana-pda){target=\_blank}
- [Solana Queries Verification Example](https://github.com/wormholelabs-xyz/example-queries-solana-verify){target=\_blank}

### What is the format of the response signature?

The Guardian node calculates an ECDSA signature using [`Sign` function of the crypto package](https://pkg.go.dev/github.com/ethereum/go-ethereum@v1.10.21/crypto#Sign){target=\_blank} where the digest hash is:

```keccak256("query_response_0000000000000000000|"+keccak256(responseBytes))``` 

See the [Guardian Key Usage](https://github.com/wormhole-foundation/wormhole/blob/main/whitepapers/0009_guardian_key.md){target=\_blank} white paper for more background. Once this signature is created, the Guardian's index in the Guardian set is appended to the end.

!!! note
    If you are used to `ecrecover` you will notice that the `v` byte is `0` or `1` as opposed to `27` or `28`. The `signaturesToEvmStruct` method in the [Query TypeScript SDK](https://npmjs.com/package/@wormhole-foundation/wormhole-query-sdk){target=\_blank} accounts for this as well as structuring the signatures into an `IWormhole.SignatureStruct[]`.

### Can anyone run a query proxy server?

Permissions for Query Proxy are managed by the Guardians. The Guardian nodes are configured to only listen to a set of allow-listed proxies. However, it is possible that this restriction may be lifted in the future and/or more proxies could be added.

It is also important to note that the proxies don't impact the verifiability of the request or result, i.e., their role in the process is trustless.