---
title: Run a Relayer
description: Learn how to build and configure your own off-chain custom relaying solution to relay Wormhole messages for your applications using the Relayer Engine.
categories: Relayers
url: https://wormhole.com/docs/protocol/infrastructure-guides/run-relayer/
---

# Run a Custom Relayer

Relayers play a crucial role in cross-chain communication, ensuring that messages are transferred seamlessly between different blockchains. While the [Executor](/docs/protocol/infrastructure/relayer/#executor){target=\_blank} provides a reliable way to handle these transfers, they might not always meet every application's unique requirements.

Custom relayers address these limitations by offering tailored solutions that cater to the distinct needs of your application. Developing a custom relayer gives you complete control over message processing, delivery mechanisms, and integration with existing systems. This customization allows for optimized performance and the ability to implement specific features that Wormhole-deployed relayers might not support.

A custom relayer might be as simple as an in-browser process that polls the API for the availability of a VAA after submitting a transaction and delivers it to the target chain. It might also be implemented with a Spy coupled with some daemon listening for VAAs from a relevant chain ID and emitter, then taking action when one is observed.

This guide teaches you how to set up and configure a custom relayer for efficient message handling. You'll start by understanding how to uniquely identify a VAA using its emitter address, sequence ID, and chain ID. Then, you'll explore the Relayer Engine, a package that provides a framework for building custom relayers, and learn how to fetch and handle VAAs using the Wormhole SDK.

## Get Started with a Custom Relayer

To start building a custom relayer, it's essential to grasp the components you'll be managing as part of your relaying service. Your relayer must be capable of retrieving and delivering VAAs.

<figure markdown="span">
  ![Custom relayer](/docs/images/protocol/infrastructure-guides/run-relayer/relayer-1.webp)
  <figcaption>The off-chain components outlined in blue must be implemented.</figcaption>
</figure>

### How to Uniquely Identify a VAA

Regardless of the environment, to get the VAA you intend to relay, you need:

- The `emitter` address.
- The `sequence` ID of the message you're interested in.
- The `chainId` for the chain that emitted the message.

With these three components, you're able to uniquely identify a VAA and process it.

## Use the Relayer Engine

The [`relayer-engine`](https://github.com/wormhole-foundation/relayer-engine){target=\_blank} is a package that provides the structure and a starting point for a custom relayer.

With the Relayer Engine, a developer can write specific logic for filtering to receive only the messages they care about.

Once a Wormhole message is received, the developer may apply additional logic to parse custom payloads or submit the Verifiable Action Approvals (VAA) to one or many destination chains.

To use the Relayer Engine, a developer may specify how to relay Wormhole messages for their app using an idiomatic Express/Koa middleware-inspired API, then let the library handle all the details.

### Install the Relayer Engine

First, install the `relayer-engine` package with your favorite package manager:

```bash
npm i @wormhole-foundation/relayer-engine
```

### Get Started with the Relayer Engine

In the following example, you'll:

1. Set up a `StandardRelayerApp`, passing configuration options for our relayer.
2. Add a filter to capture only those messages our app cares about, with a callback to do _something_ with the VAA once received.
3. Start the relayer app.

```typescript
import {
  Environment,
  StandardRelayerApp,
  StandardRelayerContext,
} from '@wormhole-foundation/relayer-engine';
import { CHAIN_ID_SOLANA } from '@certusone/wormhole-sdk';

(async function main() {
  // Initialize relayer engine app and pass relevant config options
  const app = new StandardRelayerApp<StandardRelayerContext>(
    Environment.TESTNET,
    // Other app specific config options can be set here for things
    // like retries, logger, or redis connection settings
    {
      name: 'ExampleRelayer',
    }
  );

  // Add a filter with a callback that will be invoked
  // on finding a VAA that matches the filter
  app.chain(CHAIN_ID_SOLANA).address(
    // Emitter address on Solana
    'DZnkkTmCiFWfYTfT41X3Rd1kDgozqzxWaHqsw6W4x2oe',
    // Callback function to invoke on new message
    async (ctx, next) => {
      const vaa = ctx.vaa;
      const hash = ctx.sourceTxHash;
      console.log(
        `Got a VAA with sequence: ${vaa.sequence} from with txhash: ${hash}`
      );
    }
  );

  // Add and configure any other middleware here

  // Start app. Blocks until unrecoverable error or process is stopped
  await app.listen();
})();

```

The first meaningful line instantiates the `StandardRelayerApp`, a subclass of the `RelayerApp` with standard defaults.

```typescript
export class StandardRelayerApp<
  ContextT extends StandardRelayerContext = StandardRelayerContext,
> extends RelayerApp<ContextT> {
  // ...
  constructor(env: Environment, opts: StandardRelayerAppOpts) {
```

The only field you pass in the `StandardRelayerAppOpts` is the name to help identify log messages and reserve a namespace in Redis.

??? code "`StandardRelayerAppOpts`"

    Other options can be passed to the `StandardRelayerApp` constructor to configure the app further.

    ```typescript
    wormholeRpcs?: string[];  // List of URLs from which to query missed VAAs
    concurrency?: number;     // How many concurrent requests to make for workflows
    spyEndpoint?: string;     // The hostname and port of our Spy
    logger?: Logger;          // A custom Logger
    privateKeys?: Partial<{ [k in ChainId]: any[]; }>; // A set of keys that can be used to sign and send transactions
    tokensByChain?: TokensByChain;    // The token list we care about
    workflows?: { retries: number; }; // How many times to retry a given workflow
    providers?: ProvidersOpts;        // Configuration for the default providers
    fetchSourceTxhash?: boolean;      // whether or not to get the original transaction ID/hash
    // Redis config
    redisClusterEndpoints?: ClusterNode[];
    redisCluster?: ClusterOptions;
    redis?: RedisOptions;
    ```

The next meaningful line in the example adds a filter middleware component. This middleware will cause the relayer app to request a subscription from the Spy for any VAAs that match the criteria and invoke the callback with the VAA.

If you'd like your program to subscribe to `multiple` chains and addresses, you can call the same method several times or use the `multiple` helper.

```typescript
app.multiple(
  {
    [CHAIN_ID_SOLANA]: 'DZnkkTmCiFWfYTfT41X3Rd1kDgozqzxWaHqsw6W4x2oe',
    [CHAIN_ID_ETH]: ['0xabc1230000000...', '0xdef456000...'],
  },
  myCallback
);

```

The last line in the simple example runs `await app.listen()`, which starts the relayer engine. Once started, the Relayer Engine issues subscription requests to the Spy and begins any other workflows (e.g., tracking missed VAAs).

This will run until the process is killed or encounters an unrecoverable error. To gracefully shut down the relayer, call `app.stop()`.

The source code for this example is available in the [`relayer-engine` repository](https://github.com/wormhole-foundation/relayer-engine/blob/main/examples/simple/src/app.ts){target=\_blank}.

## Start Background Processes

!!! note
    These processes _must_ be running for the relayer app below to work.

Next, you must start a Spy to listen for available VAAs published on the Guardian network. You also need a persistence layer. This example uses Redis.

More details about the Spy are available in the [Spy Documentation](/docs/protocol/infrastructure/spy){target=\_blank}.

### Wormhole Network Spy

For our relayer app to receive messages, a local Spy must be running that watches the Guardian network. Our relayer app will receive updates from this Spy.

=== "Mainnet Spy"

    ```bash
    docker run --pull=always --platform=linux/amd64 \
    -p 7073:7073 \
    --entrypoint /guardiand ghcr.io/wormhole-foundation/guardiand:latest \
    spy \
    --nodeKey /node.key \
    --spyRPC "[::]:7073" \
    --env mainnet
    ```

=== "Testnet Spy"

    ```bash
    docker run --pull=always --platform=linux/amd64 \
    -p 7073:7073 \
    --entrypoint /guardiand ghcr.io/wormhole-foundation/guardiand:latest \
    spy \
    --nodeKey /node.key \
    --spyRPC "[::]:7073" \
    --env testnet   
    ```

### Redis Persistence

!!! note
    While you're using [Redis](https://redis.io/docs/latest/develop/get-started/){target=\_blank} here, the persistence layer can be swapped out for some other database by implementing the appropriate [interface](https://github.com/wormhole-foundation/relayer-engine/blob/main/relayer/storage/redis-storage.ts){target=\_blank}.

A Redis instance must also be available to persist job data for fetching VAAs from the Spy.

```bash
docker run --rm -p 6379:6379 --name redis-docker -d redis
```

## Use the Wormhole SDK

!!! note   
    The example below uses the legacy [`@certusone/wormhole-sdk`](https://www.npmjs.com/package/@certusone/wormhole-sdk){target=\_blank}, which is still supported and used in the Relayer Engine but is no longer actively maintained.
    
    For most use cases, it is recommend to use the latest [`@wormhole-foundation/sdk`](https://www.npmjs.com/package/@wormhole-foundation/sdk){target=\_blank}.

You can also use the Wormhole SDK to poll the Guardian RPC until a signed VAA is ready using the SDK's `getSignedVAAWithRetry` function.

```ts
import {
  getSignedVAAWithRetry,
  parseVAA,
  CHAIN_ID_SOLANA,
  CHAIN_ID_ETH,
} from '@certusone/wormhole-sdk';

const RPC_HOSTS = [
  /* ...*/
];

async function getVAA(
  emitter: string,
  sequence: string,
  chainId: number
): Promise<Uint8Array> {
  // Wait for the VAA to be ready and fetch it from the guardian network
  const { vaaBytes } = await getSignedVAAWithRetry(
    RPC_HOSTS,
    chainId,
    emitter,
    sequence
  );
  return vaaBytes;
}

const vaaBytes = await getVAA('INSERT_EMITTER_ADDRESS', 1, CHAIN_ID_ETH);

```

Once you have the VAA, the delivery method is chain-dependent.

=== "EVM"

    On EVM chains, the bytes for the VAA can be passed directly as an argument to an ABI method.

    ```ts
    // Set up eth wallet
    const ethProvider = new ethers.providers.StaticJsonRpcProvider(
      'INSERT_RPC_URL'
    );
    const ethWallet = new ethers.Wallet('INSERT_PRIVATE_KEY', ethProvider);

    // Create client to interact with our target app
    const ethHelloWorld = HelloWorld__factory.connect(
      'INSERT_CONTRACT_ADDRESS',
      ethWallet
    );

    // Invoke the receiveMessage on the ETH contract and wait for confirmation
    const receipt = await ethHelloWorld
      .receiveMessage(vaaBytes)
      .then((tx: ethers.ContractTransaction) => tx.wait())
      .catch((msg: any) => {
        console.error(msg);
        return null;
      });

    ```

=== "Solana"

    On Solana, the VAA is first posted to the core bridge, and then a custom transaction is prepared to process and validate the VAA. 

    ```ts
    import { CONTRACTS } from '@certusone/wormhole-sdk';

    export const WORMHOLE_CONTRACTS = CONTRACTS[NETWORK];
    export const CORE_BRIDGE_PID = new PublicKey(WORMHOLE_CONTRACTS.solana.core);

    // First, post the VAA to the core bridge
    await postVaaSolana(
      connection,
      wallet.signTransaction,
      CORE_BRIDGE_PID,
      wallet.key(),
      vaaBytes
    );

    const program = createHelloWorldProgramInterface(connection, programId);
    const parsed = isBytes(wormholeMessage)
      ? parseVaa(wormholeMessage)
      : wormholeMessage;

    const ix = program.methods
      .receiveMessage([...parsed.hash])
      .accounts({
        payer: new PublicKey(payer),
        config: deriveConfigKey(programId),
        wormholeProgram: new PublicKey(wormholeProgramId),
        posted: derivePostedVaaKey(wormholeProgramId, parsed.hash),
        foreignEmitter: deriveForeignEmitterKey(programId, parsed.emitterChain),
        received: deriveReceivedKey(
          programId,
          parsed.emitterChain,
          parsed.sequence
        ),
      })
      .instruction();

    const transaction = new Transaction().add(ix);
    const { blockhash } = await connection.getLatestBlockhash(commitment);
    transaction.recentBlockhash = blockhash;
    transaction.feePayer = new PublicKey(payerAddress);

    const signed = await wallet.signTxn(transaction);
    const txid = await connection.sendRawTransaction(signed);

    await connection.confirmTransaction(txid);

    ```
