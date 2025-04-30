import {
  EthCallQueryRequest,
  EthCallQueryResponse,
  PerChainQueryRequest,
  QueryRequest,
  QueryResponse,
} from '@wormhole-foundation/wormhole-query-sdk';
import axios from 'axios';
import * as eth from 'web3';

const query_url = 'https://testnet.query.wormhole.com/v1/query';
const rpc = 'https://ethereum-sepolia.rpc.subquery.network/public';
const chain_id = 10002; // Sepolia
const token = '0x1c7D4B196Cb0C7B01d743Fbc6116a902379C7238'; // USDC Contract on Sepolia
const data = '0x06fdde03'; // function selector for `name()`

const apiKey = process.env.API_KEY;
if (!apiKey) throw new Error('API_KEY is not set in your environment');

(async () => {
  const latestBlock = (
    await axios.post(rpc, {
      method: 'eth_getBlockByNumber',
      params: ['latest', false],
      id: 1,
      jsonrpc: '2.0',
    })
  ).data?.result?.number;

  const request = new QueryRequest(1, [
    new PerChainQueryRequest(
      chain_id,
      new EthCallQueryRequest(latestBlock, [{ to: token, data: data }])
    ),
  ]);
  const serialized = request.serialize();

  const response = await axios.post(
    query_url,
    { bytes: Buffer.from(serialized).toString('hex') },
    { headers: { 'X-API-Key': apiKey } }
  );

  const queryResponse = QueryResponse.from(response.data.bytes);
  const chainResponse = queryResponse.responses[0]
    .response as EthCallQueryResponse;
  const name = eth.eth.abi.decodeParameter('string', chainResponse.results[0]);

  console.log('\n\nParsed chain response:');
  console.log(chainResponse);
  console.log('\nToken name:', name);
})();
