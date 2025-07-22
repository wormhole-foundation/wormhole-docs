---
title: Solana Shim Deployment
description: TODO
categories: Basics
---
<!-- TODO add link in messaging overview -->

<!--
Give clear, minimal, production-focused instructions for deploying the post message and verify VAA shim contracts on Solana, testing them, and hardening upgrade authority. Should also be the landing spot for rollout instructions, keys, and links to build artifacts/scripts.

Prerequisites:
(Verifiable build, where to get code/artifacts, needed keys, 1Password reference)

Deploy Steps:
Build (with command)
Deploy each contract (with command and explanation of options, what the addresses are)

Testing:
How to test each shim, using the repo scripts (link to them)
What to expect (no observation until guardian is set, testnet/mainnet differences)

Lock Down:
How and why to drop upgrade authority, with command.

Guardian Rollout:
How guardians should verify and set config, when to re-test emission

FAQ/Troubleshooting:
Node history limits, verifiable build hashes, etc.
-->

# Solana Shim Contract Deployment

This guide outlines how to deploy the two shim programs that optimize Wormhole Core Bridge operations on Solana.

- Uses verifiable builds
- Deploys with pre-defined program IDs
- Drops upgrade authority after validation
- Ensures Guardian compatibility and observation

## Program Overview 

The two shim programs serve distinct purposes:

| Shim             | Purpose                           | Program ID                                     |
|------------------|-----------------------------------|------------------------------------------------|
| Post Message     | Emits messages without rent cost  | `EtZMZM22ViKMo4r5y4Anovs3wKQ2owUmDpjygnMMcdEX` |
| Verify VAA       | Verifies VAAs without storing data| `EFaNWErqAtVWufdNb7yofSHHfWFos843DFpu4JBw24at` |

These program IDs are fixed and their keypairs are stored securely in 1Password. This ensures continuity with previously generated IDLs and Guardian configs.

<!--  Concept page note: Explain what "verifiable builds" are and why dropping upgrade authority matters. --> 

## Build the Programs

Build verifiable artifacts for both shims
NETWORK=mainnet SVM=solana make build-artifacts

This creates compiled binaries in artifacts-mainnet/.
You must build on the same machine or Docker image used to deploy in order to verify later.


## Deploy to Mainnet

 Deploy Post Message Shim
solana program deploy -u m \
  --with-compute-unit-price PRICE_IN_LAMPORTS \
  --program-id path/to/post_message_shim_keypair.json \
  artifacts-mainnet/wormhole_post_message_shim.so

 Deploy Verify VAA Shim
solana program deploy -u m \
  --with-compute-unit-price PRICE_IN_LAMPORTS \
  --program-id path/to/verify_vaa_shim_keypair.json \
  artifacts-mainnet/wormhole_verify_vaa_shim.so

This results in the deployer retaining the upgrade authority temporarily.

## Test Both Shims

Use the testing scripts provided in the monorepo:

- [Emit Shim Test](https://github.com/wormhole-foundation/wormhole/blob/main/solana/scripts/post_message_shim_test.ts)
- [Verify Shim Test](https://github.com/wormhole-foundation/wormhole/blob/main/solana/scripts/verify_vaa_shim_test.ts)

Testing checklist:
- Post Message Shim should emit successfully, but not be picked up by Guardians unless configured
- A Guardian with shim config enabled should observe the emission via tx
- Verify Shim should accept a valid mainnet VAA and reject invalid ones

note Nodes only retain transaction logs for ~30 minutes — be quick with testing!

## Drop Upgrade Authority

 Optional: Verify build hashes
solana-verify -u m get-program-hash EFaNWErqAtVWufdNb7yofSHHfWFos843DFpu4JBw24at
solana-verify -u m get-program-hash EtZMZM22ViKMo4r5y4Anovs3wKQ2owUmDpjygnMMcdEX

 Drop upgrade authority to finalize immutability
solana program set-upgrade-authority -u m --final EFaNWErqAtVWufdNb7yofSHHfWFos843DFpu4JBw24at
solana program set-upgrade-authority -u m --final EtZMZM22ViKMo4r5y4Anovs3wKQ2owUmDpjygnMMcdEX

note After this step, the programs are immutable.


## Final Guardian Rollout

1. Ask Guardians to verify the post message shim deployment independently
2. Each Guardian should configure their watcher to recognize the shim address
3. Once 13+ Guardians enable it, shim-based emissions will result in valid VAAs





<!------------------------------------>




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