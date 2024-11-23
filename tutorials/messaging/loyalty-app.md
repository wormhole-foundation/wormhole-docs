---
title: Build a loyalty app with message transfers
description: Build a loyalty app that connects across networks, enabling seamless message transfers and unlocking unique user engagement opportunities.
---

<!-- need to properly style all the variables etc -->

# Build a loyalty app with message transfers 

## Introduction

This tutorial guides you through building a loyalty app that spans multiple blockchains, leveraging Wormhole's cross-chain messaging capabilities. The app will enable users to earn loyalty points across various blockchain-based marketplaces and manage their points on a governance layer powered by Sui. The tutorial focuses on sending and receiving cross-chain messages using Wormhole and provides insights into Sui and its Move programming language.

This tutorial aims to achieve the following:

- **Receive and send messages** - focus on the mechanics of transferring data between chains, with Sui as the source and recipient chains
- **Design a loyalty program** - create a program where users earn points across chains and transmit these points to Sui for centralized management and governance

The loyalty app assumes multiple business marketplaces operate on different blockchains. Each time a user purchases something on any of these chains, they earn points. These points are sent to Sui, which acts as a governance layer. The app ensures:

- Chains can inquire about a user’s available points
- Sui can notify all chains about user points

### Data handling 

The app processes data in the form of payloads to facilitate cross-chain communication. Incoming payloads sent to Sui include:

- **Points earned** - encoded as a BSC u64 (Binary Canonical Serialization)
- **User address** - represented as a UUID (Universally Unique Identifier). 

    !!!note
        Reusing addresses as unique identifiers across chains might pose risks of collisions, however it serves as a suitable example for this use case

- **Chain code** - omitted because the Wormhole message already includes the emitter's chain address and the sending function
- **Operation code** - specifies whether to add or remove points (0 for addition, 1 for removal)

Outgoing payloads from Sui contain:

- **Points to be deducted or transferred** - encoded as a BSC u64
- **User address** - represented as a UUID

## Libraries

The implementation relies on several libraries to handle blockchain interactions and message processing. For blockchain-specific functionalities, key libraries include:

