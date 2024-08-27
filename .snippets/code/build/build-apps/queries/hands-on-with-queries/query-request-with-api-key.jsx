const serialized = request.serialize();
const proxyResponse = (await axios.post)<QueryProxyQueryResponse>(
  QUERY_URL,
  {
    bytes: Buffer.from(serialized).toString('hex'),
  },
  { headers: { 'X-API-Key': YOUR_API_KEY } }
);
