---
title: FAQs
description: Find answers to frequently asked questions about Wormhole's features, including NTT, CCTP, custom relayers, token bridges, TypeScript SDK, and more.
---

# FAQs

##  Native Token Transfers (NTT)

### Do you have an example of how cross-chain lending can be implemented using Wormhole?

Yes, we have an example of cross-chain lending that leverages [Wormhole’s Token Bridge](/learn/messaging/token-nft-bridge/){target=\_blank}. In this example, collateral deposits (such as ETH on Ethereum) are bridged to a hub chain. Once the collateral is deposited, the borrowed assets, like wrapped BNB, are bridged to Binance Smart Chain. You can explore the full implementation in this [cross-chain lending example repository](https://github.com/wormhole-foundation/example-wormhole-lending){target=_blank}.

Alternatively, you can also implement cross-chain lending using [Wormhole’s core messaging](/learn/messaging/native-token-transfers/){target=\_blank} instead of the Token Bridge, which avoids the limitations imposed by governor limits. ETH would be custodied on Ethereum, and BNB on the Binance spoke during this setup. When a user deposits ETH on Ethereum, a core bridge message is sent to the hub for accounting purposes. The hub then emits a message that can be redeemed on Binance to release the BNB. This approach allows for more direct asset control across chains while reducing reliance on Token Bridge limits.

### What causes the "No protocols registered for Evm" error in Wormhole SDK?

This error typically occurs when the [Wormhole SDK](https://github.com/wormhole-foundation/wormhole-sdk-ts){target=\_blank} cannot recognize or register the necessary EVM protocols, which are required for interacting with Ethereum-based networks. The most common reason for this error is that the relevant EVM package for Wormhole's NTT has not been imported correctly.

To resolve this issue, ensure you have imported the appropriate Wormhole SDK package for EVM environments. The necessary package for handling NTT on EVM chains is `@wormhole-foundation/sdk-evm-ntt`. Here's the correct import statement:

```rust
import '@wormhole-foundation/sdk-evm-ntt';
```

By importing this package, the Wormhole SDK can register and utilize the required protocols for EVM chains, enabling cross-chain token transfers using the NTT framework. Ensure to include this import at the start of your code, especially before attempting any interactions with EVM chains in your project.

### How can I transfer ownership of NTT to a multisig?

Transferring ownership of Wormhole's NTT to a multisig is a two-step process for safety. This ensures that ownership is not transferred to an address that cannot claim it. Refer to the `transfer_ownership` method in the [NTT Manager Contract](https://github.com/wormhole-foundation/example-native-token-transfers/blob/main/solana/programs/example-native-token-transfers/src/instructions/admin.rs#L16-L60){target=\_blank} to initiate the transfer.

1. **Initiate transfer** - use the `transfer_ownership` method on the NTT Manager contract to set the new owner (the multisig)
2. **Claim ownership** - the multisig must then claim ownership via the `claim_ownership` instruction. If not claimed, the current owner can cancel the transfer
3. **Single-step transfer (Riskier)** - you can also use the `transfer_ownership_one_step_unchecked` method to transfer ownership in a single step, but if the new owner cannot sign, the contract may become locked. Be cautious and ensure the new owner is a Program Derived Address (PDA)


### How can I specify a custom RPC for NTT?

To specify a custom RPC for Wormhole's NTT, create an `overrides.json` file in the root of your deployment directory. This file allows you to define custom RPC endpoints, which can be helpful when you need to connect to specific nodes or networks for better performance, security, or control over the RPC connection.

Below’s an example of how the `overrides.json` file should be structured:

???- example "Example `overrides.json`"
    ```json
    {
    "chains": {
        "Bsc": {
            "rpc": "http://127.0.0.1:8545"
        },
        "Sepolia": {
            "rpc": "http://127.0.0.1:8546"
        },
        "Solana": {
            "rpc": "http://127.0.0.1:8899"
        }
        }
    }
    ```

### How can I redeem tokens if NTT rate limits block them on the target chain?

If the rate limits on Wormhole's NTT block tokens from being received on the target chain, the transaction will typically be paused until the rate limits are adjusted. Rate limits are implemented to manage congestion and prevent chain abuse, but they can occasionally delay token redemptions.

To resolve this:

1. **Adjust rate limits** - the rate limits must be modified by an administrator or through the appropriate configuration tools to allow the blocked transaction to proceed
2. **Resume transaction flow** - once the rate limits are adjusted, you can resume the flow, which should be visible in the UI. The tokens will then be redeemable on the target chain

In most cases, the transaction will resume automatically once the rate limits are adjusted, and the UI will guide you through the redemption process.

### What are the challenges of deploying NTT to non-EVM chains?

NTT requires the same transceiver for all routes, limiting flexibility when deploying across EVM and non-EVM chains. For example, if you're deploying to Ethereum, Arbitrum, and Solana, you can't use Wormhole and Axelar as transceivers because Axelar doesn't support Solana. This constraint forces integrators to use a single transceiver (e.g., Wormhole) for all chains, reducing flexibility in optimizing cross-chain transfers.

### Does the NTT manager function as an escrow account for a hub chain?

Yes, the NTT manager acts like an escrow account for non-transferable tokens on a hub chain. To manage non-transferable tokens, you would add the NTT manager to the allowlist, ensuring that only the NTT manager can hold and control the tokens as they are transferred across chains.

### Which functions or events does Connect rely on for NTT integration?

Connect relies on the NTT SDK for integration, with platform-specific implementations for both [Solana](https://github.com/wormhole-foundation/example-native-token-transfers/blob/main/solana/ts/sdk/ntt.ts){target=\_blank} and [EVM](https://github.com/wormhole-foundation/example-native-token-transfers/blob/main/evm/ts/src/ntt.ts){target=\_blank}. The key methods involved include:

- **Initiate and redeem functions** - these functions are essential for initiating token transfers and redeeming them on the destination chain
- **Rate capacity methods** - methods for fetching inbound and outbound rate limits are also critical for controlling the flow of tokens and preventing congestion

These functions ensure Connect can handle token transfers and manage chain-rate limits.

### How does the relayer contract determine which transceiver to call?

The source chain's transceiver includes the destination chain's transceiver in the message via the relayer contract. The admin configures each transceiver's mapping of its peers on other chains. This mapping allows the destination transceiver to verify that the message came from a trusted source.

## Wormhole Connect

### Do integrators need to enable wallets like Phantom or Backpack in Wormhole Connect?

Integrators don’t need to enable wallets like Phantom or Backpack in Wormhole Connect explicitly. However, the wallet must be installed and enabled in the user's browser to appear as an option in the interface.

### Is a minimum amount required for bridging with CCTP/Connect SDK?

There is no minimum amount for bridging if the user is paying gas fees on both the source and destination chains. However, if you want to use automatic relaying, a minimum amount is required to cover relay fees:

 - Approximately 4.2 USDC for Ethereum L1
 - Approximately 0.3 USDC for Base, Optimism, Arbitrum, and Avalanche

!!! note
    - Currently, Wormhole’s native CCTP route does not support automatic relaying of USDC to Solana. For this, you can use the [Mayan plugin](https://github.com/mayan-finance/wormhole-sdk-route){target=\_blank}

### Which function should be modified to set priority fees for Solana transactions?

In [Wormhole Connect](https://github.com/wormhole-foundation/wormhole-connect){target=\_blank}, you can modify the priority fees for Solana transactions by updating the `computeBudget/index.ts` file. This file contains the logic for adjusting the compute unit limit and priority fees associated with Solana transactions.

To control the priority fee applied to your transactions, you can modify the `feePercentile` and `minPriorityFee` parameters in the `addComputeBudget` and `determineComputeBudget` functions.

The relevant file can be found in the Connect codebase: [`computeBudget/index.ts`](https://github.com/wormhole-foundation/wormhole-connect/blob/62f1ba8ee5502ac6fd405680e6b3816c9aa54325/sdk/src/contexts/solana/utils/computeBudget/index.ts){target=\_blank}.

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

3. **Submit the VAA through Etherscan (for EVM chains)** - once the VAA is in hex format, go to the [Etherscan UI](https://etherscan.io/){target=\_blank} and submit it through the relevant contract’s method (such as the `CompleteTransfer` function or `CompleteTransferWithPayload`)

    - The correct contract addresses for each chain are available in the [Wormhole contract addresses](/docs/build/reference/contract-addresses/){target=\_blank} section

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

`keccak256("query_response_0000000000000000000|"+keccak256(responseBytes))` 

See the [Guardian Key Usage](https://github.com/wormhole-foundation/wormhole/blob/main/whitepapers/0009_guardian_key.md){target=\_blank} white paper for more background. Once this signature is created, the Guardian's index in the Guardian set is appended to the end.

!!! note
    If you are used to `ecrecover` you will notice that the `v` byte is `0` or `1` as opposed to `27` or `28`. The `signaturesToEvmStruct` method in the [Query TypeScript SDK](https://npmjs.com/package/@wormhole-foundation/wormhole-query-sdk){target=\_blank} accounts for this as well as structuring the signatures into an `IWormhole.SignatureStruct[]`.

### Can anyone run a query proxy server?

Permissions for Query Proxy are managed by the Guardians. The Guardian nodes are configured to only listen to a set of allow-listed proxies. However, it is possible that this restriction may be lifted in the future and/or more proxies could be added.

It is also important to note that the proxies don't impact the verifiability of the request or result, i.e., their role in the process is trustless.