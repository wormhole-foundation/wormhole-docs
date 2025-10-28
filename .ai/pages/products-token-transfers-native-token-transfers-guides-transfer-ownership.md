---
title: Transfer Ownership
description: Step-by-step guide to transferring ownership of Native Token Transfers on EVM, Solana, and Sui with CLI instructions.
categories: NTT, Transfer
url: https://wormhole.com/docs/products/token-transfers/native-token-transfers/guides/transfer-ownership/
---

# Transfer Ownership

After deploying Native Token Transfers (NTT), you may need to move ownership to a new owner address (e.g., a multisig). This page outlines the process for transferring ownership on EVM, Solana, and Sui.

## EVM

The [NTT CLI](/docs/products/token-transfers/native-token-transfers/get-started/#install-ntt-cli){target=\_blank} supports transferring ownership on EVM chains. To transfer ownership on the EVM chains, you can do the following:

1. Set the private key used to sign the transaction.

    ```bash
    export ETH_PRIVATE_KEY=INSERT_EVM_PRIVATE_KEY
    ```

2. Run the `ntt transfer-ownership` command, specifying the chain and destination address.

    ```bash
    ntt transfer-ownership INSERT_CHAIN --destination INSERT_DESTINATION_ADDRESS
    ```

    You’ll see a confirmation prompt. Type `y` to proceed.

If successful, you will see the following output:

<div id="termynal" data-termynal>
    <span data-ty="input"><span class="file-path"></span>export ETH_PRIVATE_KEY=INSERT_EVM_PRIVATE_KEY</span>
	<span data-ty="input"><span class="file-path"></span>ntt transfer-ownership ArbitrumSepolia --destination 0xc96CE2a...</span>
	<span data-ty></span>
	<span data-ty>Transferring ownership on ArbitrumSepolia (Testnet)</span>
	<span data-ty>Manager address: 0x00a97bE...</span>
    <span data-ty>New owner: 0xc96CE2a...</span>
	<span data-ty>Current owner: 0x0088DFA...</span>
    <span data-ty> </span>
    <span data-ty>⚠️ ⚠️ ⚠️ CRITICAL WARNING ⚠️ ⚠️ ⚠️</span>
    <span data-ty>This ownership transfer is IRREVERSIBLE!</span>
    <span data-ty>Please TRIPLE-CHECK that the destination address is correct:</span>
    <span data-ty>0xc96CE2a...</span>
    <span data-ty> </span>
    <span data-ty>Are you absolutely certain you want to transfer ownership to 0xc96CE2a...? [y/N]y</span>
    <span data-ty>Transaction hash: 0x57da478...</span>
    <span data-ty>Waiting for 1 confirmation...</span>
    <span data-ty>Verifying ownership transfer...</span>
    <span data-ty>✅ Ownership transferred successfully to 0xc96CE2a...</span>
	<span data-ty="input"><span class="file-path"></span></span>
</div>
## Solana

Transferring ownership of Wormhole's NTT to a multisig on Solana is a two-step process for safety. This ensures that ownership is not transferred to an address that cannot claim it. Refer to the `transfer_ownership` method in the [NTT Manager Contract](https://github.com/wormhole-foundation/native-token-transfers/blob/main/solana/programs/example-native-token-transfers/src/instructions/admin/transfer_ownership.rs#L58){target=\_blank} to initiate the transfer.

1. **Initiate transfer**: Use the `transfer_ownership` method on the NTT Manager contract to set the new owner (the multisig).
2. **Claim ownership**: The multisig must then claim ownership via the `claim_ownership` instruction. If not claimed, the current owner can cancel the transfer.
3. **Single-step transfer (Riskier)**: You can also use the `transfer_ownership_one_step_unchecked` method to transfer ownership in a single step, but if the new owner cannot sign, the contract may become locked. Be cautious and ensure the new owner is a [Program Derived Address (PDA)](https://solana.com/docs/core/pda){target=\_blank}.

For a practical demonstration of transferring ownership of Wormhole's NTT to a multisig on Solana, visit the [GitHub demo](https://github.com/wormhole-foundation/demo-ntt-solana-multisig-tools), which provides scripts and guidance for managing an NTT program using Squads' multisig functionality, including procedures for ownership transfer.

## Sui

The [Sui CLI](https://docs.sui.io/guides/developer/getting-started/sui-install){target=\_blank} supports transferring ownership by moving the NTT Manager’s `AdminCap` and `UpgradeCap` to your multisig. You can transfer ownership as follows:

1. Find out the `AdminCap` and `UpgradeCap` for your NTT manager.

    ```bash
    sui client object INSERT_SUI_NTT_MANAGER_ADDRESS --json 2>/dev/null | jq -r '"AdminCap ID: \(.content.fields.admin_cap_id)\nUpgradeCap ID: \(.content.fields.upgrade_cap_id)"'
    ```

2. Transfer `AdminCap` object over to a multisig.

    ```bash
    sui client transfer --to INSERT_MULTISIG_ADDRESS --object-id INSERT_ADMIN_CAP_ID_STEP1
    ```

3. Transfer `UpgradeCap` object over to a multisig.

    ```bash
    sui client transfer --to INSERT_MULTISIG_ADDRESS --object-id INSERT_UPGRADE_CAP_ID_STEP1
    ```

4. Check the new owner of the `AdminCap` object.

    ```bash
    sui client object INSERT_ADMIN_CAP_ID_STEP1 --json \
        | jq -r '.owner'
    ```
