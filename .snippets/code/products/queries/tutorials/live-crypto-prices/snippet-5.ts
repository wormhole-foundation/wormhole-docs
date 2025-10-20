export interface QueryApiSuccess {
  ok: true;
  blockNumber: string;
  blockTimeMicros: string;
  price: string;
  decimals: number;
  updatedAt: string;
  stale?: boolean;
}

export interface QueryApiError {
  ok: false;
  error: string;
}
export type QueryApiResponse = QueryApiSuccess | QueryApiError;
