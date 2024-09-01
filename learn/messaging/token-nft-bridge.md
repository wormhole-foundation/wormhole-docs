---
title: Token Bridge 
description: Learn about Wormhole's Token and NFT Bridge for cross-chain transfers using lock and mint mechanisms, ensuring secure and efficient asset movement.
---

# Token and NFT Bridge

## Token Bridge

!!! note
    Before a token transfer can be made, the token being transferred must exist as a wrapped asset on the target chain. This is done by [Attesting](/learn/infrastructure/vaas/#attestation){target=\_blank} the token details on the target chain.

The Token Bridge contract allows token transfers between blockchains through a lock and mint mechanism, using the [Core Contract](/learn/messaging/core-contracts/){target=\_blank} with a specific [payload](/learn/infrastructure/vaas/#token-transfer){target=\_blank} to pass information about the transfer. 

The Token Bridge also supports sending tokens with some additional data in the form of arbitrary byte payload attached to the token transfer. This type of transfer is referred to as a [Contract Controlled Transfer](/learn/infrastructure/vaas/#token-transfer-with-message){target=\_blank}.

While the [Core Contract](/learn/messaging/core-contracts/){target=\_blank} has no specific receiver by default, transfers sent through the Token Bridge do have a specific receiver chain and address to ensure the tokens are minted to the expected recipient.

### Attesting on Multiple Chains

When transferring assets between multiple chains using Wormhole, you must attest the asset on each destination chain. To do this:
1. Perform the attestation on the first destination chain as per the standard procedure.
2. Obtain the VAA for the attestation and submit it to the second destination chain, and so on.

### Practical Example

To demonstrate how to attest a token across multiple chains, follow these steps:

1. **Step 1: Attest the Token on Chain A**  
   - Obtain the VAA for the attestation on Chain A.
   - Relay this VAA to Chain B to mint the wrapped token.

2. **Step 2: Attest the Token on Chain B**  
   - Submit the VAA from Chain A to Chain B to ensure that the token details are recognized on Chain B.

3. **Step 3: Transfer the Token**  
   - After successful attestations, you can proceed with transferring the token across the attested chains.

### Ensuring Finality

VAAs rely on the finality of transactions on the source chain. Make sure that the consistency level is sufficient to avoid issues related to reorgs or rollbacks.

## NFT Bridge

The NFT Bridge functions similarly to the Token Bridge but with special rules for what may be transferred and how the wrapped version is created on the destination chain.