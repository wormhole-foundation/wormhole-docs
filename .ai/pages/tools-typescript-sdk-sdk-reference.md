---
title: Wormhole TS SDK
description: Explore Wormhole's TypeScript SDK and learn how to perform different types of transfers, including native, token, and USDC.
categories: Typescript SDK
url: https://wormhole.com/docs/tools/typescript-sdk/sdk-reference/
---

# TypeScript SDK Reference

This page covers all you need to know about the functionality offered through the Wormhole TypeScript SDK.

<div class="grid cards" markdown>

-   :octicons-download-16:{ .lg .middle } **Installation**

    ---

    Find installation instructions for both the meta package and installing specific, individual packages.

    [:custom-arrow: Install the SDK](/docs/tools/typescript-sdk/get-started/#install-the-sdk)

-   :octicons-code-square-16:{ .lg .middle } **TSdoc for SDK**

    ---

    Review the TSdoc for the Wormhole TypeScript SDK for a detailed look at available methods, classes, interfaces, and definitions.

    [:custom-arrow: View the TSdoc on GitHub](https://wormhole-foundation.github.io/wormhole-sdk-ts/){target=\_blank}

-   :octicons-code-square-16:{ .lg .middle } **Source Code**

    ---

    Want to go straight to the source? Check out the TypeScript SDK GitHub repository.
    
    [:custom-arrow: View GitHub Repository](https://github.com/wormhole-foundation/wormhole-sdk-ts/){target=\_blank}

</div>

!!! warning
    This package is a work in progress. The interface may change, and there are likely bugs. Please [report any issues](https://github.com/wormhole-foundation/wormhole-sdk-ts/issues){target=\_blank} you find.

## Concepts

Understanding key Wormhole concepts—and how the SDK abstracts them—will help you use the tools more effectively. The following sections cover platforms, chain contexts, addresses, signers, and protocols, explaining their roles in Wormhole and how the SDK simplifies working with them.

### Platforms

The SDK includes `Platform` modules, which create a standardized interface for interacting with the chains of a supported platform. The contents of a module vary by platform but can include:

- [Protocols](#protocols) preconfigured to suit the selected platform.
- Definitions and configurations for types, signers, addresses, and chains.
- Helpers configured for dealing with unsigned transactions on the selected platform.

These modules expose key functions and types from the native ecosystem, reducing the need for full packages and keeping dependencies lightweight.

??? interface "Supported platform modules"

    | Platform | Installation Command                               |
    |----------|----------------------------------------------------|
    | EVM      | <pre>```@wormhole-foundation/sdk-evm```</pre>      |
    | Solana   | <pre>```@wormhole-foundation/sdk-solana```</pre>   |
    | Algorand | <pre>```@wormhole-foundation/sdk-algorand```</pre> |
    | Aptos    | <pre>```@wormhole-foundation/sdk-aptos```</pre>    |
    | Cosmos   | <pre>```@wormhole-foundation/sdk-cosmwasm```</pre> |
    | Sui      | <pre>```@wormhole-foundation/sdk-sui```</pre>      |

    See the [Platforms folder of the TypeScript SDK](https://github.com/wormhole-foundation/wormhole-sdk-ts/tree/main/platforms){target=\_blank} for an up-to-date list of the platforms supported by the Wormhole TypeScript SDK.

### Chain Context

`ChainContext` (from the `@wormhole-foundation/sdk-definitions` package) provides a unified interface for interacting with connected chains. It:

- Holds network, chain, and platform configurations.
- Caches RPC and protocol clients.
- Exposes both platform-inherited and chain-specific methods.
- Defines the core types used across the SDK such as the `Network`, `Chain`, and `Platform`.

```ts
// Get the chain context for the source and destination chains
// This is useful to grab direct clients for the protocols
const srcChain = wh.getChain(senderAddress.chain);
const dstChain = wh.getChain(receiverAddress.chain);

const tb = await srcChain.getTokenBridge(); // => TokenBridge<'Evm'>
srcChain.getRpcClient(); // => RpcClient<'Evm'>
```

### Addresses

The SDK uses the `UniversalAddress` class to implement the `Address` interface, standardizing address handling across chains. All addresses are parsed into a 32-byte format. Each platform also defines a `NativeAddress` type that understands its native format. These abstractions ensure consistent cross-chain address handling.

```ts
// It's possible to convert a string address to its Native address
const ethAddr: NativeAddress<'Evm'> = toNative('Ethereum', '0xbeef...');

// A common type in the SDK is the `ChainAddress` which provides
// the additional context of the `Chain` this address is relevant for
const senderAddress: ChainAddress = Wormhole.chainAddress(
  'Ethereum',
  '0xbeef...'
);
const receiverAddress: ChainAddress = Wormhole.chainAddress(
  'Solana',
  'Sol1111...'
);

// Convert the ChainAddress back to its canonical string address format
const strAddress = Wormhole.canonicalAddress(senderAddress); // => '0xbeef...'

// Or if the ethAddr above is for an emitter and you need the UniversalAddress
const emitterAddr = ethAddr.toUniversalAddress().toString();
```

### Tokens

The `TokenId` type identifies any token by its chain and address. For standardized tokens, Wormhole uses the token's contract address. For native currencies (e.g., ETH on Ethereum), it uses the keyword `native`. This ensures consistent handling of all tokens.

```ts
// Get the TokenId for an ERC-20 token
const sourceToken: TokenId = Wormhole.tokenId('Ethereum', '0xbeef...');
// Get the TokenId for native ETH
const gasToken: TokenId = Wormhole.tokenId('Ethereum', 'native');
// Convert a TokenId back to a string
const strAddress = Wormhole.canonicalAddress(senderAddress); // => '0xbeef...'
```

### Signers

The SDK's `Signer` interface can be implemented as either a `SignOnlySigner` or a `SignAndSendSigner`, created by wrapping an offline or web wallet:

- **`SignOnlySigner`**: Signs and serializes unsigned transactions without broadcasting them. Transactions can be inspected or modified before signing. Serialization is chain-specific. See testing signers (e.g., [EVM](https://github.com/wormhole-foundation/connect-sdk/blob/main/platforms/evm/src/signer.ts){target=\_blank}, [Solana](https://github.com/wormhole-foundation/connect-sdk/blob/main/platforms/solana/src/signer.ts){target=\_blank}) for implementation examples.
- **`SignAndSendSigner`**: Signs and broadcasts transactions, returning their transaction IDs in order.

```ts
export type Signer = SignOnlySigner | SignAndSendSigner;

export interface SignOnlySigner {
  chain(): ChainName;
  address(): string;
  // Accept an array of unsigned transactions and return
  // an array of signed and serialized transactions.
  // The transactions may be inspected or altered before
  // signing.
  sign(tx: UnsignedTransaction[]): Promise<SignedTx[]>;
}

export interface SignAndSendSigner {
  chain(): ChainName;
  address(): string;
  // Accept an array of unsigned transactions and return
  // an array of transaction ids in the same order as the
  // unsignedTransactions array.
  signAndSend(tx: UnsignedTransaction[]): Promise<TxHash[]>;
}
```

#### Set Up a Signer with Ethers.js

To sign transactions programmatically with the Wormhole SDK, you can use [Ethers.js](https://docs.ethers.org/v6/){target=\_blank} to manage private keys and handle signing. Here's an example of setting up a signer using Ethers.js:

```javascript
import { ethers } from 'ethers';

// Update the following variables
const rpcUrl = 'INSERT_RPC_URL';
const privateKey = 'INSERT_PRIVATE_KEY';
const toAddress = 'INSERT_RECIPIENT_ADDRESS';

// Set up a provider and signer
const provider = new ethers.JsonRpcProvider(rpcUrl);
const signer = new ethers.Wallet(privateKey, provider);

// Example: Signing and sending a transaction
async function sendTransaction() {
  const tx = {
    to: toAddress,
    value: ethers.parseUnits('0.1'), // Sending 0.1 ETH
    gasPrice: await provider.getGasPrice(),
    gasLimit: ethers.toBeHex(21000),
  };

  const transaction = await signer.sendTransaction(tx);
  console.log('Transaction hash:', transaction.hash);
}
sendTransaction();

```

These components work together to create, sign, and submit a transaction to the blockchain:

- **`provider`**: Connects to the Ethereum or EVM-compatible network, enabling data access and transaction submission.
- **`signer`**: Represents the account that signs transactions using a private key.
- **`Wallet`**: Combines provider and signer to create, sign, and send transactions programmatically.

### Protocols

Wormhole is a Generic Message Passing (GMP) protocol with several specialized protocols built on top. Each protocol has platform-specific implementations providing methods to generate transactions or read on-chain state.

??? interface "Supported protocol modules"

    | Protocol              | Installation Command                                           |
    |-----------------------|----------------------------------------------------------------|
    | EVM Core              | <pre>```@wormhole-foundation/sdk-evm-core```</pre>             |
    | EVM WTT               | <pre>```@wormhole-foundation/sdk-evm-tokenbridge```</pre>      |
    | EVM CCTP              | <pre>```@wormhole-foundation/sdk-evm-cctp```</pre>             |
    | EVM Portico           | <pre>```@wormhole-foundation/sdk-evm-portico```</pre>          |
    | EVM TBTC              | <pre>```@wormhole-foundation/sdk-evm-tbtc```</pre>             |
    | Solana Core           | <pre>```@wormhole-foundation/sdk-solana-core```</pre>          |
    | Solana WTT            | <pre>```@wormhole-foundation/sdk-solana-tokenbridge```</pre>   |
    | Solana CCTP           | <pre>```@wormhole-foundation/sdk-solana-cctp```</pre>          |
    | Solana TBTC           | <pre>```@wormhole-foundation/sdk-solana-tbtc```</pre>          |
    | Algorand Core         | <pre>```@wormhole-foundation/sdk-algorand-core```</pre>        |
    | Algorand WTT          | <pre>```@wormhole-foundation/sdk-algorand-tokenbridge```</pre> |
    | Aptos Core            | <pre>```@wormhole-foundation/sdk-aptos-core```</pre>           |
    | Aptos WTT             | <pre>```@wormhole-foundation/sdk-aptos-tokenbridge```</pre>    |
    | Aptos CCTP            | <pre>```@wormhole-foundation/sdk-aptos-cctp```</pre>           |
    | Cosmos Core           | <pre>```@wormhole-foundation/sdk-cosmwasm-core```</pre>        |
    | Cosmos WTT            | <pre>```@wormhole-foundation/sdk-cosmwasm-tokenbridge```</pre> |
    | Sui Core              | <pre>```@wormhole-foundation/sdk-sui-core```</pre>             |
    | Sui WTT               | <pre>```@wormhole-foundation/sdk-sui-tokenbridge```</pre>      |
    | Sui CCTP              | <pre>```@wormhole-foundation/sdk-sui-cctp```</pre>             |


#### Wormhole Core

The core protocol powers all Wormhole activity by emitting messages containing the [emitter address](/docs/products/reference/glossary/#emitter){target=\_blank}, sequence number, and payload needed for bridging.

Example workflow on Solana Testnet:

1. Initialize a Wormhole instance for Solana.
2. Obtain a signer and its address.
3. Access the core messaging bridge for cross-chain messaging.
4. Prepare a message with:

    - Sender's address
    - Encoded payload (e.g., "lol")
    - Nonce (e.g., 0)
    - Consistency level (e.g., 0)

5. Generate, sign, and send the transaction to publish the message.
6. Extract the Wormhole message ID from transaction logs for tracking.
7. Wait (up to 60s) to receive the [Verified Action Approval (VAA)](/docs/protocol/infrastructure/vaas/){target=\_blank} (in `Uint8Array` format) from the Wormhole network.
8. Prepare and send a verification transaction on the receiving chain using the sender's address and the VAA.

???+ example "Example workflow"
    ```ts
    import { encoding, signSendWait, wormhole } from '@wormhole-foundation/sdk';
    import { getSigner } from './helpers/index.js';
    import solana from '@wormhole-foundation/sdk/solana';
    import evm from '@wormhole-foundation/sdk/evm';

    (async function () {
      const wh = await wormhole('Testnet', [solana, evm]);

      const chain = wh.getChain('Avalanche');
      const { signer, address } = await getSigner(chain);

      // Get a reference to the core messaging bridge
      const coreBridge = await chain.getWormholeCore();

      // Generate transactions, sign and send them
      const publishTxs = coreBridge.publishMessage(
        // Address of sender (emitter in VAA)
        address.address,
        // Message to send (payload in VAA)
        encoding.bytes.encode('lol'),
        // Nonce (user defined, no requirement for a specific value, useful to provide a unique identifier for the message)
        0,
        // ConsistencyLevel (ie finality of the message, see wormhole docs for more)
        0
      );
      // Send the transaction(s) to publish the message
      const txids = await signSendWait(chain, publishTxs, signer);

      // Take the last txid in case multiple were sent
      // The last one should be the one containing the relevant
      // event or log info
      const txid = txids[txids.length - 1];

      // Grab the wormhole message id from the transaction logs or storage
      const [whm] = await chain.parseTransaction(txid!.txid);

      // Wait for the vaa to be signed and available with a timeout
      const vaa = await wh.getVaa(whm!, 'Uint8Array', 60_000);
      console.log(vaa);

      // Note: calling verifyMessage manually is typically not a useful thing to do
      // As the VAA is typically submitted to the counterpart contract for
      // A given protocol and the counterpart contract will verify the VAA
      // This is simply for demo purposes
      const verifyTxs = coreBridge.verifyMessage(address.address, vaa!);
      console.log(await signSendWait(chain, verifyTxs, signer));
    })();

    ```

The payload contains the information necessary to perform whatever action is required based on the protocol that uses it.

#### Wrapped Token Transfers (WTT)

The most familiar protocol built on Wormhole is WTT. Each supported chain has a `TokenBridge` client that provides a consistent interface for transferring tokens and handling attestations. While `WormholeTransfer` abstractions are recommended, direct interaction with the protocol is also supported.

!!! note "Terminology" 
    The SDK and smart contracts use the name Token Bridge. In documentation, this product is referred to as Wrapped Token Transfers (WTT). Both terms describe the same protocol.

```ts
import { signSendWait } from '@wormhole-foundation/sdk';

const tb = await srcChain.getTokenBridge(); 

const token = '0xdeadbeef...';
const txGenerator = tb.createAttestation(token); 
const txids = await signSendWait(srcChain, txGenerator, src.signer);
```

## Transfers

While using the [`ChainContext`](#chain-context) and [`Protocol`](#protocols) clients directly is possible, the SDK provides some helpful abstractions for transferring tokens.

The `WormholeTransfer` interface provides a convenient abstraction to encapsulate the steps involved in a cross-chain transfer.

### Token Transfers

Token transfers between chains are straightforward using Wormhole. Create a `Wormhole` instance and use it to initialize a `TokenTransfer` or `CircleTransfer` object.

The example below shows how to initiate and complete a `TokenTransfer`. After creating the transfer object and retrieving a quote (to verify sufficient amount and fees), the process involves:

1. Initiating the transfer on the source chain.
2. Waiting for attestation (if required).
3. Completing the transfer on the destination chain.

For automatic transfers, the process ends after initiation. Manual transfers require attestation before completion.

```ts
  // Create a TokenTransfer object to track the state of the transfer over time
  const xfer = await wh.tokenTransfer(
    route.token,
    route.amount,
    route.source.address,
    route.destination.address,
    route.delivery?.automatic ?? false,
    route.payload,
    route.delivery?.nativeGas
  );

  const quote = await TokenTransfer.quoteTransfer(
    wh,
    route.source.chain,
    route.destination.chain,
    xfer.transfer
  );
  console.log(quote);

  if (xfer.transfer.automatic && quote.destinationToken.amount < 0)
    throw 'The amount requested is too low to cover the fee and any native gas requested.';

  // 1) Submit the transactions to the source chain, passing a signer to sign any txns
  console.log('Starting transfer');
  const srcTxids = await xfer.initiateTransfer(route.source.signer);
  console.log(`Started transfer: `, srcTxids);

  // If automatic, we're done
  if (route.delivery?.automatic) return xfer;

  // 2) Wait for the VAA to be signed and ready (not required for auto transfer)
  console.log('Getting Attestation');
  const attestIds = await xfer.fetchAttestation(60_000);
  console.log(`Got Attestation: `, attestIds);

  // 3) Redeem the VAA on the dest chain
  console.log('Completing Transfer');
  const destTxids = await xfer.completeTransfer(route.destination.signer);
  console.log(`Completed Transfer: `, destTxids);
```

??? code "View the complete script"
    ```ts hl_lines="122"
    import {
      Chain,
      Network,
      TokenId,
      TokenTransfer,
      Wormhole,
      amount,
      isTokenId,
      wormhole,
    } from '@wormhole-foundation/sdk';

    import evm from '@wormhole-foundation/sdk/evm';
    import solana from '@wormhole-foundation/sdk/solana';
    import { SignerStuff, getSigner, waitLog } from './helpers/index.js';

    (async function () {
      // Init Wormhole object, passing config for which network
      // to use (e.g. Mainnet/Testnet) and what Platforms to support
      const wh = await wormhole('Testnet', [evm, solana]);

      // Grab chain Contexts -- these hold a reference to a cached rpc client
      const sendChain = wh.getChain('Avalanche');
      const rcvChain = wh.getChain('Solana');

      // Shortcut to allow transferring native gas token
      const token = Wormhole.tokenId(sendChain.chain, 'native');

      // A TokenId is just a `{chain, address}` pair and an alias for ChainAddress
      // The `address` field must be a parsed address.
      // You can get a TokenId (or ChainAddress) prepared for you
      // by calling the static `chainAddress` method on the Wormhole class.
      // e.g.
      // wAvax on Solana
      // const token = Wormhole.tokenId("Solana", "3Ftc5hTz9sG4huk79onufGiebJNDMZNL8HYgdMJ9E7JR");
      // wSol on Avax
      // const token = Wormhole.tokenId("Avalanche", "0xb10563644a6AB8948ee6d7f5b0a1fb15AaEa1E03");

      // Normalized given token decimals later but can just pass bigints as base units
      // Note: The WTT (Token Bridge) will dedust past 8 decimals
      // This means any amount specified past that point will be returned
      // To the caller
      const amt = '0.05';

      // With automatic set to true, perform an automatic transfer. This will invoke a relayer
      // Contract intermediary that knows to pick up the transfers
      // With automatic set to false, perform a manual transfer from source to destination
      // Of the token
      // On the destination side, a wrapped version of the token will be minted
      // To the address specified in the transfer VAA
      const automatic = false;

      // The Wormhole relayer has the ability to deliver some native gas funds to the destination account
      // The amount specified for native gas will be swapped for the native gas token according
      // To the swap rate provided by the contract, denominated in native gas tokens
      const nativeGas = automatic ? '0.01' : undefined;

      // Get signer from local key but anything that implements
      // Signer interface (e.g. wrapper around web wallet) should work
      const source = await getSigner(sendChain);
      const destination = await getSigner(rcvChain);

      // Used to normalize the amount to account for the tokens decimals
      const decimals = isTokenId(token)
        ? Number(await wh.getDecimals(token.chain, token.address))
        : sendChain.config.nativeTokenDecimals;

      // Set this to true if you want to perform a round trip transfer
      const roundTrip: boolean = false;

      // Set this to the transfer txid of the initiating transaction to recover a token transfer
      // And attempt to fetch details about its progress.
      let recoverTxid = undefined;

      // Finally create and perform the transfer given the parameters set above
      const xfer = !recoverTxid
        ? // Perform the token transfer
          await tokenTransfer(
            wh,
            {
              token,
              amount: amount.units(amount.parse(amt, decimals)),
              source,
              destination,
              delivery: {
                automatic,
                nativeGas: nativeGas
                  ? amount.units(amount.parse(nativeGas, decimals))
                  : undefined,
              },
            },
            roundTrip
          )
        : // Recover the transfer from the originating txid
          await TokenTransfer.from(wh, {
            chain: source.chain.chain,
            txid: recoverTxid,
          });

      const receipt = await waitLog(wh, xfer);

      // Log out the results
      console.log(receipt);
    })();

    async function tokenTransfer<N extends Network>(
      wh: Wormhole<N>,
      route: {
        token: TokenId;
        amount: bigint;
        source: SignerStuff<N, Chain>;
        destination: SignerStuff<N, Chain>;
        delivery?: {
          automatic: boolean;
          nativeGas?: bigint;
        };
        payload?: Uint8Array;
      },
      roundTrip?: boolean
    ): Promise<TokenTransfer<N>> {
      // Create a TokenTransfer object to track the state of the transfer over time
      const xfer = await wh.tokenTransfer(
        route.token,
        route.amount,
        route.source.address,
        route.destination.address,
        route.delivery?.automatic ?? false,
        route.payload,
        route.delivery?.nativeGas
      );

      const quote = await TokenTransfer.quoteTransfer(
        wh,
        route.source.chain,
        route.destination.chain,
        xfer.transfer
      );
      console.log(quote);

      if (xfer.transfer.automatic && quote.destinationToken.amount < 0)
        throw 'The amount requested is too low to cover the fee and any native gas requested.';

      // 1) Submit the transactions to the source chain, passing a signer to sign any txns
      console.log('Starting transfer');
      const srcTxids = await xfer.initiateTransfer(route.source.signer);
      console.log(`Started transfer: `, srcTxids);

      // If automatic, we're done
      if (route.delivery?.automatic) return xfer;

      // 2) Wait for the VAA to be signed and ready (not required for auto transfer)
      console.log('Getting Attestation');
      const attestIds = await xfer.fetchAttestation(60_000);
      console.log(`Got Attestation: `, attestIds);

      // 3) Redeem the VAA on the dest chain
      console.log('Completing Transfer');
      const destTxids = await xfer.completeTransfer(route.destination.signer);
      console.log(`Completed Transfer: `, destTxids);

      // If no need to send back, dip
      if (!roundTrip) return xfer;

      const { destinationToken: token } = quote;
      return await tokenTransfer(wh, {
        ...route,
        token: token.token,
        amount: token.amount,
        source: route.destination,
        destination: route.source,
      });
    }

    ```

Internally, this uses the [`TokenBridge`](#wrapped-token-transfers-wtt) protocol client to transfer tokens.

### Native USDC Transfers

You can transfer native USDC using [Circle's CCTP](https://www.circle.com/cross-chain-transfer-protocol){target=\_blank}. If the transfer is set to `automatic`, the quote will include a relay fee, which is deducted from the total amount sent. For example, to receive 1.0 USDC on the destination chain, the sender must cover both the 1.0 and the relay fee. The same applies when including a native gas drop-off.

In the example below, the `wh.circleTransfer` function is used to initiate the transfer. It accepts the amount (in base units), sender and receiver chains and addresses, and an optional automatic flag to enable hands-free completion. You can also include an optional payload (set to `undefined` here) and specify a native gas drop-off if desired.

When waiting for the VAA, a timeout of `60,000` milliseconds is used. The actual wait time [varies by network](https://developers.circle.com/cctp/required-block-confirmations#mainnet){target=\_blank}.

```ts
  const xfer = await wh.circleTransfer(
    // Amount as bigint (base units)
    req.amount,
    // Sender chain/address
    src.address,
    // Receiver chain/address
    dst.address,
    // Automatic delivery boolean
    req.automatic,
    // Payload to be sent with the transfer
    undefined,
    // If automatic, native gas can be requested to be sent to the receiver
    req.nativeGas
  );

  // Note, if the transfer is requested to be Automatic, a fee for performing the relay
  // will be present in the quote. The fee comes out of the amount requested to be sent.
  // If the user wants to receive 1.0 on the destination, the amount to send should be 1.0 + fee.
  // The same applies for native gas dropoff
  const quote = await CircleTransfer.quoteTransfer(
    src.chain,
    dst.chain,
    xfer.transfer
  );
  console.log('Quote', quote);

  console.log('Starting Transfer');
  const srcTxids = await xfer.initiateTransfer(src.signer);
  console.log(`Started Transfer: `, srcTxids);

  if (req.automatic) {
    const relayStatus = await waitForRelay(srcTxids[srcTxids.length - 1]!);
    console.log(`Finished relay: `, relayStatus);
    return;
  }

  console.log('Waiting for Attestation');
  const attestIds = await xfer.fetchAttestation(60_000);
  console.log(`Got Attestation: `, attestIds);

  console.log('Completing Transfer');
  const dstTxids = await xfer.completeTransfer(dst.signer);
  console.log(`Completed Transfer: `, dstTxids);
}
```

??? code "View the complete script"
    ```ts
    import {
      Chain,
      CircleTransfer,
      Network,
      Signer,
      TransactionId,
      TransferState,
      Wormhole,
      amount,
      wormhole,
    } from '@wormhole-foundation/sdk';
    import evm from '@wormhole-foundation/sdk/evm';
    import solana from '@wormhole-foundation/sdk/solana';
    import { SignerStuff, getSigner, waitForRelay } from './helpers/index.js';

    /*
    Notes:
    Only a subset of chains are supported by Circle for CCTP, see core/base/src/constants/circle.ts for currently supported chains

    AutoRelayer takes a 0.1 USDC fee when transferring to any chain beside Goerli, which is 1 USDC
    */
    //

    (async function () {
      // Init the Wormhole object, passing in the config for which network
      // to use (e.g. Mainnet/Testnet) and what Platforms to support
      const wh = await wormhole('Testnet', [evm, solana]);

      // Grab chain Contexts
      const sendChain = wh.getChain('Avalanche');
      const rcvChain = wh.getChain('Solana');

      // Get signer from local key but anything that implements
      // Signer interface (e.g. wrapper around web wallet) should work
      const source = await getSigner(sendChain);
      const destination = await getSigner(rcvChain);

      // 6 decimals for USDC (except for BSC, so check decimals before using this)
      const amt = amount.units(amount.parse('0.2', 6));

      // Choose whether or not to have the attestation delivered for you
      const automatic = false;

      // If the transfer is requested to be automatic, you can also request that
      // during redemption, the receiver gets some amount of native gas transferred to them
      // so that they may pay for subsequent transactions
      // The amount specified here is denominated in the token being transferred (USDC here)
      const nativeGas = automatic ? amount.units(amount.parse('0.0', 6)) : 0n;

      await cctpTransfer(wh, source, destination, {
        amount: amt,
        automatic,
        nativeGas,
      });

    })();

    async function cctpTransfer<N extends Network>(
      wh: Wormhole<N>,
      src: SignerStuff<N, any>,
      dst: SignerStuff<N, any>,
      req: {
        amount: bigint;
        automatic: boolean;
        nativeGas?: bigint;
      }
    ) {

      const xfer = await wh.circleTransfer(
        // Amount as bigint (base units)
        req.amount,
        // Sender chain/address
        src.address,
        // Receiver chain/address
        dst.address,
        // Automatic delivery boolean
        req.automatic,
        // Payload to be sent with the transfer
        undefined,
        // If automatic, native gas can be requested to be sent to the receiver
        req.nativeGas
      );

      // Note, if the transfer is requested to be Automatic, a fee for performing the relay
      // will be present in the quote. The fee comes out of the amount requested to be sent.
      // If the user wants to receive 1.0 on the destination, the amount to send should be 1.0 + fee.
      // The same applies for native gas dropoff
      const quote = await CircleTransfer.quoteTransfer(
        src.chain,
        dst.chain,
        xfer.transfer
      );
      console.log('Quote', quote);

      console.log('Starting Transfer');
      const srcTxids = await xfer.initiateTransfer(src.signer);
      console.log(`Started Transfer: `, srcTxids);

      if (req.automatic) {
        const relayStatus = await waitForRelay(srcTxids[srcTxids.length - 1]!);
        console.log(`Finished relay: `, relayStatus);
        return;
      }

      console.log('Waiting for Attestation');
      const attestIds = await xfer.fetchAttestation(60_000);
      console.log(`Got Attestation: `, attestIds);

      console.log('Completing Transfer');
      const dstTxids = await xfer.completeTransfer(dst.signer);
      console.log(`Completed Transfer: `, dstTxids);
    }

    export async function completeTransfer(
      wh: Wormhole<Network>,
      txid: TransactionId,
      signer: Signer
    ): Promise<void> {

      const xfer = await CircleTransfer.from(wh, txid);

      const attestIds = await xfer.fetchAttestation(60 * 60 * 1000);
      console.log('Got attestation: ', attestIds);

      const dstTxIds = await xfer.completeTransfer(signer);
      console.log('Completed transfer: ', dstTxIds);
    }

    ```

### Recovering Transfers

It may be necessary to recover an abandoned transfer before it is completed. To do this, instantiate the `Transfer` class with the `from` static method and pass one of several types of identifiers. A `TransactionId` or `WormholeMessageId` may be used to recover the transfer.

```ts
  const xfer = await CircleTransfer.from(wh, txid);

  const attestIds = await xfer.fetchAttestation(60 * 60 * 1000);
  console.log('Got attestation: ', attestIds);

  const dstTxIds = await xfer.completeTransfer(signer);
  console.log('Completed transfer: ', dstTxIds);
```

??? code "View the complete script"
    ```ts hl_lines="130"
    import {
      Chain,
      CircleTransfer,
      Network,
      Signer,
      TransactionId,
      TransferState,
      Wormhole,
      amount,
      wormhole,
    } from '@wormhole-foundation/sdk';
    import evm from '@wormhole-foundation/sdk/evm';
    import solana from '@wormhole-foundation/sdk/solana';
    import { SignerStuff, getSigner, waitForRelay } from './helpers/index.js';

    /*
    Notes:
    Only a subset of chains are supported by Circle for CCTP, see core/base/src/constants/circle.ts for currently supported chains

    AutoRelayer takes a 0.1 USDC fee when transferring to any chain beside Goerli, which is 1 USDC
    */
    //

    (async function () {
      // Init the Wormhole object, passing in the config for which network
      // to use (e.g. Mainnet/Testnet) and what Platforms to support
      const wh = await wormhole('Testnet', [evm, solana]);

      // Grab chain Contexts
      const sendChain = wh.getChain('Avalanche');
      const rcvChain = wh.getChain('Solana');

      // Get signer from local key but anything that implements
      // Signer interface (e.g. wrapper around web wallet) should work
      const source = await getSigner(sendChain);
      const destination = await getSigner(rcvChain);

      // 6 decimals for USDC (except for BSC, so check decimals before using this)
      const amt = amount.units(amount.parse('0.2', 6));

      // Choose whether or not to have the attestation delivered for you
      const automatic = false;

      // If the transfer is requested to be automatic, you can also request that
      // during redemption, the receiver gets some amount of native gas transferred to them
      // so that they may pay for subsequent transactions
      // The amount specified here is denominated in the token being transferred (USDC here)
      const nativeGas = automatic ? amount.units(amount.parse('0.0', 6)) : 0n;

      await cctpTransfer(wh, source, destination, {
        amount: amt,
        automatic,
        nativeGas,
      });

    })();

    async function cctpTransfer<N extends Network>(
      wh: Wormhole<N>,
      src: SignerStuff<N, any>,
      dst: SignerStuff<N, any>,
      req: {
        amount: bigint;
        automatic: boolean;
        nativeGas?: bigint;
      }
    ) {

      const xfer = await wh.circleTransfer(
        // Amount as bigint (base units)
        req.amount,
        // Sender chain/address
        src.address,
        // Receiver chain/address
        dst.address,
        // Automatic delivery boolean
        req.automatic,
        // Payload to be sent with the transfer
        undefined,
        // If automatic, native gas can be requested to be sent to the receiver
        req.nativeGas
      );

      // Note, if the transfer is requested to be Automatic, a fee for performing the relay
      // will be present in the quote. The fee comes out of the amount requested to be sent.
      // If the user wants to receive 1.0 on the destination, the amount to send should be 1.0 + fee.
      // The same applies for native gas dropoff
      const quote = await CircleTransfer.quoteTransfer(
        src.chain,
        dst.chain,
        xfer.transfer
      );
      console.log('Quote', quote);

      console.log('Starting Transfer');
      const srcTxids = await xfer.initiateTransfer(src.signer);
      console.log(`Started Transfer: `, srcTxids);

      if (req.automatic) {
        const relayStatus = await waitForRelay(srcTxids[srcTxids.length - 1]!);
        console.log(`Finished relay: `, relayStatus);
        return;
      }

      console.log('Waiting for Attestation');
      const attestIds = await xfer.fetchAttestation(60_000);
      console.log(`Got Attestation: `, attestIds);

      console.log('Completing Transfer');
      const dstTxids = await xfer.completeTransfer(dst.signer);
      console.log(`Completed Transfer: `, dstTxids);
    }

    export async function completeTransfer(
      wh: Wormhole<Network>,
      txid: TransactionId,
      signer: Signer
    ): Promise<void> {

      const xfer = await CircleTransfer.from(wh, txid);

      const attestIds = await xfer.fetchAttestation(60 * 60 * 1000);
      console.log('Got attestation: ', attestIds);

      const dstTxIds = await xfer.completeTransfer(signer);
      console.log('Completed transfer: ', dstTxIds);
    }

    ```

## Routes

While a specific `WormholeTransfer`, such as `TokenTransfer` or `CCTPTransfer`, may be used, the developer must know exactly which transfer type to use for a given request.

To provide a more flexible and generic interface, the `Wormhole` class provides a method to produce a `RouteResolver` that can be configured with a set of possible routes to be supported.

The following section demonstrates setting up and validating a token transfer using Wormhole's routing system.

```ts
  // Create new resolver, passing the set of routes to consider
  const resolver = wh.resolver([
    routes.TokenBridgeRoute, // manual WTT (Token Bridge)
    routes.AutomaticTokenBridgeRoute, // automatic WTT (Token Bridge)
    routes.CCTPRoute, // manual CCTP
    routes.AutomaticCCTPRoute, // automatic CCTP
    routes.AutomaticPorticoRoute, // Native eth transfers
  ]);
```

Once created, the resolver can be used to provide a list of input and possible output tokens.

```ts
  // What tokens are available on the source chain?
  const srcTokens = await resolver.supportedSourceTokens(sendChain);
  console.log(
    'Allowed source tokens: ',
    srcTokens.map((t) => canonicalAddress(t))
  );

  const sendToken = Wormhole.tokenId(sendChain.chain, 'native');

  // Given the send token, what can we possibly get on the destination chain?
  const destTokens = await resolver.supportedDestinationTokens(
    sendToken,
    sendChain,
    destChain
  );
  console.log(
    'For the given source token and routes configured, the following tokens may be receivable: ',
    destTokens.map((t) => canonicalAddress(t))
  );
  // Grab the first one for the example
  const destinationToken = destTokens[0]!;
```

Once the tokens are selected, a `RouteTransferRequest` may be created to provide a list of routes that can fulfill the request. Creating a transfer request fetches the token details since all routes will need to know about the tokens.

```ts
  // Creating a transfer request fetches token details
  // Since all routes will need to know about the tokens
  const tr = await routes.RouteTransferRequest.create(wh, {
    source: sendToken,
    destination: destinationToken,
  });

  // Resolve the transfer request to a set of routes that can perform it
  const foundRoutes = await resolver.findRoutes(tr);
  console.log(
    'For the transfer parameters, we found these routes: ',
    foundRoutes
  );
```

Choosing the best route is up to the developer and may involve sorting by output amount or estimated completion time (though no estimate is currently provided).

Once a route is selected, parameters like `amount`, `nativeGasDropoff`, and `slippage` can be set. After validation, a transfer quote is requested, including fees, estimated time, and final amount. If successful, the quote is shown to the user for review before proceeding, ensuring all details are verified prior to transfer.

```ts
  console.log(
    'This route offers the following default options',
    bestRoute.getDefaultOptions()
  );

  // Specify the amount as a decimal string
  const amt = '0.001';
  // Create the transfer params for this request
  const transferParams = { amount: amt, options: { nativeGas: 0 } };

  // Validate the transfer params passed, this returns a new type of ValidatedTransferParams
  // which (believe it or not) is a validated version of the input params
  // This new var must be passed to the next step, quote
  const validated = await bestRoute.validate(tr, transferParams);
  if (!validated.valid) throw validated.error;
  console.log('Validated parameters: ', validated.params);

  // Get a quote for the transfer, this too returns a new type that must
  // be passed to the next step, execute (if you like the quote)
  const quote = await bestRoute.quote(tr, validated.params);
  if (!quote.success) throw quote.error;
  console.log('Best route quote: ', quote);
```

Finally, assuming the quote looks good, the route can initiate the request with the quote and the `signer`.

```ts
    const receipt = await bestRoute.initiate(
      tr,
      sender.signer,
      quote,
      receiver.address
    );
    console.log('Initiated transfer with receipt: ', receipt);
```

??? code "View the complete script"

    ```ts
    import {
      Wormhole,
      canonicalAddress,
      routes,
      wormhole,
    } from '@wormhole-foundation/sdk';

    import evm from '@wormhole-foundation/sdk/evm';
    import solana from '@wormhole-foundation/sdk/solana';
    import { getSigner } from './helpers/index.js';

    (async function () {
      // Setup
      const wh = await wormhole('Testnet', [evm, solana]);

      // Get chain contexts
      const sendChain = wh.getChain('Avalanche');
      const destChain = wh.getChain('Solana');

      // Get signers from local config
      const sender = await getSigner(sendChain);
      const receiver = await getSigner(destChain);

      // Create new resolver, passing the set of routes to consider
      const resolver = wh.resolver([
        routes.TokenBridgeRoute, // manual WTT (Token Bridge)
        routes.AutomaticTokenBridgeRoute, // automatic WTT (Token Bridge)
        routes.CCTPRoute, // manual CCTP
        routes.AutomaticCCTPRoute, // automatic CCTP
        routes.AutomaticPorticoRoute, // Native eth transfers
      ]);

      // What tokens are available on the source chain?
      const srcTokens = await resolver.supportedSourceTokens(sendChain);
      console.log(
        'Allowed source tokens: ',
        srcTokens.map((t) => canonicalAddress(t))
      );

      const sendToken = Wormhole.tokenId(sendChain.chain, 'native');

      // Given the send token, what can we possibly get on the destination chain?
      const destTokens = await resolver.supportedDestinationTokens(
        sendToken,
        sendChain,
        destChain
      );
      console.log(
        'For the given source token and routes configured, the following tokens may be receivable: ',
        destTokens.map((t) => canonicalAddress(t))
      );
      // Grab the first one for the example
      const destinationToken = destTokens[0]!;

      // Creating a transfer request fetches token details
      // Since all routes will need to know about the tokens
      const tr = await routes.RouteTransferRequest.create(wh, {
        source: sendToken,
        destination: destinationToken,
      });

      // Resolve the transfer request to a set of routes that can perform it
      const foundRoutes = await resolver.findRoutes(tr);
      console.log(
        'For the transfer parameters, we found these routes: ',
        foundRoutes
      );

      const bestRoute = foundRoutes[0]!;
      console.log('Selected: ', bestRoute);

      console.log(
        'This route offers the following default options',
        bestRoute.getDefaultOptions()
      );

      // Specify the amount as a decimal string
      const amt = '0.001';
      // Create the transfer params for this request
      const transferParams = { amount: amt, options: { nativeGas: 0 } };

      // Validate the transfer params passed, this returns a new type of ValidatedTransferParams
      // which (believe it or not) is a validated version of the input params
      // This new var must be passed to the next step, quote
      const validated = await bestRoute.validate(tr, transferParams);
      if (!validated.valid) throw validated.error;
      console.log('Validated parameters: ', validated.params);

      // Get a quote for the transfer, this too returns a new type that must
      // be passed to the next step, execute (if you like the quote)
      const quote = await bestRoute.quote(tr, validated.params);
      if (!quote.success) throw quote.error;
      console.log('Best route quote: ', quote);

      // If you're sure you want to do this, set this to true
      const imSure = false;
      if (imSure) {
        // Now the transfer may be initiated
        // A receipt will be returned, guess what you gotta do with that?
        const receipt = await bestRoute.initiate(
          tr,
          sender.signer,
          quote,
          receiver.address
        );
        console.log('Initiated transfer with receipt: ', receipt);

        // Kick off a wait log, if there is an opportunity to complete, this function will do it
        // See the implementation for how this works
        await routes.checkAndCompleteTransfer(bestRoute, receipt, receiver.signer);
      } else {
        console.log('Not initiating transfer (set `imSure` to true to do so)');
      }
    })();

    ```

See the `router.ts` example in the [examples directory](https://github.com/wormhole-foundation/wormhole-sdk-ts/tree/main/examples){target=\_blank} for a full working example.

### Routes as Plugins

Routes can be imported from any npm package that exports them and configured with the resolver. Custom routes must extend [`Route`](https://github.com/wormhole-foundation/wormhole-sdk-ts/blob/0c57292368146c460abc9ce9e7f6a42be8e0b903/connect/src/routes/route.ts#L21-L64){target=\_blank} and implement [`StaticRouteMethods`](https://github.com/wormhole-foundation/wormhole-sdk-ts/blob/0c57292368146c460abc9ce9e7f6a42be8e0b903/connect/src/routes/route.ts#L101){target=\_blank}.

```ts
import { Network, routes } from '@wormhole-foundation/sdk-connect';

export class CustomRoute<N extends Network>
  extends routes.Route<N>
  implements routes.StaticRouteMethods<typeof CustomRoute>
{
  static meta = {
    name: 'CustomRoute',
  };
  // implementation...
}

```

A noteworthy example of a route exported from a separate npm package is Wormhole Native Token Transfers (NTT). See the [`NttAutomaticRoute`](https://github.com/wormhole-foundation/native-token-transfers/blob/66f8e414223a77f5c736541db0a7a85396cab71c/sdk/route/src/automatic.ts#L48){target=\_blank} route implementation.

## See Also

The TSdoc is available [on GitHub](https://wormhole-foundation.github.io/wormhole-sdk-ts/){target=\_blank}.
