---
title: Native Token Transfers Installation
description: Learn how to Install Wormhole’s Native Token Transfers (NTT) framework, a flexible and composable framework for transferring tokens across blockchains.
---

# Install the Native Token Transfers CLI

In this video, the Wormhole team walks you through installing the [Native Token Transfers (NTT) CLI](https://github.com/wormhole-foundation/native-token-transfers/tree/main/cli){target=\_blank}. You’ll see a practical demonstration of running commands, verifying your installation, and addressing common issues that might arise. If you prefer to follow written instructions or want a quick reference for each step, scroll down for the detailed installation guide.

<style>.embed-container { position: relative; padding-bottom: 56.25%; height: 0; overflow: hidden; max-width: 100%; } .embed-container iframe, .embed-container object, .embed-container embed { position: absolute; top: 0; left: 0; width: 100%; height: 100%; }</style><div class='embed-container'><iframe src='https://www.youtube.com/embed/ltZmeyjUxRk?start=1685' frameborder='0' allowfullscreen></iframe></div>

## Install NTT CLI

The fastest way to deploy Native Token Transfers (NTT) is using the NTT CLI. As prerequisites, ensure you have the following installed:

- Install [Foundry](https://book.getfoundry.sh/getting-started/installation){target=\_blank}
- Install [Bun](https://bun.sh/){target=\_blank}

Follow these steps to install the NTT CLI:

1. Run the installation command in your terminal:

    ```bash
    curl -fsSL https://raw.githubusercontent.com/wormhole-foundation/native-token-transfers/main/cli/install.sh | bash
    ```

2. Verify the NTT CLI is installed:

    ```bash
    ntt --version
    ```

3. Once installed, check out the available [NTT CLI Commands](/docs/build/transfers/native-token-transfers/cli-commands/){target=\_blank} to start using the CLI.

## Update NTT CLI

To update an existing NTT CLI installation, run the following command in your terminal:

```bash
ntt update
```

NTT CLI installations and updates will always pick up the latest tag with name vX.Y.Z+cli and verify that the underlying commit is included in main.

For local development, you can update your CLI version from a specific branch or install from a local path.

To install from a specific branch, run:

```bash
ntt update --branch foo
```

To install locally, run:
```bash
ntt update --path path/to/ntt/repo
```

Git branch and local installations enable a fast iteration loop as changes to the CLI code will immediately be reflected in the running binary without having to run any build steps.

## Where to Go Next

<div class="grid cards" markdown>


-   :octicons-tools-16:{ .lg .middle } **Deploy to EVM Chains**

    ---

    Deploy and configure Wormhole’s Native Token Transfers (NTT) for EVM chains, including setup, token compatibility, mint/burn modes, and CLI usage.

    [:custom-arrow: Deploy NTT to EVM chains](/docs/build/transfers/native-token-transfers/deployment-process/deploy-to-evm/)

-   :octicons-tools-16:{ .lg .middle } **Deploy to Solana**

    ---

    Deploy and configure Wormhole's Native Token Transfers (NTT) for Solana, including setup, token compatibility, mint/burn modes, and CLI usage.

    [:custom-arrow: Deploy NTT to Solana](/docs/build/transfers/native-token-transfers/deployment-process/deploy-to-solana/)

</div>
