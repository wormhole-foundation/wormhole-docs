---
title: Send Multichain Messages
description: Hands on guide to creating cross-chain contracts with Wormhole practice repository.
---

<!--
comments go here
-->

# Send Multichain Messages

## Overview

In this tutorial, we will be working with a [repository](https://github.com/wormhole-foundation/hello-wormhole){target=\_blank} specifically designed to help you understand and implement _cross-chain messaging_ using the `HelloWormhole` contract. This contract allows users to send greetings across different blockchain networks. The repository includes the following key components:

- Example Solidity Code
- Example Forge local testing setup
- Testnet Deploy Scripts
- Example Testnet testing setup

## Environment Setup

- Node 16.14.1 or later, npm 8.5.0 or later: [https://docs.npmjs.com/downloading-and-installing-node-js-and-npm](https://docs.npmjs.com/downloading-and-installing-node-js-and-npm){target=\_blank}
- Forge 0.2.0 or later: [https://book.getfoundry.sh/getting-started/installation](https://book.getfoundry.sh/getting-started/installation){target=\_blank}

## Testing Locally

Local testing ensures that the `HelloWormhole` contract is functioning as expected in your development environment before deploying it to testnet.

Clone the repository from GitHub, navigate into the directory, and then build and test the code.

```sh
git clone https://github.com/wormhole-foundation/hello-wormhole.git
cd hello-wormhole
npm run build
forge test
```

The expected output should look like this:

```sh
Running 1 test for test/HelloWormhole.t.sol:HelloWormholeTest
[PASS] testGreeting() (gas: 777229)
Test result: ok. 1 passed; 0 failed; finished in 3.98s
```

## Deploying to Testnet

Now that we have tested the contract locally, we can deploy it to the testnet. For this you will need a wallet with at least 0.05 Testnet AVAX and 0.01 Testnet CELO.

- [Obtain testnet AVAX](https://faucet.avax-test.network/){target=\_blank}
- [Obtain testnet CELO](https://celo.org/developers/faucet){target=\_blank}

Once you have the required funds, deploy the contract to the testnet by running the following command:

```sh
EVM_PRIVATE_KEY=your_wallet_private_key npm run deploy
```

## Testing on Testnet
Now that the `HelloWormhole` contract has been successfully deployed to the testnet, the next step is to test its functionality by sending a cross-chain message. This will ensure that the contract is correctly set up and that the _cross-chain messaging_ works as expected.

Before testing, ensure you have a wallet with at least 0.02 [Testnet AVAX](https://faucet.avax-test.network/){target=\_blank}.

Make sure the contracts are deployed to the testnet as described in the above section. To test sending and receiving a message, execute the following command:

```sh
EVM_PRIVATE_KEY=your_wallet_private_key npm run test
```

