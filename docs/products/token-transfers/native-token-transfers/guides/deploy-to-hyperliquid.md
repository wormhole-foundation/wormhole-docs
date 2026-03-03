---
title: Native Token Transfers Hyperliquid Deployment
description: Deploy and configure Wormhole's Native Token Transfers (NTT) on Hyperliquid, including HyperCore spot token linking, asset bridging between HyperEVM and HyperCore, and CLI usage.
categories: NTT, Transfer
---

# Deploy NTT to Hyperliquid

[Native Token Transfers (NTT)](/docs/products/token-transfers/native-token-transfers/overview/){target=\_blank} enable seamless multichain transfers of tokens using Wormhole's messaging protocol. On Hyperliquid, NTT contracts are deployed to [HyperEVM](https://hyperliquid.gitbook.io/hyperliquid-docs/hyperevm){target=\_blank} (the EVM-compatible execution layer), and can then be linked to [HyperCore](https://hyperliquid.gitbook.io/hyperliquid-docs){target=\_blank} (the L1 order book layer) to enable spot trading of your token.

This guide walks you through the Hyperliquid-specific steps: deploying a HyperCore spot token, linking it to your HyperEVM ERC-20 contract, and bridging tokens between the two layers using the NTT CLI.

!!! warning
    The HyperEVM integration is experimental, as its node software is not open source. Use Wormhole messaging on HyperEVM with caution.

## Prerequisites

Before following this guide, ensure you have:

- An NTT deployment on HyperEVM. If you haven't deployed yet, follow the [Deploy NTT to EVM Chains](/docs/products/token-transfers/native-token-transfers/guides/deploy-to-evm/){target=\_blank} guide using HyperEVM as your target chain.
- Your `ETH_PRIVATE_KEY` environment variable set to the deployer wallet private key.
- The [NTT CLI](/docs/products/token-transfers/native-token-transfers/reference/cli-commands/){target=\_blank} installed and up to date.

## Overview of the Deployment Process

After deploying NTT on HyperEVM, integrating with HyperCore follows these steps:

1. **Deploy a spot token on HyperCore** - use the Hyperliquid Deploy Spot UI to register your token and obtain a token index.
2. **Link HyperCore to HyperEVM** - use `ntt hype link` to connect your HyperCore spot token to its HyperEVM ERC-20 contract.
3. **Bridge tokens** - use `ntt hype bridge-in` and `ntt hype bridge-out` to move tokens between HyperEVM and HyperCore.

## Deploy a Spot Token on HyperCore

