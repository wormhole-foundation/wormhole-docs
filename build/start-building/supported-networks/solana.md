---
title: Solana
description: Learn how to work with Wormhole in the Solana ecosystem with tools, address formats, contract details, and finality levels across different environments.
---

# Solana

This page includes details for working with the Solana environment chains.

## Developer Tools

To develop contracts for Solana, you'll need to have the following tools installed:

- [Cargo](https://doc.rust-lang.org/cargo/getting-started/installation.html){target=_blank}, a Rust build tool and package manager
- [Solana CLI tools](https://docs.solana.com/cli/install-solana-cli-tools){target=_blank} - CLI tools for working with Solana
- [Anchor](https://www.anchor-lang.com/docs/installation){target=_blank} - Smart contract development framework

Install [Wormhole Rust crates](https://lib.rs/crates/wormhole-token-bridge-solana){target=_blank} to interact with Solana on-chain programs and Token Bridge.

!!! warning
	Known issues exist with Solana version 1.15 - downgrade to Solana 1.14.14

## Addresses

Because Wormhole works with many environments, the Wormhole address format is normalized. For Solana-based chains, a Wormhole formatted address is the base58 decoded address. E.g. `worm2ZoG2kUd4vFXhvjh93UUH596ayRfgQ2MgjNMTth` becomes `0x0e0a589a41a55fbd66c52a475f2d92a6d3dc9b4747114cb9af825a98b545d3ce`

## Emitter 

The emitter address on Solana chains is a Program-Derived Address derived by the application and normalized to the Wormhole address format. 

!!! note 
	As the application developer, you decide whether this address will remain consistent over time or change. It is strongly recommended that you keep it consistent.

## Solana

!!! note
	The contract addresses for `testnet` are on the Solana `devnet`

### Ecosystem

- [Website](https://solana.com/){target=_blank}
- [Blockchain Explorer](https://explorer.solana.com/){target=_blank}
- [Developer Docs](https://solana.com/developers){target=_blank}

### Wormhole Details

- Name: `solana`
- Chain ID: `1`
- Contract Source: No source file

### Consistency Levels

The options for [`consistencyLevel`](/docs/build/reference/consistency-levels/){target=\_blank} (i.e., finality) are:

|Level|Value|
|-----|-----|
|Confirmed|0|
|Finalized|1|

For more information, see [the Solana Docs](https://docs.solana.com/cluster/commitments){target=_blank}.

=== "MainNet"

	`Mainnet Beta - 5eykt4UsFv8P8NJdTREpY1vzqKqZKvdpKuc147dw2N9d`
	
	|    Type    |                                                                 Contract                                                                  |
	|:----------:|:----------------------------------------------------------------------------------------------------------------------------------------:|
	|    Core    | [`worm2ZoG2kUd4vFXhvjh93UUH596ayRfgQ2MgjNMTth`](https://explorer.solana.com/address/worm2ZoG2kUd4vFXhvjh93UUH596ayRfgQ2MgjNMTth){target=_blank} |
	| Token Bridge | [`wormDTUJ6AWPNvk59vGQbDvGJmqbDTdgWgAqcLBCgUb`](https://explorer.solana.com/address/wormDTUJ6AWPNvk59vGQbDvGJmqbDTdgWgAqcLBCgUb){target=_blank} |
	| NFT Bridge   | [`WnFt12ZrnzZrFZkt2xsNsaNWoQribnuQ5B5FrDbwDhD`](https://explorer.solana.com/address/WnFt12ZrnzZrFZkt2xsNsaNWoQribnuQ5B5FrDbwDhD){target=_blank} |

=== "TestNet"

	`DevNet - EtWTRABZaYq6iMfeYKouRu166VU2xqa1wcaWoxPkrZBG`

	|    Type    |                                                                  Contract                                                                  |
	|:----------:|:------------------------------------------------------------------------------------------------------------------------------------------:|
	|    Core    | [`3u8hJUVTA4jH1wYAyUur7FFZVQ8H635K3tSHHF4ssjQ5`](https://explorer.solana.com/address/3u8hJUVTA4jH1wYAyUur7FFZVQ8H635K3tSHHF4ssjQ5?cluster=devnet){target=_blank} |
	| Token Bridge | [`DZnkkTmCiFWfYTfT41X3Rd1kDgozqzxWaHqsw6W4x2oe`](https://explorer.solana.com/address/DZnkkTmCiFWfYTfT41X3Rd1kDgozqzxWaHqsw6W4x2oe?cluster=devnet){target=_blank} |
	| NFT Bridge   | [`2rHhojZ7hpu1zA91nvZmT8TqWWvMcKmmNBCr2mKTtMq4`](https://explorer.solana.com/address/2rHhojZ7hpu1zA91nvZmT8TqWWvMcKmmNBCr2mKTtMq4?cluster=devnet){target=_blank} |

=== "Local Network Contract"

	|    Type    |               Contract               |
	|:----------:|:------------------------------------:|
	|    Core    | `Bridge1p5gheXUvJ6jGWGeCsgPKgnE3YgdGKRVCMY9o`  |
	| Token Bridge | `B6RHG3mfcckmrYN1UhmJzyS1XX3fZKbkeUcpJe9Sy3FE` |
	| NFT Bridge   | `NFTWqJR8YnRVqPDvTJrYuLrQDitTG5AScqbeghi4zSA`  |

  
## Pythnet

### Ecosystem

- [Website](https://pyth.network/){target=_blank}
- [Developer Docs](https://docs.pyth.network/home){target=_blank}

### Wormhole Details

- Name: `pythnet`
- Chain ID: `26`
- Contract Source: No source file

=== "MainNet"

	|    Type    |                                                            Contract                                                            |
	|:----------:|:------------------------------------------------------------------------------------------------------------------------------:|
	|    Core    | [`H3fxXJ86ADW2PNuDDmZJg6mzTtPxkYCpNuQUTgmJ7AjU`](https://explorer.solana.com/address/H3fxXJ86ADW2PNuDDmZJg6mzTtPxkYCpNuQUTgmJ7AjU){target=_blank} |
	| Token Bridge |                                                              N/A                                                              |
	| NFT Bridge   |                                                              N/A                                                              |

=== "TestNet"

	|    Type    |                                                                 Contract                                                                 |
	|:----------:|:---------------------------------------------------------------------------------------------------------------------------------------:|
	|    Core    | [`EUrRARh92Cdc54xrDn6qzaqjA77NRrCcfbr8kPwoTL4z`](https://explorer.solana.com/address/EUrRARh92Cdc54xrDn6qzaqjA77NRrCcfbr8kPwoTL4z?cluster=devnet){target=_blank} |
	| Token Bridge |                                                              N/A                                                              |
	| NFT Bridge   |                                                              N/A                                                              |

=== "Local Network"

	|    Type    | Contract |
	|:----------:|:--------:|
	|    Core    |    N/A   |
	| Token Bridge |    N/A   |
	| NFT Bridge   |    N/A   |