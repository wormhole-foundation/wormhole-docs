---
title: Solana Shim Deployment
description:
categories: Basics
---

<!-- TODO add link in messaging overview -->

# Solana Shim Contract Deployment

Purpose: Describes the actual deployment procedure for the two shims:

- Uses verifiable builds
- Deploys with known program IDs (stored in 1Password vault)
- Drops upgrade authority after test confirmations
- Provides the program IDs:
    - EFaNWErqAtVWufdNb7yofSHHfWFos843DFpu4JBw24at (verify)
    - EtZMZM22ViKMo4r5y4Anovs3wKQ2owUmDpjygnMMcdEX (emit)

## Emit 

## Verify


https://github.com/wormhole-foundation/wormhole/tree/main/svm/wormhole-core-shims

```
### This will create "artifacts-mainnet" directory.
NETWORK=mainnet SVM=solana make build-artifacts

solana program deploy -u m --with-compute-unit-price PRICE_IN_LAMPORTS --program-id path/to/post_message_shim_keypair.json artifacts-mainnet/wormhole_post_message_shim.so

solana program deploy -u m --with-compute-unit-price PRICE_IN_LAMPORTS --program-id path/to/verify_vaa_shim_keypair.json artifacts-mainnet/wormhole_verify_vaa_shim.so
```

This deploy with result in the deployer having the upgrade authority. The intention is to test the contracts in mainnet and then drop the upgrade authority before anyone integrates the contract.

The keypair is in 1Password, which will keep the existing addresses that we’ve already built IDLs for.

Verify shim: `EFaNWErqAtVWufdNb7yofSHHfWFos843DFpu4JBw24at`

Post Message shim: `EtZMZM22ViKMo4r5y4Anovs3wKQ2owUmDpjygnMMcdEX`

# Rollout Plan

1. Deploy a [verifiable build](https://solana.com/developers/guides/advanced/verified-builds) of both shims to Solana mainnet with the keypairs from the vault
    1. Have multiple contributors confirm that they can verify the deployment with the verifiable build cli
2. Test the verification and post message shims
    1. There are scripts for testing each shim in the monorepo
        1. https://github.com/wormhole-foundation/wormhole/blob/main/solana/scripts/post_message_shim_test.ts#L14
        2. https://github.com/wormhole-foundation/wormhole/blob/main/solana/scripts/verify_vaa_shim_test.ts#L15
    2. Note: at this stage, the post message shim emissions should **NOT** result in any guardian observations!
    3. The post message shim should result in an observation against a guardian with the shim address set - xLabs could try setting the shim address on their guardian and reobserving by tx - this should result in a single observation, only from them. (remember to be quick, as the node only has the transactions for so long!)
    4. The verification shim should work with a mainnet VAA
3. After successfully testing the above, drop the upgrade authority so the programs become immutable!
    
    ```bash
    # Check that the bytecode hashes match
    $ solana-verify -u m get-program-hash EFaNWErqAtVWufdNb7yofSHHfWFos843DFpu4JBw24at
    b3e5ee398c5cb4ac14f71c5311babdb2e043bff3e825160885235dafb121255e
    $ solana-verify -u m get-program-hash EtZMZM22ViKMo4r5y4Anovs3wKQ2owUmDpjygnMMcdEX
    e724f0159914ff64d83ebceadc4c90c5b2df4883935b91b140d651ff207bf4f3
    
    # Drop upgrade authority for both programs
    solana program set-upgrade-authority -u m --final EFaNWErqAtVWufdNb7yofSHHfWFos843DFpu4JBw24at
    solana program set-upgrade-authority -u m --final EtZMZM22ViKMo4r5y4Anovs3wKQ2owUmDpjygnMMcdEX
    ```
    
4. Then request that the guardians verify the publish message shim for themselves and set their config to the public key.
5. Repeat the post message shim emission tests after 13 guardians have enabled.