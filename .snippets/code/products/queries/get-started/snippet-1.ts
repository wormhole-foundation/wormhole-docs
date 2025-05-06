// Import the SDK types and helpers for making the query
import {
  EthCallQueryRequest,
  EthCallQueryResponse,
  PerChainQueryRequest,
  QueryRequest,
  QueryResponse,
} from '@wormhole-foundation/wormhole-query-sdk';
import axios from 'axios';
import * as eth from 'web3';

// Define the endpoint and query parameters
const query_url = 'https://testnet.query.wormhole.com/v1/query';
const rpc = 'https://ethereum-sepolia.rpc.subquery.network/public';
const chain_id = 10002; // Sepolia (Wormhole chain ID)
const token = '0x1c7D4B196Cb0C7B01d743Fbc6116a902379C7238'; // USDC contract
const data = '0x06fdde03'; // function selector for `name()`

// Load your API key from environment variables
const apiKey = process.env.API_KEY;
if (!apiKey) throw new Error('API_KEY is not set in your environment');

(async () => {
  // Fetch the latest block number (required to anchor the query)
  const latestBlock = (
    await axios.post(rpc, {
      method: 'eth_getBlockByNumber',
      params: ['latest', false],
      id: 1,
      jsonrpc: '2.0',
    })
  ).data?.result?.number;

  // Build the query targeting the token contract's name() function
  const request = new QueryRequest(1, [
    new PerChainQueryRequest(
      chain_id,
      new EthCallQueryRequest(latestBlock, [{ to: token, data: data }])
    ),
  ]);
  const serialized = request.serialize();

  // Send the query to the Wormhole Query Proxy
  const response = await axios.post(
    query_url,
    { bytes: Buffer.from(serialized).toString('hex') },
    { headers: { 'X-API-Key': apiKey } }
  );

  // Decode the response returned by the Guardian network
  const queryResponse = QueryResponse.from(response.data.bytes);
  const chainResponse = queryResponse.responses[0]
    .response as EthCallQueryResponse;
  const name = eth.eth.abi.decodeParameter('string', chainResponse.results[0]);

  // Output the results
  console.log('\n\nParsed chain response:');
  console.log(chainResponse);
  console.log('\nToken name:', name);
})();
