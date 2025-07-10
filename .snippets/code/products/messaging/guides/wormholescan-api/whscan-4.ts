export interface NTTToken {
  symbol: string;
  coingecko_id: string;
  fully_diluted_valuation: string;
  price: string;
  price_change_percentage_24h: string;
  volume_24h: string;
  total_value_transferred: string;
  total_value_locked: string | null;
  market_cap: string;
  circulating_supply: string;
  image: {
    thumb: string;
    small: string;
    large: string;
  };
  platforms: Record<string, string>;
}

export interface NTTTokenDetail {
  home: {
    blockchain: string;
    externalSalt: string | null;
    isCanonical: boolean;
    lastIndexed: number;
    manager: {
      address: string;
      limits: Array<{
        amount: string;
        baseAmount: string;
        blockchain: string;
        type: string;
        wormholeChainId: number;
      }>;
      owner: {
        address: string | null;
        nttOwner: string | null;
      };
      transceivers: Array<{
        address: string;
        index: number;
        type: string;
      }>;
      version: string;
    };
    mode: string;
    token: {
      address: string;
      decimals: number;
      maxSupply: string;
      minter: string;
      name: string;
      owner: string;
      symbol: string;
      totalSupply: string;
    };
    wormholeChainId: number;
  };
  peers: any[];
}

export interface Operation {
  id: string;
  emitterChain: number;
  emitterAddress: {
    hex: string;
    native: string;
  };
  sequence: string;
  vaa?: {
    raw: string;
    guardianSetIndex: number;
    isDuplicated: boolean;
  };
  content: {
    payload: {
      nttManagerMessage: {
        id: string;
        sender: string;
      };
      nttMessage: {
        additionalPayload: string;
        sourceToken: string;
        to: string;
        toChain: number;
        trimmedAmount: {
          amount: string;
          decimals: number;
        };
      };
      transceiverMessage: {
        prefix: string;
        recipientNttManager: string;
        sourceNttManager: string;
        transceiverPayload: string;
      };
    };
    standarizedProperties: {
      appIds: string[];
      fromChain: number;
      fromAddress: string;
      toChain: number;
      toAddress: string;
      tokenChain: number;
      tokenAddress: string;
      amount: string;
      feeAddress: string;
      feeChain: number;
      fee: string;
      normalizedDecimals: number;
    };
  };
  sourceChain?: {
    chainId: number;
    timestamp: string;
    transaction: {
      txHash: string;
    };
    from: string;
    status: string;
    fee: string;
    gasTokenNotional: string;
    feeUSD: string;
  };
  targetChain?: {
    chainId: number;
    timestamp: string;
    transaction: {
      txHash: string;
    };
    status: string;
    from: string;
    to: string;
    fee: string;
    gasTokenNotional: string;
    feeUSD: string;
  };
}

export interface OperationsResponse {
  operations: Operation[];
}
