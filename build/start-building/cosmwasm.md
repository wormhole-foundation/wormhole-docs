---
title: CosmWasm
description: Learn how to work with Wormhole in the CosmWasm ecosystem with address formats, emitter details, contract consistency levels, and key contract info. 
---

This page includes details for working with CosmWasm environment chains. 

## Addresses

Because Wormhole works with many environments, the Wormhole address format is normalized. For CosmWasm based chains, this means a wormhole formatted address is the [bech32](https://en.bitcoin.it/wiki/Bech32){target=_blank} format converted to hex. E.g. `xpla137w0wfch2dfmz7jl2ap8pcmswasj8kg06ay4dtjzw7tzkn77ufxqfw7acv` becomes `0x8f9cf727175353b17a5f574270e370776123d90fd74956ae4277962b4fdee24c`.

## Emitter 

The emitter address on CosmWasm chains is the canonical address of the contract, normalized to the wormhole address format. 

## Cosmoshub

### Ecosystem

- [Developer Docs](https://hub.cosmos.network/main){target=_blank}

### Wormhole Details

- Name: `cosmoshub`
- Chain ID: `4000`
- Contract Source: No source file

### Mainnet Contracts (<code>cosmoshub-4</code>)

| Type         | Contract |
|--------------|----------|
| Core         | N/A      |
| Token Bridge | N/A      |
| NFT Bridge   | N/A      |

### Testnet Contracts (<code>theta-testnet-001</code>)

| Type         | Contract |
|--------------|----------|
| Core         | N/A      |
| Token Bridge | N/A      |
| NFT Bridge   | N/A      |

### Local Network Contract

| Type         | Contract |
|--------------|----------|
| Core         | N/A      |
| Token Bridge | N/A      |
| NFT Bridge   | N/A      |
  
## Evmos

### Ecosystem

- [Website](https://evmos.org/){target=_blank}
- [https://www.mintscan.io/evmos](https://www.mintscan.io/evmos)
- No dev docs, update [here](https://github.com/wormhole-foundation/docs.wormhole.com/blob/main/scripts/src/chains/evmos.json)

### Wormhole Details

- Name: `evmos`
- Chain ID: `4001`
- Contract Source: No source file

### Mainnet Contracts (<code>evmos_9001-2</code>)

| Type         | Contract |
|--------------|----------|
| Core         | N/A      |
| Token Bridge | N/A      |
| NFT Bridge   | N/A      |

### Testnet Contracts (<code>evmos_9000-4</code>)

| Type         | Contract |
|--------------|----------|
| Core         | N/A      |
| Token Bridge | N/A      |
| NFT Bridge   | N/A      |

### Local Network Contract

| Type         | Contract |
|--------------|----------|
| Core         | N/A      |
| Token Bridge | N/A      |
| NFT Bridge   | N/A      |
  
## Kujira

### Ecosystem

- No webpage, update [here](https://github.com/wormhole-foundation/docs.wormhole.com/blob/main/scripts/src/chains/kujira.json)
- No explorer, update [here](https://github.com/wormhole-foundation/docs.wormhole.com/blob/main/scripts/src/chains/kujira.json)
- No dev docs, update [here](https://github.com/wormhole-foundation/docs.wormhole.com/blob/main/scripts/src/chains/kujira.json)

### Wormhole Details

- Name: `kujira`
- Chain ID: `4002`
- Contract Source: No source file

### Mainnet Contracts (<code>kaiyo-1</code>)

| Type         | Contract |
|--------------|----------|
| Core         | N/A      |
| Token Bridge | N/A      |
| NFT Bridge   | N/A      |

### Testnet Contracts (<code>harpoon-4</code>)

| Type         | Contract |
|--------------|----------|
| Core         | N/A      |
| Token Bridge | N/A      |
| NFT Bridge   | N/A      |

### Local Network Contract

| Type         | Contract |
|--------------|----------|
| Core         | N/A      |
| Token Bridge | N/A      |
| NFT Bridge   | N/A      |
  
## Injective

### Ecosystem

- [Website](https://injective.com/){target=_blank}
- [Injective Explorer](https://explorer.injective.network/){target=_blank} | [Injective Testnet Explorer](https://testnet.explorer.injective.network/){target=_blank}
- [Developer Docs](https://docs.injective.network/){target=_blank} | [Injective Typescript SDK docs](https://docs.ts.injective.network/){target=_blank} | [Injective trading docs](https://docs.trading.injective.network/){target=_blank}

### Wormhole Details

- Name: `injective`
- Chain ID: `19`
- Contract Source: No source file

### Mainnet Contracts (<code>injective-1</code>)

| Type         | Contract                                     |
|--------------|----------------------------------------------|
| Core         | `inj17p9rzwnnfxcjp32un9ug7yhhzgtkhvl9l2q74d` |
| Token Bridge | `inj1ghd753shjuwexxywmgs4xz7x2q732vcnxxynfn` |
| NFT Bridge   | N/A                                          |

### Testnet Contracts (<code>injective-888</code>)

| Type         | Contract                                     |
|--------------|----------------------------------------------|
| Core         | `inj1xx3aupmgv3ce537c0yce8zzd3sz567syuyedpg` |
| Token Bridge | `inj1q0e70vhrv063eah90mu97sazhywmeegp7myvnh` |
| NFT Bridge   | N/A                                          |

### Local Network Contract

| Type         | Contract |
|--------------|----------|
| Core         | N/A      |
| Token Bridge | N/A      |
| NFT Bridge   | N/A      |
  
## Osmosis

### Ecosystem

- [Website](https://osmosis.zone/){target=_blank}
- [Block Explorer](https://atomscan.com/osmosis){target=_blank}
- [Developer Docs](https://docs.osmosis.zone/){target=_blank}

### Wormhole Details

- Name: `osmosis`
- Chain ID: `20`
- Contract Source: No source file

### Mainnet Contracts (<code>osmosis-1</code>)

| Type         | Contract |
|--------------|----------|
| Core         | N/A      |
| Token Bridge | N/A      |
| NFT Bridge   | N/A      |

### Testnet Contracts (<code>osmo-test-5</code>)

| Type         | Contract                                                          |
|--------------|-------------------------------------------------------------------|
| Core         | `osmo1hggkxr0hpw83f8vuft7ruvmmamsxmwk2hzz6nytdkzyup9krt0dq27sgyx` |
| Token Bridge | N/A                                                               |
| NFT Bridge   | N/A                                                               |

### Local Network Contract

| Type         | Contract |
|--------------|----------|
| Core         | N/A      |
| Token Bridge | N/A      |
| NFT Bridge   | N/A      |
  
## Sei

### Ecosystem

- [Website](https://www.sei.io/){target=_blank}
- [SeiScan Explorer](https://www.seiscan.app/){target=_blank}
- [Faucet](https://atlantic-2.app.sei.io/faucet){target=_blank}

### Wormhole Details

- Name: `sei`
- Chain ID: `32`
- Contract Source: No source file

### Mainnet Contracts (<code>pacific-1</code>)

| Type         | Contract                                                         |
|--------------|------------------------------------------------------------------|
| Core         | `sei1gjrrme22cyha4ht2xapn3f08zzw6z3d4uxx6fyy9zd5dyr3yxgzqqncdqn` |
| Token Bridge | `sei1smzlm9t79kur392nu9egl8p8je9j92q4gzguewj56a05kyxxra0qy0nuf3` |
| NFT Bridge   | N/A                                                              |

### Testnet Contracts (<code>atlantic-2</code>)

| Type         | Contract                                                         |
|--------------|------------------------------------------------------------------|
| Core         | `sei1nna9mzp274djrgzhzkac2gvm3j27l402s4xzr08chq57pjsupqnqaj0d5s` |
| Token Bridge | `sei1jv5xw094mclanxt5emammy875qelf3v62u4tl4lp5nhte3w3s9ts9w9az2` |
| NFT Bridge   | N/A                                                              |

### Local Network Contract

| Type         | Contract |
|--------------|----------|
| Core         | N/A      |
| Token Bridge | N/A      |
| NFT Bridge   | N/A      |
  

## Terra

### Ecosystem

- [Website](https://www.terra.money/){target=_blank}
- [Block Explorer](https://finder.terra.money/){target=_blank}
- [Developer Docs](https://docs.terra.money/){target=_blank}

### Wormhole Details

- Name: `terra`
- Chain ID: `3`
- Contract Source: No source file

### Mainnet Contracts (<code>columbus-5</code>)

| Type         | Contract                                       |
|--------------|------------------------------------------------|
| Core         | `terra1dq03ugtd40zu9hcgdzrsq6z2z4hwhc9tqk2uy5` |
| Token Bridge | `terra10nmmwe8r3g99a9newtqa7a75xfgs2e8z87r2sf` |
| NFT Bridge   | N/A                                            |

### Testnet Contracts (<code>bombay-12</code>)

| Type         | Contract                                       |
|--------------|------------------------------------------------|
| Core         | `terra1pd65m0q9tl3v8znnz5f5ltsfegyzah7g42cx5v` |
| Token Bridge | `terra1pseddrv0yfsn76u4zxrjmtf45kdlmalswdv39a` |
| NFT Bridge   | N/A                                            |

### Local Network Contract

| Type         | Contract                                                           |
|--------------|--------------------------------------------------------------------|
| Core         | `terra14hj2tavq8fpesdwxxcu44rty3hh90vhujrvcmstl4zr3txmfvw9ssrc8au` |
| Token Bridge | `terra1nc5tatafv6eyq7llkr2gv50ff9e22mnf70qgjlv737ktmt4eswrquka9l6` |
| NFT Bridge   | N/A                                                                |
  
## Terra2

### Wormhole Details

- Name: `terra2`
- Chain ID: `18`
- Contract Source: No source file

### Mainnet Contracts (<code>phoenix-1</code>)

| Type         | Contract                                                           |
|--------------|--------------------------------------------------------------------|
| Core         | `terra12mrnzvhx3rpej6843uge2yyfppfyd3u9c3uq223q8sl48huz9juqffcnhp` |
| Token Bridge | `terra153366q50k7t8nn7gec00hg66crnhkdggpgdtaxltaq6xrutkkz3s992fw9` |
| NFT Bridge   | N/A                                                                |

### Testnet Contracts (<code>pisco-1</code>)

| Type         | Contract                                                           |
|--------------|--------------------------------------------------------------------|
| Core         | `terra19nv3xr5lrmmr7egvrk2kqgw4kcn43xrtd5g0mpgwwvhetusk4k7s66jyv0` |
| Token Bridge | `terra1c02vds4uhgtrmcw7ldlg75zumdqxr8hwf7npseuf2h58jzhpgjxsgmwkvk` |
| NFT Bridge   | N/A                                                                |

### Local Network Contract

| Type         | Contract                                                           |
|--------------|--------------------------------------------------------------------|
| Core         | `terra14hj2tavq8fpesdwxxcu44rty3hh90vhujrvcmstl4zr3txmfvw9ssrc8au` |
| Token Bridge | `terra1nc5tatafv6eyq7llkr2gv50ff9e22mnf70qgjlv737ktmt4eswrquka9l6` |
| NFT Bridge   | N/A                                                                |
  
## Xpla

### Ecosystem

- [Website](https://www.xpla.io/en){target=_blank}
- [Block Explorer](https://explorer.xpla.io/){target=_blank}
- [Developer Docs](https://docs.xpla.io/learn/learn/about-xpla-chain/){target=_blank}

### Wormhole Details

- Name: `xpla`
- Chain ID: `28`
- Contract Source: No source file

### Mainnet Contracts (<code>dimension_37-1</code>)

| Type         | Contract                                                          |
|--------------|-------------------------------------------------------------------|
| Core         | `xpla1jn8qmdda5m6f6fqu9qv46rt7ajhklg40ukpqchkejcvy8x7w26cqxamv3w` |
| Token Bridge | `xpla137w0wfch2dfmz7jl2ap8pcmswasj8kg06ay4dtjzw7tzkn77ufxqfw7acv` |
| NFT Bridge   | N/A                                                               |

### Testnet Contracts (<code>cube_47-5</code>)

| Type         | Contract                                                          |
|--------------|-------------------------------------------------------------------|
| Core         | `xpla1upkjn4mthr0047kahvn0llqx4qpqfn75lnph4jpxfn8walmm8mqsanyy35` |
| Token Bridge | `xpla1kek6zgdaxcsu35nqfsyvs2t9vs87dqkkq6hjdgczacysjn67vt8sern93x` |
| NFT Bridge   | N/A                                                               |

### Local Network Contract

| Type         | Contract |
|--------------|----------|
| Core         | N/A      |
| Token Bridge | N/A      |
| NFT Bridge   | N/A      |
  
## Neutron

### Ecosystem

- [Website](https://www.neutron.org/){target=_blank}
- [Block Explorer](https://neutron.celat.one/neutron-1){target=_blank}
- [Developer docs](https://docs.neutron.org/){target=_blank}

### Wormhole Details

- Name: `neutron`
- Chain ID: `4003`
- Contract Source: No source file

### Mainnet Contracts (<code>neutron-1</code>)

| Type         | Contract                                                             |
|--------------|----------------------------------------------------------------------|
| Core         | `neutron16rerygcpahqcxx5t8vjla46ym8ccn7xz7rtc6ju5ujcd36cmc7zs9zrunh` |
| Token Bridge | N/A                                                                  |
| NFT Bridge   | N/A                                                                  |

### Testnet Contracts (<code>pion-1</code>)

| Type         | Contract                                                             |
|--------------|----------------------------------------------------------------------|
| Core         | `neutron1enf63k37nnv9cugggpm06mg70emcnxgj9p64v2s8yx7a2yhhzk2q6xesk4` |
| Token Bridge | N/A                                                                  |
| NFT Bridge   | N/A                                                                  |

### Local Network Contract

| Type         | Contract |
|--------------|----------|
| Core         | N/A      |
| Token Bridge | N/A      |
| NFT Bridge   | N/A      |

## Celestia

### Ecosystem

- [Website](https://celestia.org){target=_blank}
- [Block Explorer](https://explorer.modular.cloud/celestia-mainnet){target=_blank}
- [Developer Docs](https://celestia.org/build/){target=_blank}

### Wormhole Details

- Name: `celestia`
- Chain ID: `4004`
- Contract Source: No source file, update [here](https://github.com/wormhole-foundation/docs.wormhole.com/blob/main/scripts/src/chains/celestia.json)

### Mainnet Contracts (<code>celestia</code>)

| Type         | Contract |
|--------------|----------|
| Core         | N/A      |
| Token Bridge | N/A      |
| NFT Bridge   | N/A      |

### Testnet Contracts (<code>mocha-4</code>)

| Type         | Contract |
|--------------|----------|
| Core         | N/A      |
| Token Bridge | N/A      |
| NFT Bridge   | N/A      |

### Local Network Contract

| Type         | Contract |
|--------------|----------|
| Core         | N/A      |
| Token Bridge | N/A      |
| NFT Bridge   | N/A      |

## Dymension

### Ecosystem

- [Website](https://dymension.xyz/){target=_blank}
- [Block Explorer](https://www.mintscan.io/dymension){target=_blank}
- [Developer Docs](https://docs.dymension.xyz/){target=_blank}

### Wormhole Details

- Name: `dymension`
- Chain ID: `4007`
- Contract Source: No source file

### Mainnet Contracts (<code>dymension_1100-1</code>)

| Type         | Contract |
|--------------|----------|
| Core         | N/A      |
| Token Bridge | N/A      |
| NFT Bridge   | N/A      |

### Testnet Contracts 

| Type         | Contract |
|--------------|----------|
| Core         | N/A      |
| Token Bridge | N/A      |
| NFT Bridge   | N/A      |

### Local Network Contract

| Type         | Contract |
|--------------|----------|
| Core         | N/A      |
| Token Bridge | N/A      |
| NFT Bridge   | N/A      |
  

## Stargaze

### Ecosystem

- [Website](https://www.stargaze.zone/){target=_blank}
- [Block Explorer](https://www.mintscan.io/stargaze){target=_blank}
- [Developer Docs](https://docs.stargaze.zone/){target=_blank}

### Wormhole Details

- Name: `stargaze`
- Chain ID: `4005`
- Contract Source: No source file

### Mainnet Contracts (<code>stargaze-1</code>)

| Type         | Contract |
|--------------|----------|
| Core         | N/A      |
| Token Bridge | N/A      |
| NFT Bridge   | N/A      |

### Testnet Contracts 

| Type         | Contract |
|--------------|----------|
| Core         | N/A      |
| Token Bridge | N/A      |
| NFT Bridge   | N/A      |

### Local Network Contract

| Type         | Contract |
|--------------|----------|
| Core         | N/A      |
| Token Bridge | N/A      |
| NFT Bridge   | N/A      |
  
## Seda

### Ecosystem

- [Website](https://seda.xyz/){target=_blank}
- [Block Explorer](https://explorer.seda.xyz/){target=_blank}
- [Developer Docs](https://docs.seda.xyz/home){target=_blank}

### Wormhole Details

- Name: `seda`
- Chain ID: `4006`
- Contract Source: No source file

### Mainnet Contracts 

| Type         | Contract |
|--------------|----------|
| Core         | N/A      |
| Token Bridge | N/A      |
| NFT Bridge   | N/A      |

### Testnet Contracts (<code>seda-1-testnet</code>)

| Type         | Contract |
|--------------|----------|
| Core         | N/A      |
| Token Bridge | N/A      |
| NFT Bridge   | N/A      |

### Local Network Contract

| Type         | Contract |
|--------------|----------|
| Core         | N/A      |
| Token Bridge | N/A      |
| NFT Bridge   | N/A      |
  
## Provenance

### Ecosystem

- [Website](https://provenance.io/){target=_blank}
- [Block Explorer](https://explorer.provenance.io/dashboard){target=_blank}
- [Developer Docs](https://developer.provenance.io/docs/quick-start/start-here/){target=_blank}

## Wormhole Details

- Name: `provenance`
- Chain ID: `4008`
- Contract Source: No source file

### Mainnet Contracts (<code>pio-mainnet-1</code>)

| Type         | Contract |
|--------------|----------|
| Core         | N/A      |
| Token Bridge | N/A      |
| NFT Bridge   | N/A      |

### Testnet Contracts 

| Type         | Contract |
|--------------|----------|
| Core         | N/A      |
| Token Bridge | N/A      |
| NFT Bridge   | N/A      |

### Local Network Contract

| Type         | Contract |
|--------------|----------|
| Core         | N/A      |
| Token Bridge | N/A      |
| NFT Bridge   | N/A      |
  