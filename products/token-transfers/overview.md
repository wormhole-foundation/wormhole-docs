---
title: Token Transfers Overview
description: Transfer tokens across chains using Wormhole's Native Token Transfers (NTT) for direct movement or Wrapped Token Transfers (WTT) for lock-and-mint.
categories: WTT, NTT, Transfer
---

# Token Transfers Overview

Wormhole Token Transfers let you move assets seamlessly across chains. Developers can choose between [Native Token Transfers (NTT)](/docs/products/token-transfers/native-token-transfers/overview/){target=\_blank}, which enable direct movement of native tokens, or [Wrapped Token Transfers (WTT)](/docs/products/token-transfers/wrapped-token-transfers/overview/){target=\_blank}, which use a lock-and-mint model for broad compatibility. Both approaches are secured by the Wormhole Guardians and integrate with the same cross-chain messaging layer.

## How Token Transfers Work

Both NTT and WTT rely on Guardian-signed messages ([VAAs](/docs/protocol/infrastructure/vaas/){target=\_blank}) to move tokens securely across chains. The difference lies in how tokens are represented on the destination chain.

At a high level, the flow looks like this:

1. A user sends tokens to the Wormhole contract on the source chain.
2. The contract emits a message, which is signed by the Guardians as a VAA.
3. The VAA is submitted to the destination chain.
4. Depending on the transfer type:
    - **NTT**: Tokens are minted or released from escrow.
    - **WTT**: Wrapped tokens are minted to the recipient’s wallet.

