const mock = new QueryProxyMock({ 2: rpc });
const mockData = await mock.mock(request);
console.log(mockData);
// {
//   signatures: ['...'],
//   bytes: '...'
// }