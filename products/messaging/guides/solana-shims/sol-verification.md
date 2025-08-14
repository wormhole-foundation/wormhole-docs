---
title: Efficient VAA Verification on Solana (Shim)
description: Efficiently verify Wormhole VAAs on Solana without leaving rent-exempt accounts, using the core bridge’s standard instructions.
categories: Basics
---

# Efficient VAA Verification on Solana (Shim)

This guide explains how to efficiently verify Wormhole VAAs on Solana by leveraging the core bridge’s [`verify_signatures`](https://github.com/wormhole-foundation/wormhole/blob/main/solana/bridge/program/src/api/verify_signature.rs){target=\_blank} and [`post_vaa`](https://github.com/wormhole-foundation/wormhole/blob/main/solana/bridge/program/src/api/post_vaa.rs){target=\_blank} instructions, and cleaning up temporary accounts after use.

The goal is to accumulate all guardian signatures into a temporary `SignatureSet` account using `verify_signatures`, verify the VAA and guardian set using `post_vaa`, and immediately close any accounts you created for this process.

For more background, see [Solana Shims concept page](/docs/products/messaging/concepts/solana-shim/){target=\_blank}. 

## How It Works

The verification shim replaces the legacy multi-account pattern with a flow where you only create a temporary signature set account. After verification, you can close it to reclaim your lamports.

1. **Create a temporary `SignatureSet` account**: Fund it as rent-exempt for the required size.
2. **Call `verify_signatures`** as many times as needed, using the secp256k1 syscall and all guardian signatures. The SignatureSet account will accumulate valid signatures.
3. **Call `post_vaa`** to check guardian set validity, consensus, and VAA integrity.
   - If verification succeeds, proceed with your on-chain logic (e.g., updating state, processing transfers).
4. **Immediately close** the `GuardianSignatures` account via `close_signatures` to reclaim lamports, if you are the payer.

```mermaid
graph LR
    A[Create SignatureSet] --> B[verify_signatures]
    B --> C[post_vaa]
    C --> D[Process Logic]
    D --> E[Close SignatureSet & PostedVAA]
```

## Verify VAA

This instruction is intended to be invoked via CPI call. It verifies a digest against a GuardianSignatures account and a core bridge GuardianSet. Prior to this call, and likely in a separate transaction, `post_signatures` must be called to create the account. Immediately after this call, `close_signatures` should be called to reclaim the lamports.

A v1 VAA digest can be computed as follows:

```rust
let message_hash = &solana_program::keccak::hashv(&[&vaa_body]).to_bytes();
let digest = keccak::hash(message_hash.as_slice()).to_bytes();
```

A QueryResponse digest can be computed as follows:

```rust
use wormhole_query_sdk::MESSAGE_PREFIX;
let message_hash = [
  MESSAGE_PREFIX,
  &solana_program::keccak::hashv(&[&bytes]).to_bytes(),
].concat();
let digest = keccak::hash(message_hash.as_slice()).to_bytes();
```

## Limitations and Security Considerations

- You must be the payer and/or account owner to reclaim lamports from SignatureSet and PostedVAA accounts.
- The verification proof is ephemeral—no permanent on-chain record unless you keep the account.
- Compute usage (CU) is higher for the rent-efficient pattern, but total cost is dramatically lower than keeping permanent accounts.
- All validation guarantees remain as strong as with the legacy method.
- If you do not close accounts you create, rent will be lost as before.
- This approach assumes you do not need to later re-validate the VAA from an on-chain artifact.

## Conclusion

By following this flow, you can efficiently verify VAAs on Solana with minimal rent overhead, leaving no unnecessary state behind on-chain.