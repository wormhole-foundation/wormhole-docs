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

removed comments from move.toml
in our move.toml file we're gonna add these dependencies
replace with this code 

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
// rev by default it would be framework/testnet but we use the same revision as wormhole does to avoid errors when building

sui move build
to find out which revision wormhole uses [link](https://github.com/wormhole-foundation/wormhole/blob/sui-upgrade-testnet/sui/wormhole/Move.testnet.toml){target=\_blank}

then we build 
- cd contracts 
- sui move build
when we build the surces will be downloaded 

sources/messages.move
how u send a message
loyalty contracts > sources 
you can find in the sources dependencies downloaded 
we are going to be using the vaa a lot 
vaa.move 
you can check the module itself and check the comments 
really helpful 
parse_and_verify 
in the code we'll be using take_payload
in a production code you will get take_emitter_info_and_payload which gives u the emitter chain, emitter address and payload itself
what we actually get is a vector so we need parse_and_verify along with the state and the clock
parse_and_verify returns the vaa
once u have the vaa you call the take_emitter_info_and_payload with the vaa and you get the info that u actually need 
then u get the payload which u have to deserialize to use

one more thing we care about is publish_message.move
publish_message emits a message as a sui event 
`publish_message` emits a message as a Sui event. This method uses the input `EmitterCap` as the registered sender of the `WormholeMessage`. It also produces a new sequence for this emitter.

It is important for integrators to refrain from calling this method within their contracts. This method is meant to be called in a transaction block after receiving a `MessageTicket` from calling `prepare_message` within a contract. 

prepare_message is the methd we want, which will retunr a message ticket which is needed inside the publish_message
you call prepare_message get the result and put it inside publish_message

these are the main fnctions that we will use 

- receive_message method
for receive_message im expecting to be given the raw_vaa which is the vector from before 
i will need the state and clock to be able to parse and verify
when we have the vector we call parse_and_verify with all the necessary arguments and we get the vaa
then we extrate the payload, we use take_payload but its suggested that u use take_emitter_info_and_payload in order to actuall do checks 
we're not doing any checks 

we expect to be getting an operations code, 0 add points 1 remove points 
for user we are using the public key of the user to identify it

```
public fun receive_message (
    raw_vaa: vector<u8>,
    wormhole_state: &State,
    clock: &Clock,
    data: &mut LoyaltyData
)
{

    let vaa: VAA = vaa::parse_and_verify(wormhole_state, raw_vaa, clock);
    let payload = vaa::take_payload(vaa);
    let (op, _chain, user, amount) = parse_payload(payload);

    // gain points
    if (op == 0) {
        loyalty::add_points(data, user, amount);
    } 
    // use points
    else if (op == 1) {
       loyalty::remove_points(data, user, amount); 
    } else {
        abort(EInexistentOpCode)
    }

}
```

- new_message method
how to create a new message 
msg will contain user address as bytes and amount of points 
amount of points is in data loyaltydata 
i get the points inside the table data.points
for every user im keeping their points
i create prepare_payload which returns a vector of bytes
then i publich message i use the wormhole publish_message::prepare_message to retunr the message ticket 
were supposed to use it in a ptb ?? and then call the publich message:: publich message from wormhole

```
// suggested way is to call wormhole::publish_message::publish_message in a PTB
public fun new_message(
    data: &LoyaltyData,
    user: vector<u8>,
    nonce: u32,
    emitter_cap: &mut EmitterCap
): MessageTicket
{
    let payload = prepare_payload(data.points(user), user);
    publish_message::prepare_message(emitter_cap, nonce, payload)
}
```

at the end put the whole script messages.move

this is how u use sui move code that interacts with wormhole now we go over the full example


SO NOW WE START

so in Sui you have a a package which usually is indicated by a big a folder that contains usually a sources and contains a lot of move files which are called modules - some of them may be test modules and the test modules are indicated by a test_only above them 

we go to our file contacts/sources/contracts.move
we write the package name and module name 
we change the module name to make it more clear 
so we rename contracts.move to into.move

so our intro.move file now contains:

```
module contracts::intro;
```

where contracts is the name of the package (main folder) and intro the name of the module (our file)
when this gets publiched on chain the contracts will disappear and we'll get a full address
the intro will remain to be able to call functions
so it will be like 0x1234565aabb...::intro::function 
this would be the full path of any items inside the module, wether its a function or struct


- loyalty.move


we create a shared object LoyaltyData - in sui you have shared and known objects - known objects are inside addresses and shared objects are inside the global storage everyone can access them can can be inputted as arguments to a tx - owned objects can only be inputted as arguments to the transaction only by the address owner 
so we have LoyaltyData shared object 
we have admin address id and the user points - we are using a table which is the map with key of the user depending on the chain as a vector and amount of points u64

```
public struct LoyaltyData has key {
    id: UID,
    user_points: Table<vector<u8>, u64>,
    admin_address: address,
}
```

init function that crerates only one loyalty data and then shares it with transfer shareobject

```
fun init(ctx: &mut TxContext) {
    let data = LoyaltyData {
        id: object::new(ctx),
        user_points: table::new<vector<u8>, u64>(ctx),
        admin_address: ctx.sender(),
    };
    transfer::share_object(data);
}
```

function that allows me to change an admin - if my private key gets compromised i can change it to an uncompromised one and save the day

```
public fun change_admin_address(
    data: &mut LoyaltyData,
    new_admin: address,
    ctx: &mut TxContext,
) {
    assert!(ctx.sender() == data.admin_address, EWrongSigner);
    data.admin_address = new_admin;
}
```

add and remove points functions
public(package) means that this function cant be called - can only be called from another module inside the package 
HERE WE HAVE THE BASIC LOGIC on how i want to manipulate loyalty data

```
public(package) fun add_points(
    data: &mut LoyaltyData,
    user: vector<u8>,
    loyalty_points: u64,
) {
    if (loyalty_points > 0) {
        if(data.user_points.contains(user)) {
            *data.user_points.borrow_mut(user) = *data.user_points.borrow(user) + loyalty_points;
        } else {
            data.user_points.add(user, loyalty_points);
        };
    };
}

public(package) fun remove_points(
    data: &mut LoyaltyData,
    user: vector<u8>,
    loyalty_points: u64,
) {
    assert!(data.user_points.contains(user), EInexistentUser);
    let current_points = *data.user_points.borrow(user);
    if(current_points > loyalty_points) {
        *data.user_points.borrow_mut(user) = current_points - loyalty_points;
    } else {
        *data.user_points.borrow_mut(user) = 0;
    };
}
```

then we need some getters - how many points a user has 

```
// getters

public fun points(data: &LoyaltyData, user: vector<u8>): u64 {
    *data.user_points.borrow(user)
}


#[test_only]
public fun init_for_tests(ctx: &mut TxContext) {
    init(ctx);
}
```

```
```

```
```

```
```

```
```

```
```

```
```


## Resources 

[intro to move code](https://github.com/Eis-D-Z/wormhole_sui/tree/intro_branch){target=\_blank}

## Conclusion

