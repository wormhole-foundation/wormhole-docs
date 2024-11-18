---
title: Build a loyalty app with message transfers
description: Build a loyalty app that connects across networks, enabling seamless message transfers and unlocking unique user engagement opportunities.
---

# Build a loyalty app with message transfers 

## Introduction

Sui Workshop #2: End-to-End Example – Cross-chain Loyalty App

Sending and receiving messages from another chain

Join us for a hands-on session where we’ll build a loyalty app that spans multiple blockchains. Learn how to leverage cross-chain interoperability to enhance user experiences and unlock new business opportunities.

<!-- transcription -->

deeper dive on sui and move and how do you use the Wormhole part of the move 
first we cover the move part for who is new to that 
then we will cover the wormhole part 
the main focus will be how do you receive and send messages 
we'll explain how actually sui move works 

presentation:
Sending and receiving Wormhole messages

how does wormhole work? we can skip this part on the docs
wormhole facilitates messaging between two different blockchains
they also have some guarantees to make sure the message wasnt tampered with during transportation

on todays workshop we will assume that the source chain is sui 
dealing with receiving and sending messages 

The idea was to do a loyalty app project where we assume we have different busness marketpplaces on different chains 
and we want to start doing loyalty programs for our users
sui as a governance layer 
everytime on any chain a user buys something they will gain points
transmit a message to sui
every chain can ask sui or sui can inform everyone that x user has n many points available for spending

OUR FOCUS
receive messages on sui
send messages from sui

INCOMING PAYLOAD 
- BSC u64 representation of points earned - Binary Canonical Serialization (BCS) a binary encoding format for structured data - library is rust and sui has one as well that allows to serialize and deserialize - sui works really welll with BCS 
- user address as uuid (Universally Unique Identifier - 128-bit label) (vulnerability - if im using the user address in every chain there is a probability that two users can have the same address on different chains --> in this case I'm not sure how probable that is and if it's safe or not to use that as a as a unique identifier for your users across chains but in this case it was just suitable)
- chain code (not needed because whenever you get a VAA the emitter is present - address that sent it, chain that came from and fucntion that called it)
- operations code (0 - add or remove points)

OUTGOING PAYLOAD from sui
- BSC u64 representation of actual points 
- user address as uuid

LIBRARIES
WEB 3 8:44
- [move-stdlib](https://github.com/MystenLabs/sui/tree/main/crates/sui-framework/packages/move-stdlib){target=\_blank}
- [sui-frameworks](https://github.com/MystenLabs/sui/tree/main/crates/sui-framework/packages/sui-framework/sources){target=\_blank}
- [wormhole address and testnet](https://github.com/wormhole-foundation/wormhole/tree/sui-upgrade-testnet/sui){target=\_blank}

ISSUES
sui evolves too fast - code is a bit outdated

WEB2 LIBRARIES
- pnpm i @wormhole-foundation/sdk
- pnpm i @mysten/sui - to create transactions and show how to interact with the chain

ADDITIONAL EXAMPLES
- [sui example for sending tokens](https://github.com/wormhole-foundation/wormhole/tree/sui-upgrade-testnet/sui/examples){target=\_blank}

CODE REPOSITORY
- [TUTORIAL REPO](https://github.com/Eis-D-Z/wormhole_sui){target=\_blank}


## Prerequisites

- sui cli installed [install sui](https://docs.sui.io/guides/developer/getting-started/sui-install){target=\_blank}
- brew install sui

## Tutorial

create folder, navigate to it 

- mkdir wormhole-sui
- cd wormhole-sui
- sui move new contracts

it will create a folder and we'll have almost everything ready

- removed comments from move.toml

in our move.toml file we're gonna add these dependencies

```
[package]
name = "loyalty_contracts"
edition = "2024.beta" # edition = "legacy" to use legacy (pre-2024) Move
# license = ""           # e.g., "MIT", "GPL", "Apache 2.0"
# authors = ["..."]      # e.g., ["Joe Smith (joesmith@noemail.com)", "John Snow (johnsnow@noemail.com)"]

[dependencies.Sui]
git = "https://github.com/MystenLabs/sui.git"
subdir = "crates/sui-framework/packages/sui-framework"
rev = "041c5f2bae2fe52079e44b70514333532d69f4e6"

[dependencies.Wormhole]
git = "https://github.com/wormhole-foundation/wormhole.git"
subdir = "sui/wormhole"
rev = "sui-upgrade-testnet"

[addresses]
loyalty_contracts = "0x0"
```


## Resources 

## Conclusion