Before linking your ERC-20 token on HyperEVM to HyperCore, you must first deploy a [HIP-1](https://hyperliquid.gitbook.io/hyperliquid-docs/hyperliquid-improvement-proposals-hips/hip-1-native-token-standard){target=\_blank} spot token through Hyperliquid's Deploy Spot interface. This is a multi-step process performed directly on the Hyperliquid platform.

Navigate to the Deploy Spot page:

- **Testnet** - [app.hyperliquid-testnet.xyz/deploySpot](https://app.hyperliquid-testnet.xyz/deploySpot){target=\_blank}
- **Mainnet** - [app.hyperliquid.xyz/deploySpot](https://app.hyperliquid.xyz/deploySpot){target=\_blank}

!!! warning
    Each step is permanent. You cannot change inputs after proceeding to the next step. Hyperliquid recommends testing the exact configuration on testnet before using mainnet.

### Step 1: Deploy Token

Register the token name and configure its decimal precision:

- **`szDecimals`** - tradable precision on the order book. For example, `2` means the minimum order increment is `0.01` tokens.
- **`weiDecimals`** - smallest indivisible unit. For example, `8` means the smallest unit is `0.00000001` tokens.

These values must satisfy the constraint: **`szDecimals + 5 <= weiDecimals`** as defined in the [HIP-1 specification](https://hyperliquid.gitbook.io/hyperliquid-docs/hyperliquid-improvement-proposals-hips/hip-1-native-token-standard){target=\_blank}.

!!! note
    The HIP-1 token on HyperCore uses `weiDecimals`, which may differ from your ERC-20 token's decimals on HyperEVM. The asset bridge handles the conversion between the two.

### Step 2: Set Deployer Trading Fee Share

Configure the percentage of trading fees on the spot pair that go to your deployer address. The remainder is burned. This value can only be **decreased** after deployment, never increased.

After completing this step, the **Progress So Far** panel on the right side of the screen displays your **Token Index**, the unique integer identifier for your spot token on HyperCore. Save this value as you'll need it for the `ntt hype link` command after completing the Deploy Spot process.

![The Progress So Far panel in the Deploy Spot UI after Step 2, showing Token Index and fee share](/docs/images/products/native-token-transfers/guides/hyperliquid/deploy-spot-progress-step2.jpeg)

### Step 3: Set Genesis Balances

This step allocates the initial HIP-1 token supply. For an NTT bridge token, you must mint the genesis supply to the **asset bridge address** so the bridge has reserves to back bridged tokens.

The asset bridge address is deterministic based on your token index. The format is a fixed prefix followed by the token index as a 4-character hex value:

```text
0x2000000000000000000000000000000000000{tokenIndex as 4-char hex}
```

For example, token index `1591` = hex `0637`:

```text
0x2000000000000000000000000000000000000637
```

In the Deploy Spot UI:

1. Enter the **asset bridge address** in the **User** field.
2. Enter the genesis amount in the **Amount** field. This is a whole number in the smallest unit (wei). For example, with `weiDecimals=8`, an amount of `10000000000000000` equals 100 million tokens.
3. Click **Register User Genesis** to register the entry.
4. Click **Complete User Genesis** to finalize (irreversible).

!!! note
    Why mint to the asset bridge? The bridge credits HIP-1 tokens on HyperCore when ERC-20 deposits arrive on HyperEVM. It can only release tokens it already holds. Minting the genesis supply to the bridge ensures it has reserves to back any deposited ERC-20 tokens.

### Step 4: Deploy Spot Trading Pair

This step creates the trading pair between your token and USDC on HyperCore via a `RegisterSpot` action. It requires specifying the base token index (your token) and the quote token index (USDC). The initial pricing is determined through a [Dutch auction](https://hyperliquid.gitbook.io/hyperliquid-docs/for-developers/api/deploying-hip-1-and-hip-2-assets){target=\_blank} mechanism.

### Step 5: Deploy Hyperliquidity

Hyperliquidity commits permanent on-chain liquidity to the order book. It is not required for the asset bridge to function, but the UI requires you to configure it before proceeding to Step 6.

!!! warning
    Hyperliquidity reserves a portion of the genesis supply for its automated market making. Account for this when choosing your genesis amount in Step 3.

### Step 6: Review and Trigger Genesis

Review all inputs and trigger genesis. This step creates the HIP-1 token on HyperCore and is **irreversible**. Without triggering genesis, the token does not exist on HyperCore.

The **Progress So Far** panel on the right side of the screen summarizes your deployment, including the **Token Index** you'll need for the next step.

![The Progress So Far panel in the Deploy Spot UI showing the Token Index](/docs/images/products/native-token-transfers/guides/hyperliquid/deploy-spot-token-index.jpeg)

## Link HyperCore to HyperEVM

Once your spot token is deployed on HyperCore, use the `ntt hype link` command to connect it to your HyperEVM ERC-20 contract. This two-step process registers the EVM contract with HyperCore and finalizes the link.

```bash
ntt hype link --token-index INSERT_TOKEN_INDEX
```

Replace `INSERT_TOKEN_INDEX` with the token index from the Deploy Spot process (e.g., `1591`).

The command performs two actions automatically:

1. **Request** - registers the EVM contract address with HyperCore.
2. **Finalize** - completes the link by confirming the contract deployment nonce.

After the command completes, it saves the `tokenIndex` to your `deployment.json` under a `hypercore` key:

```json
{
  "network": "Testnet",
  "chains": {
    "HyperEVM": {
      "token": "0x..."
    }
  },
  "hypercore": {
    "tokenIndex": 1591
  }
}
```

??? interface "Additional Options"

    | Option | Description | Default |
    |---|---|---|
    | `--only-finalize` | Skip the request step and only run finalize. Useful if the request was already submitted separately. | `false` |
    | `--evm-extra-wei-decimals` | Set `evmExtraWeiDecimals` (ERC-20 decimals minus `weiDecimals`). | `10` |
    | `--deploy-nonce` | Explicitly set the ERC-20 CREATE deploy nonce. Auto-derived from the deployer address if omitted. | Auto |
    | `--testnet` | Override the network setting from `deployment.json` to use testnet. | From `deployment.json` |

## Bridge Tokens Between HyperEVM and HyperCore

After linking, you can move tokens between HyperEVM and HyperCore using the asset bridge. Each HyperCore spot token has a deterministic asset bridge address derived from its token index.

### Bridge Into HyperCore

Transfer tokens from HyperEVM into HyperCore:

```bash
ntt hype bridge-in INSERT_AMOUNT_DECIMAL
```

Replace `INSERT_AMOUNT_DECIMAL` with the human-readable token amount (e.g., `100`, `0.5`). This sends an ERC-20 `transfer` to the asset bridge address on HyperEVM, which credits the equivalent HIP-1 tokens to your HyperCore account.

### Bridge Out to HyperEVM

Transfer tokens from HyperCore back to HyperEVM:

```bash
ntt hype bridge-out INSERT_AMOUNT_DECIMAL
```

Replace `INSERT_AMOUNT_DECIMAL` with the token amount to withdraw. This performs a `spotSend` on HyperCore to the asset bridge, which releases the tokens as ERC-20 on HyperEVM to your wallet address.

## Check Status

At any point after linking, you can check your HyperCore token configuration:

```bash
ntt hype status
```

This displays:

- **Token index** - the HyperCore spot token identifier.
- **Asset bridge address** - the deterministic bridge address for your token.
- **Token string** - the HyperCore token identifier (e.g., `WSV:0x7d816f...`).
- **Network** - testnet or mainnet.
- **EVM token address** - the linked ERC-20 contract on HyperEVM.

