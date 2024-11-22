---
title: Build a loyalty app with message transfers
description: Build a loyalty app that connects across networks, enabling seamless message transfers and unlocking unique user engagement opportunities.
---

# Build a loyalty app with message transfers 

## Introduction

### Overview 

In this tutorial, we will build a loyalty app that spans multiple blockchains, leveraging Wormhole's cross-chain messaging capabilities. The app will enable users to earn loyalty points across various blockchain-based marketplaces and manage their points on a governance layer powered by Sui. By the end of this tutorial, you'll understand how to send and receive cross-chain messages using Wormhole and gain insights into Sui and its Move programming language.

### Objectives

- Receive and send messages - focus on the mechanics of transferring data between chains, with Sui as the source and recipient
- Design a loyalty program - create a program where users earn points across chains and transmit these points to Sui for centralized management and governance

### Application Context

The loyalty app assumes multiple business marketplaces operate on different blockchains. Each time a user purchases something on any of these chains, they earn points. These points are sent to Sui, which acts as a governance layer. The app ensures:

- Chains can inquire about a user’s available points
- Sui can notify all chains about user points

## Data Handling 

Incoming Payload (to Sui)

- Points earned - encoded as a BSC u64 (Binary Canonical Serialization)
- User address - represented as a UUID (Universally Unique Identifier). While reusing addresses as unique identifiers across chains might pose risks of collisions, it serves as a suitable example for this use case
- Chain code - omitted because the Wormhole message already includes the emitter's chain address and the sending function
- Operation code - specifies whether to add or remove points (0 for addition, 1 for removal)

Outgoing Payload (from Sui)

- Points to be deducted or transferred - encoded as a BSC u64
- User address - represented as a UUID

<!-- transcription -->

## Libraries

### Web3 libraries 

