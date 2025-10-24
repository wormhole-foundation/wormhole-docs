---
title: Native Token Transfers FAQs
description: Frequently asked questions about Wormhole Native Token Transfers, including cross-chain lending, SDK usage, custom RPCs, and integration challenges.
categories: NTT, Transfer
---

# NTT FAQs

## What is NTT?

Native Token Transfers (NTT) is a framework for moving your own token across multiple chains without wrapping. It preserves your token's native contract design on every chain and keeps control in your hands for metadata, ownership, upgrades, and custom features.

NTT includes configurable controls like rate limiting and access control, and supports deployment modes that fit either new or existing tokens. For a quick video summary, watch the [NTT speed round](https://youtu.be/wdU_6tAeGyg?si=-2wWxC8IZegzB1vl){target=\_blank}.

## Do you have an example of how cross-chain lending can be implemented using Wormhole?

Yes, we have an example of cross-chain lending that leverages [Wormhole’s Wrapped Token Transfers (WTT)](/docs/products/token-transfers/wrapped-token-transfers/overview/){target=\_blank}. In this example, collateral deposits (such as ETH on Ethereum) are bridged to a hub chain. Once the collateral is deposited, the borrowed assets, like wrapped BNB, are bridged to Binance Smart Chain. You can explore the full implementation in the [Wormhole Lending Examples repository](https://github.com/wormhole-foundation/example-wormhole-lending){target=\_blank} on GitHub.

Alternatively, you can also implement cross-chain lending using [Wormhole’s core messaging](/docs/products/messaging/overview/){target=\_blank} instead of WTT, which avoids the limitations imposed by governor limits. ETH would be custodied on Ethereum, and BNB on the Binance spoke during this setup. When a user deposits ETH on Ethereum, a core bridge message is sent to the hub for accounting purposes. The hub then emits a message that can be redeemed on Binance to release the BNB. This approach allows for more direct asset control across chains while reducing reliance on WTT limits.

## What causes the "No protocols registered for Evm" error in Wormhole SDK?

This error typically occurs when the [Wormhole SDK](https://github.com/wormhole-foundation/wormhole-sdk-ts){target=\_blank} cannot recognize or register the necessary EVM protocols, which are required for interacting with Ethereum-based networks. The most common reason for this error is that the relevant EVM package for Wormhole's NTT has not been imported correctly.

To resolve this issue, ensure you have imported the appropriate Wormhole SDK package for EVM environments. The necessary package for handling NTT on EVM chains is `@wormhole-foundation/sdk-evm-ntt`. Here's the correct import statement:

```rust
import '@wormhole-foundation/sdk-evm-ntt';
```

By importing this package, the Wormhole SDK can register and utilize the required protocols for EVM chains, enabling cross-chain token transfers using the NTT framework. Ensure to include this import at the start of your code, especially before attempting any interactions with EVM chains in your project.

## How can I mint tokens after moving the treasury object to the NTT manager on Sui?

To mint tokens after moving the treasury object to the NTT manager on Sui, you need to use the `take_treasury_cap` function from the [NTT contract](https://github.com/wormhole-foundation/native-token-transfers/blob/main/sui/packages/ntt/sources/state.move#L307C16-L307C33){target=\_blank}. This function allows the admin to temporarily take the treasury cap to mint assets.

The flow works as follows:

1. **Take the treasury cap**: Use `state.take_treasury_cap(admin_cap)` to extract the treasury cap.
2. **Mint assets**: Perform your minting operations with the treasury cap.
3. **Return the treasury cap**: Use `state.return_treasury_cap(treasury_cap)` to return it to the state.

!!!Important 
    Return the Treasury Cap! If the treasury cap is not returned in the same transaction, the NTT deployment will stop working. The contract will break and become non-functional.

It is recommended to use [Programmable Transaction Blocks (PTBs)](https://docs.sui.io/concepts/transactions/prog-txn-blocks){target=\_blank} for this operation. PTBs allow you to execute multiple operations atomically in a single transaction, ensuring that both the minting operation and returning the treasury cap happen together, preventing any risk of the contract breaking.

## How can I specify a custom RPC for NTT?

To specify a custom RPC for Wormhole's NTT, create an `overrides.json` file in the root of your deployment directory. This file allows you to define custom RPC endpoints, which can be helpful when you need to connect to specific nodes or networks for better performance, security, or control over the RPC connection.

Below is an example of how the `overrides.json` file should be structured:

???- code "`overrides.json`"
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

## How can I redeem tokens if NTT rate limits block them on the target chain?

If the rate limits on Wormhole's NTT block tokens from being received on the target chain, the transaction will typically be paused until the rate limits are adjusted. Rate limits are implemented to manage congestion and prevent chain abuse, but they can occasionally delay token redemptions.

To resolve this:

1. **Adjust rate limits**: The rate limits must be modified by an administrator or through the appropriate configuration tools to allow the blocked transaction to proceed.
2. **Resume transaction flow**: Once the rate limits are adjusted, you can resume the flow, which should be visible in the UI. The tokens will then be redeemable on the target chain.

In most cases, the transaction will resume automatically once the rate limits are adjusted, and the UI will guide you through the redemption process.

## What are the challenges of deploying NTT to non-EVM chains?

NTT requires the same transceiver for all routes, limiting flexibility when deploying across EVM and non-EVM chains. For example, if you're deploying to Ethereum, Arbitrum, and Solana, you can't use Wormhole and Axelar as transceivers because Axelar doesn't support Solana. This constraint forces integrators to use a single transceiver (e.g., Wormhole) for all chains, reducing flexibility in optimizing cross-chain transfers.

## Does the NTT manager function as an escrow account for a hub chain?

Yes, the NTT manager acts like an escrow account for non-transferable tokens on a hub chain. To manage non-transferable tokens, you would add the NTT manager to the allowlist, ensuring that only the NTT manager can hold and control the tokens as they are transferred across chains.

## Which functions or events does Connect rely on for NTT integration?

Connect relies on the NTT SDK for integration, with platform-specific implementations for both [SVM](https://github.com/wormhole-foundation/native-token-transfers/blob/main/solana/ts/sdk/ntt.ts){target=\_blank} and [EVM](https://github.com/wormhole-foundation/native-token-transfers/blob/main/evm/ts/src/ntt.ts){target=\_blank}. The key methods involved include:

- **Initiate and redeem functions**: These functions are essential for initiating token transfers and redeeming them on the destination chain.
- **Rate capacity methods**: Methods for fetching inbound and outbound rate limits are also critical for controlling the flow of tokens and preventing congestion.

These functions ensure Connect can handle token transfers and manage chain-rate limits.

## How does the relayer contract determine which transceiver to call?

The source chain's transceiver includes the destination chain's transceiver in the message via the relayer contract. The admin configures each transceiver's mapping of its peers on other chains. This mapping allows the destination transceiver to verify that the message came from a trusted source.

## How do I create a verifier or transceiver?

To run your verifier, you need to implement a transceiver. This involves approximately 200 lines of code, leveraging the base functionality provided by the [abstract transceiver contract](https://github.com/wormhole-foundation/native-token-transfers/blob/main/evm/src/Transceiver/Transceiver.sol){target=\_blank}.

For reference, you can review the [Axelar transceiver implementation](https://github.com/wormhole-foundation/example-wormhole-axelar-wsteth/blob/main/src/axelar/AxelarTransceiver.sol){target=\_blank}.

## Can I use Hetzner for the NTT deployment?

No, using Hetzner servers for Solana deployments is not recommended. Hetzner has blocked Solana network activity on its servers, leading to connection issues. Hetzner nodes will return a `ConnectionRefused: Unable to connect` error for Solana deployments. Therefore, choosing alternative hosting providers that support Solana deployments is advisable to ensure seamless operation.

## How can I transfer tokens with NTT with an additional payload?

You can include an extra payload in NTT messages by overriding specific methods in the [NttManager contract](https://github.com/wormhole-foundation/native-token-transfers/blob/main/evm/src/NttManager/NttManager.sol){target=\_blank}.

- On the source chain, override the [`_handleMsg` function](https://github.com/wormhole-foundation/native-token-transfers/blob/main/evm/src/NttManager/NttManager.sol#L216-L226){target=\_blank} to query any additional data you need for the transfer. The extra payload can then be added to the message.
- On the destination chain override the [`_handleAdditionalPayload` function](https://github.com/wormhole-foundation/native-token-transfers/blob/main/evm/src/NttManager/NttManager.sol#L262-L275){target=\_blank} to process and utilize the extra payload sent in the message.

!!!Important
    You cannot pass the additional data as part of the entry point directly. Instead, the data must be queried on-chain via the `_handleMsg` method, ensuring the payload is properly included and processed.

## Why use NTT over xERC20?

Shortcomings of xERC20:

- **Single point of failure**: xERC20 relies on multiple bridges, but a compromise in any single bridge can jeopardize the token. It enforces a 1-of-n design rather than a more robust m-of-n approach.
- **No pausing**: xERC20 lacks mechanisms to pause operations during emergencies.
- **No access control**: There are no built-in access controls for managing token transfers securely.
- **Limited rate limiting**: Rate limits are bridge-specific and cannot be set per chain, reducing flexibility and security.
- **No integration with relaying systems**: xERC20 does not natively support relayer systems, limiting its usability in automated or dynamic setups.

While xERC20 is an extension of the ERC20 standard, NTT is designed as a framework rather than a rigid standard. It is compatible with any token that supports `burn` and `mint` functions and allows the NTT manager to act as a minter. 

## How can I start transferring tokens to a chain that is in burning mode, if no tokens are locked yet?

To begin transferring tokens to a chain in burning mode when no tokens are locked, you must first send tokens to the NTT manager to back the supply. The address of the NTT manager can be found in the `deployment.json` file.

## Is there a way to use NTT tokens with chains that don't currently support NTT?

Yes. NTT tokens can be used with chains that do not support NTT by leveraging the [Wrapped Token Transfers (WTT)](/docs/products/token-transfers/wrapped-token-transfers/overview/){target=\_blank}. For example:

- **Wrapped token scenario**: A token, such as the W token, can be bridged to non-NTT networks using WTT. When the token is bridged to a chain like Sui, a wrapped version of the token is created (e.g., Wrapped W token).
- **Unwrapping requirement**: Tokens bridged using WTT cannot be directly transferred to NTT-supported chains. To transfer them, they must first be unwrapped on the non-NTT chain and then transferred via the appropriate mechanism.
- **Messaging consistency**: WTT exclusively uses Wormhole messaging, ensuring consistent communication across all chains, whether or not they support NTT.

This approach ensures interoperability while maintaining the integrity of the token's cross-chain movement.

## How can I update my NTT CLI version?

To update an existing NTT CLI installation, run the following command in your terminal:

```bash
ntt update
```

NTT CLI installations and updates will always pick up the latest tag with name vX.Y.Z+cli and verify that the underlying commit is included in main.

For local development, you can update your CLI version from a specific branch or install from a local path.

To install from a specific branch, run:

```bash
ntt update --branch foo
```

To install locally, run:
```bash
ntt update --path path/to/ntt/repo
```

Git branch and local installations enable a fast iteration loop as changes to the CLI code will immediately be reflected in the running binary without having to run any build steps.