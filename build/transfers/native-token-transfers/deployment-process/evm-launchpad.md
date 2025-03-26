---
title: Deploy Native Token Transfers with Launchpad
description: Deploy a new token or extend an existing one across multiple chains with the NTT Launchpad. Manage transfers, supply, and settings—all from a single platform.
categories: NTT, Transfer
---

# Deploy Native Token Transfers with Launchpad

## Introduction

The [Native Token Transfers (NTT) Launchpad](https://ntt.wormhole.com/){target=\_blank} is a Wormhole-managed UI application that provides a step-by-step interface for deploying NTT across multiple blockchains.

Instead of manually deploying contracts on each chain, configuring relayers, and managing cross-chain communication, you can quickly launch or expand tokens with just a few clicks. 

The Launchpad automates deployment, reducing complexity and saving time.

This guide covers:

 - Launching a new cross-chain token
 - Expanding an existing token for NTT
 - Managing tokens via the dashboard and settings

## Prerequisites

 - An EVM-compatible wallet (e.g., [MetaMask](https://metamask.io/){target=\_blank}, [Phantom](https://phantom.com/){target=\_blank}, etc.)
 - Minimum ETH (or equivalent) for gas fees per deployment

## Supported Blockchains

The NTT Launchpad currently supports deployments on the following mainnet chains:

 - Ethereum
 - Optimism Mainnet
 - Arbitrum One
 - Base

## Choose Your Path

Once ready, choose an option to proceed:

 - [**Launch a Cross-Chain Token**](#launch-a-cross-chain-token) - deploy a brand-new token that is NTT-ready from day one, enabling seamless transfers across multiple blockchains
 - [**Expand Your Existing Token**](#expand-your-existing-token) - if you already have a token deployed on different chains, integrate it with NTT to enable NTT without modifying its original contract

## Launch a Cross-Chain Token

Deploy a new NTT-compatible token that can be transferred across multiple chains. This process sets up your token on a home network and deploys it to additional blockchains. Follow the below steps to get started:

1. Open the [NTT Launchpad](https://ntt.wormhole.com/){target=\_blank}, connect your wallet, and click **Get Started**

    ![](/docs/images/build/transfers/native-token-transfers/deployment-process/evm-launchpad/ntt-launchpad-1.webp)
    
2. Select **Launch a Cross-Chain Token**

    ![](/docs/images/build/transfers/native-token-transfers/deployment-process/evm-launchpad/ntt-launchpad-2.webp)

3. Set the token details:
    1. Select the **home network** from the dropdown menu
    2. Enter the **name** for the token
    3. Enter the **symbol** of the token 
    4. Provide the **initial supply**
    5. To the token details, click **Next**

    ![](/docs/images/build/transfers/native-token-transfers/deployment-process/evm-launchpad/ntt-launchpad-3.webp)

4. Select the deployment chains:
    1. The home network where your token will be deployed will be populated (e.g., Optimism)
    2. Choose any additional chains to deploy your token to (e.g., Base)
    3. To continue, click **Next**

    ![](/docs/images/build/transfers/native-token-transfers/deployment-process/evm-launchpad/ntt-launchpad-4.webp)

5. To deploy on the first chain (Optimism), click on **Deploy**; if prompted, switch your wallet to the correct network and confirm the transaction

    ![](/docs/images/build/transfers/native-token-transfers/deployment-process/evm-launchpad/ntt-launchpad-5.webp)

6. Once deployed, you can view the transaction in a block explorer and add the token to your wallet

    ![](/docs/images/build/transfers/native-token-transfers/deployment-process/evm-launchpad/ntt-launchpad-6.webp)

7. Repeat the previous step to deploy the token on the second chain (Base). The supply of tokens on Base will be zero since the tokens were all minted on Optimism in the previous step

8. Once both deployments are completed, proceed to the [**Dashboard**](#explore-the-launchpad-dashboard) to manage your token.

## Expand Your Existing Token

Expand an existing token to support NTT across multiple chains. This process integrates your deployed token with NTT without modifying its original contract. Follow the steps below to get started:

1. Open the [NTT Launchpad](https://ntt.wormhole.com/){target=\_blank}, connect your wallet, and click **Get Started**

    ![](/docs/images/build/transfers/native-token-transfers/deployment-process/evm-launchpad/ntt-launchpad-1.webp)

2. Select **Expand Your Existing Token**

    ![](/docs/images/build/transfers/native-token-transfers/deployment-process/evm-launchpad/ntt-launchpad-7.webp)

3. Enter the token details:
    1. Choose the home network where your token is already deployed (e.g., Optimism)
    2. Choose any additional chains to deploy your token to (e.g., Base)
    3. To continue, click **Next**

    ![](/docs/images/build/transfers/native-token-transfers/deployment-process/evm-launchpad/ntt-launchpad-8.webp)

4. Select the chains to deploy your token to:
    1. The home network where your token is already deployed will be populated (e.g., Optimism)
    2. Choose any additional chains to deploy your token to (e.g., Base)
    1. Click **Next**

    ![](/docs/images/build/transfers/native-token-transfers/deployment-process/evm-launchpad/ntt-launchpad-9.webp)

5. To deploy on the first chain (Optimism), click on **Deploy**; if prompted, switch your wallet to the correct network and confirm the transaction

    ![](/docs/images/build/transfers/native-token-transfers/deployment-process/evm-launchpad/ntt-launchpad-5.webp)

6. Once deployed, you can view the transaction in a block explorer and add the token to your wallet

    ![](/docs/images/build/transfers/native-token-transfers/deployment-process/evm-launchpad/ntt-launchpad-6.webp)

7. Repeat the previous step to deploy the token on the second chain (Base). The supply of tokens on Base will be zero since the tokens were all minted on Optimism in the previous step

8. Now that your token has been deployed on multiple chains click [**Dashboard**](#explore-the-launchpad-dashboard) to review its details

## Explore the Launchpad Dashboard

To access the **Dashboard** from the [Launchpad home page](https://ntt.wormhole.com/){target=\_blank}, click on **Manage Deployment**. Here, you can view deployment status, monitor supply across chains, and configure transfer settings.

![](/docs/images/build/transfers/native-token-transfers/deployment-process/evm-launchpad/ntt-launchpad-10.webp)

The dashboard provides a high-level view of your token across all deployed chains, including:

 - Token addresses for each chain
 - Supply distribution visualization
 - List of deployed chains, including inbound and outbound transfer limits, which can be modified in [**Settings**](#settings)

![](/docs/images/build/transfers/native-token-transfers/deployment-process/evm-launchpad/ntt-launchpad-11.webp)

## Settings

The **Settings** page allows you to configure security parameters, role management, and transfer limits for your deployed token. You can switch between chains to manage these settings independently for each deployment.

### Chain Management

Use the drop-down menu at the top to select the chain you want to configure. The available options correspond to the chains where your token has already been deployed. Once selected, the page displays token details specific to that chain.

From this section, you can also:

 - **Pause the token** – temporarily turn off transfers on the selected chain
 - **Deploy to a new chain** – expand your token by deploying it to an additional chain

![](/docs/images/build/transfers/native-token-transfers/deployment-process/evm-launchpad/ntt-launchpad-12.webp)

### Role Management

This section displays key [roles](/docs/build/transfers/native-token-transfers/configuration/access-control/){target=\_blank} involved in token governance. You can view and modify these roles by selecting a new address and confirming the update.

 - **Manager’s Owner** – the owner through the `NTTOwner` proxy
 - **Pauser** – the address authorized to pause transfers

![](/docs/images/build/transfers/native-token-transfers/deployment-process/evm-launchpad/ntt-launchpad-13.webp)

### Security Threshold

Determine and update how transceivers interact with the token. [Transceivers](/docs/build/transfers/native-token-transfers/managers-transceivers/#transceivers){target=\_blank} route NTT transfers between blockchains, ensuring tokens are correctly sent and received across networks.

A higher transceiver threshold increases security by requiring more approvals before processing a transfer, but it may also slow down transactions. A lower threshold allows faster transfers but reduces redundancy in message verification.  

 - **Registered Transceivers** – displays the number of registered transceivers and their addresses
 - **Transceivers Threshold** – a configurable value that must be less than or equal to the number of transceivers

![](/docs/images/build/transfers/native-token-transfers/deployment-process/evm-launchpad/ntt-launchpad-14.webp)

### Peer Chains Limits

Define the transfer restrictions for each connected network. You can adjust:

 - **Sending Limits** – the maximum amount of tokens that can be sent from the home chain
 - **Receiving Limits** – the maximum amount of tokens that can be received for each of the supported peer chains

Enter a new value to adjust limits and click **Update**. The changes will take effect immediately.

![](/docs/images/build/transfers/native-token-transfers/deployment-process/evm-launchpad/ntt-launchpad-15.webp)