- [move-stdlib](https://github.com/MystenLabs/sui/tree/main/crates/sui-framework/packages/move-stdlib){target=\_blank}
- [sui-frameworks](https://github.com/MystenLabs/sui/tree/main/crates/sui-framework/packages/sui-framework/sources){target=\_blank}
- [wormhole address and testnet](https://github.com/wormhole-foundation/wormhole/tree/sui-upgrade-testnet/sui){target=\_blank}

### Web2 libraries 

- @wormhole-foundation/sdk - install with `pnpm i @wormhole-foundation/sdk`
- @mysten/sui - install with `pnpm i @mysten/sui` to create transactions and interact with the chain

## Prerequisites

Before starting, ensure you have the following tools installed:

- Sui CLI - install the Sui CLI by following the [Sui installation guide](https://docs.sui.io/guides/developer/getting-started/sui-install){target=\_blank}
- Homebrew (MacOS) - install with `brew install sui`

## Building the Loyalty App

### Setting up your project 

Create a new project folder for your loyalty app and initialize a Sui Move contract template:

```sh
mkdir wormhole-sui
cd wormhole-sui
sui move new contracts
```

This command sets up the initial project structure, including the `move.toml` file and a basic contracts folder.

### Configuring move.toml

Update your `move.toml` file to include the necessary dependencies. Replace the default content with the following:

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

!!! note
    The revision (`rev`) for Wormhole dependencies is set to match Wormhole’s sui-upgrade-testnet branch. This ensures compatibility when building the project. For the latest revision, refer to the [Move.testnet.toml](https://github.com/wormhole-foundation/wormhole/blob/sui-upgrade-testnet/sui/wormhole/Move.testnet.toml){target=\_blank} 

### Build your project 

Navigate to the contracts folder and build the project:

```sh
cd contracts
sui move build
```
Building the project downloads the necessary dependencies and prepares the source files. You can now find downloaded dependencies in the `sources` folder.

### Key Wormhole modules in use

Wormhole’s Move modules provide the core functionality for handling cross-chain messages. Two key modules are essential for this process: `vaa.move`, which is used to verify and extract information from incoming messages, and `publish_message.move`, which facilitates sending messages from Sui to other chains.

The `vaa.move` module plays a crucial role in processing incoming Wormhole messages, also known as VAAs (Verifiable Action Approvals). The first step is to verify the VAA using the `parse_and_verify` function, which ensures the message is authentic and untampered. Once the VAA is verified, the `take_emitter_info_and_payload` function can be used to extract important details, such as the emitter's chain, address, and the message payload. These details allow your application to understand the origin and content of the message. Afterward, the payload must be deserialized to make it usable for the application’s logic.

On the other hand, the `publish_message.move` module is used for sending messages from Sui to other chains. However, integrators are advised not to call the `publish_message` function directly in their contracts. Instead, the process involves two key steps. First, the `prepare_message` function is used to create a `MessageTicket`, which acts as a placeholder for the message you want to send. Once you have the ticket, it can be passed into `publish_message` within a transaction block, allowing the message to be emitted as a Sui event. This process also generates a unique sequence number for the emitter.

By combining these modules, you can effectively manage both incoming and outgoing messages in your cross-chain application. The `vaa.move` module ensures that messages from other chains are verified and processed securely, while `publish_message.move` handles the seamless emission of messages from Sui to the Wormhole network.


<!-- ----- TRANSCRIPT ----- -->


<!-- START -->
SO NOW WE START

so in Sui you have a a package which usually is indicated by a big a folder that contains usually a sources and contains a lot of move files which are called modules - some of them may be test modules and the test modules are indicated by a test_only above them 

we go to our file contacts/sources/contracts.move
we write the package name and module name 
we change the module name to make it more clear 
so we rename contracts.move to into.move

so our loyalty.move file now contains:

```
module contracts::loyalty;
```

where contracts is the name of the package (main folder) and intro the name of the module (our file)
when this gets publiched on chain the contracts will disappear and we'll get a full address
the intro will remain to be able to call functions
so it will be like 0x1234565aabb...::intro::function 
this would be the full path of any items inside the module, wether its a function or struct

<!-- loyalty.move -->

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

*data.user_points.borrow_mut(user) = *data.user_points.borrow(user) + loyalty_points; how we change the value on a table 
otherwise we add to the table a new user data.user_points.add(user, loyalty_points);

remove points same idea but we asser that the user indeed exists 


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

<!-- messages.move -->

sources/messages.move
how u send a message 

we create another file messages.move 
then we go to messages.move 

- receive_message method from messages.move
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

<!-- web2 part -->

create a folder web2 at the same level of the contracts 

<!-- utils.ts -->
utils.ts creates a signer 
you will need an environment .env for the private key

create a new private key with new-address Generate new address and keypair with keypair 

once u install sui  to find your keys 

```
cat ~/.sui/sui_config/sui.keystore
```

```
sui keytool convert -b64 string-
```
use suiprivkey

<!-- scripts.ts -->

in here the payload is hardcoded 
getting the vaa directly from wormhole

<!-- contants.ts -->
the users and all of that are inside costants 
you need to use your own solana public key and will have to create an emitter cap 
the code on how to create that is in scripts.ts getEmitterCap - u can create as many as u want but one is enough 
after u got it check the response and put the address of the item in the var  

to get package id
```
sui client publish --skip-dependency-verification
```

<!-- for web2 theres also a package.json and pnpm-lock.yaml files not sure how to get those-->


## Resources 

- [intro to move code](https://github.com/Eis-D-Z/wormhole_sui/tree/intro_branch){target=\_blank}

ADDITIONAL EXAMPLES
- [sui example for sending tokens](https://github.com/wormhole-foundation/wormhole/tree/sui-upgrade-testnet/sui/examples){target=\_blank}

CODE REPOSITORY <!-- to be changed with our repo -->
- [TUTORIAL REPO](https://github.com/Eis-D-Z/wormhole_sui){target=\_blank}

## Conclusion

