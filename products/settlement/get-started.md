---
title: Get Started
description: Perform a cross-chain token swap using Wormhole Settlement and the Mayan Swift route with the TypeScript SDK on mainnet.
categories: Settlement, Transfer
---

# Get Started

[Settlement](/docs/products/settlement/overview/){target=\_blank} is Wormhole’s intent-based execution layer that enables fast, multichain token transfers. It coordinates routing logic, relayers, and on-chain infrastructure to let users express what they want done, not how.

This guide walks you through performing a real token swap from Ethereum to Solana using the [Mayan Swift route](https://mayan.finance){target=_blank}, one of the three integrated Settlement protocols. We’ll follow the [demo-mayanswift](https://github.com/wormhole-foundation/demo-mayanswift){target=_blank} project and use the [Wormhole SDK](https://www.npmjs.com/package/@wormhole-foundation/sdk){target=_blank}.

By the end, you'll have a working script that:

- Resolves token transfer routes using Mayan Swift
- Quotes and validates the best route
- Initiates the swap on Ethereum
- Completes the transfer on Solana

!!! note
    Mayan Swift currently supports **mainnet only**. Attempting to run this demo on testnet will result in failure.

## Prerequisites

Before you begin, ensure you have the following:

- [Node.js and npm](https://docs.npmjs.com/downloading-and-installing-node-js-and-npm){target=\_blank} installed on your machine
- A wallet with a private key, funded with native tokens on mainnet for gas fees
  - **Ethereum** wallet with ETH for gas
  - **Solana** wallet with SOL for fees


## Project Setup

Start by scaffolding a basic Node.js project and installing the required SDKs.

1. Create a new project folder

    ```bash
    mkdir settlement-swap
    cd settlement-swap
    npm init -y
    ```

2. Install the required dependencies

    ```bash
    npm install @wormhole-foundation/sdk-connect \
        @wormhole-foundation/sdk-evm \
        @wormhole-foundation/sdk-solana \
        @mayanfinance/wormhole-sdk-route \
        dotenv
    npm install -D typescript tsx
    ```
3. Create the file structure

    ```bash
    mkdir src
    touch src/helpers.ts src/swap.ts .env .gitignore
    ```
4. Set up environment variables: Set up secure access to your wallets. This guide assumes you are loading your `MAINNET_ETH_PRIVATE_KEY` and `MAINNET_SOL_PRIVATE_KEY` from a secure keystore of your choice, such as a secrets manager or a CLI-based tool like [cast wallet](https://book.getfoundry.sh/reference/cast/cast-wallet/){target=_blank}. If you're testing locally, you can create a .env file with the following:

    ```bash
    MAINNET_ETH_PRIVATE_KEY="your_ethereum_private_key"
    MAINNET_SOL_PRIVATE_KEY="your_solana_private_key"
    ```

    !!! warning
        If you use a .env file during development, add it to your .gitignore to exclude it from version control. Never commit private keys or mnemonics to your repository.

    Add this to your `.gitignore`:

    ```bash
    node_modules
    .env
    ```

## Configure Wallet Access

The Mayan Swift route requires signing transactions on both EVM and Solana. To handle this cleanly, you’ll write a helper function that:

- Detects the platform (Solana or EVM)
- Loads the correct signer from the environment
- Returns both the signer and a Wormhole-formatted address

Create `src/helpers.ts` and add the following:

```ts title="src/helpers.ts"
--8<-- "code/products/settlement/get-started/snippet-1.ts"
```

- `getEnv()` makes sure required keys are present, or throws a clear error.
- The `getSigner()` function:
    - Checks if the chain is EVM or Solana
    - Loads the appropriate signer using Wormhole SDK helpers
    - Returns both the signer (used to send txs) and address (used as the recipient)

You’ll use this in the next step to load the sender (on Ethereum) and receiver (on Solana).

## Perform the Token Swap

Now you’ll build the script that performs the swap using the Mayan Swift route. Here’s what happens in the `swap.ts` script:

- **Initialize Wormhole**: Sets up the SDK for Mainnet with EVM and Solana support.
- **Define chains and tokens**: specifies you're sending native ETH on Base to native SOL on Solana.
- **Load wallets**: Pulls signers and addresses from your `getSigner()` helper.
- **Create transfer request**: Tells Wormhole what you're trying to do.
- **Find routes**: Asks the Mayan Swift resolver to suggest valid ways to perform the transfer.
- **Transfer parameters** – specifies how much to send and uses default route options.
- **Validate route**: Checks if your intent is valid (e.g. sufficient liquidity, no errors).
- **Quote**: Retrieves the expected output and fees.
- **Initiate**: Sends the transaction on Ethereum (Base).
- **Complete**: waits for the VAA and finalizes the transfer on Solana.

Add the following code to `src/swap.ts`:

```ts title="src/swap.ts"
--8<-- "code/products/settlement/get-started/snippet-2.ts"
```

## Add a Run Script

To simplify running the swap script, update your `package.json` with the following:

```json title="package.json"
{
  "scripts": {
    "swap": "npx tsx src/swap.ts"
  }
}
```

## Run the Script

Once everything is in place, you can execute the swap script with:

```bash
npm run swap
```
If successful, you’ll see terminal output like this:

```bash
Validated: { valid: true, ... }
Quote: { success: true, ... }
Initiated transfer with receipt: ...
Current Transfer State: DestinationFinalized
```

Congrats!!! You've just completed a cross-chain token swap from Ethereum to Solana using Settlement!

## Customize the Integration

You can tailor the example to your use case by adjusting:

- **Tokens and chains** – use `getSupportedTokens()` to explore what's available
- **Transfer settings** – update the amount or route parameters
- **Signer management** – modify `src/helpers.ts` to integrate with your preferred wallet setup
- **Source and destination chains**: modify `sendChain` and `destChain` in `swap.ts`
- **Amount and transfer settings**: adjust amount to suit your needs

## Next Steps

Once you've chosen a path, follow the corresponding guide to start building:

- [**Integrate with Liquidity Layer**](/docs/products/settlement/guides/liquidity-layer/){target=\_blank} – interact directly with routers for flexible protocol-level control
- [**Use Mayan Swift with the SDK**](TODO){target=\_blank} – plug into Settlement using the [TypeScript SDK](https://www.npmjs.com/package/@wormhole-foundation/sdk){target=\_blank} for rapid integration
