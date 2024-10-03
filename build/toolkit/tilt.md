---
title: Tilt Introduction and Setup
description: Learn about Tilt, a Wormhole dev environment with a local Kubernetes set up for cross-chain testing with Guardian nodes and relayers for seamless development.
---

# Tilt

[Tilt](https://tilt.dev/){target=\_blank} is part of the official Docker ecosystem. It's a tool that allows developers to configure a Kubernetes environment for development easily.

!!! note
    Tilt is often referred to as "DevNet" in the Wormhole ecosystem, so any information labeled as "DevNet" also applies to Tilt.

However, in the context of Wormhole, "Tilt" refers to the development environment used by the [Wormhole Core repository](https://github.com/wormhole-foundation/wormhole){target=\_blank}. This environment stands up Docker images for all the tools necessary to build across multiple blockchains, including:

- All the Wormhole-supported blockchains and ecosystems
- A Guardian node
- Relayers
- Databases, Redis
- Utility front ends

The Tilt environment is designed to provide an entire cross-chain development stack right out of the box.

## Is Tilt Right for You?

Tilt is a good option for developers who need a local development environment and have access to a machine that can handle running it. It is also an excellent option for developers who want to establish a CI testing suite.

=== "Pros"

    - Out-of-the-box support for the many components needed to develop across the heterogeneous blockchain spaces
    - Consistent development environment, where contracts deploy deterministically, and everything is already linked up
    - Ability to easily enable or disable components as needed
    - Regularly updated as new components join the Wormhole ecosystem

=== "Cons"

    - Relatively high system requirements, but this can be mitigated by disabling components
    - Most blockchains are "blank slates" with no contracts deployed. Thus, if your contracts have any dependencies, you may have to deploy them yourself or alter the default Tilt configuration
    - Spin-up and rebuild times can be slow, which can result in a slow workflow

## Tilt Installation

Tilt functions best in a UNIX-style environment. To run the Tilt environment, make sure you have [Tilt](https://docs.tilt.dev/install.html){target=\_blank} and [Go](https://go.dev/doc/install){target=\_blank} installed.

### MacOS Instructions

You'll need to have `homebrew` installed on your system. You can install it with:

```bash
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
```

Install Go:

```bash
brew install go
```

Install Docker:

```bash
brew install docker
```

After installation, go into Docker settings and switch on `kubernetes`. Also configure Docker to have 4 CPUs and about 16GB of RAM.

Install Tilt:

```bash
brew install tilt
```

### Linux Instructions

#### Install Go

You can install Go with the following command:

```bash
wget https://go.dev/dl/go1.18.1.linux-amd64.tar.gz &&
rm -r /usr/local/go && tar -C /usr/local -xzf go1.18.1.linux-amd64.tar.gz
```

#### Install Docker Desktop 

If you're using Linux with a windows manager, it's highly recommended that you install Docker Desktop, since it comes with built-in Kubernetes, and you won't need to download Minikube. It's recommended that you allocate Docker at least 4 CPUs and 16GB RAM. Also, make sure you set up Docker as a non-root user. You can refer to [this list of Docker installation methods](https://docs.docker.com/engine/install/ubuntu/#installation-methods){target=\_blank}.

If you're using Docker Desktop, you can enable Kubernetes by going into Settings > Kubernetes and checking the checkbox to enable Kubernetes.

![Enable Kubernetes](/docs/images/build/toolkit/tilt/tilt-1.webp)

#### Minikube

The alternative to Docker Desktop with Kubernetes is to install [minikube](https://minikube.sigs.k8s.io/docs/start/){target=\_blank}. You can configure Minikube as follows:

```bash
minikube start --driver=docker --kubernetes-version=v1.23.3 --cpus=4 --memory=14G --disk-size=10G --namespace=wormhole
```

If you reboot your VM you'll need to run the `minikube start` command again before you bring up Tilt.

#### Install Tilt

You can install Tilt with the following command:

```bash
curl -fsSL https://raw.githubusercontent.com/tilt-dev/tilt/master/scripts/install.sh | bash
```

### Linux Experimental Instructions

This is an experimental, single-command setup script. 

!!! warning
    This is only recommended if you're running headless Linux and unable to use Docker Desktop, as you can enable Kubernetes from Docker.

This experimental single command setup script should install dependencies for you on Linux and configure everything properly. If it doesn't work as expected, refer to the [standard Linux installation steps above](#linux-instructions).

```bash
curl $URL | sh install_linux.sh &&
cd wormhole/ && 
./tilt.sh
```

If you've all got prerequisites installed, clone the Wormhole Core Repository and start Tilt.

```bash
git clone --branch main https://github.com/wormhole-foundation/wormhole.git &&
cd wormhole &&
tilt up
```

### Virtual Machine Instructions

If you're running Tilt in a VM, you'll need to pass in some extra flags to enable Tilt to listen to incoming traffic from external addresses:

```bash
tilt up --host=0.0.0.0 -- --webHost=0.0.0.0
```

You can now access the Tilt UI at `vm_external_ip:10350`. If the VM's external IP doesn't work, check the firewall and port settings to make sure your VM allows incoming traffic. Be sure to check out the [`Tiltfile`](https://github.com/wormhole-foundation/wormhole/blob/main/Tiltfile){target=\_blank}, which has much of the configuration and arguments for the development environment. It's relatively straightforward to enable and disable components. For example, you can enable blockchains by setting them to true at startup. Note the use of the `--` separator between Tilt command flags and the flags you wish to pass to configure the setup.

```bash
tilt up -- --algorand --solana
```

## Using Tilt

Tilt can be treated as an external environment or DevNet that you can easily spin up and tear down. If you've followed the standard setup, all your resources will be bound to various ports on localhost. To see all the endpoints that are hosted in your Tilt environment, you should check out the Tilt dashboard, located at [http://localhost:10350/overview](http://localhost:10350/overview){target=\_blank}.

All the deployed contract addresses can be found under the DevNet section of the chain being used in the [Environments](/docs/build/start-building/supported-networks/){target=\_blank} pages. Useful information pertaining to funded wallets and private keys can also be found in the [`DevNet.md`](https://github.com/wormhole-foundation/wormhole/blob/main/docs/devnet.md){target=\_blank} file of the docs.

## Shutting Down Tilt

To shut down Tilt, run `tilt down` with the same network flags provided in the `tilt up` command.

```bash
tilt down -- --solana --algorand
```

## FAQ

### Where are Fantom, Celo, Polygon, and Other EVM Chains?

The smart contract development environment is effectively the same for all chains that support EVM. For changes in gas costs and transaction times, consider testing contract logic on DevNet and then using Testnet environments to get chain-specific answers.

### Solana is Taking Forever

Due to Solana's architecture, building the Solana pod often takes 25-40 minutes. Consider increasing the number of CPU cores assigned to DevNet for a faster build.

### Solana Program Deploy Doesn't Work

Kubernetes doesn't currently allow port forwarding for UDP ports ([GitHub Issue](https://github.com/kubernetes/kubernetes/issues/47862){target=\_blank}), which is what Solana uses for `solana program deploy`. Instead, it is recommended to use [Solana Deployer](https://github.com/acheroncrypto/solana-deployer){target=\_blank}. Not only does this deploy programs over regular RPC (thus bypassing UDP port requirements), but it's also much faster than `Solana program deploy.`

### How Do I Reset State For a Pod?

If you want to iterate quickly and don't want to bring Tilt down and back up, you can reset a pod's state by clicking the refresh button next to the pod name in the Tilt UI.

## Contracts and Accounts

The DevNet environment deploys the core layer and Token Bridge to each chain at the same addresses every time. It also provides funds to specific wallets.

## Default Ports

|      Service       | Port |
|:------------------:|:----:|
|   Guardian REST    | 7071 |
| Guardian gRPC Port | 7070 |
|      Eth0 RPC      | 8545 |
|      Eth1 RPC      | 8546 |
|     Solana RPC     | 8899 |