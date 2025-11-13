---
title: Solana VAA Verification via Shim
description: Efficiently verify Wormhole VAAs on Solana using the Verification Shim, which avoids persistent rent-exempt accounts while keeping full security guarantees.
categories: Basics
url: https://wormhole.com/docs/products/messaging/guides/solana-shims/sol-verification/
---

# Solana VAA Verification via Shim

Verifying VAAs on Solana with the legacy core bridge requires creating multiple rent-exempt accounts for signatures and posted VAAs. These accounts persist even after verification is complete, which increases costs and bloats the on-chain state.

The verification shim solves this by replacing the core bridge verification flow with its own instructions:

- `post_signatures`: Accumulates Guardian signatures into a temporary account.
- `verify_hash`: Validates the VAA by checking the signatures against the active Guardian set and ensuring quorum.
- `close_signatures`: Closes the temporary account to reclaim lamports.

Because the shim avoids leaving permanent accounts behind, verification becomes much cheaper while keeping the same security guarantees.

This page introduces the Verification Shim, explains how it works, and shows how integrators can adopt it in place of the core bridge’s `verify_signatures` and `post_vaa` functions.

For more background, see the [Verification Shim concept section](/docs/products/messaging/concepts/solana-shim/#verification-shim){target=\_blank}. 

## Prerequisites

To interact with the verification shim, you'll need the following:

- [Rust and Solana CLI installed](https://solana.com/docs/intro/installation){target=\_blank}.  
- [Anchor installed](https://www.anchor-lang.com/docs/installation){target=\_blank}.
- The canonical verification shim program already deployed at [`EFaNWErqAtVWufdNb7yofSHHfWFos843DFpu4JBw24at`](https://explorer.solana.com/address/EFaNWErqAtVWufdNb7yofSHHfWFos843DFpu4JBw24at){target=\_blank}.
- The shim’s [IDL](https://github.com/wormhole-foundation/wormhole/blob/main/svm/wormhole-core-shims/anchor/idls/wormhole_verify_vaa_shim.json){target=\_blank} for wiring accounts.
- A payer (signer) funded for compute and temporary account rent (you’ll close and reclaim).

## Setup

To start, add the verification shim CPI and declare the external program so your instruction can CPI into it. This lets your program verify a VAA digest against the active Guardian set without creating persistent core bridge accounts.

```rs
declare_program!(wormhole_verify_vaa_shim);

use anchor_lang::{
    prelude::*,
    solana_program::{self, keccak},
};
use wormhole_verify_vaa_shim::cpi::accounts::VerifyHash;
use wormhole_verify_vaa_shim::program::WormholeVerifyVaaShim;
```

## Accounts

You’ll wire three accounts for verification:

- `guardian_set`: Core bridge `GuardianSet` PDA for the VAA’s `guardianSetIndex` (shim checks derivation).
- `guardian_signatures`: Temporary account created by `post_signatures` (shim checks ownership & discriminator).
- `wormhole_verify_vaa_shim`: The verification shim program.

```rs
#[derive(Accounts)]
pub struct ConsumeVaa<'info> {
    /// CHECK: Guardian set used for signature verification by shim.
    /// Derivation is checked by the shim.
    guardian_set: UncheckedAccount<'info>,

    /// CHECK: Stored guardian signatures to be verified by shim.
    /// Ownership ownership and discriminator is checked by the shim.
    guardian_signatures: UncheckedAccount<'info>,

    wormhole_verify_vaa_shim: Program<'info, WormholeVerifyVaaShim>,
}
```

Here, `guardian_set` is a core bridge PDA, and `guardian_signatures` is created and owned by the verification shim. Derive `guardian_set = PDA(["GuardianSet", index_be_bytes], CORE_BRIDGE_PROGRAM_ID)` using the `guardianSetIndex` from the VAA header (big-endian), compute its bump, and pass that bump into your instruction.

## Verify the VAA

The `consume_vaa` function computes the digest, calls the shim’s `verify_hash`, and then proceeds with your logic. This step validates Guardian signatures and quorum against the active Guardian set for the VAA’s `guardianSetIndex`, then lets your program proceed without persisting a `PostedVAA`. 

```rs
pub fn consume_vaa(
    ctx: Context<ConsumeVaa>,
    guardian_set_bump: u8,
    vaa_body: Vec<u8>,
) -> Result<()> {
    // Compute the message hash.
    let message_hash = &solana_program::keccak::hashv(&[&vaa_body]).to_bytes();
    let digest = keccak::hash(message_hash.as_slice()).to_bytes();
    // Verify the hash against the signatures.
    wormhole_verify_vaa_shim::cpi::verify_hash(
        CpiContext::new(
            ctx.accounts.wormhole_verify_vaa_shim.to_account_info(),
            VerifyHash {
                guardian_set: ctx.accounts.guardian_set.to_account_info(),
                guardian_signatures: ctx.accounts.guardian_signatures.to_account_info(),
            },
        ),
        guardian_set_bump,
        digest,
    )?;
    // Decode vaa_body, perform security checks, and do your thing.
    Ok(())
}
```

## Limitations and Security Considerations

- You must be the payer and/or account owner to reclaim lamports from the `GuardianSignatures` account.
- The verification proof is not a permanent on-chain record unless you keep the account.
- Compute usage (CU) is higher for the rent-efficient pattern, but the total cost is dramatically lower than keeping permanent accounts.
- All validation guarantees remain as strong as with the legacy method.
- If you do not close accounts you create, rent will be lost as before.
- This approach assumes you do not need to later re-validate the VAA from an on-chain artifact.

## Conclusion

By following this flow, you can efficiently verify VAAs on Solana with minimal rent overhead, leaving no unnecessary state behind on-chain. For a complete, working reference, see the full example implementation in the Wormhole repo: [`consume_vaa.rs`](https://github.com/wormhole-foundation/wormhole/blob/main/svm/wormhole-core-shims/anchor/programs/wormhole-integrator-example/src/instructions/consume_vaa.rs){target=\_blank}.
