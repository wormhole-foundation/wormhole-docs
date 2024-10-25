---
title: Cosmos
description: Learn how to work with Wormhole in the Cosmos ecosystem with address formats, emitter details, contract consistency levels, and key contract info. 
---

# Cosmos

This page includes details for working with Cosmos environment chains.

## Addresses

Because Wormhole works with many environments, the Wormhole address format is normalized. For Cosmos-based chains, this means a Wormhole formatted address is the [bech32](https://en.bitcoin.it/wiki/Bech32){target=_blank} format converted to hex. E.g. `xpla137w0wfch2dfmz7jl2ap8pcmswasj8kg06ay4dtjzw7tzkn77ufxqfw7acv` becomes `0x8f9cf727175353b17a5f574270e370776123d90fd74956ae4277962b4fdee24c`.

## Emitter 

The emitter address on Cosmos chains is the contract's canonical address, normalized to the Wormhole address format. 

## Cosmos Hub

### Ecosystem

- [Developer Docs](https://hub.cosmos.network/main){target=_blank}

### Wormhole Details

- Name: `cosmoshub`
- Chain ID: `4000`
- Contract Source: No source file

=== "Mainnet `cosmoshub-4`"

    |     Type     | Contract |
    |:------------:|:--------:|
    |     Core     |   N/A    |
    | Token Bridge |   N/A    |
    |  NFT Bridge  |   N/A    |

=== "Testnet `theta-testnet-001`"

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

  
## Evmos

### Ecosystem

- [Website](https://evmos.org/){target=_blank}
- [Mintscan](https://www.mintscan.io/evmos)
- [Evmos JSON updates](https://github.com/wormhole-foundation/docs.wormhole.com/blob/main/scripts/src/chains/evmos.json)
- [Faucet](https://faucet.evmos.dev/){target=/_blank}

### Wormhole Details

- Name: `evmos`
- Chain ID: `4001`
- Contract Source: No source file

=== "Mainnet `evmos_9001-2`"

    |     Type     | Contract |
    |:------------:|:--------:|
    |     Core     |   N/A    |
    | Token Bridge |   N/A    |
    |  NFT Bridge  |   N/A    |

=== "Testnet `evmos_9000-4`"

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

## Kujira

### Ecosystem

- No webpage, update [here](https://github.com/wormhole-foundation/docs.wormhole.com/blob/main/scripts/src/chains/kujira.json){target=_blank}
- No explorer, update [here](https://github.com/wormhole-foundation/docs.wormhole.com/blob/main/scripts/src/chains/kujira.json){target=_blank}
- [Kujira JSON updates](https://github.com/wormhole-foundation/docs.wormhole.com/blob/main/scripts/src/chains/kujira.json){target=_blank}

### Wormhole Details

- Name: `kujira`
- Chain ID: `4002`
- Contract Source: No source file

=== "Mainnet `kaiyo-1`"

    |     Type     | Contract |
    |:------------:|:--------:|
    |     Core     |   N/A    |
    | Token Bridge |   N/A    |
    |  NFT Bridge  |   N/A    |

=== "Testnet `harpoon-4`"

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
  
## Injective

### Ecosystem

- [Website](https://injective.com/){target=_blank}
- [Injective Explorer](https://explorer.injective.network/){target=_blank} | [Injective Testnet Explorer](https://testnet.explorer.injective.network/){target=_blank}
- [Developer Docs](https://docs.injective.network/){target=_blank} | [Injective TypeScript SDK docs](https://docs.ts.injective.network/){target=_blank} | [Injective trading docs](https://docs.trading.injective.network/){target=_blank}
- [Faucet](https://testnet.faucet.injective.network/){target=/_blank}

### Wormhole Details

- Name: `injective`
- Chain ID: `19`
- Contract Source: No source file

=== "Mainnet `injective-1`"

    |     Type     |                                                                        Contract                                                                        |
    |:------------:|:------------------------------------------------------------------------------------------------------------------------------------------------------:|
    |     Core     | [`inj17p9rzwnnfxcjp32un9ug7yhhzgtkhvl9l2q74d`](https://explorer.injective.network/contract/inj17p9rzwnnfxcjp32un9ug7yhhzgtkhvl9l2q74d/){target=_blank} |
    | Token Bridge | [`inj1ghd753shjuwexxywmgs4xz7x2q732vcnxxynfn`](https://explorer.injective.network/contract/inj1ghd753shjuwexxywmgs4xz7x2q732vcnxxynfn/){target=_blank} |
    |  NFT Bridge  |                                                                          N/A                                                                           |

=== "Testnet `injective-888`"

    |     Type     |                                                                           Contract                                                                            |
    |:------------:|:-------------------------------------------------------------------------------------------------------------------------------------------------------------:|
    |     Core     | [`inj1xx3aupmgv3ce537c0yce8zzd3sz567syuyedpg`](https://testnet.explorer.injective.network/account/inj1xx3aupmgv3ce537c0yce8zzd3sz567syuyedpg/){target=_blank} |
    | Token Bridge | [`inj1q0e70vhrv063eah90mu97sazhywmeegp7myvnh`](https://testnet.explorer.injective.network/account/inj1q0e70vhrv063eah90mu97sazhywmeegp7myvnh/){target=_blank} |
    |  NFT Bridge  |                                                                              N/A                                                                              |

=== "Local Network"

    |     Type     | Contract |
    |:------------:|:--------:|
    |     Core     |   N/A    |
    | Token Bridge |   N/A    |
    |  NFT Bridge  |   N/A    |

  
## Osmosis

### Ecosystem

- [Website](https://osmosis.zone/){target=_blank}
- [Block Explorer](https://atomscan.com/osmosis){target=_blank}
- [Developer Docs](https://docs.osmosis.zone/){target=_blank}
- [Faucet](https://faucet.testnet.osmosis.zone/){target=/_blank}

### Wormhole Details

- Name: `osmosis`
- Chain ID: `20`
- Contract Source: No source file

=== "Mainnet `osmosis-1`"

    |     Type     | Contract |
    |:------------:|:--------:|
    |     Core     |   N/A    |
    | Token Bridge |   N/A    |
    |  NFT Bridge  |   N/A    |

=== "Testnet `osmo-test-5`"

    |     Type     |                             Contract                              |
    |:------------:|:-----------------------------------------------------------------:|
    |     Core     | `osmo1hggkxr0hpw83f8vuft7ruvmmamsxmwk2hzz6nytdkzyup9krt0dq27sgyx` |
    | Token Bridge |                                N/A                                |
    |  NFT Bridge  |                                N/A                                |

=== "Local Network"

    |     Type     | Contract |
    |:------------:|:--------:|
    |     Core     |   N/A    |
    | Token Bridge |   N/A    |
    |  NFT Bridge  |   N/A    |

## Sei

### Ecosystem

- [Website](https://www.sei.io/){target=_blank}
- [SeiScan Explorer](https://www.seiscan.app/){target=_blank}
- [Faucet](https://atlantic-2.app.sei.io/faucet/){target=_blank}

### Wormhole Details

- Name: `sei`
- Chain ID: `32`
- Contract Source: No source file

=== "Mainnet `pacific-1`"

    |     Type     |                                                                                           Contract                                                                                            |
    |:------------:|:---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------:|
    |     Core     | [`sei1gjrrme22cyha4ht2xapn3f08zzw6z3d4uxx6fyy9zd5dyr3yxgzqqncdqn`](https://www.seiscan.app/pacific-1/contracts/sei1gjrrme22cyha4ht2xapn3f08zzw6z3d4uxx6fyy9zd5dyr3yxgzqqncdqn){target=_blank} |
    | Token Bridge | [`sei1smzlm9t79kur392nu9egl8p8je9j92q4gzguewj56a05kyxxra0qy0nuf3`](https://www.seiscan.app/pacific-1/contracts/sei1smzlm9t79kur392nu9egl8p8je9j92q4gzguewj56a05kyxxra0qy0nuf3){target=_blank} |
    |  NFT Bridge  |                                                                                              N/A                                                                                              |

=== "Testnet `atlantic-2`"

    |     Type     |                                                                                            Contract                                                                                            |
    |:------------:|:----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------:|
    |     Core     | [`sei1nna9mzp274djrgzhzkac2gvm3j27l402s4xzr08chq57pjsupqnqaj0d5s`](https://www.seiscan.app/atlantic-2/contracts/sei1nna9mzp274djrgzhzkac2gvm3j27l402s4xzr08chq57pjsupqnqaj0d5s){target=_blank} |
    | Token Bridge | [`sei1jv5xw094mclanxt5emammy875qelf3v62u4tl4lp5nhte3w3s9ts9w9az2`](https://www.seiscan.app/atlantic-2/contracts/sei1jv5xw094mclanxt5emammy875qelf3v62u4tl4lp5nhte3w3s9ts9w9az2){target=_blank} |
    |  NFT Bridge  |                                                                                              N/A                                                                                               |

=== "Local Network"

    |     Type     | Contract |
    |:------------:|:--------:|
    |     Core     |   N/A    |
    | Token Bridge |   N/A    |
    |  NFT Bridge  |   N/A    |


## Terra

### Ecosystem

- [Website](https://www.terra.money/){target=_blank}
- [Block Explorer](https://finder.terra.money/){target=_blank}
- [Developer Docs](https://docs.terra.money/){target=_blank}
- [Faucet](https://faucet.terra.money/){target=/_blank}

### Wormhole Details

- Name: `terra`
- Chain ID: `3`
- Contract Source: No source file

=== "Mainnet `columbus-5`"

    |     Type     |                    Contract                    |
    |:------------:|:----------------------------------------------:|
    |     Core     | `terra1dq03ugtd40zu9hcgdzrsq6z2z4hwhc9tqk2uy5` |
    | Token Bridge | `terra10nmmwe8r3g99a9newtqa7a75xfgs2e8z87r2sf` |
    |  NFT Bridge  |                      N/A                       |

=== "Testnet `bombay-12`"

    |     Type     |                    Contract                    |
    |:------------:|:----------------------------------------------:|
    |     Core     | `terra1pd65m0q9tl3v8znnz5f5ltsfegyzah7g42cx5v` |
    | Token Bridge | `terra1pseddrv0yfsn76u4zxrjmtf45kdlmalswdv39a` |
    |  NFT Bridge  |                      N/A                       |

=== "Local Network"

    |     Type     |                              Contract                              |
    |:------------:|:------------------------------------------------------------------:|
    |     Core     | `terra14hj2tavq8fpesdwxxcu44rty3hh90vhujrvcmstl4zr3txmfvw9ssrc8au` |
    | Token Bridge | `terra1nc5tatafv6eyq7llkr2gv50ff9e22mnf70qgjlv737ktmt4eswrquka9l6` |
    |  NFT Bridge  |                                N/A                                 |

## Terra2

### Wormhole Details

- Name: `terra2`
- Chain ID: `18`
- Contract Source: No source file

=== "Mainnet `phoenix-1`"

    |     Type     |                              Contract                              |
    |:------------:|:------------------------------------------------------------------:|
    |     Core     | `terra12mrnzvhx3rpej6843uge2yyfppfyd3u9c3uq223q8sl48huz9juqffcnhp` |
    | Token Bridge | `terra153366q50k7t8nn7gec00hg66crnhkdggpgdtaxltaq6xrutkkz3s992fw9` |
    |  NFT Bridge  |                                N/A                                 |

=== "Testnet `pisco-1`"

    |     Type     |                              Contract                              |
    |:------------:|:------------------------------------------------------------------:|
    |     Core     | `terra19nv3xr5lrmmr7egvrk2kqgw4kcn43xrtd5g0mpgwwvhetusk4k7s66jyv0` |
    | Token Bridge | `terra1c02vds4uhgtrmcw7ldlg75zumdqxr8hwf7npseuf2h58jzhpgjxsgmwkvk` |
    |  NFT Bridge  |                                N/A                                 |

=== "Local Network"

    |     Type     |                              Contract                              |
    |:------------:|:------------------------------------------------------------------:|
    |     Core     | `terra14hj2tavq8fpesdwxxcu44rty3hh90vhujrvcmstl4zr3txmfvw9ssrc8au` |
    | Token Bridge | `terra1nc5tatafv6eyq7llkr2gv50ff9e22mnf70qgjlv737ktmt4eswrquka9l6` |
    |  NFT Bridge  |                                N/A                                 |

  
## XPLA

### Ecosystem

- [Website](https://www.xpla.io/en){target=_blank}
- [Block Explorer](https://explorer.xpla.io/){target=_blank}
- [Developer Docs](https://docs.xpla.io/learn/learn/about-xpla-chain/){target=_blank}
- [Faucet](https://faucet.xpla.io/){target=/_blank}

### Wormhole Details

- Name: `xpla`
- Chain ID: `28`
- Contract Source: No source file

=== "Mainnet `dimension_37-1`"

    |     Type     |                                                                                           Contract                                                                                           |
    |:------------:|:--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------:|
    |     Core     | [`xpla1jn8qmdda5m6f6fqu9qv46rt7ajhklg40ukpqchkejcvy8x7w26cqxamv3w`](https://explorer.xpla.io/mainnet/address/xpla1jn8qmdda5m6f6fqu9qv46rt7ajhklg40ukpqchkejcvy8x7w26cqxamv3w){target=_blank} |
    | Token Bridge | [`xpla137w0wfch2dfmz7jl2ap8pcmswasj8kg06ay4dtjzw7tzkn77ufxqfw7acv`](https://explorer.xpla.io/mainnet/address/xpla137w0wfch2dfmz7jl2ap8pcmswasj8kg06ay4dtjzw7tzkn77ufxqfw7acv){target=_blank} |
    |  NFT Bridge  |                                                                                             N/A                                                                                              |

=== "Testnet `cube_47-5`"

    |     Type     |                                                                                           Contract                                                                                           |
    |:------------:|:--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------:|
    |     Core     | [`xpla1upkjn4mthr0047kahvn0llqx4qpqfn75lnph4jpxfn8walmm8mqsanyy35`](https://explorer.xpla.io/testnet/address/xpla1upkjn4mthr0047kahvn0llqx4qpqfn75lnph4jpxfn8walmm8mqsanyy35){target=_blank} |
    | Token Bridge | [`xpla1kek6zgdaxcsu35nqfsyvs2t9vs87dqkkq6hjdgczacysjn67vt8sern93x`](https://explorer.xpla.io/testnet/address/xpla1kek6zgdaxcsu35nqfsyvs2t9vs87dqkkq6hjdgczacysjn67vt8sern93x){target=_blank} |
    |  NFT Bridge  |                                                                                             N/A                                                                                              |

=== "Local Network"

    |     Type     | Contract |
    |:------------:|:--------:|
    |     Core     |   N/A    |
    | Token Bridge |   N/A    |
    |  NFT Bridge  |   N/A    |

## Neutron

### Ecosystem

- [Website](https://www.neutron.org/){target=_blank}
- [Block Explorer](https://neutron.celat.one/neutron-1){target=_blank}
- [Developer docs](https://docs.neutron.org/){target=_blank}

### Wormhole Details

- Name: `neutron`
- Chain ID: `4003`
- Contract Source: No source file

=== "Mainnet `neutron-1`"

    |     Type     |                                                                                                Contract                                                                                                 |
    |:------------:|:-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------:|
    |     Core     | [`neutron16rerygcpahqcxx5t8vjla46ym8ccn7xz7rtc6ju5ujcd36cmc7zs9zrunh`](https://neutron.celat.one/neutron-1/contracts/neutron16rerygcpahqcxx5t8vjla46ym8ccn7xz7rtc6ju5ujcd36cmc7zs9zrunh){target=_blank} |
    | Token Bridge |                                                                                                   N/A                                                                                                   |
    |  NFT Bridge  |                                                                                                   N/A                                                                                                   |

=== "Testnet `pion-1`"

    |     Type     |                                                                                               Contract                                                                                               |
    |:------------:|:----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------:|
    |     Core     | [`neutron1enf63k37nnv9cugggpm06mg70emcnxgj9p64v2s8yx7a2yhhzk2q6xesk4`](https://neutron.celat.one/pion-1/contracts/neutron1enf63k37nnv9cugggpm06mg70emcnxgj9p64v2s8yx7a2yhhzk2q6xesk4){target=_blank} |
    | Token Bridge |                                                                                                 N/A                                                                                                  |
    |  NFT Bridge  |                                                                                                 N/A                                                                                                  |

=== "Local Network"

    |     Type     | Contract |
    |:------------:|:--------:|
    |     Core     |   N/A    |
    | Token Bridge |   N/A    |
    |  NFT Bridge  |   N/A    |


## Celestia

### Ecosystem

- [Website](https://celestia.org){target=_blank}
- [Block Explorer](https://explorer.modular.cloud/celestia-mainnet){target=_blank}
- [Developer Docs](https://celestia.org/build/){target=_blank}

### Wormhole Details

- Name: `celestia`
- Chain ID: `4004`
- Contract Source: No source file, update [here](https://github.com/wormhole-foundation/docs.wormhole.com/blob/main/scripts/src/chains/celestia.json)

=== "Mainnet `celestia`"

    |     Type     | Contract |
    |:------------:|:--------:|
    |     Core     |   N/A    |
    | Token Bridge |   N/A    |
    |  NFT Bridge  |   N/A    |

=== "Testnet `mocha-4`"

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

## Dymension

### Ecosystem

- [Website](https://dymension.xyz/){target=_blank}
- [Block Explorer](https://www.mintscan.io/dymension){target=_blank}
- [Developer Docs](https://docs.dymension.xyz/){target=_blank}

### Wormhole Details

- Name: `dymension`
- Chain ID: `4007`
- Contract Source: No source file

=== "Mainnet `dymension_1100-1`"

    |     Type     | Contract |
    |:------------:|:--------:|
    |     Core     |   N/A    |
    | Token Bridge |   N/A    |
    |  NFT Bridge  |   N/A    |

=== "Testnet "

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

## Stargaze

### Ecosystem

- [Website](https://www.stargaze.zone/){target=_blank}
- [Block Explorer](https://www.mintscan.io/stargaze){target=_blank}
- [Developer Docs](https://docs.stargaze.zone/){target=_blank}

### Wormhole Details

- Name: `stargaze`
- Chain ID: `4005`
- Contract Source: No source file

=== "Mainnet `stargaze-1`"

    |     Type     | Contract |
    |:------------:|:--------:|
    |     Core     |   N/A    |
    | Token Bridge |   N/A    |
    |  NFT Bridge  |   N/A    |

=== "Testnet"

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

  
## SEDA

### Ecosystem

- [Website](https://seda.xyz/){target=_blank}
- [Block Explorer](https://explorer.seda.xyz/){target=_blank}
- [Developer Docs](https://docs.seda.xyz/home){target=_blank}

### Wormhole Details

- Name: `seda`
- Chain ID: `4006`
- Contract Source: No source file

=== "Mainnet"

    |     Type     | Contract |
    |:------------:|:--------:|
    |     Core     |   N/A    |
    | Token Bridge |   N/A    |
    |  NFT Bridge  |   N/A    |

=== "Testnet `seda-1-testnet`"

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

## Provenance

### Ecosystem

- [Website](https://provenance.io/){target=_blank}
- [Block Explorer](https://explorer.provenance.io/dashboard){target=_blank}
- [Developer Docs](https://developer.provenance.io/docs/quick-start/start-here/){target=_blank}

### Wormhole Details

- Name: `provenance`
- Chain ID: `4008`
- Contract Source: No source file

=== "Mainnet `pio-mainnet-1`"

    |     Type     | Contract |
    |:------------:|:--------:|
    |     Core     |   N/A    |
    | Token Bridge |   N/A    |
    |  NFT Bridge  |   N/A    |

=== "Testnet"

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