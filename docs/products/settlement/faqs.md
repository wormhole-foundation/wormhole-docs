---
title: Wormhole Settlement FAQs
description: Frequently asked questions about Wormhole Settlement, including smart contract usage, auction fallback, and message execution. 
categories: Settlement, Transfer
---

# Settlement FAQs

## Can I use Wormhole Settlement from a smart contract? If so, how is a message signed and relayed?

Yes, Wormhole Settlement can be used from a smart contract. The composing protocol's relayer relays the message. 

## What happens if no solver participates in the auction?

Mayan Swift uses a refund mechanism. If an auction does not start within the specified deadline, it means no solvers placed a bid, and the user's funds will be refunded on the source chain.

## What guarantees does Wormhole Settlement provide for message execution?

After the user receives the token upfront, the execution of additional contract calls depends on the relayer of the composing protocol. 