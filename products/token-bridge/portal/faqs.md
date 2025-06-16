---
title: Portal Bridge FAQs
description: Learn how to use deep-linking on Portal Bridge and send tokens to any wallet address with simple URL parameters and custom recipient fields.
categories: Token-Bridge, Transfer
---

# FAQs

## How do I use deep-linking with Portal?

You can create a direct link to pre-fill chain and asset selections on [Portal Bridge](https://portalbridge.com){target=\_blank} using URL parameters.

| Parameter     | Description                                                |
|---------------|------------------------------------------------------------|
| `sourceChain` | A source chain that will be pre-selected                   |
| `targetChain` | A target chain that will be pre-selected                   |
| `asset`       | The asset key on the source chain (e.g., SOL, USDC, etc.)  |
| `targetAsset` | The asset key on the destination chain                     |

Example:

```bash
https://portalbridge.com/?sourceChain=solana&targetChain=ethereum&asset=SOL&targetAsset=WSOL
```

This link will open Portal with:
 
 - **`sourceChain`** pre-selected as `solana`
 - **`targetChain`** pre-selected as `ethereum`
 - **`asset`** pre-selected as `SOL`
 - **`targetAsset`** pre-selected as `WSOL`

!!! note
    For [**NTT tokens**](/docs/products/native-token-transfers/overview/){target=\_blank}, you can define just one asset if the same token exists across chains.

    Example: [https://portalbridge.com/?sourceChain=ethereum&targetChain=solana&asset=W](https://portalbridge.com/?sourceChain=ethereum&targetChain=solana&asset=W){target=\_blank}

## What does the "Send to a wallet address" field do?

After selecting your tokens and connecting your source wallet on [Portal](https://portalbridge.com/){target=\_blank}, you'll be prompted to connect your destination wallet. At this step, alongside wallet options like MetaMask or Phantom, you'll also see an option labeled "Send to a wallet address".

This allows you to enter any wallet address as the recipient, rather than connecting a destination wallet. This option will enable you to send tokens to a predefined recipient, such as a team wallet, treasury address, or cold storage wallet.

![](/docs/images/products/token-bridge/portal-bridge/faqs/portal-wallet-address.webp){.half}

This field is optional. If left empty, the tokens will be sent to your connected wallet.