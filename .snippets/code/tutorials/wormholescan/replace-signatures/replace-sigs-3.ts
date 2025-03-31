export const PARSE_AND_VERIFY_VM_ABI = {
  inputs: [{ internalType: 'bytes', name: 'encodedVM', type: 'bytes' }],
  name: 'parseAndVerifyVM',
  outputs: [
    {
      components: [
        { internalType: 'uint8', name: 'version', type: 'uint8' },
        { internalType: 'uint32', name: 'timestamp', type: 'uint32' },
        { internalType: 'uint32', name: 'nonce', type: 'uint32' },
        { internalType: 'uint16', name: 'emitterChainId', type: 'uint16' },
        { internalType: 'bytes32', name: 'emitterAddress', type: 'bytes32' },
        { internalType: 'uint64', name: 'sequence', type: 'uint64' },
        { internalType: 'uint8', name: 'consistencyLevel', type: 'uint8' },
        { internalType: 'bytes', name: 'payload', type: 'bytes' },
        { internalType: 'uint32', name: 'guardianSetIndex', type: 'uint32' },
        {
          components: [
            { internalType: 'bytes32', name: 'r', type: 'bytes32' },
            { internalType: 'bytes32', name: 's', type: 'bytes32' },
            { internalType: 'uint8', name: 'v', type: 'uint8' },
            { internalType: 'uint8', name: 'guardianIndex', type: 'uint8' },
          ],
          internalType: 'struct Structs.Signature[]',
          name: 'signatures',
          type: 'tuple[]',
        },
        { internalType: 'bytes32', name: 'hash', type: 'bytes32' },
      ],
      internalType: 'struct Structs.VM',
      name: 'vm',
      type: 'tuple',
    },
    { internalType: 'bool', name: 'valid', type: 'bool' },
    { internalType: 'string', name: 'reason', type: 'string' },
  ],
  stateMutability: 'view',
  type: 'function',
};
