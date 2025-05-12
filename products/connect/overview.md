---
title: Wormhole Connect
description: Integrate the Wormhole Connect React widget into your web application for easy cross-chain asset transfers via Wormhole.
categories: Connect, Widget, UI, Transfer
---

# Wormhole Connect Overview 

Wormhole Connect is a React widget that lets developers offer an easy-to-use interface to facilitate cross-chain asset transfers via Wormhole directly in a web application. Check out the [Wormhole Connect GitHub repository](https://github.com/wormhole-foundation/wormhole-connect){target=\_blank}.

For developers seeking UI customization, the [Wormhole TypeScript SDK](docs/build/toolkit/typescript-sdk/){target=\_blank} provides a powerful alternative to the Connect widget, empowering you to integrate the same core functionality directly into your own user interface. Refer to the SDK documentation for comprehensive usage instructions.

## Features

Wormhole Connect offers flexible customization to match your application. Tailor technical aspects like supported assets and custom RPCs, or use the full-featured default widget. Its UI is also highly adaptable, offering extensive styling options, including a no-code visual interface. Connect’s features include:

- Multiple ways to bridge assets (routes)
- Extensive ways to style the UI (including the no-code styling interface)
- Ways to configure what feature set to offer
- Ability to configure any token to bridge via Wormhole
- Ability to drop off some gas at the destination

Be sure to check the [features page](docs/build/transfers/connect/features/){target=\_blank} for more details about Wormhole Connect's features and a breakdown of supported features by chain.

## How It Works

Think of Wormhole Connect as a ready-made interface that simplifies the process of bridging assets across different blockchains. When a user initiates a transfer using the widget:

1.  **Initiation** - Using the Wormhole Connect widget, select the asset to transfer, the source blockchain, and the destination blockchain.
2.  **Connection** - The widget facilitates a connection between the user’s wallet and the selected source chain.
3.  **Transaction Submission on Source Chain** - Once the user confirms the details, Wormhole Connect triggers a transaction on the source blockchain. This transaction typically involves locking or depositing the specified amount of the asset into a Wormhole-managed contract on that chain.
4.  **Wormhole Message Creation** - Upon successful confirmation of the transaction on the source chain, the Wormhole network observes this event. Guardians, the network's overseers, attest to the validity of this event and create a Cross-Chain Transfer (CCT) message (for CCTP transfers) or a Verifiable Action Approval (VAA) (for standard Wormhole transfers). This message essentially contains proof of the asset locking/deposit event on the source chain.
5.  **Message Relaying** - This CCT message or VAA is then relayed across the Wormhole network to the target blockchain. Relayers play a crucial role in transmitting these messages efficiently.
6.  **Transaction on Destination Chain** - On the destination blockchain, Wormhole Connect (or the underlying Wormhole contracts) processes the received CCT message or VAA. This verifies that the asset was successfully locked/deposited on the source chain and that the message is legitimate.
7.  **Asset Release/Minting** - Based on the validated message, the Wormhole contracts on the destination chain will either release the equivalent amount of the bridged asset (if it's a wrapped asset) or trigger the minting of the asset (in the case of CCTP for USDC and EURC). The user will then receive these assets in their wallet on the destination chain.

## Integration

### Initial Setup

- Install Node.js (npm is bundled together)
- Make a React project (for React integration)
- Make an HTML file (for CDN integration)

### Import Connect into React App

First, install the Wormhole Connect npm package. You can read more about the package by clicking on the following button: [npm version](https://www.npmjs.com/package/@wormhole-foundation/wormhole-connect){target=\_blank}

```bash
npm i @wormhole-foundation/wormhole-connect
```

Now you can import the React component:

```javascript

import WormholeConnect from '@wormhole-foundation/wormhole-connect';

function App() {
  return <WormholeConnect />;
}
```

### Alternative Integration Using CDN

If you're not using React, you can still embed Connect on your website by using the hosted version. This uses pre-built packages (which include React) served from NPM by jsdelivr.net{target=\_blank}.

**v1.x**

``` javascript
import { wormholeConnectHosted } from '@wormhole-foundation/wormhole-connect';

// Existing DOM element where you want to mount Connect
const container = document.getElementById('bridge-container');

wormholeConnectHosted(container);
```

For assistance in migrating from Connect v0.x to v1.x, please refer to the v1 Migration guide.

**v0.x**

Simply copy and paste the following into your HTML body, and replace the INSERT_WORMHOLE_CONNECT_VERSION in the links with the most recent production version of Wormhole Connect. You can check what the most recent version is on NPM.

``` HTML
<!-- Mounting point. Include in <body> -->
<div id="wormhole-connect"></div>

<!-- Dependencies -->
<script
    type="module"
    src="https://www.unpkg.com/@wormhole-foundation/wormhole-connect@INSERT_WORMHOLE_CONNECT_VERSION/dist/main.js"
    defer
></script>
<link
    rel="https://www.unpkg.com/@wormhole-foundation/wormhole-connect@INSERT_WORMHOLE_CONNECT_VERSION/dist/main.css"
/>
```
For example, for 0.3.13:

```HTML
<!-- Mounting point. Include in <body> -->
<div id="wormhole-connect"></div>

<!-- Dependencies -->
<script
    type="module"
    src="https://www.unpkg.com/@wormhole-foundation/wormhole-connect@0.3.13/dist/main.js"
    defer
></script>
<link
    rel="https://www.unpkg.com/@wormhole-foundation/wormhole-connect@0.3.13/dist/main.css"
/>
```
It is crucial to periodically update your Wormhole Connect instance to the latest version, as frequent functionality and security updates are released.

## Configuration

This section provides a brief overview of the configuration possibilities. For comprehensive details on all available configuration options, please consult the Configuration docs.

The default configuration of Wormhole Connect might not perfectly align with your specific requirements. You might want to:

- Implement custom styles
- Restrict the chains that are supported within your application
- Add support for your project's token and remove irrelevant tokens to minimize clutter
- Configure custom RPC URLs (This is highly recommended as default public RPCs often experience heavy throttling)
- Limit the available bridging routes

For further information on these options, please refer to the [configuration options](docs/build/transfers/connect/configuration/){target=\_blank} to customize your widget according to your preferences.

## Next Steps 

Ready to integrate Wormhole Connect into your application? Explore these tutorials to get started:

- [Integrate Connect into a React DApp Tutorial](https://wormhole.com/docs/tutorials/connect/react-dapp/){target=\_blank}—Follow this guide to learn how to embed the Wormhole Connect widget into your React application, including package installation and component integration.
- [Multichain Swap Tutorial](https://wormhole.com/docs/tutorials/connect/multichain-swap/){target=\_blank}—This step-by-step tutorial demonstrates how to integrate the Connect widget into your React dApp to enable cross-chain token transfers, using Sui to Avalanche Fuji as a practical example applicable to other networks.

Start building seamless cross-chain functionality with Wormhole Connect today!