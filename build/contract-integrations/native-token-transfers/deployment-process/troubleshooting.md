---
title: Troubleshooting NTT Deployment
description: Resolve common issues in NTT deployment with this troubleshooting guide covering Solana, EVM, mint authority, decimals, and rate limits.
---

# Troubleshooting NTT Deployment

If you encounter issues during the NTT deployment process, check the following common points:

- **Solana and Anchor versions** - ensure you are using the expected versions of Solana and Anchor as outlined in the [deployment page](/docs/build/contract-integrations/native-token-transfers/deployment-process/deploy-to-solana/#install-dependencies){target=\_blank}
    -  [Solana](https://docs.solanalabs.com/cli/install){target=\_blank} **`{{ ntt.solana_cli_version }}`**
    -  [Anchor](https://www.anchor-lang.com/docs/installation){target=\_blank} **`{{ ntt.anchor_version }}`**
- **Token compliance on EVM** - verify that your token is an ERC20 token on the EVM chain
- **Mint authority transfer**
    - **For burn or spoke tokens on Solana** - ensure the token mint authority was transferred as described in the [set SPL Token Mint Authority](/docs/build/contract-integrations/native-token-transfers/deployment-process/deploy-to-solana/#set-spl-token-mint-authority){target=\_blank} section
    - **For EVM tokens** - confirm the token minter was set to the NTT Manager. Refer to the [set Token Minter to NTT Manager](/docs/build/contract-integrations/native-token-transfers/deployment-process/deploy-to-evm/#set-token-minter-to-ntt-manager){target=\_blank} section for details
- **Decimal configuration** - run `ntt pull` to correctly configure the decimals in your `deployment.json` file. More details in the [configure NTT](/docs/build/contract-integrations/native-token-transfers/deployment-process/deploy-to-solana/#configure-ntt){target=\_blank} section
- **Rate limit configuration** - increase your rate limits to a value greater than zero. A rate limit of zero can cause transactions to get stuck. Learn more on how to [configure rate limits](/docs/build/contract-integrations/native-token-transfers/deployment-process/deploy-to-evm/#configure-ntt){target=\_blank}
- **Docker environment based on Ubuntu 20.04 with all dependencies required for Wormhole NTT CLI development** - run `docker compose up -d` to start the container in your terminal from the directory containing the docker-compose.yml file
???- interface "Dockerfile"

```Dockerfile
    FROM ubuntu:20.04
    # Set environment variables to prevent interactive prompts during installation
    ENV DEBIAN_FRONTEND=noninteractive

    # Update and install necessary dependencies
    RUN apt-get update && apt-get install -y \
        curl \
        wget \
        git \
        build-essential \
        libssl-dev \
        libudev-dev \
        pkg-config \
        python3 \
        python3-pip \
        software-properties-common \
        ca-certificates \
        unzip \
        clang \
        cmake \
        protobuf-compiler \
        && apt-get clean && rm -rf /var/lib/apt/lists/*

    # Install Rust
    RUN curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh -s -- -y
    ENV PATH="/root/.cargo/bin:$PATH"

    # Install Solana CLI (v1.18.10)
    RUN sh -c "$(curl -sSfL https://release.solana.com/v1.18.10/install)"
    ENV PATH="/root/.local/share/solana/install/active_release/bin:$PATH"

    # Install Anchor using avm
    RUN cargo install --git https://github.com/coral-xyz/anchor avm --locked --force \
        && avm install 0.29.0 \
        && avm use 0.29.0
    ENV PATH="/root/.avm/bin:$PATH"


    ENV NVM_DIR=/root/.nvm
    RUN curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.1/install.sh | bash \
        && . "$NVM_DIR/nvm.sh" \
        && nvm install 22 \
        && nvm use 22 \
        && nvm alias default 22
    ENV PATH="$NVM_DIR/versions/node/v22.12.0/bin:$PATH"

    # Install Bun
    RUN curl -fsSL https://bun.sh/install | bash
    ENV PATH="/root/.bun/bin:$PATH"

    # Install Foundry
    RUN curl -L https://foundry.paradigm.xyz | bash
    ENV PATH="/root/.foundry/bin:${PATH}"
    RUN /bin/bash -c "source /root/.bashrc && foundryup"

    # Install Wormhole NTT CLI
    RUN curl -fsSL https://raw.githubusercontent.com/wormhole-foundation/native-token-transfers/main/cli/install.sh | bash

    # Add a default working directory
    WORKDIR /app

    # Expose port for development if needed
    EXPOSE 8899

    # Entry point for the container
    CMD ["bash"]
```


???- interface "docker-compose.yml"
```yml 
    services:
        portal-ntt:
            build:
                context: .
                dockerfile: Dockerfile
            platform: linux/amd64
            volumes:
                - ./src:/app
            working_dir: /app
            tty: true
``` 
