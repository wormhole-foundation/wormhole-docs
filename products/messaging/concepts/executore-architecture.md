---
title: Executor Architecture
description: TODO
categories: Basics
---
<!-- LINK IN PROTOCOLS/RELAYERS-->

# Executor Architecture

Purpose: Explain the on-chain/off-chain structure and how execution requests are processed.

detail design

Fundamentally, this design offers a re-imagining of servicing similar goals as Wormhole Relayers, namely:

A decentralized way to facilitate the delivery of verifiable messages
An on-chain API to request delivery of and receive messages
However, in an effort to drastically reduce costs for relayers, integrators, and end-users, as well as increase flexibility, the on-chain footprint will be significantly reduced.

No additional on-chain state required
Minimal on-chain verification for requests
Transparent off-chain quotes


Technical Details

Core components:

Relay Provider
...

Executor Contract
...


Lifecycle of a message delivery

Trust model & how it interacts with the Guardian network