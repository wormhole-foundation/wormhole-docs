---
title: Introduction
description: Learn how Wormhole enables cross-chain communication between smart contracts through theory and practical examples.
---

<!--
comments go here
-->

# Create Cross-Chain Contracts

## Introduction

This tutorial contains a solidity contract `HelloWormhole.sol` that can be deployed onto many EVM-compatible networks to form a fully functioning cross-chain application.

Specifically, we will write and deploy a contract on multiple chains that allows users to request a `GreetingReceived` event to be emitted on a _different chain_, all from a single contract.

This also allows users to pay for their custom greeting to be emitted on a chain that they do not have any gas funds for!
