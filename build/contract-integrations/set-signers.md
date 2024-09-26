---
title: "Set Signers: Connect vs. SDK"
description: Learn the difference between signing transactions using Wormhole Connect and the SDK, integrating MetaMask, WalletConnect, and ethers.js.
---

# Set Signers: Connect vs. SDK

## Introduction

When building with Wormhole, there are two primary ways to sign transactions: using [Wormhole Connect](/docs/build/applications/connect/){target=\_blank} for web-based signers like MetaMask and WalletConnect, or interacting with [Wormhole SDK](/docs/build/applications/wormhole-sdk/){target=\_blank} directly using libraries like [`ethers.js`](https://docs.ethers.org/v6/){target=\_blank}.

In this guide, we’ll clarify the differences between these approaches and show you how to set up both. Wormhole Connect is ideal if you’re developing a front-end application and want a simple, secure way to sign transactions through a UI. However, if you’re working at a lower level or directly with the SDK, you’ll need to handle signing through private keys, typically using `ethers.js` or a similar library.

By the end of this page, you’ll:

 - Understand when to use Connect versus the SDK
 - Learn how to integrate web-based signers like [MetaMask](https://metamask.io/){target=\_blank}
 - See how to set up transaction signing with the SDK using `ethers.js`

## UI-Based Applications

When building decentralized applications (dApps) with a user interface, managing transaction signing can be challenging, especially when avoiding directly handling private keys in your code. This is where Wormhole Connect comes in.

Wormhole Connect is a pre-built UI solution that simplifies integrating popular web-based signers like MetaMask and WalletConnect. Connect allows users to sign transactions securely without worrying about exposing private keys or building a custom signing interface from scratch.

### Why Use Wormhole Connect?

 - **Security** - signers like MetaMask handle private keys securely, removing the need for developers to interact with them directly
 - **Ease of Integration** - Wormhole Connect provides a ready-to-use UI, speeding up the development process for frontend applications
 - **User Familiarity** - many users are already familiar with MetaMask and WalletConnect, which can improve user experience and adoption of your dApp

### Set Up Wallets with Wormhole Connect

When using Wormhole Connect, your selected blockchain network determines the available wallet options.

 - For EVM chains, wallets like MetaMask and WalletConnect are supported
 - For Solana, you'll see options such as Phantom, Torus, and Coin98

The wallet options automatically adjust based on the selected chain, providing a seamless user experience without additional configuration.

If you'd like to offer WalletConnect as an option for EVM, make sure to obtain a project ID from the [WalletConnect cloud dashboard](https://cloud.reown.com/sign-in){target=\_blank}.

<figure markdown="span">
  ![Wormhole Connect](/docs/images/build/contract-integrations/signers/signers-1.webp)
  <figcaption>Wallet options based on the selected blockchain network.</figcaption>
</figure>

### What’s Next?

Once you've integrated Wormhole Connect and set up wallet options for your dApp, you can start handling user transactions securely. If you want to dive deeper into customizing wallet interactions or exploring advanced configuration options, check out the [Wormhole Connect Configuration](/docs/build/applications/connect/configuration/){target=\_blank} page.

For developers who need more control and flexibility, you may want to explore SDK-Level Applications. These applications allow you to work directly with the Wormhole SDK and handle signing transactions programmatically.

## SDK-Level Applications

For developers working with Wormhole SDK directly, signing transactions requires a more hands-on approach than UI-based integrations like Wormhole Connect. In SDK-level applications, you'll typically work without a pre-built interface, meaning you will programmatically handle private keys to sign and send transactions.

### Why Use SDK for Signing?

 - **Low-level control** - the SDK gives you full control over how transactions are signed and sent, allowing for more customization and flexibility in backend or automation scenarios
 - **Backend applications** - ideal for server-side implementations where you may not have a UI but need to interact with smart contracts and submit transactions programmatically
 - **Advanced customization** - if you're building more complex workflows or want to integrate multiple blockchains, the SDK allows you to customize how transactions are handled at a lower level

### Set Up a Signer with `ethers.js`

To sign transactions with the Wormhole SDK, you’ll typically use `ethers.js` or a similar library to manage private keys and handle signing.

Here’s an example of setting up a signer with `ethers.js`:

```javascript
--8<-- 'code/build/contract-integrations/signers/ethers.js'
```

 - **`provider`** - responsible for connecting to the Ethereum network (or any EVM-compatible network). It acts as a bridge between your application and the blockchain, allowing you to fetch data, check the state of the blockchain, and submit transactions

 - **`signer`** - represents the account that will sign the transaction. In this case, we’re creating a signer using the private key associated with the account. The signer is responsible for authorizing transactions by digitally signing them with the private key

 - **`Wallet`** - combines both the provider (for blockchain interaction) and the signer (for transaction authorization), allowing you to sign and send transactions programmatically

These components work together to create, sign, and submit a transaction to the blockchain.

???- tip "Managing Private Keys Securely"
    Handling private keys is unavoidable, so it’s crucial to manage them securely. Here are some best practices:

     - **Use environment variables** - avoid hardcoding private keys in your code. Use environment variables or secret management tools to inject private keys securely
     - **Hardware Wallets** - for production environments, consider integrating hardware wallets to keep private keys secure while allowing programmatic access through the SDK

### What’s Next?

Now that you’ve seen how to set up a signer and securely handle private keys, you can start building more advanced transaction workflows using the Wormhole SDK. If you're looking for a practical example, check out the [send cross-chain messages demo](https://github.com/wormhole-foundation/demo-wormhole-messaging/blob/a52860abfcdde62fe0abd259edfefce9cc3e726d/script/sendMessage.js#L24-L58){target=\_blank} where it implements `ethers.js` to sign and send transactions.

For more detailed information and advanced use cases, explore the [Wormhole SDK Tutorials](/docs/tutorials/messaging/){target=\_blank}.

## Conclusion

Choosing the right approach for signing transactions depends on the needs of your project. Wormhole Connect is the perfect solution if you’re building a user-friendly dApp with a UI and want to integrate popular wallets like MetaMask or WalletConnect without managing private keys directly. For more advanced or backend applications, using the Wormhole SDK with a library like `ethers.js` gives you complete control over transaction signing and private key management.

Whether you're developing a front-end app or a low-level SDK-based solution, Wormhole provides the tools and flexibility to handle multi-chain integrations securely and efficiently. Be sure to explore the provided demos and documentation to learn more about the specifics of each approach.