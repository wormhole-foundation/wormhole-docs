import ntt from './ntt-support.json';
import cctp from './cctp-support.json';
import connect from './connect-support.json';

export type NetworkEnvironments = 'Mainnet' | 'Testnet' | 'Devnet';
export type SupportMap = Record<NetworkEnvironments, string[]>;

export const nttSupport = ntt as SupportMap;
export const cctpSupport = cctp as SupportMap;
export const connectSupport = connect as SupportMap;
