---
title: Use Queries
description: Explore a simple demo of interacting with Wormhole Queries using an eth_call request to query the supply of wETH on Ethereum using a Wormhole query.
categories: Queries
url: https://wormhole.com/docs/products/queries/guides/use-queries/
---

# Use Queries

You can visit the [Example Queries Demo](https://wormholelabs-xyz.github.io/example-queries-demo/){target=\_blank} to view an interactive example of an application interacting with the [Query Demo](https://github.com/wormholelabs-xyz/example-queries-demo/blob/main/src/QueryDemo.sol){target=\_blank} contract.

This guide covers using a simple `eth_call` request to get the total supply of WETH on Ethereum.

## Construct a Query {: #construct-a-query}

You can use the [Wormhole Query SDK](https://www.npmjs.com/package/@wormhole-foundation/wormhole-query-sdk){target=\_blank} to construct a query. You will also need an RPC endpoint from the provider of your choice. This example uses [Axios](https://www.npmjs.com/package/axios){target=\_blank} for RPC requests. Ensure that you also have [TypeScript](https://www.typescriptlang.org/download/){target=\_blank} installed. 

```jsx
npm i @wormhole-foundation/wormhole-query-sdk axios
```

In order to make an `EthCallQueryRequest`, you need a specific block number or hash as well as the call data to request.

You can request the latest block from a public node using `eth_getBlockByNumber`.

```jsx
const rpc = 'https://ethereum.publicnode.com';
  const latestBlock: string = (
    await axios.post(rpc, {
      method: 'eth_getBlockByNumber',
      params: ['latest', false],
      id: 1,
      jsonrpc: '2.0',
    })
  ).data?.result?.number;
```

Then construct the call data.

```jsx
const callData: EthCallData = {
  to: '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2', // WETH
  data: '0x18160ddd', // web3.eth.abi.encodeFunctionSignature("totalSupply()")
};
```

Finally, put it all together in a `QueryRequest`.

```jsx
  // Form the query request
  const request = new QueryRequest(
    0, // Nonce
    [
      new PerChainQueryRequest(
        2, // Ethereum Wormhole Chain ID
        new EthCallQueryRequest(latestBlock, [callData])
      ),
    ]
  );
```

This request consists of one `PerChainQueryRequest`, which is an `EthCallQueryRequest` to Ethereum. You can use `console.log` to print the JSON object and review the structure.

```jsx
  console.log(JSON.stringify(request, undefined, 2));
  // {
  //   "nonce": 0,
  //   "requests": [
  //     {
  //       "chainId": 2,
  //       "query": {
  //         "callData": [
  //           {
  //             "to": "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2",
  //             "data": "0x18160ddd"
  //           }
  //         ],
  //         "blockTag": "0x11e9068"
  //       }
  //     }
  //   ],
  //   "version": 1
  // }
```

## Mock a Query

For easier testing, the Query SDK provides a `QueryProxyMock` method. This method will perform the request and sign the result with the [Devnet](https://github.com/wormhole-foundation/wormhole/blob/main/DEVELOP.md){target=\_blank} Guardian key. The `mock` call returns the same format as the Query Proxy.

```jsx
  const mock = new QueryProxyMock({ 2: rpc });
  const mockData = await mock.mock(request);
  console.log(mockData);
  // {
  //   signatures: ['...'],
  //   bytes: '...'
  // }
```

This response is suited for on-chain use, but the SDK also includes a parser to make the results readable via the client.

```jsx
  const mockQueryResponse = QueryResponse.from(mockData.bytes);
  const mockQueryResult = (
    mockQueryResponse.responses[0].response as EthCallQueryResponse
  ).results[0];
  console.log(
    `Mock Query Result: ${mockQueryResult} (${BigInt(mockQueryResult)})`
  );
  // Mock Query Result:
  // 0x000000000000000000000000000000000000000000029fd09d4d81addb3ccfee
  // (3172556167631284394053614)
```

Testing this all together might look like the following:

```jsx
import {
  EthCallData,
  EthCallQueryRequest,
  EthCallQueryResponse,
  PerChainQueryRequest,
  QueryProxyMock,
  QueryRequest,
  QueryResponse,
} from '@wormhole-foundation/wormhole-query-sdk';
import axios from 'axios';

const rpc = 'https://ethereum.publicnode.com';
const callData: EthCallData = {
  to: '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2', // WETH
  data: '0x18160ddd', // web3.eth.abi.encodeFunctionSignature("totalSupply()")
};

(async () => {
  const latestBlock: string = (
    await axios.post(rpc, {
      method: 'eth_getBlockByNumber',
      params: ['latest', false],
      id: 1,
      jsonrpc: '2.0',
    })
  ).data?.result?.number;
  if (!latestBlock) {
    console.error(`❌ Invalid block returned`);
    return;
  }
  console.log('Latest Block:     ', latestBlock, `(${BigInt(latestBlock)})`);
  const targetResponse = await axios.post(rpc, {
    method: 'eth_call',
    params: [callData, latestBlock],
    id: 1,
    jsonrpc: '2.0',
  });
  // console.log(finalizedResponse.data);
  if (targetResponse.data.error) {
    console.error(`❌ ${targetResponse.data.error.message}`);
  }
  const targetResult = targetResponse.data?.result;
  console.log('Target Result:    ', targetResult, `(${BigInt(targetResult)})`);
  // Form the query request
  const request = new QueryRequest(
    0, // Nonce
    [
      new PerChainQueryRequest(
        2, // Ethereum Wormhole Chain ID
        new EthCallQueryRequest(latestBlock, [callData])
      ),
    ]
  );
  console.log(JSON.stringify(request, undefined, 2));
  const mock = new QueryProxyMock({ 2: rpc });
  const mockData = await mock.mock(request);
  console.log(mockData);
  const mockQueryResponse = QueryResponse.from(mockData.bytes);
  const mockQueryResult = (
    mockQueryResponse.responses[0].response as EthCallQueryResponse
  ).results[0];
  console.log(
    `Mock Query Result: ${mockQueryResult} (${BigInt(mockQueryResult)})`
  );
})();
```

### Fork Testing

It is common to test against a local fork of Mainnet with something like

```jsx
anvil --fork-url https://ethereum.publicnode.com
```

In order for mock requests to verify against the Mainnet Core Contract, you need to replace the current Guardian set with the single Devnet key used by the mock.

Here's an example for Ethereum Mainnet, where the `-a` parameter is the [Core Contract address](/docs/products/reference/contract-addresses/#core-contracts){target=\_blank} on that chain.

```jsx
npx @wormhole-foundation/wormhole-cli evm hijack -a 0x98f3c9e6E3fAce36bAAd05FE09d375Ef1464288B -g 0xbeFA429d57cD18b7F8A4d91A2da9AB4AF05d0FBe
```

If you are using `EthCallWithFinality`, you will need to mine additional blocks (32 if using [Anvil](https://getfoundry.sh/anvil/overview#anvil){target=\_blank}) after the latest transaction for it to become finalized. Anvil supports [auto-mining](https://getfoundry.sh/anvil/reference#mining-modes){target=\_blank} with the `-b` flag if you want to test code that waits naturally for the chain to advance. For integration tests, you may want to simply `anvil_mine` with `0x20`.

## Make a Query Request

The standardized means of making a `QueryRequest` with an API key is as follows:

```jsx
const serialized = request.serialize();
const proxyResponse =
  (await axios.post) <
  QueryProxyQueryResponse >
  (QUERY_URL,
  {
    bytes: Buffer.from(serialized).toString("hex"),
  },
  { headers: { "X-API-Key": YOUR_API_KEY } });

```

Remember to always take steps to protect your sensitive API keys, such as defining them in `.env` files and including such files in your `.gitignore`.

A Testnet Query Proxy is available at `https://testnet.query.wormhole.com/v1/query`

A Mainnet Query Proxy is available at `https://query.wormhole.com/v1/query`

## Verify a Query Response On-Chain

A [`QueryResponseLib` library](https://github.com/wormhole-foundation/wormhole-solidity-sdk/blob/main/src/libraries/QueryResponse.sol){target=\_blank} is provided to assist with verifying query responses. You can begin by installing the [Wormhole Solidity SDK](https://github.com/wormhole-foundation/wormhole-solidity-sdk){target=\_blank} with the following command:

```bash
forge install wormhole-foundation/wormhole-solidity-sdk
```

Broadly, using a query response on-chain comes down to three main steps:

   1. Parse and verify the query response.
   2. The `parseAndVerifyQueryResponse` handles verifying the Guardian signatures against the current Guardian set stored in the Core bridge contract.
   3. Validate the request details. This may be different for every integrator depending on their use case, but generally checks the following:
    - Is the request against the expected chain?
    - Is the request of the expected type? The `parseEthCall` helpers perform this check when parsing.
    - Is the resulting block number and time expected? Some consumers might require that a block number be higher than the last, or the block time be within the last 5 minutes. `validateBlockNum` and `validateBlockTime` can help with the checks.
    - Is the request for the expected contract and function signature? The `validateMultipleEthCallData` can help with non-parameter-dependent cases.
    - Is the result of the expected length for the expected result type?
   4. Run `abi.decode` on the result.

See the [QueryDemo](https://github.com/wormholelabs-xyz/example-queries-demo/blob/main/src/QueryDemo.sol){target=\_blank} contract for an example and read the docstrings of the preceding methods for detailed usage instructions.

??? code "View the complete `QueryDemo`"
    ```solidity
    // contracts/query/QueryDemo.sol
    // SPDX-License-Identifier: Apache 2

    pragma solidity ^0.8.0;

    import "wormhole-solidity-sdk/libraries/BytesParsing.sol";
    import "wormhole-solidity-sdk/interfaces/IWormhole.sol";
    import "wormhole-solidity-sdk/QueryResponse.sol";

    error InvalidOwner();
    // @dev for the onlyOwner modifier
    error InvalidCaller();
    error InvalidCalldata();
    error InvalidForeignChainID();
    error ObsoleteUpdate();
    error StaleUpdate();
    error UnexpectedResultLength();
    error UnexpectedResultMismatch();

    /// @dev QueryDemo is an example of using the QueryResponse library to parse and verify Cross Chain Query (CCQ) responses.
    contract QueryDemo is QueryResponse {
        using BytesParsing for bytes;

        struct ChainEntry {
            uint16 chainID;
            address contractAddress;
            uint256 counter;
            uint256 blockNum;
            uint256 blockTime;
        }

        address private immutable owner;
        uint16 private immutable myChainID;
        mapping(uint16 => ChainEntry) private counters;
        uint16[] private foreignChainIDs;

        bytes4 public GetMyCounter = bytes4(hex"916d5743");

        constructor(address _owner, address _wormhole, uint16 _myChainID) QueryResponse(_wormhole) {
            if (_owner == address(0)) {
                revert InvalidOwner();
            }
            owner = _owner;

            myChainID = _myChainID;
            counters[_myChainID] = ChainEntry(_myChainID, address(this), 0, 0, 0);
        }

        // updateRegistration should be used to add the other chains and to set / update contract addresses.
        function updateRegistration(uint16 _chainID, address _contractAddress) public onlyOwner {
            if (counters[_chainID].chainID == 0) {
                foreignChainIDs.push(_chainID);
                counters[_chainID].chainID = _chainID;
            }

            counters[_chainID].contractAddress = _contractAddress;
        }

        // getMyCounter (call signature 916d5743) returns the counter value for this chain. It is meant to be used in a cross chain query.
        function getMyCounter() public view returns (uint256) {
            return counters[myChainID].counter;
        }

        // getState() returns this chain's view of all the counters. It is meant to be used in the front end.
        function getState() public view returns (ChainEntry[] memory) {
            ChainEntry[] memory ret = new ChainEntry[](foreignChainIDs.length + 1);
            ret[0] = counters[myChainID];
            uint256 length = foreignChainIDs.length;

            for (uint256 i = 0; i < length;) {
                ret[i + 1] = counters[foreignChainIDs[i]];
                unchecked {
                    ++i;
                }
            }

            return ret;
        }

        // @notice Takes the cross chain query response for the other counters, stores the results for the other chains, and updates the counter for this chain.
        function updateCounters(bytes memory response, IWormhole.Signature[] memory signatures) public {
            ParsedQueryResponse memory r = parseAndVerifyQueryResponse(response, signatures);
            uint256 numResponses = r.responses.length;
            if (numResponses != foreignChainIDs.length) {
                revert UnexpectedResultLength();
            }

            for (uint256 i = 0; i < numResponses;) {
                // Create a storage pointer for frequently read and updated data stored on the blockchain
                ChainEntry storage chainEntry = counters[r.responses[i].chainId];
                if (chainEntry.chainID != foreignChainIDs[i]) {
                    revert InvalidForeignChainID();
                }

                EthCallQueryResponse memory eqr = parseEthCallQueryResponse(r.responses[i]);

                // Validate that update is not obsolete
                validateBlockNum(eqr.blockNum, chainEntry.blockNum);

                // Validate that update is not stale
                validateBlockTime(eqr.blockTime, block.timestamp - 300);

                if (eqr.result.length != 1) {
                    revert UnexpectedResultMismatch();
                }

                // Validate addresses and function signatures
                address[] memory validAddresses = new address[](1);
                bytes4[] memory validFunctionSignatures = new bytes4[](1);
                validAddresses[0] = chainEntry.contractAddress;
                validFunctionSignatures[0] = GetMyCounter;

                validateMultipleEthCallData(eqr.result, validAddresses, validFunctionSignatures);

                require(eqr.result[0].result.length == 32, "result is not a uint256");

                chainEntry.blockNum = eqr.blockNum;
                chainEntry.blockTime = eqr.blockTime / 1_000_000;
                chainEntry.counter = abi.decode(eqr.result[0].result, (uint256));

                unchecked {
                    ++i;
                }
            }

            counters[myChainID].blockNum = block.number;
            counters[myChainID].blockTime = block.timestamp;
            counters[myChainID].counter += 1;
        }

        modifier onlyOwner() {
            if (owner != msg.sender) {
                revert InvalidOwner();
            }
            _;
        }
    }
    ```

## Submit a Query Response On-Chain

The `QueryProxyQueryResponse` result requires a slight tweak when submitting to the contract to match the format of `function parseAndVerifyQueryResponse(bytes memory response, IWormhole.Signature[] memory signatures)`. A helper function, `signaturesToEvmStruct`, is provided in the SDK for this.

This example submits the transaction to the demo contract:

```jsx
const tx = await contract.updateCounters(
  `0x${response.data.bytes}`,
  signaturesToEvmStruct(response.data.signatures)
);

```
