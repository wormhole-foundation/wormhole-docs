export interface Chain {
  description: string;
  rpc: string;
  wormholeRelayer: string;
}

export interface ChainConfig {
  description: string;
  chainId: number;
  rpc: string;
  tokenBridge: string;
  wormholeRelayer: string;
  wormhole: string;
}

export interface CrossChainSenderJson {
  abi: any[];
  bytecode: string;
}

export interface CrossChainReceiverJson {
  abi: any[];
  bytecode: string;
}

export interface DeployedContracts {
  sourceChain: {
    chainId: number;
    networkName: string;
    CrossChainSender?: string;
    CrossChainReceiver?: string;
    deployedAt: string;
  };
  targetChain: {
    chainId: number;
    networkName: string;
    CrossChainSender?: string;
    CrossChainReceiver?: string;
    deployedAt: string;
  };
}
