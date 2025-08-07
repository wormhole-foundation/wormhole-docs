---
title: Solana Shim Deployment
description: Step-by-step instructions for building, deploying, verifying, and hardening Wormhole Solana shims for rent-efficient message emission and VAA verification.
categories: Basics
---

# Solana Shim Program Deployment

This guide explains how to deploy and validate the two shim programs that optimize Wormhole Core Bridge operations on Solana mainnet. Follow these steps to ensure reliable, Guardian-compatible usage with minimal rent overhead.

If you’re new to shims, start with the [Solana Shims Concepts page](/docs/products/messaging/concepts/solana-shim/){target=\_blank} for protocol background, or see the [Emission](/docs/products/messaging/guides/solana-shims/sol-emission/){target=\_blank} and [Verification](/docs/products/messaging/guides/solana-shims/sol-verification/){target=\_blank} guides for integration details.

## Prerequisites

- [Rust and Solana CLI](https://docs.solana.com/cli/install-solana-cli-tools){target=\_blank} installed.
- Familiarity with [verifiable builds](https://solana.com/developers/guides/advanced/verified-builds){target=\_blank}.
- Sufficient SOL for deploying to mainnet.

## Shims

- **Emission Shim (`EtZMZM22ViKMo4r5y4Anovs3wKQ2owUmDpjygnMMcdEX`)**: Emits messages without creating a permanent account per message.
- **Verification Shim (`EFaNWErqAtVWufdNb7yofSHHfWFos843DFpu4JBw24at`)**: Verifies VAAs without leaving data on-chain.

##  Build Verifiable Artifacts

1. Before you begin, make sure [solana-verify](https://solana.com/it/developers/guides/advanced/verified-builds){target=\_blank} is installed on your machine:

  ```bash
  cargo install solana-verify
  ```

2. Next, clone the Wormhole repo and and navigate to the shims directory:

  ```bash
  git clone https://github.com/wormhole-foundation/wormhole.git
  cd wormhole/svm/wormhole-core-shims
  ```

3. Now build the shims for mainnet using a reproducible build. An example of how to build for Solana mainnet:

  ```bash
  NETWORK=mainnet SVM=solana make build-artifacts
  ```

This command creates compiled, verifiable program binaries in the `artifacts-mainnet/` directory. If `artifacts-mainnet/` already exists, the command will not run to prevent accidental overwrites. **Do not modify these binaries before deployment.**

## Deploy to Mainnet

Deploy each shim program using the corresponding pre-generated keypair and specify an appropriate compute unit price for your environment:

- Deploy the Emission Shim:

  ```bash
  solana program deploy -u m \
    --with-compute-unit-price <PRICE_IN_LAMPORTS> \
    --program-id path/to/post_message_shim_keypair.json \
    artifacts-mainnet/wormhole_post_message_shim.so
  ```

- Deploy the  Verification Shim:

  ```bash
  solana program deploy -u m \
    --with-compute-unit-price <PRICE_IN_LAMPORTS> \
    --program-id path/to/verify_vaa_shim_keypair.json \
    artifacts-mainnet/wormhole_verify_vaa_shim.so
  ```

!!!important
    After deployment, you (the deployer) will temporarily retain upgrade authority for both programs. Do not integrate or publicize these programs until you have completed all tests and dropped upgrade authority.

## Test the Shims

Once the shims are deployed, use the provided [test script directory](https://github.com/wormhole-foundation/wormhole/tree/main/solana/scripts){target=\_blank} to verify the deployments.

### Run the Emit Shim Test

1. Navigate to the test script directory:

    ```sh
    cd wormhole/solana/scripts
    ```

2. Open [`post_message_shim_test.ts`](https://github.com/wormhole-foundation/wormhole/blob/main/solana/scripts/post_message_shim_test.ts){target=\_blank} in your editor and update any required variables at the top of the file (such as keypair paths, RPC URL, or program ID) to match your deployment.

3. Run the test:

    ```sh
    npx ts-node post_message_shim_test.ts
    ```

The test should emit a message via the shim. Unless Guardians are configured to watch the shim, no VAA will be produced.

### Run the Verify Shim Test

1. Open [verify_vaa_shim_test.ts](https://github.com/wormhole-foundation/wormhole/blob/main/solana/scripts/verify_vaa_shim_test.ts){target=\_blank} and ensure variables point to the correct keypair and network.

2. Run the test:

    ```sh
    npx ts-node verify_vaa_shim_test.ts
    ```

The test should attempt to verify a real (or sample) mainnet VAA. It should succeed for valid VAAs and fail for invalid ones.

!!!note 
    Transaction logs for testing are only available for ~30 minutes; complete your checks promptly.

## Verify the Deployment

You and other contributors can independently verify the deployed program matches the artifact:

```bash
solana-verify -u m get-program-hash EFaNWErqAtVWufdNb7yofSHHfWFos843DFpu4JBw24at
solana-verify -u m get-program-hash EtZMZM22ViKMo4r5y4Anovs3wKQ2owUmDpjygnMMcdEX
```

Full instructions for verifying builds are available in the [Solana documentation](https://solana.com/it/developers/guides/advanced/verified-builds#verify-against-public-api){target=\_blank}.

## Drop Upgrade Authority

Once testing is complete and you are confident in the deployment, make both programs immutable:

```bash
solana program set-upgrade-authority -u m --final EFaNWErqAtVWufdNb7yofSHHfWFos843DFpu4JBw24at
solana program set-upgrade-authority -u m --final EtZMZM22ViKMo4r5y4Anovs3wKQ2owUmDpjygnMMcdEX
```

After this, no further changes to the program code are possible. Only drop upgrade authority after full verification.