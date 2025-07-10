import axios, { AxiosResponse } from 'axios';

// WormholeScan API Client -  simple wrapper for making requests to the WormholeScan API
export class WormholeScanAPI {
  private baseURL: string;

  constructor(isTestnet: boolean = false) {
    this.baseURL = isTestnet
      ? 'https://api.testnet.wormholescan.io/api/v1'
      : 'https://api.wormholescan.io/api/v1';
  }

  async get<T>(endpoint: string, params?: Record<string, any>): Promise<T> {
    try {
      const response: AxiosResponse<T> = await axios.get(
        `${this.baseURL}${endpoint}`,
        {
          params,
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new Error(
          `API request failed: ${error.response?.status} - ${error.response?.statusText}`
        );
      }
      throw new Error(`Unexpected error: ${error}`);
    }
  }

  async getNTTTokens(withLinks: boolean = false) {
    return this.get('/native-token-transfer/token-list', { withLinks });
  }

  async getTokenTransfers(
    params: {
      tokenAddress?: string;
      fromChain?: number;
      toChain?: number;
      page?: number;
      pageSize?: number;
      sortBy?: string;
      sortOrder?: 'asc' | 'desc';
    } = {}
  ) {
    return this.get('/native-token-transfer', params);
  }
}

export const wormholeScanAPI = new WormholeScanAPI();
export const wormholeScanTestnetAPI = new WormholeScanAPI(true);
