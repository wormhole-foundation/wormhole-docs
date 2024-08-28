---
title: Run a Relayer
description: Develop and run a Wormhole relayer using the Relayer Engine. Guide to setup, message filtering, and processing across chains with the Wormhole network.
---

# Run a Relayer

## Introduction

The `relayer-engine` is a package that provides the structure and a starting point for a custom relayer.

With the Relayer Engine, a developer can write specific logic for filtering to receive only the messages they care about.

Once a Wormhole message is received, the developer may apply additional logic to parse custom payloads or submit the Verifiable Action Approvals (VAA) to one or many destination chains.

To use the Relayer Engine, a developer may specify how to relay Wormhole messages for their app using an idiomatic Express/Koa middleware-inspired API, then let the library handle all the details!

## Quick Start

### Install Package

First, install the `relayer-engine` package with your favorite package manager:

```bash
npm i @wormhole-foundation/relayer-engine
```

### Start Background Processes

!!! note
    These processes _must_ be running for the relayer app below to work.

Next, you must start a Spy to listen for available VAAs published on the Guardian network. You also need a persistence layer. In this case, we're using Redis.

More details about the Spy are available in the [Spy Documentation](/learn/infrastructure/spy){target=\_blank}.

#### Wormhole Network Spy

For our relayer app to receive messages, a local Spy must be running that watches the Guardian network. Our relayer app will receive updates from this Spy.

=== "TestNet Spy"

    ```bash
    docker run --platform=linux/amd64 \
    -p 7073:7073 \
    --entrypoint /guardiand ghcr.io/wormhole-foundation/guardiand:latest \
    spy \
    --nodeKey /node.key \
    --spyRPC "[::]:7073" \
    --env testnet   
    ```

=== "MainNet Spy"

    ```bash
    docker run --platform=linux/amd64 \
    -p 7073:7073 \
    --entrypoint /guardiand ghcr.io/wormhole-foundation/guardiand:latest \
    spy \
    --nodeKey /node.key \
    --spyRPC "[::]:7073" \
    --env mainnet
    ```

#### Redis Persistence

!!! note
    While you're using [Redis](https://redis.io/docs/latest/develop/get-started/){target=\_blank} here, the persistence layer can be swapped out for some other database by implementing the appropriate [interface](https://github.com/wormhole-foundation/relayer-engine/blob/main/relayer/storage/redis-storage.ts){target=\_blank}.

A Redis instance must also be available to persist job data for fetching VAAs from the Spy.

```bash
docker run --rm -p 6379:6379 --name redis-docker -d redis
```

## Relayer Code Example

In the following example, you'll:

1. Set up a `StandardRelayerApp`, passing configuration options for our relayer
2. Add a filter to capture only those messages our app cares about, with a callback to do _something_ with the VAA once we've got it
3. Start the relayer app

```typescript
--8<-- 'code/infrastructure/relayers/snippet-1.ts'
```

### Explanation

The first meaningful line instantiates the `StandardRelayerApp`, a subclass of the `RelayerApp` with standard defaults.

```typescript
--8<-- 'code/infrastructure/relayers/snippet-2.ts'
```

The only field you pass in the `StandardRelayerAppOpts` is the name to help identify log messages and reserve a namespace in Redis.

???- "`StandardRelayerAppOpts`"

    Other options can be passed to the `StandardRelayerApp` constructor to configure the app further.

    ```typescript
    --8<-- 'code/infrastructure/relayers/snippet-3.ts'
    ```

The next meaningful line in the example adds a filter middleware component. This middleware will cause the relayer app to request a subscription from the Spy for any VAAs that match the criteria and invoke the callback with the VAA.

If you'd like your program to subscribe to `multiple` chains and addresses, you can call the same method several times or use the `multiple` helper.

```typescript
--8<-- 'code/infrastructure/relayers/snippet-4.ts'
```

The last line in the simple example runs `await app.listen()`, which starts the relayer engine. Once started, the relayer engine issues subscription requests to the Spy and begins any other workflows (e.g., tracking missed VAAs).

This will run until the process is killed or encounters an unrecoverable error. To gracefully shut down the relayer, call `app.stop()`.

## Source Code

The source code for this example is available in the [`relayer-engine` repository](https://github.com/wormhole-foundation/relayer-engine/blob/main/examples/simple/src/app.ts){target=\_blank}.

## Wormhole integration complete?

Let us know so we can list your project in our ecosystem directory and introduce you to our global, multichain community!

[Reach out now](https://forms.clickup.com/45049775/f/1aytxf-10244/JKYWRUQ70AUI99F32Q){target=\_blank}