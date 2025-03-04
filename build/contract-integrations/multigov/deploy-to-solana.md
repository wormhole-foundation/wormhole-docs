---
title: MultiGov Deployment to Solana
description: 
---

# Deploy MultiGov on Solana  

This guide provides instructions to set up and deploy the **MultiGov Staking Program** on Solana. Before proceeding with the deployment, ensure that MultiGov aligns with your project’s governance needs by reviewing the system [architecture](/docs/learn/governance/architecture/){target=\_blank}.  

Once your project setup is complete, follow this guide to configure, compile, and deploy the necessary **Solana programs** and supporting accounts. This deployment enables **decentralized governance participation** on Solana as a spoke chain within the **MultiGov system**.  

## Prerequisites 

To deploy MultiGov on Solana, ensure you have the following installed:  

 - Install [Git](https://git-scm.com/downloads){target=\_blank}  
 - Install [Node.js](https://nodejs.org/){target=\_blank} **`v20.10.0`**
 - Install [Solana CLI](https://docs.solana.com/cli/install-solana-cli){target=\_blank} **`v1.18.20`**
 - Install [Anchor](https://www.anchor-lang.com/docs/installation){target=\_blank} **`v0.30.1`**
 - Install [Rust](https://www.rust-lang.org/tools/install){target=\_blank} **`v1.80.1`**
 - Install [Docker](https://www.docker.com/get-started/){target=\_blank}
 - Clone the repository:  
    ```bash
    git clone https://github.com/wormhole-foundation/multigov.git  
    cd multigov/solana/
    ```

## Build the Project

To create a verifiable build of the MultiGov Staking Program, run the following command:    

```bash
./scripts/build_verifiable_staking_program.sh
```

Once the build is complete, the compiled artifacts will be available in the `target` folder.

