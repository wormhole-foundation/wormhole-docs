---
title: Efficient VAA Verification on Solana (Shim)
description:
categories: Basics
---

<!-- TODO add link in messaging overview and maybe queries too?-->

# Efficient VAA Verification on Solana (Shim)

Purpose: Introduces a new VAA verification mechanism via a shim that:

- Avoids permanent rent costs (no signature set or posted VAA accounts left behind)
- Leverages secp256k1_recover to directly verify signatures
- Allows processing large VAAs or Queries across multiple txs

Shim Has 3 Instructions:
- post_signatures — creates/extends a GuardianSignatures account
- verify_vaa — CPI-invoked to validate signatures against digest
- close_signatures — closes the account to refund lamports