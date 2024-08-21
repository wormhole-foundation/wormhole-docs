---
title: Local Dev Environment
description: Learn how to configure a development environment to build with Wormhole, including using the CLI, local validators, testing on public test networks, and more. 
---

# Development Environment

Developers building for smart contract integration will want to set up a development environment to allow testing the full integration, possibly including VAA generation and relaying.

## Tooling Installation

The [Worm CLI Tool](/build/toolkit/toolkit-cli) should be installed regardless of environments chosen. Each environment has its own set of recommended tools. To begin working with a specific environment, see the recommended tools on its [environment page](../../blockchain-environments/README.md)

## Development Stages

Different approaches to development and testing are recommended at different stages of application development.

### Initial Development

During the initial development of an on-chain application, the best option is to use the native tools available in the environment. For the specific native tools recommended, see the page for the [Environment](../../blockchain-environments/README.md) you're interested in. For any program methods that require some message be sent or received, it's recommended to set up some Mock Guardian or Emitter to provide signed VAAs. A Mock utility is available [here](https://github.com/wormhole-foundation/wormhole/blob/main/sdk/js/src/mock/wormhole.ts){target=\_blank} and an example of its use can be found in the [Wormhole Scaffolding repo](https://github.com/wormhole-foundation/wormhole-scaffolding/blob/main/evm/ts-test/01_hello_world.ts){target=\_blank}. This approach allows for more rapid prototyping and iteration without waiting for, or debugging issues related to, Wormhole.

### Integration

For integration to Wormhole and with multiple chains, the simplest option is to use the chains' TestNets. In choosing which chains to use for integration testing, consider which chains in a given environment provide easy access to TestNet tokens and where block times are fast. Find links for TestNet faucets in the [blockchain details section](../../blockchain-environments/environments.md). A developer may prefer standing up a set of local validators instead of using the TestNet. For this option, [Tilt](/build/toolkit/toolkit-tilt) is available to run local instances of all the chains Wormhole supports.

!!! note
	The variation in host environments causes unique issues, and the computational intensity of multiple simultaneous local validators can make it difficult or time-consuming to set up. You may prefer TestNets for the simplest integration testing.

### Prepare for Deployment

Once you've finished the application's initial development and performed integration testing, you may want to set up a CI test environment. The best option for that is likely to be [Tilt](/build/toolkit/toolkit-tilt) since it allows you to spin up any of the chains supported by Wormhole in a consistent environment.

## Validator Setup with Tilt

### Tilt
If you'd like to set up a local validator environment, follow the setup guide for Tilt. Tilt is a full-fledged Kubernetes deployment of every chain connected to Wormhole, along with a Guardian node. It usually takes 30 min to spin up fully, but comes with all chains running out of the box. Refer to the [Tilt](/build/toolkit/toolkit-tilt) page for a full guide to setting up and configuring Tilt.

## Deploying to public networks

### TestNet

When doing integration testing on TestNets, remember that there is a single Guardian node watching for transactions on various test networks. Because TestNet only has a single Guardian, there's a slight chance that your VAAs will not be processed. This rate does not indicate performance on MainNet, where 19 Guardians are watching for transactions. The TestNet contract addresses are available on the page for each [environment](../../blockchain-environments/environments.md). The TestNet Guardian RPC configuration is available on the [SDK page](../sdk-docs/#testnet-guardian-rpc).

### MainNet

The MainNet contract addresses are available on the page for each [environment](../../blockchain-environments/environments.md). The MainNet Guardian RPC configuration is available on the [SDK page](../sdk-docs/#mainnet-guardian-rpc).