---
title: Get Started with Connect
description: TODO 
categories: Connect, Transfer
---

# Get Started with Connect

:simple-github: [Complete Example - GitHub](https://github.com/dawnkelly09/connect-usdc-demo-app){target=\_blank}

:simple-vercel: [Deployed Demo App - Vercel](https://connect-usdc-demo-app.vercel.app/){target=\_blank}

Connect helps you to easily add an intuitive, multichain asset transfer UI to your web applications.

## Objectives

This guide demonstrates how to: 

1. Create a Next.js project and install dependencies
2. Add the Connect widget to your project
3. Configure Connect to send testnet USDC from Sepolia to Solana
4. Configure the theme to dark mode with a custom primary color
5. Start the dev server to interact with the Connect UI

## Prerequisites

Before you begin, make sure you have the following:

- [Node.js and npm](https://docs.npmjs.com/downloading-and-installing-node-js-and-npm){target=\_blank} 
- **Developer wallet with Sepolia USDC** - you can use the [Circle Testnet Faucet](https://faucet.circle.com/){target=\_blank} to obtain tokens
- **Developer wallet with Solana address** - to use as the recipient address, no tokens required
- **RPC URLs for Sepolia and Solana endpoints** - public endpoints are provided but, you are free to substitute your own

## Start Your Integration

Use the following steps to integrate Connect into a Next.js application:

### Create Your Project

1. In your terminal, navigate to the directory where you wish to create your project then run the following command:

    ```bash
    npx create-next-app@latest wormhole-connect-demo --typescript
    ```

2. Follow the prompts in your terminal to accept the default Next.js configuration parameters and create your project


### Install Dependencies

1. Navigate to your project directory using the following command:

    ```bash
    cd wormhole-connect-demo
    ```

2. Run the following command to install Connect:

    ```bash
    npm install @wormhole-foundation/wormhole-connect
    ```

    You will now see `@wormhole-foundation/wormhole-connect` under `dependencies` in your project's `package.json` file.

### Add Connect to Your Project

Open the project in your code editor of choice, locate the `page.tsx` file in the `app` directory, delete the boilerplate code and replace it with the following:

```typescript title="page.tsx"
'use client'

import WormholeConnect, {
  WormholeConnectConfig,
  WormholeConnectTheme,
} from '@wormhole-foundation/wormhole-connect';

function Page() {
  const config: WormholeConnectConfig = {
    // Define the network (Mainnet | Testnet | Devnet)
    

    // Define the chains
    

    // Define the RPC URLs


    // Add a title to the widget
    

  };

  const theme: WormholeConnectTheme = {
    // Define the mode
    
    // Define the primary color
    
  };

  return <WormholeConnect config={config} theme={theme} />;
}

export default Page;
```

### Define Connect Configuration

1. Add the following code to set the `network` parameter to `Testnet`:

    ```typescript title="page.tsx"
    // Define the network (Mainnet | Testnet | Devnet)
    network: 'Testnet',
    ```

2. Define the supported chains to include Sepolia and Solana:

    ```typescript title="page.tsx"
    // Define the chains
    chains: [
      'Solana',
      'Sepolia',
    ],
    ```

3. Define values for Sepolia and Solana public RPC endpoints:

    ```typescript title="page.tsx"
    // Define the RPC URLs
    rpcs: {
      Solana: 'https://api.devnet.solana.com',
      Sepolia: 'https://ethereum-sepolia-rpc.publicnode.com'
    },
    ```

4. Use the following code to add a title to the UI configuration:

    ```typescript title="page.tsx"
    // Add a title to the widget
    ui: {
      title: 'Wormhole Connect Demo',
    }
    ```

### Define Connect Theme 

1. Add the following code to select dark mode:

    ```typescript title="page.tsx"
    // Define the mode
    mode: 'dark',
    ```

2. Use the following code to select the primary color:

    ```typescript title="page.tsx"
    // Define the primary color
    primary: '#78c4b6',
    ```

Select the following dropdown element to view the complete `page.tsx` code:

??? code "View complete file"

<!--TODO: upload complete script to snippets dir, convert inline code blocks to use snippets-->

### Interact with Connect

Follow these steps to interact with your Connect UI locally and make a testnet USDC transfer from Sepolia to Solana:

1. Save your changes to `page.tsx`, then run the following command from the root of your project to start the dev server: 

    ```bash
    npm run dev
    ```

2. Open your browser to [http://localhost:3000/](http://localhost:3000/){target=\_blank} to view your application which should look similar to the following:
<!--TODO: insert image `connect-get-started01.webp`, add to dir & drive-->

3. Select the dropdown arrow next to **Select chain and token** on the **From** element then select **ETH** network

<!--TODO: insert image `connect-get-started03.webp`, add to dir & drive-->

4. Select **USDC Sepolia** from the list of available tokens then connect your Sepolia developer wallet containing testnet USDC tokens when prompted

<!--TODO: insert image `connect-get-started02.webp`, add to dir & drive-->

5. Select the dropdown arrow next to **Select chain and token** on the **To** element and select **USDC** from the token list

<!--TODO: insert image `connect-get-started04.webp`, add to dir & drive-->

6. Connect your Solana developer wallet when prompted. Note, you can also supply a Solana address for the recipient instead of connecting a wallet when sending tokens to another party

<!--TODO: insert image `connect-get-started05.webp`, add to dir & drive-->

7. Enter the amount of USDC to send and the **Routes** window will open to show you which network you will pay gas on and an estimate for how long it will take to complete the transfer to Solana

<!--TODO: insert image `connect-get-started06.webp`, add to dir & drive-->

8. Select the **Confirm transaction** button and sign the **Spending cap request** transaction to authorize the use of your Sepolia USDC. Notice you can verify the amount of the spending cap requested before you sign the transaction

<!--TODO: insert image `connect-get-started07.webp`, add to dir & drive-->

9. Sign the transaction request in your Sepolia wallet to initiate the transfer

<!--TODO: insert image `connect-get-started08.webp`, add to dir & drive-->

You can now see a countdown clock indicating the time remaining for the USDC to arrive on Solana and the details for the transfer transaction. You can safely leave this page and your transfer will continue to process in the background.

## Next Steps

Now that you've successfully integrated Connect and created a simple USDC transfer application, consider these options for building upon your skills and expanding functionality:

<!--TODO: links to other guides and tutorials. Definitely want to feature using Connect to interact with your NTT deployment-->





