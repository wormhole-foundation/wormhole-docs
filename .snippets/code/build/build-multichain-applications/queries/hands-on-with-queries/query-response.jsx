const mockQueryResponse = QueryResponse.from(mockData.bytes);
const mockQueryResult = (
  mockQueryResponse.responses[0].response as EthCallQueryResponse
).results[0];
console.log(
  `Mock Query Result: ${mockQueryResult} (${BigInt(mockQueryResult)})`
);
// Mock Query Result: 0x000000000000000000000000000000000000000000029fd09d4d81addb3ccfee (3172556167631284394053614)