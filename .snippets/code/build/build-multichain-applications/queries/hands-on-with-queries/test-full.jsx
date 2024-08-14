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
  // form the query request
  const request = new QueryRequest(
    0, // nonce
    [
      new PerChainQueryRequest(
        2, // Ethereum Wormhole Chain ID
        new EthCallQueryRequest(latestBlock, [callData])
      ),
    ]
  );
  //   console.log(JSON.stringify(request, undefined, 2));
  const mock = new QueryProxyMock({ 2: rpc });
  const mockData = await mock.mock(request);
  //   console.log(mockData);
  const mockQueryResponse = QueryResponse.from(mockData.bytes);
  const mockQueryResult = (
    mockQueryResponse.responses[0].response as EthCallQueryResponse
  ).results[0];
  console.log(
    `Mock Query Result: ${mockQueryResult} (${BigInt(mockQueryResult)})`
  );
})();