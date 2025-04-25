---
title: Get Started with Connect
description: TODO 
categories: Connect, Transfer
---

# Get Started with Connect

<!--TODO: work with WH to get moved to official repos-->

:simple-github: [Complete Example - GitHub](https://github.com/dawnkelly09/connect-usdc-demo-app){target=\_blank}

:simple-vercel: [Deployed Demo App - Vercel](https://connect-usdc-demo-app.vercel.app/){target=\_blank}

## Introduction

Connect helps you to easily add an intuitive, multichain asset transfer UI to your web applications. The guide demonstrates how-to configure the Connect widget, add it to a React application, and view the application locally.

## Prerequisites

Before you begin, make sure you have the following:

- [Node.js and npm](https://docs.npmjs.com/downloading-and-installing-node-js-and-npm){target=\_blank}
- **RPC URLs for Sepolia and Solana endpoints** - public endpoints are provided, but you are free to substitute your own

- **Optional** - if you would like to send a testnet transfer using your demo application, you will also need the following:

    - **Developer wallet with Sepolia USDC** - you can use the [Circle Testnet Faucet](https://faucet.circle.com/){target=\_blank} to obtain tokens
    - **Developer wallet with Solana address** - to use as the recipient address; no tokens required


## Start Your Integration

Use the following steps to integrate Connect into a Next.js application:

### Create Your Project

1. In your terminal, navigate to the directory where you wish to create your project, then run the following command:

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

Open the project in your code editor of choice, locate the `page.tsx` file in the `app` directory, delete the boilerplate code, and replace it with the following:

```typescript title="page.tsx"
--8<-- 'code/products/connect/configuration/get-started/page.tsx'
```

### Configure Connect

The preceding sample code configures Connect by setting values inside `config` and `theme` as follows:

- **Define the network** - options include `Mainnet`, `Testnet`, or `Devnet`
- **Define chains to include** - this example uses Sepolia and Solana. See the complete list of [Connect-supported chain names](https://github.com/wormhole-foundation/wormhole-sdk-ts/blob/main/core/base/src/constants/chains.ts){target=\_blank} if you would like to use different chains
- **Define RPC URLs** - you must provide an RPC endpoint for each supported chain
- **Add a title to UI** - optional. If defined, it will render above the widget in the UI
- **Define the theme** - this example sets mode to `dark` mode and adds a primary color

### Interact with Connect

Follow these steps to serve your application locally and interact with the Connect UI:

1. Save your changes to `page.tsx`, then run the following command from the root of your project to start the dev server: 

    ```bash
    npm run dev
    ```

2. Open your browser to [http://localhost:3000/](http://localhost:3000/){target=\_blank} to view your application which should look similar to the following:

![Deployed Connect Widget](/docs/images/products/connect/tutorials/react-dapp/get-started/connect-get-started01.webp)

Congratulations! You've successfully integrated Connect to create a simple USDC transfer application. You can now follow the prompts in the UI to connect your developer wallets and send a test transfer.

## Next Steps

<!--TODO: links to other guides and tutorials. Definitely want to feature using Connect to interact with your NTT deployment-->





