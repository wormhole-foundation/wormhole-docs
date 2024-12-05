---
title: Connect FAQs
description: Common questions and detailed answers about using Wormhole Connect, including supported assets, chains, customization, and integration options.
---

# Wormhole Connect FAQs

## What types of assets does Connect support? 

Wormhole Connect supports both native and wrapped assets across all Wormhole-supported blockchains. This includes:

 - Major stablecoins like USDT and USDC (via CCTP)
 - Native gas tokens such as ETH, SOL, etc.
 - Cross-chain asset swaps through integrators like Mayan

When bridging assets through the Wormhole Token Bridge, depending on the chain and token, assets may arrive as Wormhole-wrapped tokens on the destination chain.

## What chains does Connect support? 

Connect supports around 30 chains, spanning various blockchain runtimes:

 - EVM-based chains (Ethereum, Base, Arbitrum, BSC, etc.)
 - Solana
 - Move-based chains (Sui, Aptos)

For a complete list of supported chains, see the [Connect-supported chains list](/docs/build/applications/connect/features/){target=\_blank}.

## What is gas dropoff? 

Gas dropoff allows users to receive gas for transaction fees on the destination chain, eliminating the need to acquire the native gas token from a centralized exchange. The relayer automatically swaps part of the transferred assets into the native gas token, enabling seamless entry into new ecosystems.

## Can I customize Connect inside my application?

Connect can be [fully customized](https://connect-in-style.wormhole.com/){target=\_blank} to choose the chains and assets you wish to support. You may also select different themes and colors to tailor Connect for your decentralized application. For details, see the [GitHub readme](https://github.com/wormhole-foundation/wormhole-connect){target=\_blank}.

## Which functions or events does Connect rely on for NTT integration? 

Connect relies on the NTT SDK for integration, with platform-specific implementations for Solana and EVM. The critical methods involved include initiate and redeem functions and rate capacity methods. These functions ensure Connect can handle token transfers and manage chain-rate limits.

## Do integrators need to enable wallets like Phantom or Backpack in Wormhole Connect?

Integrators don’t need to explicitly enable wallets like Phantom or Backpack in Wormhole Connect. However, the wallet must be installed and enabled in the user's browser to appear as an option in the interface.

## Which function should be modified to set priority fees for Solana transactions?

In [Wormhole Connect](https://github.com/wormhole-foundation/wormhole-connect){target=\_blank}, you can modify the priority fees for Solana transactions by updating the `computeBudget/index.ts` file. This file contains the logic for adjusting the compute unit limit and priority fees associated with Solana transactions.

To control the priority fee applied to your transactions, you can modify the `feePercentile` and `minPriorityFee` parameters in the `addComputeBudget` and `determineComputeBudget` functions.

The relevant file can be found in the Connect codebase: [`computeBudget/index.ts`](https://github.com/wormhole-foundation/wormhole-connect/blob/62f1ba8ee5502ac6fd405680e6b3816c9aa54325/sdk/src/contexts/solana/utils/computeBudget/index.ts){target=\_blank}.

## Is there a minimum amount for bridging with CCTP or the Connect SDK?

There is no minimum amount for bridging via CCTP if the user covers the gas fees on both the source and destination chains. However, if the transfer is automatically relayed, there is a minimum amount required to cover relay fees on the destination chain. These fees are charged at cost by the relay provider.

Current relay fees:

- Ethereum L1: ~4.2 USDC
- Base, Optimism, Arbitrum, Avalanche: 0.3 USDC

Additional notes:

- **USDC to Solana** - Wormhole's native CCTP route does not currently support automatic relaying of USDC to Solana. However, you can transfer USDC to Solana using the [Mayan plugin](https://github.com/mayan-finance/wormhole-sdk-route){target=\_blank} for the SDK. Mayan is a protocol that integrates Wormhole and CCTP to enable this functionality
- **Frontend integrations**
    - **Connect** - A pre-built UI available via [@wormhole-foundation/wormhole-connect](https://www.npmjs.com/package/@wormhole-foundation/wormhole-connect){target=\_blank}
    - **TypeScript SDK** - A lower-level integration option, available via [@wormhole-foundation/sdk](https://www.npmjs.com/package/@wormhole-foundation/sdk){target=\_blank}, allowing developers to build custom UIs

        !!!note
            Note: The TypeScript SDK was previously referred to as the "Connect SDK," but this naming has since been discontinued.
