---
title: Native Token Transfers Installation
description: Learn how to Install Wormhole’s Native Token Transfers (NTT) framework, a flexible and composable framework for transferring tokens across blockchains.
---

## Installation

The fastest way to deploy _Native Token Transfer_ (NTT) is using the NTT CLI. As prerequisites, ensure you have the following installed:

- Install [Foundry](https://book.getfoundry.sh/getting-started/installation){target=\_blank}
- Install [Bun](https://bun.sh/){target=\_blank}

Install the NTT CLI:

```bash
curl -fsSL https://raw.githubusercontent.com/wormhole-foundation/example-native-token-transfers/cli/cli/install.sh | bash
```

Verify the NTT CLI is installed:

```bash
ntt --version
```