import ntt from './ntt-support.json';
import cctp from './cctp-support.json';
import cctpV1 from './cctp-v1-support.json';
import cctpV2 from './cctp-v2-support.json';
import connect from './connect-support.json';
import type { Network, SupportMap } from '../types/support';

export type NetworkEnvironments = Network;
export type { SupportMap };

export const nttSupport = ntt as SupportMap;
export const cctpSupport = cctp as SupportMap;
export const cctpV1Support = cctpV1 as SupportMap;
export const cctpV2Support = cctpV2 as SupportMap;
export const connectSupport = connect as SupportMap;