- [move-stdlib](https://github.com/MystenLabs/sui/tree/main/crates/sui-framework/packages/move-stdlib){target=\_blank}
- [sui-frameworks](https://github.com/MystenLabs/sui/tree/main/crates/sui-framework/packages/sui-framework/sources){target=\_blank}
- [wormhole address and testnet](https://github.com/wormhole-foundation/wormhole/tree/sui-upgrade-testnet/sui){target=\_blank}

Additionally, tools for integrating with the blockchain and handling transactions include:

- @wormhole-foundation/sdk - install with `pnpm i @wormhole-foundation/sdk`
- @mysten/sui - install with `pnpm i @mysten/sui` to create transactions and interact with the chain

## Prerequisites

Before starting, ensure you have the following tools installed:

- Sui CLI - install the Sui CLI by following the [Sui installation guide](https://docs.sui.io/guides/developer/getting-started/sui-install){target=\_blank}
- Homebrew (MacOS) - install with `brew install sui`

## Build the Loyalty App

### Set-up your project 

Create a new project folder for your loyalty app and initialize a Sui Move contract template:

```sh
mkdir wormhole-sui
cd wormhole-sui
sui move new contracts
```

This command sets up the initial project structure, including the `move.toml` file and a basic contracts folder.

### Configure move.toml

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

The `vaa.move` module plays a crucial role in processing incoming Wormhole messages, also known as [VAAs (Verifiable Action Approvals)](/docs/learn/infrastructure/vaas/){target=\_blank}. The first step is to verify the VAA using the `parse_and_verify` function, which ensures the message is authentic and untampered. Once the VAA is verified, the `take_emitter_info_and_payload` function can be used to extract important details, such as the emitter's chain, address, and the message payload. These details help determine the origin and content of the message. Afterward, the payload must be deserialized to make it usable for the application’s logic.

The `publish_message.move` module facilitates sending messages from Sui to other chains. However, integrators are advised not to call the `publish_message` function directly in their contracts. Instead, the process involves two key steps. First, the `prepare_message` function creates a `MessageTicket`, which acts as a placeholder for the message you want to send. The ticket is then passed into `publish_message` within a transaction block, allowing the message to be emitted as a Sui event. This process also generates a unique sequence number for the emitter.

These modules together enable effective management of incoming and outgoing messages in cross-chain applications. The `vaa.move` module ensures that messages from other chains are verified and processed securely, while `publish_message.move` handles the seamless emission of messages from Sui to the Wormhole network.

## Implement the loyalty contract 

1. **Project structure and module naming**

    In Sui, a package represents a folder that contains the Move modules (`.move` files) you’ll write. Within the package, there’s a sources folder where these modules reside. Each module typically defines related functionality, and some may include test-only modules indicated by the `#[test_only]` attribute.

    For this project, navigate to `contracts/sources` and rename the default module file to make its purpose clear. For instance, rename `contracts.move` to `loyalty.move`. Then, update the module declaration to reflect the package and module name:

    ```
    module contracts::loyalty;
    ```

    - `contracts` - the name of the package (main folder)
    - `loyalty` - the name of the module (file)

    When deployed on-chain, the package name (`contracts`) will disappear, leaving the module name (`loyalty`) prefixed with the contract’s full address. For example, functions or structures in this module will be accessible using a path like `0x1234565aabb...::loyalty::function_name`.

2. **Import dependencies** - start by importing the necessary modules

    ```
    use sui::table::{Self, Table};
    ```

    This import provides access to the `Table` type, a mapping structure in Sui Move, which we’ll use to store user points. It also allows us to use the `Table` module’s associated functions.

3. **Define errors** - declare custom error codes that will be used throughout the contract

    ```
    const EInexistentUser: u64 = 1;
    const EWrongSigner: u64 = 2;
    ```

    ??? interface "Errors"

        `EInexistentUser` ++"u64"++

        This error will be triggered if a function attempts to interact with a non-existent user in the points table

        ---

        `EWrongSigner` ++"u64"++

        This error ensures only the admin can perform certain restricted actions, such as changing the admin address

4. **Defining the LoyaltyData struct** - the loyalty program revolves around the `LoyaltyData` shared object, which stores user points and admin information. Shared objects are accessible globally and can be passed as arguments in transactions, unlike owned objects, which are tied to specific addresses

    ```
    public struct LoyaltyData has key {
        id: UID,
        user_points: Table<vector<u8>, u64>,
        admin_address: address,
    }
    ```

    ??? interface "Parameters"

        `id` ++"UID"++

        A unique identifier for this object, automatically generated when created.

        ---

        `user_points` ++"Table<vector<u8>, u64>"++

        A mapping of user identifiers (as byte vectors) to their corresponding points (as u64 integers).

        ---

        `admin_address` ++"address"++

        The address of the admin who can manage this object.

    !!!note
        The `has key` attribute ensures that the struct can be stored on-chain as an object.

### Initializing the shared object

The `init` function creates the `LoyaltyData` object, initializes its fields, and registers it as a shared object that can be accessed globally.

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

### Admin management

The admin plays a critical role in managing the loyalty program. To ensure flexibility and security, the contract allows the admin to update their address if needed, such as in the case of a compromised private key.

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

### Adding and Removing Points

Managing loyalty points is a core function of the program. This is handled with two functions: one to add points and another to remove them.

The `add_points` function increases the loyalty points for a user. If the user already exists in the points table, their current points are retrieved, updated, and saved back into the table. If the user doesn’t exist yet, a new entry is created with the provided points value.

- Existing user - Check if the user is in the table, retrieve their current points, and increment the value by the specified amount
- New user - If the user doesn’t exist in the table, add them with the specified points

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
```

The `remove_points` function decreases the loyalty points for a user. It first ensures the user exists in the table. Then it retrieves their current points and deducts the specified amount. If the points to be removed exceed the user’s total, their points are set to zero.

- Validation - confirm the user exists in the table before proceeding
- Deduction - subtract points from the user’s total. If the requested deduction is larger than the current total, set the user’s points to zero


```
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

### Fetching user points

To enable other modules or users to query the number of loyalty points a user has, the contract includes a getter function.

```
public fun points(data: &LoyaltyData, user: vector<u8>): u64 {
    *data.user_points.borrow(user)
}
```

### Testing Support

During development and testing, initializing shared objects can be challenging. The contract provides a test-only function to initialize the `LoyaltyData` object.

```
#[test_only]
public fun init_for_tests(ctx: &mut TxContext) {
    init(ctx);
}
```

### Full loyalty.move code recap

Here is the complete code, now with all steps integrated:

```
#[allow(implicit_const_copy)]
module loyalty_contracts::loyalty;

use sui::table::{Self, Table};

// errors
const EInexistentUser: u64 = 1;
const EWrongSigner: u64 = 2;


public struct LoyaltyData has key {
    id: UID,
    user_points: Table<vector<u8>, u64>,
    admin_address: address,
}

fun init(ctx: &mut TxContext) {
    let data = LoyaltyData {
        id: object::new(ctx),
        user_points: table::new<vector<u8>, u64>(ctx),
        admin_address: ctx.sender(),
    };
    transfer::share_object(data);
}

public fun change_admin_address(
    data: &mut LoyaltyData,
    new_admin: address,
    ctx: &mut TxContext,
) {
    assert!(ctx.sender() == data.admin_address, EWrongSigner);
    data.admin_address = new_admin;
}

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

// getters
public fun points(data: &LoyaltyData, user: vector<u8>): u64 {
    *data.user_points.borrow(user)
}

#[test_only]
public fun init_for_tests(ctx: &mut TxContext) {
    init(ctx);
}
```

## Implementing the messages contract

Start by creating a new file in the `sources` directory called `messages.move`. This file will handle sending and receiving messages using Wormhole's functionality.

### Setup dependencies

At the top of the file, include the necessary imports for using Wormhole, handling payloads, and working with the loyalty contract:

```
module loyalty_contracts::messages;

use sui::bcs;
use sui::coin::Coin;
use sui::clock::Clock;
use sui::sui::SUI;

use wormhole::vaa::{Self, VAA};
use wormhole::state::State;
use wormhole::publish_message::{Self, MessageTicket};
use wormhole::emitter::EmitterCap;

use loyalty_contracts::loyalty::{Self, LoyaltyData};
```

Then add error codes:

```
const EInvalidPayload: u64 = 404;
const EInexistentOpCode: u64 = 407;
```

### Implement the receive_message Function

The `receive_message` function processes incoming messages by verifying their authenticity and extracting their payloads. It then updates the loyalty program’s state based on the operation code. <!-- add better description here-->

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

### Implement the new_message function

This function creates a new message containing user points and prepares it for sending via Wormhole. <!-- add better description here-->

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

### Implement helper functions

`prepare_payload` function constructs the payload for outgoing messages, which includes the user’s points and address.

```
fun prepare_payload(points: u64, user: vector<u8>): vector<u8> {
    let mut payload: vector<u8> = bcs::to_bytes(&points);
    vector::append(&mut payload, user);
    payload
}
```

`parse_payload` function decodes an incoming payload to extract its components.
```
fun parse_payload(mut payload: vector<u8>): (u8, u8, vector<u8>, u64) {
    let operation = vector::pop_back(&mut payload);
    let chain = vector::pop_back(&mut payload);
    let mut user_address: vector<u8> = vector[];
    let mut i = 0;
    while(i < 32) {
        vector::push_back(&mut user_address, vector::pop_back(&mut payload));
        i = i + 1;
    };
    vector::reverse(&mut user_address);

    // Ensure remaining payload contains exactly 8 bytes for the u64 points
    assert!(vector::length(&payload) == 8, EInvalidPayload);

    let mut amount_bcs = bcs::new(payload);
    let amount = amount_bcs.peel_u64();
    (operation, chain, user_address, amount)
}
```

### Include a Testing Method (Optional)

The `emit_message_` function is primarily for testing. It demonstrates how to directly send a message using Wormhole’s publish_message.

```
public fun emit_message_(
    wormhole_state: &mut State,
    message_fee: Coin<SUI>,
    clock: &Clock,
    data: &LoyaltyData,
    user: vector<u8>,
    nonce: u32,
    emitter_cap: &mut EmitterCap
) {
    let msg_ticket = new_message(data, user, nonce, emitter_cap);
    publish_message::publish_message(wormhole_state, message_fee, msg_ticket, clock);
}

```

### Full messages.move code

Here’s the complete file:

```
module loyalty_contracts::messages;

use sui::bcs;
use sui::coin::Coin;
use sui::clock::Clock;
use sui::sui::SUI;

use wormhole::vaa::{Self, VAA};
use wormhole::state::State;
use wormhole::publish_message::{Self, MessageTicket};
use wormhole::emitter::EmitterCap;

use loyalty_contracts::loyalty::{Self, LoyaltyData};

const EInvalidPayload: u64 = 404;
const EInexistentOpCode: u64 = 407;

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

// not suggested, useful_for tests
public fun emit_message_(
    wormhole_state: &mut State,
    message_fee: Coin<SUI>,
    clock: &Clock,
    data: &LoyaltyData,
    user: vector<u8>,
    nonce: u32,
    emitter_cap: &mut EmitterCap
) 
{
    let msg_ticket = new_message(data, user, nonce, emitter_cap);
    publish_message::publish_message(wormhole_state, message_fee, msg_ticket, clock);
}

// The emitted messages will contain the points a user has
fun prepare_payload(points: u64, user: vector<u8>): vector<u8> {
    let mut payload: vector<u8> = bcs::to_bytes(&points);
    vector::append(&mut payload, user);
    payload
}


// We expect a payload to be an array of u8 types
// The last element is the operation (spend or consume)
// Then the second to last is a u8 denoting the chain
// Next 32 u8's are the public key
// First 8 are bcs encoded u64 value of the points gained
fun parse_payload(mut payload: vector<u8>): (u8, u8, vector<u8>, u64) {
    let operation = vector::pop_back(&mut payload);
    let chain = vector::pop_back(&mut payload);
    let mut user_address: vector<u8> = vector[];
    let mut i = 0;
    while(i < 32) {
        vector::push_back(&mut user_address, vector::pop_back(&mut payload));
        i = i + 1;
    };
    // we wrote it backwards
    vector::reverse(&mut user_address);
    // We expect 8 u8s in the payload since a u64 encoded in bcs is 8 bytes.
    assert!(vector::length(&payload) == 8, EInvalidPayload);

    let mut amount_bcs = bcs::new(payload);
    let amount = amount_bcs.peel_u64();
    (operation, chain, user_address, amount)
}
```

```
```

```
```


<!-- ----- TRANSCRIPT ----- -->
<!-- messages.move -->


- receive_message method from messages.move
for receive_message im expecting to be given the raw_vaa which is the vector from before 
i will need the state and clock to be able to parse and verify
when we have the vector we call parse_and_verify with all the necessary arguments and we get the vaa
then we extrate the payload, we use take_payload but its suggested that u use take_emitter_info_and_payload in order to actuall do checks 
we're not doing any checks 

we expect to be getting an operations code, 0 add points 1 remove points 
for user we are using the public key of the user to identify it


- new_message method
how to create a new message 
msg will contain user address as bytes and amount of points 
amount of points is in data loyaltydata 
i get the points inside the table data.points
for every user im keeping their points
i create prepare_payload which returns a vector of bytes
then i publich message i use the wormhole publish_message::prepare_message to retunr the message ticket 
were supposed to use it in a ptb ?? and then call the publich message:: publich message from wormhole


at the end put the whole script messages.move

this is how u use sui move code that interacts with wormhole now we go over the full example


## web2

create a folder web2 at the same level of the contracts 

## utils.ts
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

## scripts.ts

in here the payload is hardcoded 
getting the vaa directly from wormhole

## costants.ts
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

