---
title: Local Dev Environment
description: Learn how to configure a development environment to build with Wormhole, including using the CLI, local validators, testing on public test networks, and more. 
---

# Development Environment

Developers building for smart contract integration will want to set up a development environment to allow testing the full integration, possibly including VAA generation and relaying.

## Tooling Installation

The [Wormhole CLI Tool](/docs/build/toolkit/cli/){target=\_blank} should be installed regardless of the environments chosen. Each environment has its own set of recommended tools. To begin working with a specific environment, see the recommended tools on the respective [environment page](/docs/build/start-building/supported-networks/){target=\_blank}.

## Development Stages

Different approaches to development and testing are recommended at various stages of application development.

### Initial Development

During the initial development of an on-chain application, the best option is to use the native tools available in the environment. You can visit the following resources for more information:

- **[Environment](https://github.com/wormhole-foundation/wormhole){target=\_blank}** - select the folder for the desired network to learn about the recommended native toolset  
- **[Mock Guardian](https://github.com/wormhole-foundation/wormhole/blob/main/sdk/js/src/mock/wormhole.ts){target=\_blank}** - it's recommended to set up a mock Guardian or Emitter to provide signed VAAsFor any program methods that require some message be sent or received. 
- **[Wormhole Scaffolding repository](https://github.com/wormhole-foundation/wormhole-scaffolding/blob/main/evm/ts-test/01_hello_world.ts){target=\_blank}** - example mock Guardian test

Relying on native tools when possible allows for more rapid prototyping and iteration.  

### Integration

For integration to Wormhole and with multiple chains, the simplest option is to use the chains' Testnets. In choosing which chains to use for integration testing, consider which chains in a given environment provide easy access to Testnet tokens and where block times are fast. Find links for Testnet faucets in the [blockchain details section](/docs/build/start-building/supported-networks/){target=\_blank}. A developer may prefer standing up a set of local validators instead of using the Testnet. For this option, [Tilt](/docs/build/toolkit/tilt/){target=\_blank} is available to run local instances of all the chains Wormhole supports.

!!! note
    Variation in host environments causes unique issues, and the computational intensity of multiple simultaneous local validators can make setting them up difficult or time-consuming. You may prefer Testnets for the simplest integration testing.

### Prepare for Deployment

Once you've finished the application's initial development and performed integration testing, you should set up a CI test environment. The best option for that is likely to be [Tilt](/docs/build/toolkit/tilt/){target=\_blank} since it allows you to spin up any chains supported by Wormhole in a consistent environment.

## Validator Setup with Tilt

### Tilt
If you'd like to set up a local validator environment, follow the setup guide for Tilt. Tilt is a full-fledged Kubernetes deployment of every chain connected to Wormhole, along with a Guardian node. It usually takes 30 minutes to spin up fully, but it comes with all chains running out of the box. Refer to the [Tilt](/docs/build/toolkit/tilt/){target=\_blank} page for a complete guide to setting up and configuring Tilt.

## Deploying to Public Networks

### Testnet

When doing integration testing on Testnets, remember that a single Guardian node is watching for transactions on various test networks. Because Testnets only have a single Guardian, there's a slight chance that your VAAs won't be processed. This rate doesn't indicate performance on Mainnet, where 19 Guardians are watching for transactions. The Testnet contract addresses are available on the page for each [environment](/docs/build/start-building/supported-networks/){target=\_blank}. The [Wormholescan API](https://docs.wormholescan.io){target=\_blank} offers the following Guardian equivalent Testnet endpoint:

```text
https://api.testnet.wormholescan.io
```

### Mainnet

The Mainnet contract addresses are available on the page for each [environment](/docs/build/start-building/supported-networks/){target=\_blank}. The [Wormholescan API](https://docs.wormholescan.io){target=\_blank} offers the following Guardian equivalent Mainnet endpoint:

```text
https://api.wormholescan.io
```
