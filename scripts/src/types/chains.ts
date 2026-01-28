// scripts/src/types/chains.ts
import { Contracts } from '@wormhole-foundation/sdk';

// Many chains have the same underlying runtime
export type ChainType =
	| 'EVM'
	| 'SVM'
	| 'CosmWasm'
	| 'Sui Move VM'
	| 'Move VM'
	| 'AVM'
	| 'NEAR VM'
	| 'BTC'
	| '';

export type ProductSupport = {
	mainnet: boolean;
	testnet: boolean;
	devnet: boolean;
};

export type Products = Record<string, ProductSupport>;

export interface NetworkDescription {
	name: string;
	id: string;
}

export interface Finality {
	// Url to get more details about finality/commitment
	details?: string;
	confirmed?: number;
	finalized?: number;
	instant?: number;
	safe?: number;
	otherwise?: string;
}

export interface SiteDescription {
	url: string;
	description?: string;
}

export interface Faucet {
	url?: string;
	description?: string;
	token?: string;
}

export interface ExtraDetails {
	[x: string]: any;
	notes?: string[];
	finality?: Finality;
	title?: string; // title case name of the chain
	homepage?: string; // Url to the homepage of the chain
	explorer?: SiteDescription[]; // urls to explorer sites
	devDocs?: string;
	faucet?: Faucet;
	contractSource?: string; // url to core contract
	examples?: SiteDescription[];
	testnet?: NetworkDescription;
	mainnet?: NetworkDescription;
	products?: Products;
}

export type ChainDetails = {
	name: string; // Chain name
	id: number; // Chain ID
	contracts: Contracts; // Contracts
	extraDetails?: ExtraDetails;
};

export type DocChain = {
	chainType: ChainType; // Chain type
	mainnet: ChainDetails; // MainNet details
	testnets: ChainDetails[]; // TestNet details
	devnets: ChainDetails[]; // DevNet details
	products?: Products; // Supported products
};
