---
title: Wormhole Finality | Consistency Levels
description: This page documents how long to wait for finality before signing, based on each chain’s consistency (finality) level and consensus mechanism.
categories: Core
---

# Wormhole Finality

The following table documents each chain's `consistencyLevel` values (i.e., finality reached before signing). The consistency level defines how long the Guardians should wait before signing a VAA. The finalization time depends on the specific chain's consensus mechanism. The consistency level is a `u8`, so any single byte may be used. However, a small subset has particular meanings. If the `consistencyLevel` isn't one of those specific values, the `Otherwise` column describes how it's interpreted.

--8<-- 'text/build/reference/consistency-levels/consistency-levels.md'
