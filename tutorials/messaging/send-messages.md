---
title: Send Multichain Messages
description: Hands on guide to creating cross-chain contracts with Wormhole practice repository.
---

<!--
comments go here
-->

# Send Multichain Messages

## Overview

In this tutorial, we will explore how to create and deploy a _cross-chain_ application using the `HelloWormhole` Solidity contract, which can be deployed onto many EVM-compatible networks. This contract allows users to send greetings across different blockchains and request a `GreetingReceived` event to be emitted on a different chain, even if they don’t have gas funds on that chain.

We will work with a dedicated repository designed to help you understand and implement _cross-chain messaging_ using this contract.

The repository includes the following key components:

- Example Solidity Code
- Example Forge local testing setup
- TestNet Deploy Scripts
- Example TestNet testing setup

## Environment Setup

- [Node 16.14.1 or later, npm 8.5.0 or later](https://docs.npmjs.com/downloading-and-installing-node-js-and-npm){target=\_blank}
- [Forge 0.2.0 or later](https://book.getfoundry.sh/getting-started/installation){target=\_blank}

## Testing Locally

Local testing ensures that the `HelloWormhole` contract is functioning as expected in your development environment before deploying it to TestNet.

Clone the repository from GitHub, navigate into the directory, and then build and test the code.

```sh
--8<-- 'code/tutorials/cross-chain-contracts/send-messages/snippet-1.sh'
```

The expected output should look like this:

```sh
--8<-- 'code/tutorials/cross-chain-contracts/send-messages/snippet-2.sh'
```

## Deploying to TestNet

Now that we have tested the contract locally, we can deploy it to the TestNet. For this you will need a wallet with at least 0.05 TestNet AVAX and 0.01 TestNet CELO.

- [Obtain TestNet AVAX](https://faucet.avax-test.network/){target=\_blank}
- [Obtain TestNet CELO](https://celo.org/developers/faucet){target=\_blank}

Once you have the required funds, deploy the contract to the TestNet by running the following command:

```sh
--8<-- 'code/tutorials/cross-chain-contracts/send-messages/snippet-3.sh'
```

## Testing on TestNet
Now that the `HelloWormhole` contract has been successfully deployed to the TestNet, the next step is to test its functionality by sending a cross-chain message. This will ensure that the contract is correctly set up and that the _cross-chain messaging_ works as expected.

Before testing, ensure you have a wallet with at least 0.02 [TestNet AVAX](https://faucet.avax-test.network/){target=\_blank}.

Make sure the contracts are deployed to the TestNet as described in the above section. To test sending and receiving a message, execute the following command:

```sh
--8<-- 'code/tutorials/cross-chain-contracts/send-messages/snippet-4.sh'
```

