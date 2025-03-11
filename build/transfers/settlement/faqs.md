---
title: Wormhole Settlement FAQs
description: Frequently asked questions about Wormhole Settlement, including smart contract usage, auction fallback, and message execution. 
---

# Wormhole Settlement FAQs

## Can I use Wormhole Settlement from a smart contract? If so, how is a message signed and relayed?

Yes, Wormhole Settlement can be used from a smart contract. The composing protocol's relayer relays the message. For example, Mayan Shuttle (formerly Swap Layer) has a relayer that redeems the VAA on the destination chain to mint USDC and execute the `callData` contained in the payload.

## What happens if no solver participates in the auction?

If an auction does not start within the specified deadline, a standard CCTP transfer will proceed directly from the source chain to the destination chain. This is why parameters like `deadline` exist in the token router interface, ensuring a fallback mechanism in case no solver participates.

## What guarantees does CI provide for message execution?

After the user receives the token upfront, the execution of additional contract calls depends on the relayer of the composing protocol. For example, in Mayan Shuttle, the relayer will attempt the swap multiple times, but its success is subject to the parameters defined in the `callData` (e.g., slippage).

If the slippage tolerance is set too low, the user may receive USDC on the destination chain instead of the intended swap outcome. However, the four basis points (bps) fee is non-refundable, as the service provided by Liquidity Layer (LL) solvers (ensuring front-finality) is separate from the composing protocol's services, such as swaps or deposits.

