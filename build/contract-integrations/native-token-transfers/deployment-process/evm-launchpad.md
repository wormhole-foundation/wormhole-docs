---
title: Native Token Transfers Deploy via Launchpad
description: Use the NTT Launchpad to deploy a new token or expand an existing one across multiple chains. Manage transfers, supply, and settings.  
---

# Native Token Transfers Deploy via Launchpad

The [NTT Launchpad](){target=\_blank} is a Wormhole-managed UI application that provides a step-by-step interface for deploying Native Token Transfers across multiple blockchains.

Users can quickly launch or expand tokens with just a few clicks instead of manually deploying contracts on each chain, configuring relayers, and managing cross-chain communication.

The Launchpad automates deployment, reducing complexity and saving time.

This guide covers:

 - Launching a new cross-chain token
 - Expanding an existing token for NTT
 - Managing tokens via the dashboard and settings

## Prerequisites

 - An EVM-compatible wallet (e.g., [MetaMask](https://metamask.io/){target=\_blank}, [Phantom](https://phantom.com/){target=\_blank}, etc.)
 - Minimum ETH (or equivalent) for gas fees per deployment

## Getting Started

To begin, visit the [NTT Launchpad](){target=\_blank} and connect your wallet.

### Supported Blockchains

The NTT Launchpad currently supports deployments on the following Mainnet chains:

 - Ethereum
 - Optimism Mainnet
 - Arbitrum One
 - Base

### Choose Your Path

Once ready, choose an option to proceed:

 - [**Launch a Cross-Chain Token**](#launch-a-cross-chain-token) - deploy a brand-new token that is NTT-ready from day one, enabling seamless transfers across multiple blockchains
 - [**Expand Your Existing Token**](#expand-your-existing-token) - if you already have a token deployed on different chains, integrate it with NTT to enable native token transfers without modifying its original contract

## Launch a Cross-Chain Token

1. Open the [NTT Launchpad](){target=\_blank}, connect your wallet and click **Get Started**

    ![](/docs/images/build/contract-integrations/ntt/ntt-launchpad/ntt-launchpad-1.webp)
    
2. Select **Launch a Cross-Chain Token**

    ![](/docs/images/build/contract-integrations/ntt/ntt-launchpad/ntt-launchpad-2.webp)

3. Set token details (home network, token name, token symbol, and initial supply) and click **Next**

    ![](/docs/images/build/contract-integrations/ntt/ntt-launchpad/ntt-launchpad-3.webp)

4. Select the deployment chains. Choose the networks where your token will be deployed (Optimism and Base for this example) and click **Next**

    ![](/docs/images/build/contract-integrations/ntt/ntt-launchpad/ntt-launchpad-4.webp)

5. To deploy on the first chain (Optimism), click on **Deploy**; if prompted, switch your wallet to the correct network and confirm the transaction

    ![](/docs/images/build/contract-integrations/ntt/ntt-launchpad/ntt-launchpad-5.webp)

6. Once deployed, you can view the transaction in a block explorer and add the token to your wallet

    ![](/docs/images/build/contract-integrations/ntt/ntt-launchpad/ntt-launchpad-6.webp)

7. Repeat the previous step to deploy the token on the second chain (Base)

    !!!note
        The supply of tokens on Base will be zero since the tokens were all minted on Optimism in the previous step.

8. Once both deployments are completed, proceed to the [**Dashboard**](#dashboard-overview) to manage your token.

## Expand Your Existing Token

1. Open the [NTT Launchpad](){target=\_blank}, connect your wallet and click **Get Started**

    ![](/docs/images/build/contract-integrations/ntt/ntt-launchpad/ntt-launchpad-1.webp)

2. Select **Expand Your Existing Token**

    ![](/docs/images/build/contract-integrations/ntt/ntt-launchpad/ntt-launchpad-7.webp)

3. Choose the network where your token is deployed and enter your token contract address, finally click **Next**

    ![](/docs/images/build/contract-integrations/ntt/ntt-launchpad/ntt-launchpad-8.webp)

4. Choose the networks where you want to expand your token (e.g., Base in this example), then click **Next**

    ![](/docs/images/build/contract-integrations/ntt/ntt-launchpad/ntt-launchpad-9.webp)

5. To deploy on the first chain (Optimism), click on **Deploy**; if prompted, switch your wallet to the correct network and confirm the transaction

    ![](/docs/images/build/contract-integrations/ntt/ntt-launchpad/ntt-launchpad-5.webp)

6. Once deployed, you can view the transaction in a block explorer and add the token to your wallet

    ![](/docs/images/build/contract-integrations/ntt/ntt-launchpad/ntt-launchpad-6.webp)

7. Repeat the previous step to deploy the token on the second chain (Base)

    !!!note
        The supply of tokens on Base will be zero since the tokens were all minted on Optimism in the previous step.

8. Now that your token has been deployed on multiple chains, click [**Dashboard**](#dashboard-overview) to review its details

## Dashboard Overview

Once your token has been successfully deployed, you can access the Dashboard to manage and track its details. Here, you can view its deployment status, monitor supply across chains, and configure transfer settings.

### Access the Dashboard

 - After deploying your token, click **Dashboard** on the final screen
 - You can also access it anytime from the [NTT Launchpad homepage](){target=\_blank}

![](/docs/images/build/contract-integrations/ntt/ntt-launchpad/ntt-launchpad-10.webp)

### Token Overview

The dashboard provides a high-level view of your token across all deployed chains:

 - Token addresses for each chain
 - Supply distribution visualization
 - List of deployed chains, including inbound and outbound transfer limits, which can be modified in [**Settings**](#settings)

## Settings

The **Settings** page allows you to configure security parameters, role management, and transfer limits for your deployed token. You can switch between chains to manage these settings independently for each deployment.

### Chain Management

Use the drop-down menu at the top to select the chain you want to configure. The available options correspond to the chains where your token has already been deployed. Once selected, the page displays token details specific to that chain.

From this section, you can also:

 - **Pause the token** – temporarily turn off transfers on the selected chain
 - **Deploy to a new chain** – expand your token by deploying it to an additional chain

![](/docs/images/build/contract-integrations/ntt/ntt-launchpad/ntt-launchpad-11.webp)

### Role Management

This section displays key roles involved in token governance. Users can view and modify these roles by selecting a new address and confirming the update.

 - **Manager’s Owner** – the owner through the `NTTOwner` proxy
 - **Pauser** – the address authorized to pause transfers

![](/docs/images/build/contract-integrations/ntt/ntt-launchpad/ntt-launchpad-12.webp)

### Security Threshold

Determine and update how transceivers interact with the token. This includes:

 - **Registered Transceivers** – displays the number of registered transceivers and their addresses
 - **Transceivers Threshold** – a configurable value that must be less than or equal to the number of transceivers

![](/docs/images/build/contract-integrations/ntt/ntt-launchpad/ntt-launchpad-13.webp)

### Peer Chains Limits

Define the transfer restrictions for each connected network. Users can adjust:

 - **Sending Limits** – defines the maximum amount of tokens that can be sent from this chain
 - **Receiving Limits** – lists the peer chains and their respective receiving limits

Enter a new value to adjust limits and click **Update**. The changes will take effect immediately.

![](/docs/images/build/contract-integrations/ntt/ntt-launchpad/ntt-launchpad-14.webp)