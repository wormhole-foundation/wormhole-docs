---
title: EVM
description: This page includes important information for EVM chains supported by Wormhole, including contract addresses, chain IDs, bridge addresses, and other constants.
---

# EVM Network Details

This page includes details for working with EVM environment chains.

## Developer tools

The recommended development tool for EVM environments is [Foundry](https://book.getfoundry.sh/getting-started/installation){target=_blank}.

## Addresses

Because Wormhole works with many environments, the Wormhole address format is normalized. For EVM chains, a Wormhole formatted address is the 20-byte EVM standard address left padded with zeroes. e.g. `0xd8da6bf26964af9d7eed9e03e53415d37aa96045` becomes `0x000000000000000000000000d8da6bf26964af9d7eed9e03e53415d37aa96045`.

## Emitter 

The emitter address on EVM chains is the contract address, normalized to the wormhole address format.

## Ethereum

Deployed contracts are also available on the [Sepolia](#sepolia) TestNet.

### Ecosystem

- [Website](https://ethereum.org/){target=_blank}
- Block Explorers: [https://etherscan.io/](https://etherscan.io/){target=_blank}
- [https://ethereum.org/en/developers/docs/](https://ethereum.org/en/developers/docs/){target=_blank}

### Wormhole Details

- Name: `ethereum`
- Chain ID: `2`
- Contract Source: [ethereum/contracts/bridge/Bridge.sol](https://github.com/wormhole-foundation/wormhole/blob/main/ethereum/contracts/bridge/Bridge.sol){target=_blank}

### Consistency Levels

The options for [`consistencyLevel`](/docs/build/reference/consistency-levels/){target=\_blank} (i.e., finality) are:

|  Level  | Value |
|:-------:|:-----:|
| Instant |  200  |
|  Safe   |  201  |

If a value is passed that isn't in the preceding set, it's assumed to mean finalized. For more information,, see [https://www.alchemy.com/overviews/ethereum-commitment-levels](https://www.alchemy.com/overviews/ethereum-commitment-levels){target=_blank}.

=== "MainNet"

|     Type     |                                                                Contract                                                                |
|:------------:|:--------------------------------------------------------------------------------------------------------------------------------------:|
|     Core     | [`0x98f3c9e6E3fAce36bAAd05FE09d375Ef1464288B`](https://etherscan.io/address/0x98f3c9e6E3fAce36bAAd05FE09d375Ef1464288B){target=_blank} |
| Token Bridge | [`0x3ee18B2214AFF97000D974cf647E7C347E8fa585`](https://etherscan.io/address/0x3ee18B2214AFF97000D974cf647E7C347E8fa585){target=_blank} |
|  NFT Bridge  | [`0x6FFd7EdE62328b3Af38FCD61461Bbfc52F5651fE`](https://etherscan.io/address/0x6FFd7EdE62328b3Af38FCD61461Bbfc52F5651fE){target=_blank} |
|   Relayer    | [`0x27428DD2d3DD32A4D7f7C497eAaa23130d894911`](https://etherscan.io/address/0x27428DD2d3DD32A4D7f7C497eAaa23130d894911){target=_blank} |
|     CCTP     | [`0xAaDA05BD399372f0b0463744C09113c137636f6a`](https://etherscan.io/address/0xAaDA05BD399372f0b0463744C09113c137636f6a){target=_blank} |

=== "TestNet `Holesky - 17000`"

|      Type       |                   Contract                   |
|:---------------:|:--------------------------------------------:|
|      Core       | `0x706abc4E45D419950511e474C7B9Ed348A4a716c` |
|  Token Bridge   | `0xF890982f9310df57d00f659cf4fd87e65adEd8d7` |
|   NFT Bridge    | `0xD8E4C2DbDd2e2bd8F1336EA691dBFF6952B1a6eB` |
|     Relayer     | `0x28D8F1Be96f97C1387e94A53e00eCcFb4E75175a` |
|  MockProvider   | `0xD1463B4fe86166768d2ff51B1A928beBB5c9f375` |
| MockIntegration | `0xb81bc199b73AB34c393a4192C163252116a03370` |

=== "Local Network"

|      Type       |                   Contract                   |
|:---------------:|:--------------------------------------------:|
|      Core       | `0xC89Ce4735882C9F0f0FE26686c53074E09B0D550` |
|  Token Bridge   | `0x0290FB167208Af455bB137780163b7B7a9a10C16` |
|   NFT Bridge    | `0x26b4afb60d6c903165150c6f0aa14f8016be4aec` |
|     Relayer     | `0xb98F46E96cb1F519C333FdFB5CCe0B13E0300ED4` |
|  MockProvider   | `0x1ef9e15c3bbf0555860b5009B51722027134d53a` |
| MockIntegration | `0x0eb0dD3aa41bD15C706BC09bC03C002b7B85aeAC` |

## Other EVM Chains

Besides Ethereum, several other EVM chains are supported.

## Acala

### Ecosystem

- [Website](https://acala.network/){target=_blank}
- Block Explorers: [https://acala.subscan.io/](https://acala.subscan.io/){target=_blank} | [https://blockscout.acala.network/](https://blockscout.acala.network/){target=_blank}
- [Developer docs](https://evmdocs.acala.network/){target=_blank} | [Faucet](https://evmdocs.acala.network/tooling/faucet){target=_blank}

### Wormhole Details

- Name: `acala`
- Chain ID: `12`
- Contract Source: [ethereum/contracts/bridge/Bridge.sol](https://github.com/wormhole-foundation/wormhole/blob/main/ethereum/contracts/bridge/Bridge.sol){target=_blank}

### Consistency Levels

The options for [`consistencyLevel`](/docs/build/reference/consistency-levels/){target=\_blank} (i.e., finality) are:

|  Level  | Value |
|:-------:|:-----:|
| Instant |  200  |

If a value is passed that isn't in the preceding set, it's assumed to mean finalized.


=== "MainNet `787`"

|     Type     |                                                                      Contract                                                                      |
|:------------:|:--------------------------------------------------------------------------------------------------------------------------------------------------:|
|     Core     | [`0xa321448d90d4e5b0A732867c18eA198e75CAC48E`](https://blockscout.acala.network/address/0xa321448d90d4e5b0A732867c18eA198e75CAC48E){target=_blank} |
| Token Bridge | [`0xae9d7fe007b3327AA64A32824Aaac52C42a6E624`](https://blockscout.acala.network/address/0xae9d7fe007b3327AA64A32824Aaac52C42a6E624){target=_blank} |
|  NFT Bridge  | [`0xb91e3638F82A1fACb28690b37e3aAE45d2c33808`](https://blockscout.acala.network/address/0xb91e3638F82A1fACb28690b37e3aAE45d2c33808){target=_blank} |
|   Relayer    | [`0x27428DD2d3DD32A4D7f7C497eAaa23130d894911`](https://blockscout.acala.network/address/0x27428DD2d3DD32A4D7f7C497eAaa23130d894911){target=_blank} |

=== "TestNet `597`"

|     Type     |                   Contract                   |
|:------------:|:--------------------------------------------:|
|     Core     | `0x4377B49d559c0a9466477195C6AdC3D433e265c0` |
| Token Bridge | `0xebA00cbe08992EdD08ed7793E07ad6063c807004` |
|  NFT Bridge  | `0x96f1335e0AcAB3cfd9899B30b2374e25a2148a6E` |

=== "Local Network Contract"

|     Type     | Contract |
|:------------:|:--------:|
|     Core     |   N/A    |
| Token Bridge |   N/A    |
|  NFT Bridge  |   N/A    |

## Arbitrum

### Ecosystem

- [Website](https://arbitrum.io/){target=_blank}
- [Arbitrum Explorer](https://arbiscan.io/){target=_blank}
- [Developer Docs](https://developer.arbitrum.io/getting-started-devs){target=_blank}

### Wormhole Details

- Name: `arbitrum`
- Chain ID: `23`
- Contract Source: No source file

### Consistency Levels

The options for [`consistencyLevel`](/docs/build/reference/consistency-levels/){target=\_blank} (i.e., finality) are:

|  Level  | Value |
|:-------:|:-----:|
| Instant |  200  |

If a value is passed that isn't in the preceding set, it's assumed to mean finalized.

For more information,, see [https://developer.arbitrum.io/tx-lifecycle](https://developer.arbitrum.io/tx-lifecycle){target=_blank}.

=== "MainNet `Arbitrum One - 42161`"

|     Type     |                                                               Contract                                                                |
|:------------:|:-------------------------------------------------------------------------------------------------------------------------------------:|
|     Core     | [`0xa5f208e072434bC67592E4C49C1B991BA79BCA46`](https://arbiscan.io/address/0xa5f208e072434bC67592E4C49C1B991BA79BCA46){target=_blank} |
| Token Bridge | [`0x0b2402144Bb366A632D14B83F244D2e0e21bD39c`](https://arbiscan.io/address/0x0b2402144Bb366A632D14B83F244D2e0e21bD39c){target=_blank} |
|  NFT Bridge  | [`0x3dD14D553cFD986EAC8e3bddF629d82073e188c8`](https://arbiscan.io/address/0x3dD14D553cFD986EAC8e3bddF629d82073e188c8){target=_blank} |
|   Relayer    | [`0x27428DD2d3DD32A4D7f7C497eAaa23130d894911`](https://arbiscan.io/address/0x27428DD2d3DD32A4D7f7C497eAaa23130d894911){target=_blank} |
|     CCTP     | [`0x2703483B1a5a7c577e8680de9Df8Be03c6f30e3c`](https://arbiscan.io/address/0x2703483B1a5a7c577e8680de9Df8Be03c6f30e3c){target=_blank} |

=== "TestNet `Sepolia - 421614`"

|      Type       |                                                                   Contract                                                                    |
|:---------------:|:---------------------------------------------------------------------------------------------------------------------------------------------:|
|      Core       | [`0xC7A204bDBFe983FCD8d8E61D02b475D4073fF97e`](https://sepolia.arbiscan.io/address/0xC7A204bDBFe983FCD8d8E61D02b475D4073fF97e){target=_blank} |
|  Token Bridge   | [`0x23908A62110e21C04F3A4e011d24F901F911744A`](https://sepolia.arbiscan.io/address/0x23908A62110e21C04F3A4e011d24F901F911744A){target=_blank} |
|   NFT Bridge    | [`0xEe3dB83916Ccdc3593b734F7F2d16D630F39F1D0`](https://sepolia.arbiscan.io/address/0xEe3dB83916Ccdc3593b734F7F2d16D630F39F1D0){target=_blank} |
|     Relayer     | [`0xAd753479354283eEE1b86c9470c84D42f229FF43`](https://sepolia.arbiscan.io/address/0xAd753479354283eEE1b86c9470c84D42f229FF43){target=_blank} |
|  MockProvider   | [`0x90995DBd1aae85872451b50A569dE947D34ac4ee`](https://sepolia.arbiscan.io/address/0x90995DBd1aae85872451b50A569dE947D34ac4ee){target=_blank} |
| MockIntegration | [`0x0de48f34E14d08934DA1eA2286Be1b2BED5c062a`](https://sepolia.arbiscan.io/address/0x0de48f34E14d08934DA1eA2286Be1b2BED5c062a){target=_blank} |

=== "Local Network"

|     Type     | Contract |
|:------------:|:--------:|
|     Core     |   N/A    |
| Token Bridge |   N/A    |
|  NFT Bridge  |   N/A    |

## Aurora

### Ecosystem

- [Website](https://aurora.dev/){target=_blank}
- [Block Explorer](https://explorer.aurora.dev/){target=_blank}
- [Developer docs](https://doc.aurora.dev/){target=_blank} | [Faucet](https://aurora.dev/faucet){target=_blank}

### Wormhole Details

- Name: `aurora`
- Chain ID: `9`
- Contract Source: [ethereum/contracts/bridge/Bridge.sol](https://github.com/wormhole-foundation/wormhole/blob/main/ethereum/contracts/bridge/Bridge.sol){target=_blank}

=== "MainNet `1313161554`"

|     Type     |                                                                   Contract                                                                    |
|:------------:|:---------------------------------------------------------------------------------------------------------------------------------------------:|
|     Core     | [`0xa321448d90d4e5b0A732867c18eA198e75CAC48E`](https://explorer.aurora.dev/address/0xa321448d90d4e5b0A732867c18eA198e75CAC48E){target=_blank} |
| Token Bridge | [`0x51b5123a7b0F9b2bA265f9c4C8de7D78D52f510F`](https://explorer.aurora.dev/address/0x51b5123a7b0F9b2bA265f9c4C8de7D78D52f510F){target=_blank} |
|  NFT Bridge  | [`0x6dcC0484472523ed9Cdc017F711Bcbf909789284`](https://explorer.aurora.dev/address/0x6dcC0484472523ed9Cdc017F711Bcbf909789284){target=_blank} |

=== "TestNet `1313161555`"

|     Type     |                                                                       Contract                                                                        |
|:------------:|:-----------------------------------------------------------------------------------------------------------------------------------------------------:|
|     Core     | [`0xBd07292de7b505a4E803CEe286184f7Acf908F5e`](https://explorer.testnet.aurora.dev/address/0xBd07292de7b505a4E803CEe286184f7Acf908F5e){target=_blank} |
| Token Bridge | [`0xD05eD3ad637b890D68a854d607eEAF11aF456fba`](https://explorer.testnet.aurora.dev/address/0xD05eD3ad637b890D68a854d607eEAF11aF456fba){target=_blank} |
|  NFT Bridge  | [`0x8F399607E9BA2405D87F5f3e1B78D950b44b2e24`](https://explorer.testnet.aurora.dev/address/0x8F399607E9BA2405D87F5f3e1B78D950b44b2e24){target=_blank} |

=== "Local Network"

|     Type     | Contract |
|:------------:|:--------:|
|     Core     |   N/A    |
| Token Bridge |   N/A    |
|  NFT Bridge  |   N/A    |

## Avalanche

### Ecosystem

- [Website](https://www.avax.network/){target=_blank}
- [C-Chain Block Explorer](https://snowscan.xyz/){target=_blank} | [https://subnets.avax.network/](https://subnets.avax.network/){target=_blank}
- [Developer docs](https://docs.avax.network/){target=_blank} | [Faucet](https://core.app/tools/TestNet-faucet/?subnet=c&token=c){target=_blank}

### Wormhole Details

- Name: `avalanche`
- Chain ID: `6`
- Contract Source: [ethereum/contracts/bridge/Bridge.sol](https://github.com/wormhole-foundation/wormhole/blob/main/ethereum/contracts/bridge/Bridge.sol){target=_blank}

### Consistency Levels

The options for [`consistencyLevel`](/docs/build/reference/consistency-levels/){target=\_blank} (i.e., finality) are:

|   Level   | Value |
|:---------:|:-----:|
| Finalized |   0   |

This field may be ignored since the chain provides instant finality.

For more information, see [https://docs.avax.network/build/dapp/advanced/integrate-exchange#determining-finality](https://docs.avax.network/build/dapp/advanced/integrate-exchange#determining-finality){target=_blank}.

=== "MainNet `C-Chain - 43114`"

|     Type     |                                                                Contract                                                                |
|:------------:|:--------------------------------------------------------------------------------------------------------------------------------------:|
|     Core     | [`0x54a8e5f9c4CbA08F9943965859F6c34eAF03E26c`](https://snowscan.xyz/address/0x54a8e5f9c4CbA08F9943965859F6c34eAF03E26c){target=_blank} |
| Token Bridge | [`0x0e082F06FF657D94310cB8cE8B0D9a04541d8052`](https://snowscan.xyz/address/0x0e082F06FF657D94310cB8cE8B0D9a04541d8052){target=_blank} |
|  NFT Bridge  | [`0xf7B6737Ca9c4e08aE573F75A97B73D7a813f5De5`](https://snowscan.xyz/address/0xf7B6737Ca9c4e08aE573F75A97B73D7a813f5De5){target=_blank} |
|   Relayer    | [`0x27428DD2d3DD32A4D7f7C497eAaa23130d894911`](https://snowscan.xyz/address/0x27428DD2d3DD32A4D7f7C497eAaa23130d894911){target=_blank} |
|     CCTP     | [`0x09Fb06A271faFf70A651047395AaEb6265265F13`](https://snowscan.xyz/address/0x09Fb06A271faFf70A651047395AaEb6265265F13){target=_blank} |

=== "TestNet `Fuji - 43113`"

|       Type       |                                                                    Contract                                                                    |
|:----------------:|:----------------------------------------------------------------------------------------------------------------------------------------------:|
|       Core       | [`0x7bbcE28e64B3F8b84d876Ab298393c38ad7aac4C`](https://testnet.snowscan.xyz/address/0x7bbcE28e64B3F8b84d876Ab298393c38ad7aac4C){target=_blank} |
|   Token Bridge   | [`0x61E44E506Ca5659E6c0bba9b678586fA2d729756`](https://testnet.snowscan.xyz/address/0x61E44E506Ca5659E6c0bba9b678586fA2d729756){target=_blank} |
|    NFT Bridge    | [`0xD601BAf2EEE3C028344471684F6b27E789D9075D`](https://testnet.snowscan.xyz/address/0xD601BAf2EEE3C028344471684F6b27E789D9075D){target=_blank} |
|     Relayer      | [`0xA3cF45939bD6260bcFe3D66bc73d60f19e49a8BB`](https://testnet.snowscan.xyz/address/0xA3cF45939bD6260bcFe3D66bc73d60f19e49a8BB){target=_blank} |
|  Mock Provider   | [`0x60a86b97a7596eBFd25fb769053894ed0D9A8366`](https://testnet.snowscan.xyz/address/0x60a86b97a7596eBFd25fb769053894ed0D9A8366){target=_blank} |
| Mock Integration | [`0x5E52f3eB0774E5e5f37760BD3Fca64951D8F74Ae`](https://testnet.snowscan.xyz/address/0x5E52f3eB0774E5e5f37760BD3Fca64951D8F74Ae){target=_blank} |
|       CCTP       | [`0x58f4c17449c90665891c42e14d34aae7a26a472e`](https://testnet.snowscan.xyz/address/0x58f4c17449c90665891c42e14d34aae7a26a472e){target=_blank} |

=== "Local Network"

|     Type     | Contract |
|:------------:|:--------:|
|     Core     |   N/A    |
| Token Bridge |   N/A    |
|  NFT Bridge  |   N/A    |

## Base

### Ecosystem

- [Website](https://base.org/){target=_blank}
- [Block Explorer](https://basescan.org/){target=_blank} 
- [Developer docs](https://docs.base.org/){target=_blank}

### Wormhole Details

- Name: `base`
- Chain ID: `30`
- Contract Source: [ethereum/contracts/bridge/Bridge.sol](https://github.com/wormhole-foundation/wormhole/blob/main/ethereum/contracts/bridge/Bridge.sol){target=_blank}

=== "MainNet ` 8453`"

|     Type     |                                                                Contract                                                                |
|:------------:|:--------------------------------------------------------------------------------------------------------------------------------------:|
|     Core     | [`0xbebdb6C8ddC678FfA9f8748f85C815C556Dd8ac6`](https://basescan.org/address/0xbebdb6C8ddC678FfA9f8748f85C815C556Dd8ac6){target=_blank} |
| Token Bridge | [`0x8d2de8d2f73F1F4cAB472AC9A881C9b123C79627`](https://basescan.org/address/0x8d2de8d2f73F1F4cAB472AC9A881C9b123C79627){target=_blank} |
|  NFT Bridge  | [`0xDA3adC6621B2677BEf9aD26598e6939CF0D92f88`](https://basescan.org/address/0xDA3adC6621B2677BEf9aD26598e6939CF0D92f88){target=_blank} |
|   Relayer    | [`0x706f82e9bb5b0813501714ab5974216704980e31`](https://basescan.org/address/0x706f82e9bb5b0813501714ab5974216704980e31){target=_blank} |
|     CCTP     | [`0x03faBB06Fa052557143dC28eFCFc63FC12843f1D`](https://basescan.org/address/0x03faBB06Fa052557143dC28eFCFc63FC12843f1D){target=_blank} |

=== "TestNet `Base Goerli - 84531`"

|       Type       |                                                                    Contract                                                                    |
|:----------------:|:----------------------------------------------------------------------------------------------------------------------------------------------:|
|       Core       | [`0x23908A62110e21C04F3A4e011d24F901F911744A`](https://sepolia.basescan.org/address/0x23908A62110e21C04F3A4e011d24F901F911744A){target=_blank} |
|   Token Bridge   | [`0xA31aa3FDb7aF7Db93d18DDA4e19F811342EDF780`](https://sepolia.basescan.org/address/0xA31aa3FDb7aF7Db93d18DDA4e19F811342EDF780){target=_blank} |
|    NFT Bridge    | [`0xF681d1cc5F25a3694E348e7975d7564Aa581db59`](https://sepolia.basescan.org/address/0xF681d1cc5F25a3694E348e7975d7564Aa581db59){target=_blank} |
|     Relayer      | [`0xea8029CD7FCAEFFcD1F53686430Db0Fc8ed384E1`](https://sepolia.basescan.org/address/0xea8029CD7FCAEFFcD1F53686430Db0Fc8ed384E1){target=_blank} |
|  Mock Provider   | [`0x60a86b97a7596eBFd25fb769053894ed0D9A8366`](https://sepolia.basescan.org/address/0x60a86b97a7596eBFd25fb769053894ed0D9A8366){target=_blank} |
| Mock Integration | [`0x9Ee656203B0DC40cc1bA3f4738527779220e3998`](https://sepolia.basescan.org/address/0x9Ee656203B0DC40cc1bA3f4738527779220e3998){target=_blank} |

=== "Local Network"

|     Type     | Contract |
|:------------:|:--------:|
|     Core     |   N/A    |
| Token Bridge |   N/A    |
|  NFT Bridge  |   N/A    |


## BNB Smart Chain {: #bsc }

### Ecosystem

- [Website](https://www.bnbchain.org/en/smartChain){target=_blank}
- [Etherscan](https://bscscan.com/){target=_blank}
- [Developer docs](https://docs.bnbchain.org/docs/learn/intro){target=_blank} | [Faucet](https://TestNet.binance.org/faucet-smart/){target=_blank}

### Wormhole Details

- Name: `bsc`
- Chain ID: `4`
- Contract Source: [ethereum/contracts/bridge/Bridge.sol](https://github.com/wormhole-foundation/wormhole/blob/main/ethereum/contracts/bridge/Bridge.sol){target=_blank}

### Consistency Levels

The options for [`consistencyLevel`](/docs/build/reference/consistency-levels/){target=\_blank} (i.e., finality) are:

|  Level  | Value |
|:-------:|:-----:|
| Instant |  200  |
|  Safe   |  201  |

If a value is passed that isn't in the preceding set, it's assumed to mean finalized. For more information, see [https://docs.bnbchain.org/docs/learn/consensus](https://docs.bnbchain.org/docs/learn/consensus){target=_blank}.

=== "MainNet `56`"

|     Type     |                                                               Contract                                                                |
|:------------:|:-------------------------------------------------------------------------------------------------------------------------------------:|
|     Core     | [`0x98f3c9e6E3fAce36bAAd05FE09d375Ef1464288B`](https://bscscan.com/address/0x98f3c9e6E3fAce36bAAd05FE09d375Ef1464288B){target=_blank} |
| Token Bridge | [`0xB6F6D86a8f9879A9c87f643768d9efc38c1Da6E7`](https://bscscan.com/address/0xB6F6D86a8f9879A9c87f643768d9efc38c1Da6E7){target=_blank} |
|  NFT Bridge  | [`0x5a58505a96D1dbf8dF91cB21B54419FC36e93fdE`](https://bscscan.com/address/0x5a58505a96D1dbf8dF91cB21B54419FC36e93fdE){target=_blank} |
|   Relayer    | [`0x27428DD2d3DD32A4D7f7C497eAaa23130d894911`](https://bscscan.com/address/0x27428DD2d3DD32A4D7f7C497eAaa23130d894911){target=_blank} |

=== "TestNet `97`"

|       Type       |                                                                   Contract                                                                    |
|:----------------:|:---------------------------------------------------------------------------------------------------------------------------------------------:|
|       Core       | [`0x68605AD7b15c732a30b1BbC62BE8F2A509D74b4D`](https://testnet.bscscan.com/address/0x68605AD7b15c732a30b1BbC62BE8F2A509D74b4D){target=_blank} |
|   Token Bridge   | [`0x9dcF9D205C9De35334D646BeE44b2D2859712A09`](https://testnet.bscscan.com/address/0x9dcF9D205C9De35334D646BeE44b2D2859712A09){target=_blank} |
|    NFT Bridge    | [`0xcD16E5613EF35599dc82B24Cb45B5A93D779f1EE`](https://testnet.bscscan.com/address/0xcD16E5613EF35599dc82B24Cb45B5A93D779f1EE){target=_blank} |
|     Relayer      | [`0x80aC94316391752A193C1c47E27D382b507c93F3`](https://testnet.bscscan.com/address/0x80aC94316391752A193C1c47E27D382b507c93F3){target=_blank} |
|  Mock Provider   | [`0x60a86b97a7596eBFd25fb769053894ed0D9A8366`](https://testnet.bscscan.com/address/0x60a86b97a7596eBFd25fb769053894ed0D9A8366){target=_blank} |
| Mock Integration | [`0xb6A04D6672F005787147472Be20d39741929Aa03`](https://testnet.bscscan.com/address/0xb6A04D6672F005787147472Be20d39741929Aa03){target=_blank} |

=== "Local Network"

|       Type       |                   Contract                   |
|:----------------:|:--------------------------------------------:|
|       Core       | `0xC89Ce4735882C9F0f0FE26686c53074E09B0D550` |
|   Token Bridge   | `0x0290FB167208Af455bB137780163b7B7a9a10C16` |
|    NFT Bridge    | `0x26b4afb60d6c903165150c6f0aa14f8016be4aec` |
|     Relayer      | `0xb98F46E96cb1F519C333FdFB5CCe0B13E0300ED4` |
|  Mock Provider   | `0x1ef9e15c3bbf0555860b5009B51722027134d53a` |
| Mock Integration | `0x0eb0dD3aa41bD15C706BC09bC03C002b7B85aeAC` |

## Celo

### Ecosystem

- [Website](https://celo.org/){target=_blank}
- [https://explorer.celo.org/](https://explorer.celo.org/){target=_blank} | [https://celoscan.io/](https://celoscan.io/){target=_blank}
- [Developer docs](https://docs.celo.org/){target=_blank} | [Faucet](https://faucet.celo.org/alfajores){target=_blank}

### Wormhole Details

- Name: `celo`
- Chain ID: `14`
- Contract Source: [ethereum/contracts/bridge/Bridge.sol](https://github.com/wormhole-foundation/wormhole/blob/main/ethereum/contracts/bridge/Bridge.sol){target=_blank}

### Consistency Levels

The options for [`consistencyLevel`](/docs/build/reference/consistency-levels/){target=\_blank} (i.e., finality) are:

|  Level  | Value |
|:-------:|:-----:|
| Instant |  200  |

If a value is passed that isn't in the preceding set, it's assumed to mean finalized.

=== "MainNet `42220`"

|     Type     |                                                               Contract                                                                |
|:------------:|:-------------------------------------------------------------------------------------------------------------------------------------:|
|     Core     | [`0xa321448d90d4e5b0A732867c18eA198e75CAC48E`](https://celoscan.io/address/0xa321448d90d4e5b0A732867c18eA198e75CAC48E){target=_blank} |
| Token Bridge | [`0x796Dff6D74F3E27060B71255Fe517BFb23C93eed`](https://celoscan.io/address/0x796Dff6D74F3E27060B71255Fe517BFb23C93eed){target=_blank} |
|  NFT Bridge  | [`0xA6A377d75ca5c9052c9a77ED1e865Cc25Bd97bf3`](https://celoscan.io/address/0xA6A377d75ca5c9052c9a77ED1e865Cc25Bd97bf3){target=_blank} |
|   Relayer    | [`0x27428DD2d3DD32A4D7f7C497eAaa23130d894911`](https://celoscan.io/address/0x27428DD2d3DD32A4D7f7C497eAaa23130d894911){target=_blank} |

=== "TestNet  `Alfajores - 44787`"

|       Type       |                                                                    Contract                                                                     |
|:----------------:|:-----------------------------------------------------------------------------------------------------------------------------------------------:|
|       Core       | [`0x88505117CA88e7dd2eC6EA1E13f0948db2D50D56`](https://alfajores.celoscan.io/address/0x88505117CA88e7dd2eC6EA1E13f0948db2D50D56){target=_blank} |
|   Token Bridge   | [`0x05ca6037eC51F8b712eD2E6Fa72219FEaE74E153`](https://alfajores.celoscan.io/address/0x05ca6037eC51F8b712eD2E6Fa72219FEaE74E153){target=_blank} |
|    NFT Bridge    | [`0xaCD8190F647a31E56A656748bC30F69259f245Db`](https://alfajores.celoscan.io/address/0xaCD8190F647a31E56A656748bC30F69259f245Db){target=_blank} |
|     Relayer      | [`0x306B68267Deb7c5DfCDa3619E22E9Ca39C374f84`](https://alfajores.celoscan.io/address/0x306B68267Deb7c5DfCDa3619E22E9Ca39C374f84){target=_blank} |
|  Mock Provider   | [`0x60a86b97a7596eBFd25fb769053894ed0D9A8366`](https://alfajores.celoscan.io/address/0x60a86b97a7596eBFd25fb769053894ed0D9A8366){target=_blank} |
| Mock Integration | [`0x7f1d8E809aBB3F6Dc9B90F0131C3E8308046E190`](https://alfajores.celoscan.io/address/0x7f1d8E809aBB3F6Dc9B90F0131C3E8308046E190){target=_blank} |

=== "Local Network"

|     Type     | Contract |
|:------------:|:--------:|
|     Core     |   N/A    |
| Token Bridge |   N/A    |
|  NFT Bridge  |   N/A    |

## Fantom

### Ecosystem

- [Website](https://fantom.foundation/){target=_blank}
- [https://ftmscan.com/](https://ftmscan.com/){target=_blank}
- [Developer docs](https://docs.fantom.foundation/){target=_blank} | [Faucet](https://faucet.fantom.network/){target=_blank}

### Wormhole Details

- Name: `fantom`
- Chain ID: `10`
- Contract Source: [ethereum/contracts/bridge/Bridge.sol](https://github.com/wormhole-foundation/wormhole/blob/main/ethereum/contracts/bridge/Bridge.sol){target=_blank}

### Consistency Levels

The options for [`consistencyLevel`](/docs/build/reference/consistency-levels/){target=\_blank} (i.e., finality) are:

|  Level  | Value |
|:-------:|:-----:|
| Instant |  200  |

If a value is passed that isn't in the preceding set, it's assumed to mean finalized.

=== "MainNet `250`"

|     Type     |                                                               Contract                                                                |
|:------------:|:-------------------------------------------------------------------------------------------------------------------------------------:|
|     Core     | [`0x126783A6Cb203a3E35344528B26ca3a0489a1485`](https://ftmscan.com/address/0x126783A6Cb203a3E35344528B26ca3a0489a1485){target=_blank} |
| Token Bridge | [`0x7C9Fc5741288cDFdD83CeB07f3ea7e22618D79D2`](https://ftmscan.com/address/0x7C9Fc5741288cDFdD83CeB07f3ea7e22618D79D2){target=_blank} |
|  NFT Bridge  | [`0xA9c7119aBDa80d4a4E0C06C8F4d8cF5893234535`](https://ftmscan.com/address/0xA9c7119aBDa80d4a4E0C06C8F4d8cF5893234535){target=_blank} |
|   Relayer    | [`0x27428DD2d3DD32A4D7f7C497eAaa23130d894911`](https://ftmscan.com/address/0x27428DD2d3DD32A4D7f7C497eAaa23130d894911){target=_blank} |

=== "TestNet `4002`"

|     Type     |                                                                   Contract                                                                    |
|:------------:|:---------------------------------------------------------------------------------------------------------------------------------------------:|
|     Core     | [`0x1BB3B4119b7BA9dfad76B0545fb3F531383c3bB7`](https://testnet.ftmscan.com/address/0x1BB3B4119b7BA9dfad76B0545fb3F531383c3bB7){target=_blank} |
| Token Bridge | [`0x599CEa2204B4FaECd584Ab1F2b6aCA137a0afbE8`](https://testnet.ftmscan.com/address/0x599CEa2204B4FaECd584Ab1F2b6aCA137a0afbE8){target=_blank} |
|  NFT Bridge  | [`0x63eD9318628D26BdCB15df58B53BB27231D1B227`](https://testnet.ftmscan.com/address/0x63eD9318628D26BdCB15df58B53BB27231D1B227){target=_blank} |

=== "Local Network"

|     Type     | Contract |
|:------------:|:--------:|
|     Core     |   N/A    |
| Token Bridge |   N/A    |
|  NFT Bridge  |   N/A    |

## Gnosis

### Ecosystem

- [Website](https://www.gnosis.io/){target=_blank}
- [Block Explorer](https://gnosisscan.io/){target=_blank}
- [Developer docs](https://docs.gnosischain.com/developers/overview){target=_blank} | [Faucet](https://faucet.gnosischain.com/){target=_blank}

### Wormhole Details

- Name: `gnosis`
- Chain ID: `25`
- Contract Source: [ethereum/contracts/bridge/Bridge.sol](https://github.com/wormhole-foundation/wormhole/blob/main/ethereum/contracts/bridge/Bridge.sol){target=_blank}

=== "MainNet `100`"

|     Type     |                                                                Contract                                                                 |
|:------------:|:---------------------------------------------------------------------------------------------------------------------------------------:|
|     Core     | [`0xa321448d90d4e5b0A732867c18eA198e75CAC48E`](https://gnosisscan.io/address/0xa321448d90d4e5b0A732867c18eA198e75CAC48E){target=_blank} |
| Token Bridge |                                                                   N/A                                                                   |
|  NFT Bridge  |                                                                   N/A                                                                   |

=== "TestNet `Chaido - 10200`"

|     Type     |                                                                        Contract                                                                        |
|:------------:|:------------------------------------------------------------------------------------------------------------------------------------------------------:|
|     Core     | [`0xBB73cB66C26740F31d1FabDC6b7A46a038A300dd`](https://gnosis-chiado.blockscout.com/address/0xBB73cB66C26740F31d1FabDC6b7A46a038A300dd){target=_blank} |
| Token Bridge |                                                                          N/A                                                                           |
|  NFT Bridge  |                                                                          N/A                                                                           |

=== "Local Network"

|     Type     | Contract |
|:------------:|:--------:|
|     Core     |   N/A    |
| Token Bridge |   N/A    |
|  NFT Bridge  |   N/A    |

## Karura

### Ecosystem

- [Website](https://acala.network/karura){target=_blank}
- Block Explorers: [Subscan](https://karura.subscan.io/){target=_blank} | [BlockScout](https://blockscout.karura.network/){target=_blank}
- [Developer Docs](https://wiki.acala.network/){target=_blank}

### Wormhole Details

- Name: `karura`
- Chain ID: `11`
- Contract Source: [ethereum/contracts/bridge/Bridge.sol](https://github.com/wormhole-foundation/wormhole/blob/main/ethereum/contracts/bridge/Bridge.sol){target=_blank}

### Consistency Levels

The options for [`consistencyLevel`](/docs/build/reference/consistency-levels/){target=\_blank} (i.e., finality) are:

|  Level  | Value |
|:-------:|:-----:|
| Instant |  200  |

If a value is passed that isn't in the preceding set, it's assumed to mean finalized. For more information, see [https://wiki.polkadot.network/docs/learn-consensus](https://wiki.polkadot.network/docs/learn-consensus){target=_blank}.

=== "MainNet `686`"

|     Type     |                                                                      Contract                                                                       |
|:------------:|:---------------------------------------------------------------------------------------------------------------------------------------------------:|
|     Core     | [`0xa321448d90d4e5b0A732867c18eA198e75CAC48E`](https://blockscout.karura.network/address/0xa321448d90d4e5b0A732867c18eA198e75CAC48E){target=_blank} |
| Token Bridge | [`0xae9d7fe007b3327AA64A32824Aaac52C42a6E624`](https://blockscout.karura.network/address/0xae9d7fe007b3327AA64A32824Aaac52C42a6E624){target=_blank} |
|  NFT Bridge  | [`0xb91e3638F82A1fACb28690b37e3aAE45d2c33808`](https://blockscout.karura.network/address/0xb91e3638F82A1fACb28690b37e3aAE45d2c33808){target=_blank} |
|   Relayer    | [`0x27428DD2d3DD32A4D7f7C497eAaa23130d894911`](https://blockscout.karura.network/address/0x27428DD2d3DD32A4D7f7C497eAaa23130d894911){target=_blank} |

=== "TestNet `596`"

|     Type     |                   Contract                   |
|:------------:|:--------------------------------------------:|
|     Core     | `0xE4eacc10990ba3308DdCC72d985f2a27D20c7d03` |
| Token Bridge | `0xd11De1f930eA1F7Dd0290Fe3a2e35b9C91AEFb37` |
|  NFT Bridge  | `0x0A693c2D594292B6Eb89Cb50EFe4B0b63Dd2760D` |

=== "Local Network"

|     Type     | Contract |
|:------------:|:--------:|
|     Core     |   N/A    |
| Token Bridge |   N/A    |
|  NFT Bridge  |   N/A    |

## Kaia {: #klaytn }

### Ecosystem

- [Website](https://kaia.io/){target=_blank}
- [Kaiascan](https://kaiascan.io/){target=_blank} | [Klaytnscope](https://scope.klaytn.com/){target=_blank}
- [Developer docs](https://docs.kaia.io/){target=_blank} | [Faucet](https://faucet.kaia.io){target=_blank}

### Wormhole Details

- Name: `kaia`
- Chain ID: `13`
- Contract Source: [ethereum/contracts/bridge/Bridge.sol](https://github.com/wormhole-foundation/wormhole/blob/main/ethereum/contracts/bridge/Bridge.sol){target=_blank}

### Consistency Levels

The options for [`consistencyLevel`](/docs/build/reference/consistency-levels/){target=\_blank} (i.e., finality) are:

|  Level  | Value |
|:-------:|:-----:|
| Instant |  200  |

If a value is passed that isn't in the preceding set, it's assumed to mean finalized.

=== "MainNet `8217`"

|     Type     |                                                               Contract                                                                |
|:------------:|:-------------------------------------------------------------------------------------------------------------------------------------:|
|     Core     | [`0x0C21603c4f3a6387e241c0091A7EA39E43E90bb7`](https://kaiascan.io/address/0x0C21603c4f3a6387e241c0091A7EA39E43E90bb7){target=_blank} |
| Token Bridge | [`0x5b08ac39EAED75c0439FC750d9FE7E1F9dD0193F`](https://kaiascan.io/address/0x5b08ac39EAED75c0439FC750d9FE7E1F9dD0193F){target=_blank} |
|  NFT Bridge  | [`0x3c3c561757BAa0b78c5C025CdEAa4ee24C1dFfEf`](https://kaiascan.io/address/0x3c3c561757BAa0b78c5C025CdEAa4ee24C1dFfEf){target=_blank} |
|   Relayer    | [`0x27428DD2d3DD32A4D7f7C497eAaa23130d894911`](https://kaiascan.io/address/0x27428DD2d3DD32A4D7f7C497eAaa23130d894911){target=_blank} |

=== "TestNet `Kairos - 1001`"

|     Type     |                                                                   Contract                                                                   |
|:------------:|:--------------------------------------------------------------------------------------------------------------------------------------------:|
|     Core     | [`0x1830CC6eE66c84D2F177B94D544967c774E624cA`](https://kairos.kaiascan.io/address/0x1830CC6eE66c84D2F177B94D544967c774E624cA){target=_blank} |
| Token Bridge | [`0xC7A13BE098720840dEa132D860fDfa030884b09A`](https://kairos.kaiascan.io/address/0xC7A13BE098720840dEa132D860fDfa030884b09A){target=_blank} |
|  NFT Bridge  | [`0x94c994fC51c13101062958b567e743f1a04432dE`](https://kairos.kaiascan.io/address/0x94c994fC51c13101062958b567e743f1a04432dE){target=_blank} |

=== "Local Network"

|     Type     | Contract |
|:------------:|:--------:|
|     Core     |   N/A    |
| Token Bridge |   N/A    |
|  NFT Bridge  |   N/A    |

## Moonbeam

### Ecosystem

- [Website](https://moonbeam.network/){target=_blank}
- [Moonbeam EVM Block Explorer](https://moonscan.io/){target=_blank}
- [Developer docs](https://docs.moonbeam.network/){target=_blank} | [Faucet](https://faucet.moonbeam.network/){target=_blank}

### Wormhole Details

- Name: `moonbeam`
- Chain ID: `16`
- Contract Source: [ethereum/contracts/bridge/Bridge.sol](https://github.com/wormhole-foundation/wormhole/blob/main/ethereum/contracts/bridge/Bridge.sol){target=_blank}

### Consistency Levels

The options for [`consistencyLevel`](/docs/build/reference/consistency-levels/){target=\_blank} (i.e., finality) are:

|  Level  | Value |
|:-------:|:-----:|
| Instant |  200  |

If a value is passed that isn't in the preceding set, it's assumed to mean finalized. For more information, see [https://docs.moonbeam.network/builders/build/moonbeam-custom-api/#finality-rpc-endpoints](https://docs.moonbeam.network/builders/build/moonbeam-custom-api/#finality-rpc-endpoints){target=_blank}.

=== "MainNet `1284`"

|     Type     |                                                               Contract                                                                |
|:------------:|:-------------------------------------------------------------------------------------------------------------------------------------:|
|     Core     | [`0xC8e2b0cD52Cf01b0Ce87d389Daa3d414d4cE29f3`](https://moonscan.io/address/0xC8e2b0cD52Cf01b0Ce87d389Daa3d414d4cE29f3){target=_blank} |
| Token Bridge | [`0xb1731c586ca89a23809861c6103f0b96b3f57d92`](https://moonscan.io/address/0xb1731c586ca89a23809861c6103f0b96b3f57d92){target=_blank} |
|  NFT Bridge  | [`0x453cfbe096c0f8d763e8c5f24b441097d577bde2`](https://moonscan.io/address/0x453cfbe096c0f8d763e8c5f24b441097d577bde2){target=_blank} |
|   Relayer    | [`0x27428DD2d3DD32A4D7f7C497eAaa23130d894911`](https://moonscan.io/address/0x27428DD2d3DD32A4D7f7C497eAaa23130d894911){target=_blank} |

=== "TestNet `Moonbase-Alphanet - 1287`"

|      Type       |                                                                    Contract                                                                    |
|:---------------:|:----------------------------------------------------------------------------------------------------------------------------------------------:|
|      Core       | [`0xa5B7D85a8f27dd7907dc8FdC21FA5657D5E2F901`](https://moonbase.moonscan.io/address/0xa5B7D85a8f27dd7907dc8FdC21FA5657D5E2F901){target=_blank} |
|  Token Bridge   | [`0xbc976D4b9D57E57c3cA52e1Fd136C45FF7955A96`](https://moonbase.moonscan.io/address/0xbc976D4b9D57E57c3cA52e1Fd136C45FF7955A96){target=_blank} |
|   NFT Bridge    | [`0x98A0F4B96972b32Fcb3BD03cAeB66A44a6aB9Edb`](https://moonbase.moonscan.io/address/0x98A0F4B96972b32Fcb3BD03cAeB66A44a6aB9Edb){target=_blank} |
|     Relayer     | [`0x0591C25ebd0580E0d4F27A82Fc2e24E7489CB5e0`](https://moonbase.moonscan.io/address/0x0591C25ebd0580E0d4F27A82Fc2e24E7489CB5e0){target=_blank} |
|  MockProvider   | [`0x60a86b97a7596eBFd25fb769053894ed0D9A8366`](https://moonbase.moonscan.io/address/0x60a86b97a7596eBFd25fb769053894ed0D9A8366){target=_blank} |
| MockIntegration | [`0x3bF0c43d88541BBCF92bE508ec41e540FbF28C56`](https://moonbase.moonscan.io/address/0x3bF0c43d88541BBCF92bE508ec41e540FbF28C56){target=_blank} |

=== "Local Network"

|     Type     | Contract |
|:------------:|:--------:|
|     Core     |   N/A    |
| Token Bridge |   N/A    |
|  NFT Bridge  |   N/A    |


## Neon

### Ecosystem

- [Website](https://neon-labs.org/){target=_blank}
- Block Explorers: [NeonScan](https://neonscan.org/){target=_blank} | [BlockScout](https://neon.blockscout.com/){target=_blank}
- [Developer Docs](https://neonevm.org/docs/quick_start){target=_blank} | [Faucet](https://neonfaucet.org/){target=/_blank}

### Wormhole Details

- Name: `neon`
- Chain ID: `17`
- Contract Source: [ethereum/contracts/bridge/Bridge.sol](https://github.com/wormhole-foundation/wormhole/blob/main/ethereum/contracts/bridge/Bridge.sol){target=_blank}

=== "MainNet `245022934`"

|     Type     | Contract |
|:------------:|:--------:|
|     Core     |   N/A    |
| Token Bridge |   N/A    |
|  NFT Bridge  |   N/A    |

=== "TestNet `245022940`"

|     Type     | Contract |
|:------------:|:--------:|
|     Core     |   N/A    |
| Token Bridge |   N/A    |
|  NFT Bridge  |   N/A    |

=== "Local Network"

|     Type     | Contract |
|:------------:|:--------:|
|     Core     |   N/A    |
| Token Bridge |   N/A    |
|  NFT Bridge  |   N/A    |

## Oasis

### Ecosystem

- [Website](https://oasisprotocol.org/){target=_blank}
- [OasisScan](https://www.oasisscan.com/){target=_blank}
- [Developer Docs](https://docs.oasis.io/){target=_blank} | [Faucet](https://faucet.testnet.oasis.dev/){target=/_blank}

### Wormhole Details

- Name: `oasis`
- Chain ID: `7`
- Contract Source: [ethereum/contracts/bridge/Bridge.sol](https://github.com/wormhole-foundation/wormhole/blob/main/ethereum/contracts/bridge/Bridge.sol){target=_blank}

=== "MainNet `42262`"

|     Type     |                   Contract                   |
|:------------:|:--------------------------------------------:|
|     Core     | `0xfE8cD454b4A1CA468B57D79c0cc77Ef5B6f64585` |
| Token Bridge | `0x5848C791e09901b40A9Ef749f2a6735b418d7564` |
|  NFT Bridge  | `0x04952D522Ff217f40B5Ef3cbF659EcA7b952a6c1` |

=== "TestNet `42261`"

|     Type     |                   Contract                   |
|:------------:|:--------------------------------------------:|
|     Core     | `0xc1C338397ffA53a2Eb12A7038b4eeb34791F8aCb` |
| Token Bridge | `0x88d8004A9BdbfD9D28090A02010C19897a29605c` |
|  NFT Bridge  | `0xC5c25B41AB0b797571620F5204Afa116A44c0ebA` |

=== "Local Network"

|     Type     | Contract |
|:------------:|:--------:|
|     Core     |   N/A    |
| Token Bridge |   N/A    |
|  NFT Bridge  |   N/A    |

## Optimism

### Ecosystem

- [Website](https://www.optimism.io/){target=_blank}
- [Block Explorer](https://optimistic.etherscan.io/){target=_blank}
- [Developer Docs](https://docs.optimism.io/){target=_blank}

### Wormhole Details

- Name: `optimism`
- Chain ID: `24`
- Contract Source: [ethereum/contracts/bridge/Bridge.sol](https://github.com/wormhole-foundation/wormhole/blob/main/ethereum/contracts/bridge/Bridge.sol){target=_blank}

### Consistency Levels

The options for [`consistencyLevel`](/docs/build/reference/consistency-levels/){target=\_blank} (i.e., finality) are:

|  Level  | Value |
|:-------:|:-----:|
| Instant |  200  |

If a value is passed that isn't in the preceding set, it's assumed to mean finalized.

=== "MainNet `10`"

|     Type     |                                                                     Contract                                                                      |
|:------------:|:-------------------------------------------------------------------------------------------------------------------------------------------------:|
|     Core     | [`0xEe91C335eab126dF5fDB3797EA9d6aD93aeC9722`](https://optimistic.etherscan.io/address/0xEe91C335eab126dF5fDB3797EA9d6aD93aeC9722){target=_blank} |
| Token Bridge | [`0x1D68124e65faFC907325e3EDbF8c4d84499DAa8b`](https://optimistic.etherscan.io/address/0x1D68124e65faFC907325e3EDbF8c4d84499DAa8b){target=_blank} |
|  NFT Bridge  | [`0xfE8cD454b4A1CA468B57D79c0cc77Ef5B6f64585`](https://optimistic.etherscan.io/address/0xfE8cD454b4A1CA468B57D79c0cc77Ef5B6f64585){target=_blank} |
|   Relayer    | [`0x27428DD2d3DD32A4D7f7C497eAaa23130d894911`](https://optimistic.etherscan.io/address/0x27428DD2d3DD32A4D7f7C497eAaa23130d894911){target=_blank} |
|     CCTP     | [`0x2703483B1a5a7c577e8680de9Df8Be03c6f30e3c`](https://optimistic.etherscan.io/address/0x2703483B1a5a7c577e8680de9Df8Be03c6f30e3c){target=_blank} |

=== "TestNet `Optimism Goerli - 420`"

|      Type       |                                                                        Contract                                                                         |
|:---------------:|:-------------------------------------------------------------------------------------------------------------------------------------------------------:|
|      Core       | [`0x6b9C8671cdDC8dEab9c719bB87cBd3e782bA6a35`](https://sepolia-optimism.etherscan.io/address/0x6b9C8671cdDC8dEab9c719bB87cBd3e782bA6a35){target=_blank} |
|  Token Bridge   | [`0xC7A204bDBFe983FCD8d8E61D02b475D4073fF97e`](https://sepolia-optimism.etherscan.io/address/0xC7A204bDBFe983FCD8d8E61D02b475D4073fF97e){target=_blank} |
|   NFT Bridge    | [`0x23908A62110e21C04F3A4e011d24F901F911744A`](https://sepolia-optimism.etherscan.io/address/0x23908A62110e21C04F3A4e011d24F901F911744A){target=_blank} |
|     Relayer     | [`0x01A957A525a5b7A72808bA9D10c389674E459891`](https://sepolia-optimism.etherscan.io/address/0x01A957A525a5b7A72808bA9D10c389674E459891){target=_blank} |
|  MockProvider   | [`0xfCe1Df3EF22fe5Cb7e2f5988b7d58fF633a313a7`](https://sepolia-optimism.etherscan.io/address/0xfCe1Df3EF22fe5Cb7e2f5988b7d58fF633a313a7){target=_blank} |
| MockIntegration | [`0x421e0bb71dDeeC727Af79766423d33D8FD7dB963`](https://sepolia-optimism.etherscan.io/address/0x421e0bb71dDeeC727Af79766423d33D8FD7dB963){target=_blank} |

=== "Local Network"

|     Type     | Contract |
|:------------:|:--------:|
|     Core     |   N/A    |
| Token Bridge |   N/A    |
|  NFT Bridge  |   N/A    |

## Polygon

### Ecosystem

- [Website](https://polygon.technology/){target=_blank}
- [PolygonScan Block Explorer](https://polygonscan.com/){target=_blank}
- [Developer Docs](https://wiki.polygon.technology/){target=_blank} | [Faucet](https://faucet.polygon.technology/){target=_blank}

### Wormhole Details

- Name: `polygon`
- Chain ID: `5`
- Contract Source: [ethereum/contracts/bridge/Bridge.sol](https://github.com/wormhole-foundation/wormhole/blob/main/ethereum/contracts/bridge/Bridge.sol){target=_blank}

### Consistency Levels

The options for [`consistencyLevel`](/docs/build/reference/consistency-levels/){target=\_blank} (i.e., finality) are:

|  Level  | Value |
|:-------:|:-----:|
| Instant |  200  |

If a value is passed that isn't in the preceding set, it's assumed to mean finalized. For more information, see [https://docs.polygon.technology/pos/architecture/heimdall/checkpoints/](https://docs.polygon.technology/pos/architecture/heimdall/checkpoints/){target=_blank}.

=== "MainNet `137`"

|     Type     |                                                                 Contract                                                                  |
|:------------:|:-----------------------------------------------------------------------------------------------------------------------------------------:|
|     Core     | [`0x7A4B5a56256163F07b2C80A7cA55aBE66c4ec4d7`](https://polygonscan.com/address/0x7A4B5a56256163F07b2C80A7cA55aBE66c4ec4d7){target=_blank} |
| Token Bridge | [`0x5a58505a96D1dbf8dF91cB21B54419FC36e93fdE`](https://polygonscan.com/address/0x5a58505a96D1dbf8dF91cB21B54419FC36e93fdE){target=_blank} |
|  NFT Bridge  | [`0x90BBd86a6Fe93D3bc3ed6335935447E75fAb7fCf`](https://polygonscan.com/address/0x90BBd86a6Fe93D3bc3ed6335935447E75fAb7fCf){target=_blank} |
|   Relayer    | [`0x27428DD2d3DD32A4D7f7C497eAaa23130d894911`](https://polygonscan.com/address/0x27428DD2d3DD32A4D7f7C497eAaa23130d894911){target=_blank} |
|     CCTP     | [`0x0FF28217dCc90372345954563486528aa865cDd6`](https://polygonscan.com/address/0x0FF28217dCc90372345954563486528aa865cDd6){target=_blank} |

=== "TestNet `Mumbai - 80001`"

|      Type       |                   Contract                   |
|:---------------:|:--------------------------------------------:|
|      Core       | `0x0CBE91CF822c73C2315FB05100C2F714765d5c20` |
|  Token Bridge   | `0x377D55a7928c046E18eEbb61977e714d2a76472a` |
|   NFT Bridge    | `0x51a02d0dcb5e52F5b92bdAA38FA013C91c7309A9` |
|     Relayer     | `0x0591C25ebd0580E0d4F27A82Fc2e24E7489CB5e0` |
|  MockProvider   | `0x60a86b97a7596eBFd25fb769053894ed0D9A8366` |
| MockIntegration | `0x3bF0c43d88541BBCF92bE508ec41e540FbF28C56` |
|      CCTP       | `0x2703483B1a5a7c577e8680de9Df8Be03c6f30e3c` |

=== "Local Network"

|     Type     | Contract |
|:------------:|:--------:|
|     Core     |   N/A    |
| Token Bridge |   N/A    |
|  NFT Bridge  |   N/A    |

## Rootstock

### Ecosystem

- [Website](https://rootstock.io/){target=_blank}
- [Block Explorer](https://explorer.rootstock.io/){target=_blank}
- [Developer Docs](https://dev.rootstock.io/){target=_blank} | [Faucet](https://faucet.rootstock.io/)

### Wormhole Details

- Name: `rootstock`
- Chain ID: `33`
- Contract Source: No source file

=== "MainNet `30`"

|     Type     |                   Contract                   |
|:------------:|:--------------------------------------------:|
|     Core     | `0xbebdb6C8ddC678FfA9f8748f85C815C556Dd8ac6` |
| Token Bridge |                     N/A                      |
|  NFT Bridge  |                     N/A                      |

=== "TestNet `31`"

|     Type     |                   Contract                   |
|:------------:|:--------------------------------------------:|
|     Core     | `0xbebdb6C8ddC678FfA9f8748f85C815C556Dd8ac6` |
| Token Bridge |                     N/A                      |
|  NFT Bridge  |                     N/A                      |

=== "Local Network"

|     Type     | Contract |
|:------------:|:--------:|
|     Core     |   N/A    |
| Token Bridge |   N/A    |
|  NFT Bridge  |   N/A    |

## Ethereum Sepolia

Sepolia is a TestNet-only chain that can be used as an alternative to Goerli. Note that a different chain ID is used for Sepolia.

### Wormhole Details

- Name: `sepolia`
- Chain ID: `10002`
- Contract Source: [ethereum/contracts/bridge/Bridge.sol](https://github.com/wormhole-foundation/wormhole/blob/main/ethereum/contracts/bridge/Bridge.sol){target=_blank}

=== "MainNet (N/A)"

|     Type     | Contract |
|:------------:|:--------:|
|     Core     |   N/A    |
| Token Bridge |   N/A    |
|  NFT Bridge  |   N/A    |

=== "TestNet `Sepolia - 11155111`"

|      Type       |                                                                    Contract                                                                    |
|:---------------:|:----------------------------------------------------------------------------------------------------------------------------------------------:|
|      Core       | [`0x4a8bc80Ed5a4067f1CCf107057b8270E0cC11A78`](https://sepolia.etherscan.io/address/0x4a8bc80Ed5a4067f1CCf107057b8270E0cC11A78){target=_blank} |
|  Token Bridge   | [`0xDB5492265f6038831E89f495670FF909aDe94bd9`](https://sepolia.etherscan.io/address/0xDB5492265f6038831E89f495670FF909aDe94bd9){target=_blank} |
|   NFT Bridge    | [`0x6a0B52ac198e4870e5F3797d5B403838a5bbFD99`](https://sepolia.etherscan.io/address/0x6a0B52ac198e4870e5F3797d5B403838a5bbFD99){target=_blank} |
|     Relayer     | [`0x7B1bD7a6b4E61c2a123AC6BC2cbfC614437D0470`](https://sepolia.etherscan.io/address/0x7B1bD7a6b4E61c2a123AC6BC2cbfC614437D0470){target=_blank} |
|  MockProvider   | [`0x7A0a53847776f7e94Cc35742971aCb2217b0Db81`](https://sepolia.etherscan.io/address/0x7A0a53847776f7e94Cc35742971aCb2217b0Db81){target=_blank} |
| MockIntegration | [`0x68b7Cd0d27a6F04b2F65e11DD06182EFb255c9f0`](https://sepolia.etherscan.io/address/0x68b7Cd0d27a6F04b2F65e11DD06182EFb255c9f0){target=_blank} |
|      CCTP       | [`0x2703483B1a5a7c577e8680de9Df8Be03c6f30e3c`](https://sepolia.etherscan.io/address/0x2703483B1a5a7c577e8680de9Df8Be03c6f30e3c){target=_blank} |

=== "Local Network"

|     Type     | Contract |
|:------------:|:--------:|
|     Core     |   N/A    |
| Token Bridge |   N/A    |
|  NFT Bridge  |   N/A    |


## Ethereum Holesky

Holesky is a TestNet-only chain that can be used as an alternative to Goerli. Note that a different chain ID is used for Holesky.

### Wormhole Details

- Name: `holesky`
- Chain ID: `10006`
- Contract Source: [ethereum/contracts/bridge/Bridge.sol](https://github.com/wormhole-foundation/wormhole/blob/main/ethereum/contracts/bridge/Bridge.sol){target=_blank}

=== "MainNet (N/A)"

|     Type     | Contract |
|:------------:|:--------:|
|     Core     |   N/A    |
| Token Bridge |   N/A    |
|  NFT Bridge  |   N/A    |

=== "TestNet `Holesky - 17000`"

|     Type     |                   Contract                   |
|:------------:|:--------------------------------------------:|
|     Core     | `0xa10f2eF61dE1f19f586ab8B6F2EbA89bACE63F7a` |
| Token Bridge | `0x76d093BbaE4529a342080546cAFEec4AcbA59EC6` |
|  NFT Bridge  | `0xc8941d483c45eF8FB72E4d1F9dDE089C95fF8171` |

=== "Local Network"

|     Type     | Contract |
|:------------:|:--------:|
|     Core     |   N/A    |
| Token Bridge |   N/A    |
|  NFT Bridge  |   N/A    |

## Arbitrum Sepolia

### Ecosystem

- [Website](https://arbitrum.io/){target=_blank}
- [Arbitrum Explorer](https://sepolia.arbiscan.io/){target=_blank}
- [Developer Docs](https://rootstock.io/){target=_blank}

### Wormhole Details

- Name: `arbitrum_sepolia`
- Chain ID: `10003`
- Contract Source: No source file

=== "MainNet"

|     Type     | Contract |
|:------------:|:--------:|
|     Core     |   N/A    |
| Token Bridge |   N/A    |
|  NFT Bridge  |   N/A    |

=== "TestNet `Sepolia - 421614`"

|      Type       |                                                                   Contract                                                                    |
|:---------------:|:---------------------------------------------------------------------------------------------------------------------------------------------:|
|      Core       | [`0x6b9C8671cdDC8dEab9c719bB87cBd3e782bA6a35`](https://sepolia.arbiscan.io/address/0x6b9C8671cdDC8dEab9c719bB87cBd3e782bA6a35){target=_blank} |
|  Token Bridge   | [`0xC7A204bDBFe983FCD8d8E61D02b475D4073fF97e`](https://sepolia.arbiscan.io/address/0xC7A204bDBFe983FCD8d8E61D02b475D4073fF97e){target=_blank} |
|   NFT Bridge    | [`0x23908A62110e21C04F3A4e011d24F901F911744A`](https://sepolia.arbiscan.io/address/0x23908A62110e21C04F3A4e011d24F901F911744A){target=_blank} |
|     Relayer     | [`0x7B1bD7a6b4E61c2a123AC6BC2cbfC614437D0470`](https://sepolia.arbiscan.io/address/0x7B1bD7a6b4E61c2a123AC6BC2cbfC614437D0470){target=_blank} |
|  MockProvider   | [`0x7A0a53847776f7e94Cc35742971aCb2217b0Db81`](https://sepolia.arbiscan.io/address/0x7A0a53847776f7e94Cc35742971aCb2217b0Db81){target=_blank} |
| MockIntegration | [`0x2B1502Ffe717817A0A101a687286bE294fe495f7`](https://sepolia.arbiscan.io/address/0x2B1502Ffe717817A0A101a687286bE294fe495f7){target=_blank} |
|      CCTP       | [`0x2703483B1a5a7c577e8680de9Df8Be03c6f30e3c`](https://sepolia.arbiscan.io/address/0x2703483B1a5a7c577e8680de9Df8Be03c6f30e3c){target=_blank} |

=== "Local Network"

|     Type     | Contract |
|:------------:|:--------:|
|     Core     |   N/A    |
| Token Bridge |   N/A    |
|  NFT Bridge  |   N/A    |

## Optimism Sepolia

### Ecosystem

- [Website](https://www.optimism.io/){target=_blank}
- [Block Explorer](https://sepolia-optimism.etherscan.io/){target=_blank}
- [Developer Docs](https://docs.optimism.io/){target=_blank}

### Wormhole Details

- Name: `optimism_sepolia`
- Chain ID: `10005`
- Contract Source: [ethereum/contracts/bridge/Bridge.sol](https://github.com/wormhole-foundation/wormhole/blob/main/ethereum/contracts/bridge/Bridge.sol){target=_blank}

### Consistency Levels

The options for [`consistencyLevel`](/docs/build/reference/consistency-levels/){target=\_blank} (i.e., finality) are:

|  Level  | Value |
|:-------:|:-----:|
| Instant |  200  |

If a value is passed that isn't in the preceding set, it's assumed to mean finalized.

=== "MainNet"

|     Type     | Contract |
|:------------:|:--------:|
|     Core     |   N/A    |
| Token Bridge |   N/A    |
|  NFT Bridge  |   N/A    |

=== "TestNet `Optimism Sepolia - 11155420`"

|      Type       |                                                                        Contract                                                                         |
|:---------------:|:-------------------------------------------------------------------------------------------------------------------------------------------------------:|
|      Core       | [`0x31377888146f3253211EFEf5c676D41ECe7D58Fe`](https://sepolia-optimism.etherscan.io/address/0x31377888146f3253211EFEf5c676D41ECe7D58Fe){target=_blank} |
|  Token Bridge   | [`0x99737Ec4B815d816c49A385943baf0380e75c0Ac`](https://sepolia-optimism.etherscan.io/address/0x99737Ec4B815d816c49A385943baf0380e75c0Ac){target=_blank} |
|   NFT Bridge    | [`0x27812285fbe85BA1DF242929B906B31EE3dd1b9f`](https://sepolia-optimism.etherscan.io/address/0x27812285fbe85BA1DF242929B906B31EE3dd1b9f){target=_blank} |
|     Relayer     | [`0x93BAD53DDfB6132b0aC8E37f6029163E63372cEE`](https://sepolia-optimism.etherscan.io/address/0x93BAD53DDfB6132b0aC8E37f6029163E63372cEE){target=_blank} |
|  MockProvider   | [`0x7A0a53847776f7e94Cc35742971aCb2217b0Db81`](https://sepolia-optimism.etherscan.io/address/0x7A0a53847776f7e94Cc35742971aCb2217b0Db81){target=_blank} |
| MockIntegration | [`0xA404B69582bac287a7455FFf315938CCd92099c1`](https://sepolia-optimism.etherscan.io/address/0xA404B69582bac287a7455FFf315938CCd92099c1){target=_blank} |
|      CCTP       | [`0x2703483B1a5a7c577e8680de9Df8Be03c6f30e3c`](https://sepolia-optimism.etherscan.io/address/0x2703483B1a5a7c577e8680de9Df8Be03c6f30e3c){target=_blank} |

=== "Local Network"

|     Type     | Contract |
|:------------:|:--------:|
|     Core     |   N/A    |
| Token Bridge |   N/A    |
|  NFT Bridge  |   N/A    |

## Base Sepolia

### Ecosystem

- [Website](https://base.org/){target=_blank}
- [Etherscan](https://sepolia.basescan.org/){target=_blank}
- [Developer docs](https://docs.base.org/){target=_blank} | [Faucet](https://www.ethereum-ecosystem.com/faucets/base-sepolia){target=_blank}

### Wormhole Details

- Name: `base_sepolia`
- Chain ID: `10004`
- Contract Source: [ethereum/contracts/bridge/Bridge.sol](https://github.com/wormhole-foundation/wormhole/blob/main/ethereum/contracts/bridge/Bridge.sol){target=_blank}

=== "MainNet"

|     Type     | Contract |
|:------------:|:--------:|
|     Core     |   N/A    |
| Token Bridge |   N/A    |
|  NFT Bridge  |   N/A    |

=== "TestNet `Base Sepolia - 84532`"

|      Type       |                                                                    Contract                                                                    |
|:---------------:|:----------------------------------------------------------------------------------------------------------------------------------------------:|
|      Core       | [`0x79A1027a6A159502049F10906D333EC57E95F083`](https://sepolia.basescan.org/address/0x79A1027a6A159502049F10906D333EC57E95F083){target=_blank} |
|  Token Bridge   | [`0x86F55A04690fd7815A3D802bD587e83eA888B239`](https://sepolia.basescan.org/address/0x86F55A04690fd7815A3D802bD587e83eA888B239){target=_blank} |
|   NFT Bridge    | [`0x268557122Ffd64c85750d630b716471118F323c8`](https://sepolia.basescan.org/address/0x268557122Ffd64c85750d630b716471118F323c8){target=_blank} |
|     Relayer     | [`0x93BAD53DDfB6132b0aC8E37f6029163E63372cEE`](https://sepolia.basescan.org/address/0x93BAD53DDfB6132b0aC8E37f6029163E63372cEE){target=_blank} |
|  MockProvider   | [`0x7A0a53847776f7e94Cc35742971aCb2217b0Db81`](https://sepolia.basescan.org/address/0x7A0a53847776f7e94Cc35742971aCb2217b0Db81){target=_blank} |
| MockIntegration | [`0xA404B69582bac287a7455FFf315938CCd92099c1`](https://sepolia.basescan.org/address/0xA404B69582bac287a7455FFf315938CCd92099c1){target=_blank} |
|      CCTP       | [`0x2703483B1a5a7c577e8680de9Df8Be03c6f30e3c`](https://sepolia.basescan.org/address/0x2703483B1a5a7c577e8680de9Df8Be03c6f30e3c){target=_blank} |

=== "Local Network"

|     Type     | Contract |
|:------------:|:--------:|
|     Core     |   N/A    |
| Token Bridge |   N/A    |
|  NFT Bridge  |   N/A    |

## Scroll

### Ecosystem

- [Website](https://scroll.io/){target=_blank}
- [ScrollScan Block Explorer](https://scrollscan.com/){target=_blank}
- [Developer docs](https://docs.scroll.io/en/home/){target=_blank}

### Wormhole Details

- Name: `scroll`
- Chain ID: `34`
- Contract Source: No source file

=== "MainNet `534352`"

|     Type     |                                                                 Contract                                                                 |
|:------------:|:----------------------------------------------------------------------------------------------------------------------------------------:|
|     Core     | [`0xbebdb6C8ddC678FfA9f8748f85C815C556Dd8ac6`](https://scrollscan.com/address/0xbebdb6C8ddC678FfA9f8748f85C815C556Dd8ac6){target=_blank} |
| Token Bridge | [`0x24850c6f61C438823F01B7A3BF2B89B72174Fa9d`](https://scrollscan.com/address/0x24850c6f61C438823F01B7A3BF2B89B72174Fa9d){target=_blank} |
|  NFT Bridge  |                                                                   N/A                                                                    |
|   Relayer    | [`0x27428DD2d3DD32A4D7f7C497eAaa23130d894911`](https://scrollscan.com/address/0x27428DD2d3DD32A4D7f7C497eAaa23130d894911){target=_blank} |

=== "TestNet `Sepolia - 534351`"

|     Type     |                                                                     Contract                                                                     |
|:------------:|:------------------------------------------------------------------------------------------------------------------------------------------------:|
|     Core     | [`0x055F47F1250012C6B20c436570a76e52c17Af2D5`](https://sepolia.scrollscan.com/address/0x055F47F1250012C6B20c436570a76e52c17Af2D5){target=_blank} |
| Token Bridge | [`0x22427d90B7dA3fA4642F7025A854c7254E4e45BF`](https://sepolia.scrollscan.com/address/0x22427d90B7dA3fA4642F7025A854c7254E4e45BF){target=_blank} |
|  NFT Bridge  |                                                                       N/A                                                                        |

=== "Local Network"

|     Type     | Contract |
|:------------:|:--------:|
|     Core     |   N/A    |
| Token Bridge |   N/A    |
|  NFT Bridge  |   N/A    |

## Mantle

### Ecosystem

- [Website](https://www.mantle.xyz/){target=_blank}
- [Block Explorer](https://explorer.mantle.xyz/){target=_blank}
- [Developer Docs](https://docs.mantle.xyz/network/introduction/overview){target=_blank} | [Faucet](https://faucet.testnet.mantle.xyz/){target=/_blank}

### Wormhole Details

- Name: `mantle`
- Chain ID: `35`
- Contract Source: No source file

=== "MainNet `5000`"

|     Type     |                                                                   Contract                                                                    |
|:------------:|:---------------------------------------------------------------------------------------------------------------------------------------------:|
|     Core     | [`0xbebdb6C8ddC678FfA9f8748f85C815C556Dd8ac6`](https://explorer.mantle.xyz/address/0xbebdb6C8ddC678FfA9f8748f85C815C556Dd8ac6){target=_blank} |
| Token Bridge | [`0x24850c6f61C438823F01B7A3BF2B89B72174Fa9d`](https://explorer.mantle.xyz/address/0x24850c6f61C438823F01B7A3BF2B89B72174Fa9d){target=_blank} |
|  NFT Bridge  |                                                                      N/A                                                                      |

=== "TestNet `Sepolia - 5003`"

|     Type     |                   Contract                   |
|:------------:|:--------------------------------------------:|
|     Core     | `0x376428e7f26D5867e69201b275553C45B09EE090` |
| Token Bridge | `0x75Bfa155a9D7A3714b0861c8a8aF0C4633c45b5D` |
|  NFT Bridge  |                     N/A                      |

=== "Local Network"

|     Type     | Contract |
|:------------:|:--------:|
|     Core     |   N/A    |
| Token Bridge |   N/A    |
|  NFT Bridge  |   N/A    |

## Polygon Sepolia

### Ecosystem

- [Website](https://polygon.technology/){target=_blank}
- [Developer Docs](https://wiki.polygon.technology/){target=_blank} | [Faucet](https://faucet.polygon.technology/){target=_blank}

### Wormhole Details

- Name: `polygon_sepolia`
- Chain ID: `10007`
- Contract Source: [ethereum/contracts/bridge/Bridge.sol](https://github.com/wormhole-foundation/wormhole/blob/main/ethereum/contracts/bridge/Bridge.sol){target=_blank}

### Consistency Levels

The options for [`consistencyLevel`](/docs/build/reference/consistency-levels/){target=\_blank} (i.e., finality) are:

|  Level  | Value |
|:-------:|:-----:|
| Instant |  200  |

If a value is passed that isn't in the preceding set, it's assumed to mean finalized. For more information, see [https://docs.polygon.technology/pos/architecture/heimdall/checkpoints/](https://docs.polygon.technology/pos/architecture/heimdall/checkpoints/){target=_blank}.

=== "MainNet"

|     Type     | Contract |
|:------------:|:--------:|
|     Core     |   N/A    |
| Token Bridge |   N/A    |
|  NFT Bridge  |   N/A    |

=== "TestNet `Sepolia - 80002`"

|     Type     |                   Contract                   |
|:------------:|:--------------------------------------------:|
|     Core     | `0x6b9C8671cdDC8dEab9c719bB87cBd3e782bA6a35` |
| Token Bridge | `0xC7A204bDBFe983FCD8d8E61D02b475D4073fF97e` |
|  NFT Bridge  | `0x23908A62110e21C04F3A4e011d24F901F911744A` |

=== "Local Network Contract"

|     Type     | Contract |
|:------------:|:--------:|
|     Core     |   N/A    |
| Token Bridge |   N/A    |
|  NFT Bridge  |   N/A    |

## Berachain

### Ecosystem

- [Website](https://www.berachain.com/){target=_blank}
- [Explorer update](https://bartio.beratrail.io/){target=_blank}
- [Docs](https://docs.berachain.com/){target=_blank} | [Faucet](https://bartio.faucet.berachain.com/)

### Wormhole Details

- Name: `berachain`
- Chain ID: `39`
- Contract Source: No source file

=== "MainNet"

|     Type     | Contract |
|:------------:|:--------:|
|     Core     |   N/A    |
| Token Bridge |   N/A    |
|  NFT Bridge  |   N/A    |

=== "TestNet `80084`"

|     Type     |                                                                   Contract                                                                    |
|:------------:|:---------------------------------------------------------------------------------------------------------------------------------------------:|
|     Core     | [`0xBB73cB66C26740F31d1FabDC6b7A46a038A300dd`](https://bartio.beratrail.io/address/0xBB73cB66C26740F31d1FabDC6b7A46a038A300dd){target=_blank} |
| Token Bridge | [`0xa10f2eF61dE1f19f586ab8B6F2EbA89bACE63F7a`](https://bartio.beratrail.io/address/0xa10f2eF61dE1f19f586ab8B6F2EbA89bACE63F7a){target=_blank} |
|  NFT Bridge  |                                                                      N/A                                                                      |

=== "Local Network"

|     Type     | Contract |
|:------------:|:--------:|
|     Core     |   N/A    |
| Token Bridge |   N/A    |
|  NFT Bridge  |   N/A    |

## Blast

### Ecosystem

- [Website](https://blast.io/en){target=_blank}
- [Explorer](https://blastscan.io/){target=_blank}
- [Docs](https://docs.blast.io/about-blast){target=_blank}

### Wormhole Details

- Name: `blast`
- Chain ID: `36`
- Contract Source: No source file

=== "MainNet `81457`"

|     Type     |                                                                Contract                                                                |
|:------------:|:--------------------------------------------------------------------------------------------------------------------------------------:|
|     Core     | [`0xbebdb6C8ddC678FfA9f8748f85C815C556Dd8ac6`](https://blastscan.io/address/0xbebdb6C8ddC678FfA9f8748f85C815C556Dd8ac6){target=_blank} |
| Token Bridge | [`0x24850c6f61C438823F01B7A3BF2B89B72174Fa9d`](https://blastscan.io/address/0x24850c6f61C438823F01B7A3BF2B89B72174Fa9d){target=_blank} |
|  NFT Bridge  |                                                                  N/A                                                                   |
|   Relayer    | [`0x27428DD2d3DD32A4D7f7C497eAaa23130d894911`](https://blastscan.io/address/0x27428DD2d3DD32A4D7f7C497eAaa23130d894911){target=_blank} |

=== "TestNet `168587773`"

|     Type     |                                                                    Contract                                                                    |
|:------------:|:----------------------------------------------------------------------------------------------------------------------------------------------:|
|     Core     | [`0x473e002D7add6fB67a4964F13bFd61280Ca46886`](https://sepolia.blastscan.io/address/0x473e002D7add6fB67a4964F13bFd61280Ca46886){target=_blank} |
| Token Bridge | [`0x430855B4D43b8AEB9D2B9869B74d58dda79C0dB2`](https://sepolia.blastscan.io/address/0x430855B4D43b8AEB9D2B9869B74d58dda79C0dB2){target=_blank} |
|  NFT Bridge  |                                                                      N/A                                                                       |

=== "Local Network"

|     Type     | Contract |
|:------------:|:--------:|
|     Core     |   N/A    |
| Token Bridge |   N/A    |
|  NFT Bridge  |   N/A    |

## Linea

### Ecosystem

- [Website](https://linea.build/){target=_blank}
- [Explorer](https://lineascan.build/){target=_blank}
- [Docs](https://docs.linea.build/){target=_blank}

### Wormhole Details

- Name: `linea`
- Chain ID: `38`
- Contract Source: No source file

=== "MainNet `59144`"

|     Type     | Contract |
|:------------:|:--------:|
|     Core     |   N/A    |
| Token Bridge |   N/A    |
|  NFT Bridge  |   N/A    |

=== "TestNet `59141`"

|     Type     |                   Contract                   |
|:------------:|:--------------------------------------------:|
|     Core     | `0x79A1027a6A159502049F10906D333EC57E95F083` |
| Token Bridge | `0xC7A204bDBFe983FCD8d8E61D02b475D4073fF97e` |
|  NFT Bridge  |                     N/A                      |

=== "Local Network"

|     Type     | Contract |
|:------------:|:--------:|
|     Core     |   N/A    |
| Token Bridge |   N/A    |
|  NFT Bridge  |   N/A    |

## Seievm

### Ecosystem

- [Website](https://www.sei.io/){target=_blank}
- [Explorer](https://seistream.app/){target=_blank}
- [Docs](https://www.docs.sei.io/){target=_blank}

### Wormhole Details

- Name: `seievm`
- Chain ID: `40`
- Contract Source: No source file

=== "MainNet"

|     Type     | Contract |
|:------------:|:--------:|
|     Core     |   N/A    |
| Token Bridge |   N/A    |
|  NFT Bridge  |   N/A    |

=== "TestNet"

|     Type     |                   Contract                   |
|:------------:|:--------------------------------------------:|
|     Core     | `0x07782FCe991dAb4DE7a3124032E534A0D059B4d8` |
| Token Bridge |                     N/A                      |
|  NFT Bridge  |                     N/A                      |

=== "Local Network"

|     Type     | Contract |
|:------------:|:--------:|
|     Core     |   N/A    |
| Token Bridge |   N/A    |
|  NFT Bridge  |   N/A    |

## X Layer

### Ecosystem

- [Website](https://www.okx.com/xlayer){target=_blank}
- [Explorer](https://www.oklink.com/xlayer){target=_blank}
- [Docs](https://www.okx.com/xlayer/docs/developer/build-on-xlayer/about-xlayer){target=_blank}

### Wormhole Details

- Name: `xlayer`
- Chain ID: `37`
- Contract Source: No source file

=== "MainNet"

|     Type     |                                                                    Contract                                                                     |
|:------------:|:-----------------------------------------------------------------------------------------------------------------------------------------------:|
|     Core     | [`0x194B123c5E96B9b2E49763619985790Dc241CAC0`](https://www.oklink.com/xlayer/address/0x194b123c5e96b9b2e49763619985790dc241cac0){target=_blank} |
| Token Bridge | [`0x5537857664B0f9eFe38C9f320F75fEf23234D904`](https://www.oklink.com/xlayer/address/0x5537857664b0f9efe38c9f320f75fef23234d904){target=_blank} |
|  NFT Bridge  |                                                                       N/A                                                                       |

=== "TestNet `195`"

|     Type     |                                                                       Contract                                                                       |
|:------------:|:----------------------------------------------------------------------------------------------------------------------------------------------------:|
|     Core     | [`0xA31aa3FDb7aF7Db93d18DDA4e19F811342EDF780`](https://www.oklink.com/xlayer-test/address/0xA31aa3FDb7aF7Db93d18DDA4e19F811342EDF780){target=_blank} |
| Token Bridge | [`0xdA91a06299BBF302091B053c6B9EF86Eff0f930D`](https://www.oklink.com/xlayer-test/address/0xda91a06299bbf302091b053c6b9ef86eff0f930d){target=_blank} |
|  NFT Bridge  |                                                                         N/A                                                                          |

=== "Local Network"

|     Type     | Contract |
|:------------:|:--------:|
|     Core     |   N/A    |
| Token Bridge |   N/A    |
|  NFT Bridge  |   N/A    |