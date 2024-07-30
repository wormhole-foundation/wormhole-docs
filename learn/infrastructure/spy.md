---
title: SPY
description: Learn about Wormhole's SPY daemon, a tool for subscribing to gossiped messages in the Guardian Network, including VAAs and Observations, with setup instructions.
---

# SPY

In the wormhole context, a _spy_ is a daemon that subscribes to the gossiped messages in the Guardian Network.

The messages available over gossip are things like:

- [VAAs](#){target=\_blank} <!-- link to VAAs page -->
- [Observations](#){target=\_blank} <!-- link to glossary -->
- Guardian Heartbeats

The source for the Spy is available on [Github](https://github.com/wormhole-foundation/wormhole/blob/main/node/cmd/spy/spy.go){target=\_blank}

!!! note
    The Spy has no persistence layer built in, so typically, it is paired with something like Redis or an SQL database to record relevant messages

## Use

To start a Spy locally, run the following docker command.

=== "Testnet"

    ```sh
    docker run --platform=linux/amd64 \
        -p 7073:7073 \
        --entrypoint /guardiand ghcr.io/wormhole-foundation/guardiand:latest \
        spy \
        --nodeKey /node.key \
        --spyRPC "[::]:7073" \
        --env testnet
    ```
        Optionally, add the flags to skip any VAAs with invalid signatures
    ```sh
    --ethRPC https://sepolia.drpc.org/
    --ethContract 0x4a8bc80Ed5a4067f1CCf107057b8270E0cC11A78    
    ```

=== "Mainnet"

    ```sh
    docker run --platform=linux/amd64 \
        -p 7073:7073 \
        --entrypoint /guardiand ghcr.io/wormhole-foundation/guardiand:latest \
        spy \
        --nodeKey /node.key \
        --spyRPC "[::]:7073" \
        --env mainnet
    ```
    Optionally, add the flags to skip any VAAs with invalid signatures
    ```sh
    --ethRPC https://eth.drpc.org
    --ethContract 0x98f3c9e6E3fAce36bAAd05FE09d375Ef1464288B
    ```

Once running, a [gRPC](https://grpc.io/){target=\_blank} client (i.e. your program) can subscribe to a filtered stream of messages.

To generate a client for the gRPC service use [this proto spec file](https://github.com/wormhole-foundation/wormhole/blob/main/proto/spy/v1/spy.proto){target=\_blank}.

!!! note
    If using JavaScript/TypeScript, the [Spydk](https://www.npmjs.com/package/@certusone/wormhole-spydk){target=\_blank} makes setting up a client easier.

## See Also

The [Pyth Beacon](https://github.com/pyth-network/beacon){target=\_blank} provides an alternate Spy implementation that is highly available for improved performance and reliability.

The [relayer engine](https://github.com/wormhole-foundation/relayer-engine){target=\_blank} implements a client and persistence layer for messages received from a Spy subscription.