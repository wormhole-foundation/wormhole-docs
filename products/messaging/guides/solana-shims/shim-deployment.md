---
title: Solana Shim Deployment
description: Step-by-step instructions for building, deploying, verifying, and hardening Wormhole Solana shims for rent-efficient message emission and VAA verification.
categories: Basics
---

# Solana Shim Contract Deployment

This guide explains how to deploy and validate the two shim programs that optimize Wormhole Core Bridge operations on Solana mainnet. Follow these steps to ensure reliable, Guardian-compatible usage with minimal rent overhead.

If you’re new to shims, start with the [Solana Shims Concepts page](/docs/products/messaging/concepts/solana-shim/){target=\_blank} for protocol background, or see the [Emission](/docs/products/messaging/guides/solana-shims/sol-emission/){target=\_blank} and [Verification](/docs/products/messaging/guides/solana-shims/sol-verification/){target=\_blank} guides for integration details.

## Prerequisites

- [Rust and Solana CLI](https://docs.solana.com/cli/install-solana-cli-tools) installed.
- Familiarity with [verifiable builds](https://solana.com/developers/guides/advanced/verified-builds).
- Sufficient SOL for deploying to mainnet.

## Shim

- **Emission Shim (`EtZMZM22ViKMo4r5y4Anovs3wKQ2owUmDpjygnMMcdEX`)**: Emits messages without creating a permanent account per message.
- **Verification Shim (`EFaNWErqAtVWufdNb7yofSHHfWFos843DFpu4JBw24at`)**: Verifies VAAs without leaving data on-chain.

##  Build Verifiable Artifacts

Clone the Wormhole repo and build the shims for mainnet with reproducible output:

```bash
git clone https://github.com/wormhole-foundation/wormhole.git
cd wormhole/svm/wormhole-core-shims
```

```bash
NETWORK=mainnet SVM=solana make build-artifacts
```

- Artifacts will be output to `artifacts-mainnet/`.
- Do not modify these binaries before deployment.

## Deploy to Mainnet

Deploy each program with the matching pre-generated keypair and choose a suitable compute unit price:

Emission Shim:
```bash
solana program deploy -u m \
  --with-compute-unit-price <PRICE_IN_LAMPORTS> \
  --program-id path/to/post_message_shim_keypair.json \
  artifacts-mainnet/wormhole_post_message_shim.so
```

Verification Shim:
```bash
solana program deploy -u m \
  --with-compute-unit-price <PRICE_IN_LAMPORTS> \
  --program-id path/to/verify_vaa_shim_keypair.json \
  artifacts-mainnet/wormhole_verify_vaa_shim.so
```

After deploy, you (the deployer) retain upgrade authority. Do not integrate or announce the program yet.

## Test the Shims

Run the provided [test script](https://github.com/wormhole-foundation/wormhole/tree/main/solana/scripts){target=\_blank} from the monorepo:

- [Emit Shim Test](https://github.com/wormhole-foundation/wormhole/blob/main/solana/scripts/post_message_shim_test.ts){target=\_blank}
- [Verify Shim Test](https://github.com/wormhole-foundation/wormhole/blob/main/solana/scripts/verify_vaa_shim_test.ts){target=\_blank}

Checklist:

- Post Message Shim should emit successfully, but not be picked up by Guardians unless configured
- A Guardian with shim config enabled should observe the emission via tx
- Verify Shim should accept a valid mainnet VAA and reject invalid ones

!!!note 
    Transaction logs for testing are only available for ~30 minutes—complete your checks promptly.

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

After this, no further changes to program code are possible. Only drop upgrade authority after full verification.