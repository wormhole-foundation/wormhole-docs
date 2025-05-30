const tx = await contract.updateCounters(
  `0x${response.data.bytes}`,
  signaturesToEvmStruct(response.data.signatures)
);
