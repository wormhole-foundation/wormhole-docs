---
title: Create Multichain Tokens
description: Learn how to create a multichain token, bridge tokens across blockchains, and update metadata for seamless multichain interoperability.
categories: WTT, Transfers
url: https://wormhole.com/docs/products/token-transfers/wrapped-token-transfers/tutorials/multichain-token/
---

# Create Multichain Tokens

Blockchain ecosystems are becoming increasingly interconnected, with assets often needing to exist across multiple networks to maximize their utility and reach. For example, tokens created on one chain may want to expand to others to tap into broader audiences and liquidity pools.

This guide explains how to create a multichain token—a token that seamlessly bridges across blockchains using the Wormhole protocol. The process is designed to be user-friendly. With just a few steps, your token can become multichain, enabling it to be traded or used on various networks.

By the end of this tutorial, you'll learn:

- How to register your token for bridging.
- How to create a wrapped version of your token.
- How to ensure its visibility on blockchain explorers.

Let’s begin with a straightforward, step-by-step process for creating a multichain token and expanding its reach.

## Register the Token on the Source Chain

The first step in creating a multichain token is registering your token on its source chain. This ensures the token is prepared for bridging across blockchains. Follow these steps:

1. Open the [Portal Bridge](https://portalbridge.com/legacy-tools/#/register){target=\_blank}.
2. Select the blockchain where your token is currently deployed (source chain).
3. Connect your wallet by following the on-screen instructions.
4. Locate the **Asset** field and paste the token contract address.
5. Click **Next** to proceed.

![Source Chain Registration Screen](/docs/images/products/wrapped-token-transfers/tutorials/multichain-tokens/multichain-token-1.webp)

## Register the Token on the Target Chain

After registering your token on the source chain, the next step is to select the target chain—the blockchain where you want the wrapped version of your token to exist. This step connects your token to its destination network.

1. Choose the blockchain where you want the token to be bridged (target chain).
2. Connect your wallet to the target chain.
3. Click **Next** to finalize the registration process.

![Target Chain Registration Screen](/docs/images/products/wrapped-token-transfers/tutorials/multichain-tokens/multichain-token-2.webp)

## Send an Attestation

Attestation is a key step in the process. It verifies your token’s metadata, ensuring it is correctly recognized on the target chain’s blockchain explorer (e.g., [Etherscan](https://etherscan.io/){target=\_blank}).

1. Click **Attest** to initiate the attestation process.
2. Approve the transaction in your wallet when prompted.

![Send Attestation Screen](/docs/images/products/wrapped-token-transfers/tutorials/multichain-tokens/multichain-token-3.webp)

!!! note
    - Attestation is crucial for token metadata to appear correctly on blockchain explorers like Etherscan, allowing users to identify and trust your token.
    - Ensure you have sufficient funds to cover transaction fees on the target chain.

## Create a Wrapped Token

The final step is to create the wrapped token on the target chain. This token represents the original asset and enables its use within the target blockchain.

1. Click **Create** to generate the wrapped token.
2. Approve the transaction in your wallet when prompted.

![Create Wrapped Token Screen](/docs/images/products/wrapped-token-transfers/tutorials/multichain-tokens/multichain-token-4.webp)

Upon successful creation, you will see a confirmation screen displaying key details such as the source chain, target chain, and transaction status. This helps verify that the process was completed correctly. Refer to the image below as an example:

![Confirmation Screen](/docs/images/products/wrapped-token-transfers/tutorials/multichain-tokens/multichain-token-5.webp)

## Additional Steps and Recommendations

After creating your multichain token, there are a few optional but highly recommended steps to ensure the best experience for users interacting with your token.

### Update Metadata on Blockchain Explorers

It is recommended that you update your token’s metadata on blockchain explorers such as Etherscan. This includes adding details like the token logo, price, and contract verification.

1. Create an account on the relevant scanner and go to the [token update section](https://etherscan.io/tokenupdate){target=\_blank} (or the relevant scanner that you would like to update metadata on).
2. Copy and paste the wrapped contract address in the **Token Update Application Form**.
3. Before proceeding to the next step, you will need to verify as the contract address owner on [Etherscan’s address verification tool](https://etherscan.io/verifyAddress/){target=\_blank}.
4. Follow the directions to verify contract address ownership via MetaMask by reviewing the [guide on verifying address ownership](https://info.etherscan.com/how-to-verify-address-ownership/){target=\_blank}.
   - Given that Wormhole may be the contract owner, use the manual verification process by reaching out through the [Etherscan contact form](https://etherscan.io/contactus){target=\_blank}. The team will provide support as needed.
5. Once the step above is completed, follow the [instructions to update token information](https://info.etherscan.com/how-to-update-token-information-on-token-page/){target=\_blank}.

## Next Steps

<div class="grid cards" markdown>

-   :octicons-tools-16:{ .lg .middle } **Demo Tutorials Repository**

    ---

    Looking for more hands-on tutorials? Check out the Wormhole Tutorial Demo repository on GitHub for additional examples.

    [:custom-arrow: Explore the Demo Repository](https://github.com/wormhole-foundation/demo-tutorials){target=\_blank}

-   :octicons-tools-16:{ .lg .middle } **Wormhole Dev Arena**

    ---

    A structured learning hub with hands-on tutorials across the Wormhole ecosystem.

    [:custom-arrow: Explore the Dev Arena](https://arena.wormhole.com/){target=\_blank}

</div>
