const rpc = "https://ethereum.publicnode.com";
const latestBlock: string = (
  await axios.post(rpc, {
    method: "eth_getBlockByNumber",
    params: ["latest", false],
    id: 1,
    jsonrpc: "2.0",
  })
).data?.result?.number;