---
title: Run a Spy
description: Learn how to run a Spy locally to listen for and forward messages (Verifiable Action Approvals, or VAAs) published on the Wormhole network.
---

# Run a Spy

## Introduction

The Spy is a lightweight component in the Wormhole infrastructure designed to listen for and forward messages (Verifiable Action Approvals (VAAs)) published on the Wormhole network. Running a Spy locally allows developers to subscribe to a filtered stream of these messages, facilitating the development of custom relayers or other integrations with Wormhole.

For a more comprehensive understanding of the Spy and its role within the Wormhole ecosystem, refer to the [Spy Documentation](/docs/learn/infrastructure/spy/){target=\_blank}.

## How to Start a Spy

To start a Spy locally, run the following Docker command:

=== "Mainnet"

    ```sh
    docker run --pull=always --platform=linux/amd64 \
        -p 7073:7073 \
        --entrypoint /guardiand ghcr.io/wormhole-foundation/guardiand:latest \
        spy \
        --nodeKey /node.key \
        --spyRPC "[::]:7073" \
        --env mainnet
    ```

=== "Testnet"

    ```sh
    docker run --pull=always --platform=linux/amd64 \
        -p 7073:7073 \
        --entrypoint /guardiand ghcr.io/wormhole-foundation/guardiand:latest \
        spy \
        --nodeKey /node.key \
        --spyRPC "[::]:7073" \
        --env testnet
    ```

If you want to run the spy built from source, change `ghcr.io/wormhole-foundation/guardiand:latest` to `guardian` after building the `guardian` image.

Optionally, add the following flags to skip any VAAs with invalid signatures:

=== "Mainnet"

    ```sh
    --ethRPC https://eth.drpc.org
    --ethContract 0x98f3c9e6E3fAce36bAAd05FE09d375Ef1464288B
    ```

=== "Testnet"

    ```sh
    --ethRPC https://sepolia.drpc.org/
    --ethContract 0x4a8bc80Ed5a4067f1CCf107057b8270E0cC11A78    
    ```

## Subscribe to Filtered VAAs

Once running, a [gRPC](https://grpc.io/){target=\_blank} client (i.e., your program) can subscribe to a filtered stream of messages (VAAs).

Use this [proto-spec file](https://github.com/wormhole-foundation/wormhole/blob/main/proto/spy/v1/spy.proto){target=\_blank} to generate a client for the gRPC service.

!!! note
    If using JavaScript/TypeScript, the [Spydk](https://www.npmjs.com/package/@certusone/wormhole-spydk){target=\_blank} makes setting up a client easier.

## Data Persistence

The Spy does not have a built-in persistence layer, so it is typically paired with something like Redis or an SQL database to record relevant messages.

The persistence layer needs to implement the appropriate interface. For example, you can check out the [Redis interface](https://github.com/wormhole-foundation/relayer-engine/blob/main/relayer/storage/redis-storage.ts){target=\_blank} used by the Relayer Engine, a package that implements a client and persistence layer for messages received from a Spy subscription.
