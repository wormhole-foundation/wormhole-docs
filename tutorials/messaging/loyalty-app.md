---
title: Build a loyalty app with message transfers
description: Build a loyalty app that connects across networks, enabling seamless message transfers and unlocking unique user engagement opportunities.
---

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

## Prerequisites

Before starting, ensure you have the following tools installed:

- Sui CLI - install the Sui CLI by following the [Sui installation guide](https://docs.sui.io/guides/developer/getting-started/sui-install){target=\_blank}
- @wormhole-foundation/sdk - install with `pnpm i @wormhole-foundation/sdk`
- @mysten/sui - install with `pnpm i @mysten/sui` to create transactions and interact with the chain

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

```toml
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

### Set-up 

1. **Project structure and module naming**

    In Sui, a package represents a folder that contains the Move modules (`.move` files) you’ll write. Within the package, there’s a sources folder where these modules reside. Each module typically defines related functionality, and some may include test-only modules indicated by the `#[test_only]` attribute.

    For this project, navigate to `contracts/sources` and rename the default module file to make its purpose clear. For instance, rename `contracts.move` to `loyalty.move`. Then, update the module declaration to reflect the package and module name:

    ```move
    module contracts::loyalty;
    ```

    - `contracts` - the name of the package (main folder)
    - `loyalty` - the name of the module (file)

    When deployed on-chain, the package name (`contracts`) will disappear, leaving the module name (`loyalty`) prefixed with the contract’s full address. For example, functions or structures in this module will be accessible using a path like `0x1234565aabb...::loyalty::function_name`.

2. **Import dependencies** - start by importing the necessary modules

    ```move
    use sui::table::{Self, Table};
    ```

    This import provides access to the `Table` type, a mapping structure in Sui Move, which we’ll use to store user points. It also allows us to use the `Table` module’s associated functions.

3. **Define errors** - declare custom error codes that will be used throughout the contract

    ```move
    const EInexistentUser: u64 = 1;
    const EWrongSigner: u64 = 2;
    ```

    ??? interface "Errors"

        `EInexistentUser` ++"u64"++

        This error will be triggered if a function attempts to interact with a non-existent user in the points table

        ---

        `EWrongSigner` ++"u64"++

        This error ensures only the admin can perform certain restricted actions, such as changing the admin address

4. **Define the LoyaltyData struct** - the loyalty program revolves around the `LoyaltyData` shared object, which stores user points and admin information. Shared objects are accessible globally and can be passed as arguments in transactions, unlike owned objects, which are tied to specific addresses

    ```move
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

### Define functions

1. **Initialize the shared object** - the `init` function creates the `LoyaltyData` object, initializes its fields, and registers it as a shared object that can be accessed globally

    ```move
    fun init(ctx: &mut TxContext) {
        let data = LoyaltyData {
            id: object::new(ctx),
            user_points: table::new<vector<u8>, u64>(ctx),
            admin_address: ctx.sender(),
        };
        transfer::share_object(data);
    }
    ```

    ??? interface "Parameters"

        `ctx` ++"&mut TxContext"++

        The transaction context used to create and initialize the shared `LoyaltyData` object.  

    ??? interface "Emits"

        `LoyaltyData` ++"Shared Object"++

        The initialized `LoyaltyData` object, registered as a shared object in the global storage.

2. **Admin management** - the admin plays a critical role in managing the loyalty program. To ensure flexibility and security, the contract allows the admin to update their address if needed, such as in the case of a compromised private key.

    ```move
    public fun change_admin_address(
        data: &mut LoyaltyData,
        new_admin: address,
        ctx: &mut TxContext,
    ) {
        assert!(ctx.sender() == data.admin_address, EWrongSigner);
        data.admin_address = new_admin;
    }
    ```

    ??? interface "Parameters"

        `data` ++"&mut LoyaltyData"++  

        The mutable reference to the `LoyaltyData` shared object where the admin address will be updated.  

        ---

        `new_admin` ++"address"++  

        The new address to set as the admin for the `LoyaltyData` object.  

        ---

        `ctx` ++"&mut TxContext"++  

        The transaction context used to validate the sender's address and execute the admin change.  

    The function updates the `admin_address` field of the `LoyaltyData` object to the provided `new_admin` address.

### Define application logic 

1. **Add and remove points** - managing loyalty points is a core function of the program. This is handled with two functions: one to add points and another to remove them. 

    - The `add_points` function increases the loyalty points for a user. If the user already exists in the points table, their current points are retrieved, updated, and saved back into the table. If the user doesn’t exist yet, a new entry is created with the provided points value

        - Existing user - Check if the user is in the table, retrieve their current points, and increment the value by the specified amount
        - New user - If the user doesn’t exist in the table, add them with the specified points

        ```move
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

        ??? interface "Parameters"

            `data` ++"&mut LoyaltyData"++  

            The mutable reference to the `LoyaltyData` shared object where the user's points are stored and updated.  

            ---

            `user` ++"vector<u8>"++  

            The identifier for the user, represented as a byte vector, used as the key in the points table.  

            ---

            `loyalty_points` ++"u64"++  

            The number of loyalty points to add to the user's account.  


        The function updates the `user_points` table in the `LoyaltyData` object, either incrementing the points for an existing user or adding a new entry for a new user.  

    - The `remove_points` function decreases the loyalty points for a user. It first ensures the user exists in the table. Then it retrieves their current points and deducts the specified amount. If the points to be removed exceed the user’s total, their points are set to zero.

        - Validation - confirm the user exists in the table before proceeding
        - Deduction - subtract points from the user’s total. If the requested deduction is larger than the current total, set the user’s points to zero

        ```move
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

        ??? interface "Parameters"

            `data` ++"&mut LoyaltyData"++  

            The mutable reference to the `LoyaltyData` shared object where the user's points are stored and updated.  

            ---

            `user` ++"vector<u8>"++  

            The identifier for the user, represented as a byte vector, used as the key in the points table.  

            ---

            `loyalty_points` ++"u64"++  

            The number of loyalty points to remove from the user's account.  

        The function updates the `user_points` table in the `LoyaltyData` object, decrementing the user's points or setting the points to zero if the specified amount exceeds the current balance.  

2. **Fetch user points** - to enable other modules or users to query the number of loyalty points a user has, the contract includes a getter function

    ```move
    public fun points(data: &LoyaltyData, user: vector<u8>): u64 {
        *data.user_points.borrow(user)
    }
    ```

    ??? interface "Parameters"

        `data` ++"&LoyaltyData"++  

        The reference to the `LoyaltyData` shared object from which the user's points will be retrieved.  

        ---

        `user` ++"vector<u8>"++  

        The identifier for the user, represented as a byte vector, used as the key in the points table.  


### Testing Support

During development and testing, initializing shared objects can be challenging. The contract provides a test-only function to initialize the `LoyaltyData` object.

```move
#[test_only]
public fun init_for_tests(ctx: &mut TxContext) {
    init(ctx);
}
```

### Full loyalty.move code recap

Find the complete code for `loyalty.move` below:

??? code "loyalty.move"

    ```move
    --8<-- "code/tutorials/messaging/loyalty/loyalty.move"
    ```

## Implement the messages contract

This section focuses on the `messages` module, designed to handle cross-chain messaging in the loyalty app using Wormhole. The module includes functions for processing incoming messages, creating new messages, and managing payloads. It is central to blockchain interoperability by securely transmitting and receiving loyalty program data.

This section provides explanations of:

- **Receiving messages** - validating and processing incoming Wormhole messages to update loyalty data on Sui
- **Creating messages** - generating and preparing outgoing messages that contain user data and points
- **Payload management** - encoding and decoding message payloads for seamless communication between chains

Start by creating a new file in the `sources` directory called `messages.move`. This file will handle sending and receiving messages using Wormhole's functionality.

### Set-up

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

??? interface "Imports"

    `sui::bcs`  

    Provides functions for encoding and decoding data in Binary Canonical Serialization (BCS), used for structuring payloads in messages.  

    ---

    `sui::coin::Coin`  

    Enables interaction with the native SUI coin, which is used for handling message fees when publishing messages.  

    ---

    `sui::clock::Clock`  

    Provides access to the current blockchain time, which is necessary for validating Wormhole messages.  

    ---

    `sui::sui::SUI`  

    Represents the SUI token, used in operations that involve fees or transactions.  

    ---

    `wormhole::vaa::{Self, VAA}`  

    Imports Wormhole's Verifiable Action Approval (VAA) module, which provides tools for verifying, parsing, and interacting with messages received through Wormhole.  

    ---

    `wormhole::state::State`  

    Represents Wormhole's state object, which is used for validating messages and managing the Wormhole contract state.  

    ---

    `wormhole::publish_message::{Self, MessageTicket}`  

    Provides functions for creating and publishing Wormhole messages, including the `MessageTicket` type for representing prepared messages.  

    ---

    `wormhole::emitter::EmitterCap`  

    Represents the authorization needed to emit messages from this module using Wormhole.  

    ---

    `loyalty_contracts::loyalty::{Self, LoyaltyData}`  

    Imports the loyalty module and the `LoyaltyData` struct to interact with the loyalty program’s state.  



Then add error codes:

```
const EInvalidPayload: u64 = 404;
const EInexistentOpCode: u64 = 407;
```

??? interface "Errors"

    `EInvalidPayload` ++"404"++  

    Indicates that the provided payload is malformed or does not match the expected format.  

    ---

    `EInexistentOpCode` ++"407"++  

    Indicates that the operation code extracted from the payload is invalid or unsupported.  


### Define the receive_message function

The `receive_message` function handles incoming Wormhole messages by verifying their validity and extracting the contained payload. This payload is used to update the loyalty program's state based on the specified operation code.

- **Inputs and verification** - the function expects a raw VAA (Verifiable Action Approval) as a binary vector (`vector<u8>`), the Wormhole state, and the current blockchain clock. These inputs are passed to `vaa::parse_and_verify`, which validates the VAA's authenticity and integrity. If the VAA is valid, it is returned as a structured object
- **Extracting the payload** - the payload is extracted using `vaa::take_payload`, which retrieves the core message data. While this function directly extracts the payload, `vaa::take_emitter_info_and_payload` should be used for additional checks, such as validating the emitter's address and chain. No such checks are performed in this implementation
- **Decoding the payload** - the extracted payload is parsed into its components using `parse_payload`. This function splits the payload into:
    - **Operation code (op)** - indicates the action to perform (0 for adding points, 1 for removing points)
    - **User identifier** - the user's public key, represented as a byte vector, is used as their unique identifier
    - **Amount** - the number of loyalty points involved in the operation
- **Performing the operation** - based on the operation code:
    - For 0, the points are added to the user's account using `loyalty::add_points`
    - For 1, the points are removed using `loyalty::remove_points`
    - If the operation code is invalid, the function aborts with `EInexistentOpCode`

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

??? interface "Parameters"

    `raw_vaa` ++"vector<u8>"++  

    The raw Wormhole message (VAA) in binary format, containing the encoded payload and metadata.  

    ---

    `wormhole_state` ++"&State"++  

    A reference to the Wormhole state object, used to verify the VAA’s authenticity.  

    ---

    `clock` ++"&Clock"++  

    A reference to the blockchain’s current time, used for message validation.  

    ---

    `data` ++"&mut LoyaltyData"++  

    A mutable reference to the `LoyaltyData` shared object, which stores the loyalty program’s user data.  

This function updates the `LoyaltyData` object based on the operation code in the payload. For `0`, points are added to the user’s account; for `1`, points are removed.  

### Define the new_message function

This function creates a new message containing user points and prepares it for sending via Wormhole. <!-- add better description here-->

The `new_message` function generates a Wormhole message containing the user's points and prepares it for transmission. This function integrates with Wormhole's `publish_message` module to create a `MessageTicket`, representing the message in a structured format. The function is designed to be used within a transaction block (PTB) to ensure proper message publishing.

- **Data preparation** - the function retrieves the user's current points from the `LoyaltyData` object using the `data.points(user)` method. This ensures that the message reflects the most up-to-date information about the user's points
- **Payload creation** - the `prepare_payload` helper function encodes the user's points and address into a binary format (`vector<u8>`), which serves as the message's payload
- **Message ticket creation** - the payload, along with the emitter capability (`EmitterCap`) and a nonce for unique identification, is passed to Wormhole's `publish_message::prepare_message` function. This step returns a M`essageTicket`, which encapsulates the message data and metadata required for publishing
- **Publishing messages** - while `new_message` creates the `MessageTicket`, the actual message broadcasting should be performed using `publish_message::publish_message` in a transaction block.

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

??? interface "Parameters"

    `data` ++"&LoyaltyData"++  

    A reference to the `LoyaltyData` shared object, containing user points and related data.  

    ---

    `user` ++"vector<u8>"++  

    The identifier of the user, represented as a byte vector, whose points will be included in the message.  

    ---

    `nonce` ++"u32"++  

    A unique value used to identify the message and ensure it is not duplicated.  

    ---

    `emitter_cap` ++"&mut EmitterCap"++  

    A mutable reference to the Wormhole emitter capability, which authorizes the contract to emit messages.  

??? interface "Returns"

    `MessageTicket`  

    A structured object representing the prepared message, ready for publishing through Wormhole.  


### Implement helper functions

- The `prepare_payload` function constructs a binary payload for outgoing messages. The payload includes the user’s points and address, ensuring the message contains all necessary information for the receiving chain.

    ```
    fun prepare_payload(points: u64, user: vector<u8>): vector<u8> {
        let mut payload: vector<u8> = bcs::to_bytes(&points);
        vector::append(&mut payload, user);
        payload
    }
    ```

    ??? interface "Parameters"

        `points` ++"u64"++  

        The user’s points to include in the message payload.  

        ---

        `user` ++"vector<u8>"++  

        The user’s address, represented as a byte vector, to include in the message payload.  

    ??? interface "Returns"

        `vector<u8>`  

        A binary representation of the payload, including the user’s points and address.  

- The `parse_payload` function decodes an incoming payload to extract its components. This includes the operation code, chain identifier, user address, and points. It ensures that the payload matches the expected format and structure.

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

    ??? interface "Parameters"

        `payload` ++"vector<u8>"++  

        The raw binary payload to be decoded, containing the operation code, chain ID, user address, and points.  

    ??? interface "Returns"

        `operation` ++"u8"++  

        The operation code indicating the action (`0` for adding points, `1` for removing points).  

        ---

        `chain` ++"u8"++  

        The chain identifier from which the message originated.  

        ---

        `user_address` ++"vector<u8>"++  

        The user’s address, represented as a byte vector.  

        ---

        `amount` ++"u64"++  

        The number of points included in the message.  

### Include a testing method (Optional)

The `emit_message_` function is primarily for testing. It demonstrates how to directly send a message using Wormhole’s `publish_message` functionality. This method integrates the creation of a `MessageTicket` through the `new_message` function and completes the process by publishing the message to Wormhole within the same function.

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

??? interface "Parameters"

    `wormhole_state` ++"&mut State"++  

    A mutable reference to the Wormhole state object, required for managing the contract’s state and validating the message.  

    ---

    `message_fee` ++"Coin<SUI>"++  

    The fee paid in SUI tokens to cover the cost of publishing the message.  

    ---

    `clock` ++"&Clock"++  

    A reference to the blockchain’s current time, required for message validation.  

    ---

    `data` ++"&LoyaltyData"++  

    A reference to the `LoyaltyData` shared object containing user data and loyalty points.  

    ---

    `user` ++"vector<u8>"++  

    The identifier of the user, represented as a byte vector, whose points are included in the message.  

    ---

    `nonce` ++"u32"++  

    A unique number that identifies the message and ensures no duplicate messages are processed.  

    ---

    `emitter_cap` ++"&mut EmitterCap"++  

    A mutable reference to the Wormhole emitter capability, used to authorize the message emission.  


### Full messages.move code recap

Find the complete code for `messages.move` below:

??? code "loyalty.move"

    ```move
    --8<-- "code/tutorials/messaging/loyalty/messages.move"
    ```


## Web2 Integration

The Web2 layer enables interaction with the blockchain and Wormhole from a Node.js environment. This section demonstrates how to set up the environment, manage dependencies, and execute key operations such as sending messages, receiving VAAs, and updating contracts.

### Environment Setup

1. **Dependencies** - initialize the Web2 folder and install dependencies at the same level of the loyalty contracts folder
    ```sh
    mkdir web2 && cd web2
    pnpm init
    pnpm install @mysten/sui @wormhole-foundation/sdk bs58 dotenv
    ```

2. **Environment variables** - create a `.env` file to securely store sensitive information, such as the private key. Example `.env` file:
    ```
    secretKey="YOUR_PRIVATE_SUI_KEY"
    ```
    <!-- need to come back to this -->

After Installing the dependencies you should have a `package.json` and a `pnpm-lock.yaml`. Now in that same folder we will create three typescript files:  

- `constants.ts` - to define constants such as package IDs and public keys
- `utils.ts` - to provide utility functions, such as signing transactions
- `scripts.ts` -  to contain the main functions for sending and receiving messages

### Scripts

This section walks through the creation of the three main files in the Web2 layer: `constants.ts`, `scripts.ts`, and `utils.ts`. These files contain configuration, utility functions, and logic for interacting with the blockchain and Wormhole.

- `constants.ts` - this file defines constants such as package IDs, public keys, and object references required for the application. These constants are used throughout the Web2 layer to identify contracts, emitters, and users

    ```ts
    --8<-- "code/tutorials/messaging/loyalty/constants.ts"
    ```

    ??? interface "Parameters"

        `STATE_OBJ` ++"string"++  

        Represents the state object of the Sui contract, used to maintain the application's state.  

        ---

        `WORMHOLE_PKG_ID` ++"string"++  

        The Wormhole package ID, required to access Wormhole-specific modules for messaging and interaction.  

        ---

        `PKG_ID` ++"string"++  

        The package ID for the deployed loyalty app contracts. This must be updated with your own package ID obtained from the Sui client after deployment.  

        ---

        `DATA_OBJ` ++"string"++  

        The object reference to the shared `LoyaltyData` object within the Sui contract.  

        ---

        `EMITTER_CAP` ++"string"++  

        The reference to the emitter capability created through Wormhole, which enables the emission of messages.  

        ---

        `SOLANA_PUBLIC_KEY` ++"Array<number>"++  

        The Solana public key to which messages are sent, represented as an array of bytes. Update this with your own Solana public key.  

    !!!important
        To get your package ID, run:
        ```sh
        sui client publish --skip-dependency-verification
        ```
        
        ---

        To create an `EMITTER_CAP`, use the `getEmitterCap` function in `scripts.ts`. After you do, check the response and use the address of the item for the variable.

        ---

        To find the `DATA_OBJ`, inspect the object changes in the response when deploying the `LoyaltyData` shared object in your Sui contract. This object reference represents the shared `LoyaltyData` instance used to manage user points.

- `utils.ts`

    ```ts
    --8<-- "code/tutorials/messaging/loyalty/utils.ts"
    ```

??? code "scripts.ts"
    ```ts
    --8<-- "code/tutorials/messaging/loyalty/scripts.ts"
    ```

<!-- ----- TRANSCRIPT ----- -->


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


<!-- for web2 theres also a package.json and pnpm-lock.yaml files not sure how to get those-->

## Resources 

- [Introduction to move code](https://github.com/Eis-D-Z/wormhole_sui/tree/intro_branch){target=\_blank}
- [Sui example for sending tokens](https://github.com/wormhole-foundation/wormhole/tree/sui-upgrade-testnet/sui/examples){target=\_blank}
- [TUTORIAL REPO](https://github.com/Eis-D-Z/wormhole_sui){target=\_blank} <!-- to be changed with our repo -->

## Conclusion

