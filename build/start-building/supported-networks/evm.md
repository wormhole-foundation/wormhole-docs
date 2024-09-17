---
title: EVM
description: This page includes important information for EVM chains supported by Wormhole, including contract addresses, chain IDs, bridge addresses, and other constants.
---

# EVM Network Details

Details for working with EVM environment chains.

## Developer Tools

The recommended development tool for EVM environments is [Foundry](https://book.getfoundry.sh/getting-started/installation).

## Addresses

Because Wormhole works awith many environments, the Wormhole address format is normalized.

For EVM chains, this means a wormhole formatted address is the 20 byte EVM standard address left padded with `0`s For example, `0xd8da6bf26964af9d7eed9e03e53415d37aa96045` would be converted to`0x000000000000000000000000d8da6bf26964af9d7eed9e03e53415d37aa96045`.

## Emitter

The emitter address on EVM chains is the contract address, normalized to the wormhole address format.

<!--ETHEREUM_CHAIN_DETAILS-->

## Ethereum

!!! note
    Deployed contracts are also available on the [Sepolia](#sepolia) TestNet.

### Quick Links

- [Network website](https://ethereum.org/){target=\_blank}
- [Developer documentation](https://ethereum.org/en/developers/docs/){target=\_blank}
- [https://etherscan.io/](https://etherscan.io/){target=\_blank}

### Chain Details

- **Name** - `ethereum`
- **Wormhole chain ID** - `2`
- **Network chain ID**:
    - **MainNet** - <code>1</code>
    - **TestNet** - <code>Goerli</code> - <code>5</code>
- **Contract source** - [ethereum/contracts/bridge/Bridge.sol](https://github.com/wormhole-foundation/wormhole/blob/main/ethereum/contracts/bridge/Bridge.sol){target=\_blank}

### Consistency Levels

The [consistency level](/build/reference/consistency-levels/) options (i.e., finality) are:

|Level|Value|
|-----|-----|
|Instant|200|
|Safe|201|

!!! note
    If a value is passed that is _not_ in the set above, it's assumed to mean finalized.

For more information, see [https://www.alchemy.com/overviews/ethereum-commitment-levels](https://www.alchemy.com/overviews/ethereum-commitment-levels){target=\_blank}

### Contracts

=== "MainNet"

    |Type|Contract|
    |----|--------|
    |Core|`0x98f3c9e6E3fAce36bAAd05FE09d375Ef1464288B`|
    |Token Bridge|`0x3ee18B2214AFF97000D974cf647E7C347E8fa585`|
    |NFT Bridge|`0x6FFd7EdE62328b3Af38FCD61461Bbfc52F5651fE`|
    |Relayer|`0x27428DD2d3DD32A4D7f7C497eAaa23130d894911`|
    |CCTP|`0xAaDA05BD399372f0b0463744C09113c137636f6a`|

=== "TestNet"

    |Type|Contract|
    |----|--------|
    |Core|`0x706abc4E45D419950511e474C7B9Ed348A4a716c`|
    |Token Bridge|`0xF890982f9310df57d00f659cf4fd87e65adEd8d7`|
    |NFT Bridge|`0xD8E4C2DbDd2e2bd8F1336EA691dBFF6952B1a6eB`|
    |Relayer|`0x28D8F1Be96f97C1387e94A53e00eCcFb4E75175a`|
    |Mock Provider|`0xD1463B4fe86166768d2ff51B1A928beBB5c9f375`|
    |Mock Integration|`0xb81bc199b73AB34c393a4192C163252116a03370`|

=== "Local Development"

    |Type|Contract|
    |----|--------|
    |Core|`0xC89Ce4735882C9F0f0FE26686c53074E09B0D550`|
    |Token Bridge|`0x0290FB167208Af455bB137780163b7B7a9a10C16`|
    |NFT Bridge|`0x26b4afb60d6c903165150c6f0aa14f8016be4aec`|
    |Relayer|`0xb98F46E96cb1F519C333FdFB5CCe0B13E0300ED4`|
    |Mock Provider|`0x1ef9e15c3bbf0555860b5009B51722027134d53a`|
    |Mock Integration|`0x0eb0dD3aa41bD15C706BC09bC03C002b7B85aeAC`|

<!--ETHEREUM_CHAIN_DETAILS-->

<!--ACALA_CHAIN_DETAILS-->

## Acala

### Quick Links

- [Network website](https://acala.network/){target=\_blank}
- [Developer documentation](https://evmdocs.acala.network/){target=\_blank}
- [https://acala.subscan.io/](https://acala.subscan.io/){target=\_blank} | [https://blockscout.acala.network/](https://blockscout.acala.network/){target=\_blank}
- [Faucet](https://evmdocs.acala.network/tooling/faucet){target=\_blank}

### Chain Details

- **Name** - `acala`
- **Wormhole chain ID** - `12`
- **Network chain ID**:
    - **MainNet** - <code>787</code>
    - **TestNet** - <code>597</code>
- **Contract source** - [ethereum/contracts/bridge/Bridge.sol](https://github.com/wormhole-foundation/wormhole/blob/main/ethereum/contracts/bridge/Bridge.sol){target=\_blank}

### Consistency Levels

The [consistency level](/build/reference/consistency-levels/) options (i.e., finality) are:

|Level|Value|
|-----|-----|
|Instant|200|

!!! note
    If a value is passed that is _not_ in the set above, it's assumed to mean finalized.


### Contracts

=== "MainNet"

    |Type|Contract|
    |----|--------|
    |Core|`0xa321448d90d4e5b0A732867c18eA198e75CAC48E`|
    |Token Bridge|`0xae9d7fe007b3327AA64A32824Aaac52C42a6E624`|
    |NFT Bridge|`0xb91e3638F82A1fACb28690b37e3aAE45d2c33808`|
    |Relayer|`0x27428DD2d3DD32A4D7f7C497eAaa23130d894911`|

=== "TestNet"

    |Type|Contract|
    |----|--------|
    |Core|`0x4377B49d559c0a9466477195C6AdC3D433e265c0`|
    |Token Bridge|`0xebA00cbe08992EdD08ed7793E07ad6063c807004`|
    |NFT Bridge|`0x96f1335e0AcAB3cfd9899B30b2374e25a2148a6E`|

=== "Local Development"

    |Type|Contract|
    |----|--------|
    |Core|**N/A**|
    |Token Bridge|**N/A**|
    |NFT Bridge|**N/A**|

<!--ACALA_CHAIN_DETAILS-->
<!--ARBITRUM_CHAIN_DETAILS-->

## Arbitrum

### Quick Links

- [Network website](https://arbitrum.io/){target=\_blank}
- [Developer documentation](https://developer.arbitrum.io/getting-started-devs){target=\_blank}
- [Arbitrum Explorer](https://arbiscan.io/){target=\_blank}

### Chain Details

- **Name** - `arbitrum`
- **Wormhole chain ID** - `23`
- **Network chain ID**:
    - **MainNet** - <code>Arbitrum One</code> - <code>42161</code>
    - **TestNet** - <code>Goerli</code> - <code>421613</code>
- **Contract source** - No source file available. Please update [the chain configurations](https://github.com/wormhole-foundation/docs.wormhole.com/blob/main/scripts/src/chains/arbitrum.json){target=\_blank}

### Consistency Levels

The [consistency level](/build/reference/consistency-levels/) options (i.e., finality) are:

|Level|Value|
|-----|-----|
|Instant|200|

!!! note
    If a value is passed that is _not_ in the set above, it's assumed to mean finalized.

For more information, see [https://developer.arbitrum.io/tx-lifecycle](https://developer.arbitrum.io/tx-lifecycle){target=\_blank}

### Contracts

=== "MainNet"

    |Type|Contract|
    |----|--------|
    |Core|`0xa5f208e072434bC67592E4C49C1B991BA79BCA46`|
    |Token Bridge|`0x0b2402144Bb366A632D14B83F244D2e0e21bD39c`|
    |NFT Bridge|`0x3dD14D553cFD986EAC8e3bddF629d82073e188c8`|
    |Relayer|`0x27428DD2d3DD32A4D7f7C497eAaa23130d894911`|
    |CCTP|`0x2703483B1a5a7c577e8680de9Df8Be03c6f30e3c`|

=== "TestNet"

    |Type|Contract|
    |----|--------|
    |Core|`0xC7A204bDBFe983FCD8d8E61D02b475D4073fF97e`|
    |Token Bridge|`0x23908A62110e21C04F3A4e011d24F901F911744A`|
    |NFT Bridge|`0xEe3dB83916Ccdc3593b734F7F2d16D630F39F1D0`|
    |Relayer|`0xAd753479354283eEE1b86c9470c84D42f229FF43`|
    |Mock Provider|`0x90995DBd1aae85872451b50A569dE947D34ac4ee`|
    |Mock Integration|`0x0de48f34E14d08934DA1eA2286Be1b2BED5c062a`|

=== "Local Development"

    |Type|Contract|
    |----|--------|
    |Core|**N/A**|
    |Token Bridge|**N/A**|
    |NFT Bridge|**N/A**|

<!--ARBITRUM_CHAIN_DETAILS-->
<!--AURORA_CHAIN_DETAILS-->

## Aurora

### Ecosystem

- [Web site](https://aurora.dev/)
- [Block Explorer](https://explorer.aurora.dev/)
- [Developer docs](https://doc.aurora.dev/) | [Faucet](https://aurora.dev/faucet)

### Wormhole Details

- **Name** - `aurora`
- **Wormhole Chain ID** - `9`
- **Network Chain ID**:
    - **MainNet** - `1313161554`
    - **TestNet** - `1313161555`
- **Contract Source** -  [ethereum/contracts/bridge/Bridge.sol](https://github.com/wormhole-foundation/wormhole/blob/main/ethereum/contracts/bridge/Bridge.sol)

### Contracts

=== "MainNet"

    |Type|Contract|
    |----|--------|
    |Core|`0xa321448d90d4e5b0A732867c18eA198e75CAC48E`|
    |Token Bridge|`0x51b5123a7b0F9b2bA265f9c4C8de7D78D52f510F`|
    |NFT Bridge|`0x6dcC0484472523ed9Cdc017F711Bcbf909789284`|

=== "TestNet"

    |Type|Contract|
    |----|--------|
    |Core|`0xBd07292de7b505a4E803CEe286184f7Acf908F5e`|
    |Token Bridge|`0xD05eD3ad637b890D68a854d607eEAF11aF456fba`|
    |NFT Bridge|`0x8F399607E9BA2405D87F5f3e1B78D950b44b2e24`|

=== "Local Development"

    |Type|Contract|
    |----|--------|
    |Core|**N/A**|
    |Token Bridge|**N/A**|
    |NFT Bridge|**N/A**|
  
<!--AURORA_CHAIN_DETAILS-->
<!--AVALANCHE_CHAIN_DETAILS-->

## Avalanche

### Quick Links

- [Network website](https://www.avax.network/){target=\_blank}
- [Developer documentation](https://docs.avax.network/){target=\_blank}
- [C-Chain Block Explorer](https://snowtrace.io/){target=\_blank} | [https://subnets.avax.network/](https://subnets.avax.network/){target=\_blank}
- [Faucet](https://core.app/tools/testnet-faucet/?subnet=c&token=c){target=\_blank}

### Chain Details

- **Name** - `avalanche`
- **Wormhole chain ID** - `6`
- **Network chain ID**:
    - **MainNet** - <code>C-Chain</code> - <code>43114</code>
    - **TestNet** - <code>Fuji</code> - <code>43113</code>
- **Contract source** - [ethereum/contracts/bridge/Bridge.sol](https://github.com/wormhole-foundation/wormhole/blob/main/ethereum/contracts/bridge/Bridge.sol){target=\_blank}

### Consistency Levels

The [consistency level](/build/reference/consistency-levels/) options (i.e., finality) are:

|Level|Value|
|-----|-----|
|Finalized|0|

!!! note
    This field may be ignored since the chain provides instant finality.

For more information, see [https://docs.avax.network/build/dapp/advanced/integrate-exchange#determining-finality](https://docs.avax.network/build/dapp/advanced/integrate-exchange#determining-finality){target=\_blank}

### Contracts

=== "MainNet"

    |Type|Contract|
    |----|--------|
    |Core|`0x54a8e5f9c4CbA08F9943965859F6c34eAF03E26c`|
    |Token Bridge|`0x0e082F06FF657D94310cB8cE8B0D9a04541d8052`|
    |NFT Bridge|`0xf7B6737Ca9c4e08aE573F75A97B73D7a813f5De5`|
    |Relayer|`0x27428DD2d3DD32A4D7f7C497eAaa23130d894911`|
    |CCTP|`0x09Fb06A271faFf70A651047395AaEb6265265F13`|

=== "TestNet"

    |Type|Contract|
    |----|--------|
    |Core|`0x7bbcE28e64B3F8b84d876Ab298393c38ad7aac4C`|
    |Token Bridge|`0x61E44E506Ca5659E6c0bba9b678586fA2d729756`|
    |NFT Bridge|`0xD601BAf2EEE3C028344471684F6b27E789D9075D`|
    |Relayer|`0xA3cF45939bD6260bcFe3D66bc73d60f19e49a8BB`|
    |Mock Provider|`0x60a86b97a7596eBFd25fb769053894ed0D9A8366`|
    |Mock Integration|`0x5E52f3eB0774E5e5f37760BD3Fca64951D8F74Ae`|
    |CCTP|`0x58f4c17449c90665891c42e14d34aae7a26a472e`|

=== "Local Development"

    |Type|Contract|
    |----|--------|
    |Core|**N/A**|
    |Token Bridge|**N/A**|
    |NFT Bridge|**N/A**|

<!--AVALANCHE_CHAIN_DETAILS-->
<!--BASE_CHAIN_DETAILS-->

## Base

### Quick Links

- [Network website](https://base.org/){target=\_blank}
- [Developer documentation](https://docs.base.org/){target=\_blank}
- [Etherscan](https://goerli.basescan.org/){target=\_blank} | [Blockscout](https://base-goerli.blockscout.com/){target=\_blank}

### Chain Details

- **Name** - `base`
- **Wormhole chain ID** - `30`
- **Network chain ID**:
    - **MainNet** - <code>Base</code> - <code>8453</code>
    - **TestNet** - <code>Base Goerli</code> - <code>84531</code>
- **Contract source** - [ethereum/contracts/bridge/Bridge.sol](https://github.com/wormhole-foundation/wormhole/blob/main/ethereum/contracts/bridge/Bridge.sol){target=\_blank}

### Contracts

=== "MainNet"

    |Type|Contract|
    |----|--------|
    |Core|`0xbebdb6C8ddC678FfA9f8748f85C815C556Dd8ac6`|
    |Token Bridge|`0x8d2de8d2f73F1F4cAB472AC9A881C9b123C79627`|
    |NFT Bridge|`0xDA3adC6621B2677BEf9aD26598e6939CF0D92f88`|
    |Relayer|`0x706f82e9bb5b0813501714ab5974216704980e31`|
    |CCTP|`0x03faBB06Fa052557143dC28eFCFc63FC12843f1D`|

=== "TestNet"

    |Type|Contract|
    |----|--------|
    |Core|`0x23908A62110e21C04F3A4e011d24F901F911744A`|
    |Token Bridge|`0xA31aa3FDb7aF7Db93d18DDA4e19F811342EDF780`|
    |NFT Bridge|`0xF681d1cc5F25a3694E348e7975d7564Aa581db59`|
    |Relayer|`0xea8029CD7FCAEFFcD1F53686430Db0Fc8ed384E1`|
    |Mock Provider|`0x60a86b97a7596eBFd25fb769053894ed0D9A8366`|
    |Mock Integration|`0x9Ee656203B0DC40cc1bA3f4738527779220e3998`|

=== "Local Development"

    |Type|Contract|
    |----|--------|
    |Core|**N/A**|
    |Token Bridge|**N/A**|
    |NFT Bridge|**N/A**|

<!--BASE_CHAIN_DETAILS-->
<!--BSC_CHAIN_DETAILS-->

## BNB Smart Chain {: #bsc }

### Quick Links

- [Network website](https://www.bnbchain.org/en/smartChain){target=\_blank}
- [Developer documentation](https://docs.bnbchain.org/docs/learn/intro){target=\_blank}
- [Etherscan](https://bscscan.com/){target=\_blank}
- [Faucet](https://testnet.binance.org/faucet-smart/){target=\_blank}

### Chain Details

- **Name** - `bsc`
- **Wormhole chain ID** - `4`
- **Network chain ID**:
    - **MainNet** - <code>56</code>
    - **TestNet** - <code>97</code>
- **Contract source** - [ethereum/contracts/bridge/Bridge.sol](https://github.com/wormhole-foundation/wormhole/blob/main/ethereum/contracts/bridge/Bridge.sol){target=\_blank}

### Consistency Levels

The [consistency level](/build/reference/consistency-levels/) options (i.e., finality) are:

|Level|Value|
|-----|-----|
|Instant|200|
|Safe|201|

!!! note
    If a value is passed that is _not_ in the set above, it's assumed to mean finalized.

For more information, see [https://docs.bnbchain.org/docs/learn/consensus](https://docs.bnbchain.org/docs/learn/consensus){target=\_blank}

### Contracts

=== "MainNet"

    |Type|Contract|
    |----|--------|
    |Core|`0x98f3c9e6E3fAce36bAAd05FE09d375Ef1464288B`|
    |Token Bridge|`0xB6F6D86a8f9879A9c87f643768d9efc38c1Da6E7`|
    |NFT Bridge|`0x5a58505a96D1dbf8dF91cB21B54419FC36e93fdE`|
    |Relayer|`0x27428DD2d3DD32A4D7f7C497eAaa23130d894911`|

=== "TestNet"

    |Type|Contract|
    |----|--------|
    |Core|`0x68605AD7b15c732a30b1BbC62BE8F2A509D74b4D`|
    |Token Bridge|`0x9dcF9D205C9De35334D646BeE44b2D2859712A09`|
    |NFT Bridge|`0xcD16E5613EF35599dc82B24Cb45B5A93D779f1EE`|
    |Relayer|`0x80aC94316391752A193C1c47E27D382b507c93F3`|
    |Mock Provider|`0x60a86b97a7596eBFd25fb769053894ed0D9A8366`|
    |Mock Integration|`0xb6A04D6672F005787147472Be20d39741929Aa03`|

=== "Local Development"

    |Type|Contract|
    |----|--------|
    |Core|`0xC89Ce4735882C9F0f0FE26686c53074E09B0D550`|
    |Token Bridge|`0x0290FB167208Af455bB137780163b7B7a9a10C16`|
    |NFT Bridge|`0x26b4afb60d6c903165150c6f0aa14f8016be4aec`|
    |Relayer|`0xb98F46E96cb1F519C333FdFB5CCe0B13E0300ED4`|
    |Mock Provider|`0x1ef9e15c3bbf0555860b5009B51722027134d53a`|
    |Mock Integration|`0x0eb0dD3aa41bD15C706BC09bC03C002b7B85aeAC`|

<!--BSC_CHAIN_DETAILS-->
<!--CELO_CHAIN_DETAILS-->

## Celo

### Quick Links

- [Network website](https://celo.org/){target=\_blank}
- [Developer documentation](https://docs.celo.org/){target=\_blank}
- [https://explorer.celo.org/mainnet/](https://explorer.celo.org/mainnet/){target=\_blank} | [https://celoscan.io/](https://celoscan.io/){target=\_blank}
- [Faucet](https://faucet.celo.org/alfajores){target=\_blank}

### Chain Details

- **Name** - `celo`
- **Wormhole chain ID** - `14`
- **Network chain ID**:
    - **MainNet** - <code>42220</code>
    - **TestNet** - <code>Alfajores</code> - <code>44787</code>
- **Contract source** - [ethereum/contracts/bridge/Bridge.sol](https://github.com/wormhole-foundation/wormhole/blob/main/ethereum/contracts/bridge/Bridge.sol){target=\_blank}

### Consistency Levels

The [consistency level](/build/reference/consistency-levels/) options (i.e., finality) are:

|Level|Value|
|-----|-----|
|Instant|200|

!!! note
    If a value is passed that is _not_ in the set above, it's assumed to mean finalized.


### Contracts

=== "MainNet"

    |Type|Contract|
    |----|--------|
    |Core|`0xa321448d90d4e5b0A732867c18eA198e75CAC48E`|
    |Token Bridge|`0x796Dff6D74F3E27060B71255Fe517BFb23C93eed`|
    |NFT Bridge|`0xA6A377d75ca5c9052c9a77ED1e865Cc25Bd97bf3`|
    |Relayer|`0x27428DD2d3DD32A4D7f7C497eAaa23130d894911`|

=== "TestNet"

    |Type|Contract|
    |----|--------|
    |Core|`0x88505117CA88e7dd2eC6EA1E13f0948db2D50D56`|
    |Token Bridge|`0x05ca6037eC51F8b712eD2E6Fa72219FEaE74E153`|
    |NFT Bridge|`0xaCD8190F647a31E56A656748bC30F69259f245Db`|
    |Relayer|`0x306B68267Deb7c5DfCDa3619E22E9Ca39C374f84`|
    |Mock Provider|`0x60a86b97a7596eBFd25fb769053894ed0D9A8366`|
    |Mock Integration|`0x7f1d8E809aBB3F6Dc9B90F0131C3E8308046E190`|

=== "Local Development"

    |Type|Contract|
    |----|--------|
    |Core|**N/A**|
    |Token Bridge|**N/A**|
    |NFT Bridge|**N/A**|

<!--CELO_CHAIN_DETAILS-->
<!--FANTOM_CHAIN_DETAILS-->

## Fantom

### Quick Links

- [Network website](https://fantom.foundation/){target=\_blank}
- [Developer documentation](https://docs.fantom.foundation/){target=\_blank}
- [https://ftmscan.com/](https://ftmscan.com/){target=\_blank}
- [Faucet](https://faucet.fantom.network/){target=\_blank}

### Chain Details

- **Name** - `fantom`
- **Wormhole chain ID** - `10`
- **Network chain ID**:
    - **MainNet** - <code>250</code>
    - **TestNet** - <code>4002</code>
- **Contract source** - [ethereum/contracts/bridge/Bridge.sol](https://github.com/wormhole-foundation/wormhole/blob/main/ethereum/contracts/bridge/Bridge.sol){target=\_blank}

### Consistency Levels

The [consistency level](/build/reference/consistency-levels/) options (i.e., finality) are:

|Level|Value|
|-----|-----|
|Instant|200|

!!! note
    If a value is passed that is _not_ in the set above, it's assumed to mean finalized.


### Contracts

=== "MainNet"

    |Type|Contract|
    |----|--------|
    |Core|`0x126783A6Cb203a3E35344528B26ca3a0489a1485`|
    |Token Bridge|`0x7C9Fc5741288cDFdD83CeB07f3ea7e22618D79D2`|
    |NFT Bridge|`0xA9c7119aBDa80d4a4E0C06C8F4d8cF5893234535`|
    |Relayer|`0x27428DD2d3DD32A4D7f7C497eAaa23130d894911`|

=== "TestNet"

    |Type|Contract|
    |----|--------|
    |Core|`0x1BB3B4119b7BA9dfad76B0545fb3F531383c3bB7`|
    |Token Bridge|`0x599CEa2204B4FaECd584Ab1F2b6aCA137a0afbE8`|
    |NFT Bridge|`0x63eD9318628D26BdCB15df58B53BB27231D1B227`|

=== "Local Development"

    |Type|Contract|
    |----|--------|
    |Core|**N/A**|
    |Token Bridge|**N/A**|
    |NFT Bridge|**N/A**|

<!--FANTOM_CHAIN_DETAILS-->
<!--GNOSIS_CHAIN_DETAILS-->

## Gnosis

### Quick Links

- [Network website](https://www.gnosis.io/){target=\_blank}
- [Developer documentation](https://docs.gnosischain.com/developers/overview){target=\_blank}
- No explorer available. Please update [the chain configurations](https://github.com/wormhole-foundation/docs.wormhole.com/blob/main/scripts/src/chains/gnosis.json){target=\_blank}
- No faucet available. Please update [the chain configurations](https://github.com/wormhole-foundation/docs.wormhole.com/blob/main/scripts/src/chains/gnosis.json){target=\_blank}

### Chain Details

- **Name** - `gnosis`
- **Wormhole chain ID** - `25`
- **Network chain ID**:
    - **MainNet** - <code>100</code>
    - **TestNet** - <code>Chaido</code> - <code>10200</code>
- **Contract source** - [ethereum/contracts/bridge/Bridge.sol](https://github.com/wormhole-foundation/wormhole/blob/main/ethereum/contracts/bridge/Bridge.sol){target=\_blank}

### Contracts

=== "MainNet"

    |Type|Contract|
    |----|--------|
    |Core|`0xa321448d90d4e5b0A732867c18eA198e75CAC48E`|
    |Token Bridge|**N/A**|
    |NFT Bridge|**N/A**|

=== "TestNet"

    |Type|Contract|
    |----|--------|
    |Core|`0xE4eacc10990ba3308DdCC72d985f2a27D20c7d03`|
    |Token Bridge|**N/A**|
    |NFT Bridge|**N/A**|

=== "Local Development"

    |Type|Contract|
    |----|--------|
    |Core|**N/A**|
    |Token Bridge|**N/A**|
    |NFT Bridge|**N/A**|

<!--GNOSIS_CHAIN_DETAILS-->
<!--KARURA_CHAIN_DETAILS-->

## Karura

### Quick Links

- [Network website](https://acala.network/karura){target=\_blank}
- No developer docs available. Please update [the chain configurations](https://github.com/wormhole-foundation/docs.wormhole.com/blob/main/scripts/src/chains/karura.json){target=\_blank}
- No explorer available. Please update [the chain configurations](https://github.com/wormhole-foundation/docs.wormhole.com/blob/main/scripts/src/chains/karura.json){target=\_blank}
- No faucet available. Please update [the chain configurations](https://github.com/wormhole-foundation/docs.wormhole.com/blob/main/scripts/src/chains/karura.json){target=\_blank}

### Chain Details

- **Name** - `karura`
- **Wormhole chain ID** - `11`
- **Network chain ID**:
    - **MainNet** - <code>686</code>
    - **TestNet** - <code>596</code>
- **Contract source** - [ethereum/contracts/bridge/Bridge.sol](https://github.com/wormhole-foundation/wormhole/blob/main/ethereum/contracts/bridge/Bridge.sol){target=\_blank}

### Consistency Levels

The [consistency level](/build/reference/consistency-levels/) options (i.e., finality) are:

|Level|Value|
|-----|-----|
|Instant|200|

!!! note
    If a value is passed that is _not_ in the set above, it's assumed to mean finalized.

For more information, see [https://wiki.polkadot.network/docs/learn-consensus](https://wiki.polkadot.network/docs/learn-consensus){target=\_blank}

### Contracts

=== "MainNet"

    |Type|Contract|
    |----|--------|
    |Core|`0xa321448d90d4e5b0A732867c18eA198e75CAC48E`|
    |Token Bridge|`0xae9d7fe007b3327AA64A32824Aaac52C42a6E624`|
    |NFT Bridge|`0xb91e3638F82A1fACb28690b37e3aAE45d2c33808`|
    |Relayer|`0x27428DD2d3DD32A4D7f7C497eAaa23130d894911`|

=== "TestNet"

    |Type|Contract|
    |----|--------|
    |Core|`0xE4eacc10990ba3308DdCC72d985f2a27D20c7d03`|
    |Token Bridge|`0xd11De1f930eA1F7Dd0290Fe3a2e35b9C91AEFb37`|
    |NFT Bridge|`0x0A693c2D594292B6Eb89Cb50EFe4B0b63Dd2760D`|

=== "Local Development"

    |Type|Contract|
    |----|--------|
    |Core|**N/A**|
    |Token Bridge|**N/A**|
    |NFT Bridge|**N/A**|

<!--KARURA_CHAIN_DETAILS-->
<!--KLAYTN_CHAIN_DETAILS-->

## Klaytn

### Quick Links

- [Network website](https://klaytn.foundation/){target=\_blank}
- [Developer documentation](https://docs.klaytn.foundation/){target=\_blank}
- [Klaytnfinder](https://www.klaytnfinder.io/){target=\_blank} | [Klaytnscope](https://scope.klaytn.com/){target=\_blank}
- [Faucet](https://baobab.wallet.klaytn.foundation/faucet){target=\_blank}

### Chain Details

- **Name** - `klaytn`
- **Wormhole chain ID** - `13`
- **Network chain ID**:
    - **MainNet** - <code>8217</code>
    - **TestNet** - <code>Baobab</code> - <code>1001</code>
- **Contract source** - [ethereum/contracts/bridge/Bridge.sol](https://github.com/wormhole-foundation/wormhole/blob/main/ethereum/contracts/bridge/Bridge.sol){target=\_blank}

### Consistency Levels

The [consistency level](/build/reference/consistency-levels/) options (i.e., finality) are:

|Level|Value|
|-----|-----|
|Instant|200|

!!! note
    If a value is passed that is _not_ in the set above, it's assumed to mean finalized.


### Contracts

=== "MainNet"

    |Type|Contract|
    |----|--------|
    |Core|`0x0C21603c4f3a6387e241c0091A7EA39E43E90bb7`|
    |Token Bridge|`0x5b08ac39EAED75c0439FC750d9FE7E1F9dD0193F`|
    |NFT Bridge|`0x3c3c561757BAa0b78c5C025CdEAa4ee24C1dFfEf`|
    |Relayer|`0x27428DD2d3DD32A4D7f7C497eAaa23130d894911`|

=== "TestNet"

    |Type|Contract|
    |----|--------|
    |Core|`0x1830CC6eE66c84D2F177B94D544967c774E624cA`|
    |Token Bridge|`0xC7A13BE098720840dEa132D860fDfa030884b09A`|
    |NFT Bridge|`0x94c994fC51c13101062958b567e743f1a04432dE`|

=== "Local Development"

    |Type|Contract|
    |----|--------|
    |Core|**N/A**|
    |Token Bridge|**N/A**|
    |NFT Bridge|**N/A**|

<!--KLAYTN_CHAIN_DETAILS-->
<!--MOONBEAM_CHAIN_DETAILS-->

## Moonbeam

### Quick Links

- [Network website](https://moonbeam.network/){target=\_blank}
- [Developer documentation](https://docs.moonbeam.network/){target=\_blank}
- [Moonbeam EVM Block Explorer](https://moonscan.io/){target=\_blank}
- [Faucet](https://faucet.moonbeam.network/){target=\_blank}

### Chain Details

- **Name** - `moonbeam`
- **Wormhole chain ID** - `16`
- **Network chain ID**:
    - **MainNet** - <code>1284</code>
    - **TestNet** - <code>Moonbase-Alphanet</code> - <code>1287</code>
- **Contract source** - [ethereum/contracts/bridge/Bridge.sol](https://github.com/wormhole-foundation/wormhole/blob/main/ethereum/contracts/bridge/Bridge.sol){target=\_blank}

### Consistency Levels

The [consistency level](/build/reference/consistency-levels/) options (i.e., finality) are:

|Level|Value|
|-----|-----|
|Instant|200|

!!! note
    If a value is passed that is _not_ in the set above, it's assumed to mean finalized.

For more information, see [https://docs.moonbeam.network/builders/build/moonbeam-custom-api/#finality-rpc-endpoints](https://docs.moonbeam.network/builders/build/moonbeam-custom-api/#finality-rpc-endpoints){target=\_blank}

### Contracts

=== "MainNet"

    |Type|Contract|
    |----|--------|
    |Core|`0xC8e2b0cD52Cf01b0Ce87d389Daa3d414d4cE29f3`|
    |Token Bridge|`0xb1731c586ca89a23809861c6103f0b96b3f57d92`|
    |NFT Bridge|`0x453cfbe096c0f8d763e8c5f24b441097d577bde2`|
    |Relayer|`0x27428DD2d3DD32A4D7f7C497eAaa23130d894911`|

=== "TestNet"

    |Type|Contract|
    |----|--------|
    |Core|`0xa5B7D85a8f27dd7907dc8FdC21FA5657D5E2F901`|
    |Token Bridge|`0xbc976D4b9D57E57c3cA52e1Fd136C45FF7955A96`|
    |NFT Bridge|`0x98A0F4B96972b32Fcb3BD03cAeB66A44a6aB9Edb`|
    |Relayer|`0x0591C25ebd0580E0d4F27A82Fc2e24E7489CB5e0`|
    |Mock Provider|`0x60a86b97a7596eBFd25fb769053894ed0D9A8366`|
    |Mock Integration|`0x3bF0c43d88541BBCF92bE508ec41e540FbF28C56`|

=== "Local Development"

    |Type|Contract|
    |----|--------|
    |Core|**N/A**|
    |Token Bridge|**N/A**|
    |NFT Bridge|**N/A**|

<!--MOONBEAM_CHAIN_DETAILS-->
<!--NEON_CHAIN_DETAILS-->

## Neon

### Quick Links

- [Network website](https://neon-labs.org/){target=\_blank}
- No developer docs available. Please update [the chain configurations](https://github.com/wormhole-foundation/docs.wormhole.com/blob/main/scripts/src/chains/neon.json){target=\_blank}
- No explorer available. Please update [the chain configurations](https://github.com/wormhole-foundation/docs.wormhole.com/blob/main/scripts/src/chains/neon.json){target=\_blank}
- No faucet available. Please update [the chain configurations](https://github.com/wormhole-foundation/docs.wormhole.com/blob/main/scripts/src/chains/neon.json){target=\_blank}

### Chain Details

- **Name** - `neon`
- **Wormhole chain ID** - `17`
- **Network chain ID**:
    - **MainNet** - <code>245022934</code>
    - **TestNet** - <code>245022940</code>
- **Contract source** - [ethereum/contracts/bridge/Bridge.sol](https://github.com/wormhole-foundation/wormhole/blob/main/ethereum/contracts/bridge/Bridge.sol){target=\_blank}

### Contracts

=== "MainNet"

    |Type|Contract|
    |----|--------|
    |Core|**N/A**|
    |Token Bridge|**N/A**|
    |NFT Bridge|**N/A**|

=== "TestNet"

    |Type|Contract|
    |----|--------|
    |Core|**N/A**|
    |Token Bridge|**N/A**|
    |NFT Bridge|**N/A**|

=== "Local Development"

    |Type|Contract|
    |----|--------|
    |Core|**N/A**|
    |Token Bridge|**N/A**|
    |NFT Bridge|**N/A**|

<!--NEON_CHAIN_DETAILS-->
<!--OASIS_CHAIN_DETAILS-->

## Oasis

### Quick Links

- [Network website](https://oasisprotocol.org/){target=\_blank}
- No developer docs available. Please update [the chain configurations](https://github.com/wormhole-foundation/docs.wormhole.com/blob/main/scripts/src/chains/oasis.json){target=\_blank}
- No explorer available. Please update [the chain configurations](https://github.com/wormhole-foundation/docs.wormhole.com/blob/main/scripts/src/chains/oasis.json){target=\_blank}
- No faucet available. Please update [the chain configurations](https://github.com/wormhole-foundation/docs.wormhole.com/blob/main/scripts/src/chains/oasis.json){target=\_blank}

### Chain Details

- **Name** - `oasis`
- **Wormhole chain ID** - `7`
- **Network chain ID**:
    - **MainNet** - <code>42262</code>
    - **TestNet** - <code>42261</code>
- **Contract source** - [ethereum/contracts/bridge/Bridge.sol](https://github.com/wormhole-foundation/wormhole/blob/main/ethereum/contracts/bridge/Bridge.sol){target=\_blank}

### Contracts

=== "MainNet"

    |Type|Contract|
    |----|--------|
    |Core|`0xfE8cD454b4A1CA468B57D79c0cc77Ef5B6f64585`|
    |Token Bridge|`0x5848C791e09901b40A9Ef749f2a6735b418d7564`|
    |NFT Bridge|`0x04952D522Ff217f40B5Ef3cbF659EcA7b952a6c1`|

=== "TestNet"

    |Type|Contract|
    |----|--------|
    |Core|`0xc1C338397ffA53a2Eb12A7038b4eeb34791F8aCb`|
    |Token Bridge|`0x88d8004A9BdbfD9D28090A02010C19897a29605c`|
    |NFT Bridge|`0xC5c25B41AB0b797571620F5204Afa116A44c0ebA`|

=== "Local Development"

    |Type|Contract|
    |----|--------|
    |Core|**N/A**|
    |Token Bridge|**N/A**|
    |NFT Bridge|**N/A**|

<!--OASIS_CHAIN_DETAILS-->
<!--OPTIMISM_CHAIN_DETAILS-->

## Optimism

### Quick Links

- [Network website](https://www.optimism.io/){target=\_blank}
- No developer docs available. Please update [the chain configurations](https://github.com/wormhole-foundation/docs.wormhole.com/blob/main/scripts/src/chains/optimism.json){target=\_blank}
- No explorer available. Please update [the chain configurations](https://github.com/wormhole-foundation/docs.wormhole.com/blob/main/scripts/src/chains/optimism.json){target=\_blank}
- No faucet available. Please update [the chain configurations](https://github.com/wormhole-foundation/docs.wormhole.com/blob/main/scripts/src/chains/optimism.json){target=\_blank}

### Chain Details

- **Name** - `optimism`
- **Wormhole chain ID** - `24`
- **Network chain ID**:
    - **MainNet** - <code>10</code>
    - **TestNet** - <code>Optimism Goerli</code> - <code>420</code>
- **Contract source** - [ethereum/contracts/bridge/Bridge.sol](https://github.com/wormhole-foundation/wormhole/blob/main/ethereum/contracts/bridge/Bridge.sol){target=\_blank}

### Consistency Levels

The [consistency level](/build/reference/consistency-levels/) options (i.e., finality) are:

|Level|Value|
|-----|-----|
|Instant|200|

!!! note
    If a value is passed that is _not_ in the set above, it's assumed to mean finalized.

For more information, see [https://community.optimism.io/docs/developers/bridge/comm-strategies/](https://community.optimism.io/docs/developers/bridge/comm-strategies/){target=\_blank}

### Contracts

=== "MainNet"

    |Type|Contract|
    |----|--------|
    |Core|`0xEe91C335eab126dF5fDB3797EA9d6aD93aeC9722`|
    |Token Bridge|`0x1D68124e65faFC907325e3EDbF8c4d84499DAa8b`|
    |NFT Bridge|`0xfE8cD454b4A1CA468B57D79c0cc77Ef5B6f64585`|
    |Relayer|`0x27428DD2d3DD32A4D7f7C497eAaa23130d894911`|
    |CCTP|`0x2703483B1a5a7c577e8680de9Df8Be03c6f30e3c`|

=== "TestNet"

    |Type|Contract|
    |----|--------|
    |Core|`0x6b9C8671cdDC8dEab9c719bB87cBd3e782bA6a35`|
    |Token Bridge|`0xC7A204bDBFe983FCD8d8E61D02b475D4073fF97e`|
    |NFT Bridge|`0x23908A62110e21C04F3A4e011d24F901F911744A`|
    |Relayer|`0x01A957A525a5b7A72808bA9D10c389674E459891`|
    |Mock Provider|`0xfCe1Df3EF22fe5Cb7e2f5988b7d58fF633a313a7`|
    |Mock Integration|`0x421e0bb71dDeeC727Af79766423d33D8FD7dB963`|

=== "Local Development"

    |Type|Contract|
    |----|--------|
    |Core|**N/A**|
    |Token Bridge|**N/A**|
    |NFT Bridge|**N/A**|

<!--OPTIMISM_CHAIN_DETAILS-->
<!--POLYGON_CHAIN_DETAILS-->

## Polygon

### Quick Links

- [Network website](https://polygon.technology/){target=\_blank}
- [Developer documentation](https://wiki.polygon.technology/){target=\_blank}
- No explorer available. Please update [the chain configurations](https://github.com/wormhole-foundation/docs.wormhole.com/blob/main/scripts/src/chains/polygon.json){target=\_blank}
- [Faucet](https://faucet.polygon.technology/){target=\_blank}

### Chain Details

- **Name** - `polygon`
- **Wormhole chain ID** - `5`
- **Network chain ID**:
    - **MainNet** - <code>137</code>
    - **TestNet** - <code>Mumbai</code> - <code>80001</code>
- **Contract source** - [ethereum/contracts/bridge/Bridge.sol](https://github.com/wormhole-foundation/wormhole/blob/main/ethereum/contracts/bridge/Bridge.sol){target=\_blank}

### Consistency Levels

The [consistency level](/build/reference/consistency-levels/) options (i.e., finality) are:

|Level|Value|
|-----|-----|
|Instant|200|

!!! note
    If a value is passed that is _not_ in the set above, it's assumed to mean finalized.

For more information, see [https://docs.polygon.technology/pos/architecture/heimdall/checkpoints/](https://docs.polygon.technology/pos/architecture/heimdall/checkpoints/){target=\_blank}

### Contracts

=== "MainNet"

    |Type|Contract|
    |----|--------|
    |Core|`0x7A4B5a56256163F07b2C80A7cA55aBE66c4ec4d7`|
    |Token Bridge|`0x5a58505a96D1dbf8dF91cB21B54419FC36e93fdE`|
    |NFT Bridge|`0x90BBd86a6Fe93D3bc3ed6335935447E75fAb7fCf`|
    |Relayer|`0x27428DD2d3DD32A4D7f7C497eAaa23130d894911`|
    |CCTP|`0x0FF28217dCc90372345954563486528aa865cDd6`|

=== "TestNet"

    |Type|Contract|
    |----|--------|
    |Core|`0x0CBE91CF822c73C2315FB05100C2F714765d5c20`|
    |Token Bridge|`0x377D55a7928c046E18eEbb61977e714d2a76472a`|
    |NFT Bridge|`0x51a02d0dcb5e52F5b92bdAA38FA013C91c7309A9`|
    |Relayer|`0x0591C25ebd0580E0d4F27A82Fc2e24E7489CB5e0`|
    |Mock Provider|`0x60a86b97a7596eBFd25fb769053894ed0D9A8366`|
    |Mock Integration|`0x3bF0c43d88541BBCF92bE508ec41e540FbF28C56`|
    |CCTP|`0x2703483B1a5a7c577e8680de9Df8Be03c6f30e3c`|

=== "Local Development"

    |Type|Contract|
    |----|--------|
    |Core|**N/A**|
    |Token Bridge|**N/A**|
    |NFT Bridge|**N/A**|

<!--POLYGON_CHAIN_DETAILS-->

<!--ROOTSTOCK_CHAIN_DETAILS-->

## Rootstock

### Quick Links

- No webpage available. Please update [the chain configurations](https://github.com/wormhole-foundation/docs.wormhole.com/blob/main/scripts/src/chains/rootstock.json){target=\_blank}
- No developer docs available. Please update [the chain configurations](https://github.com/wormhole-foundation/docs.wormhole.com/blob/main/scripts/src/chains/rootstock.json){target=\_blank}
- No explorer available. Please update [the chain configurations](https://github.com/wormhole-foundation/docs.wormhole.com/blob/main/scripts/src/chains/rootstock.json){target=\_blank}
- No faucet available. Please update [the chain configurations](https://github.com/wormhole-foundation/docs.wormhole.com/blob/main/scripts/src/chains/rootstock.json){target=\_blank}

### Chain Details

- **Name** - `rootstock`
- **Wormhole chain ID** - `33`
- **Network chain ID**:
    - **MainNet** - <code>30</code>
    - **TestNet** - <code>31</code>
- **Contract source** - No source file available. Please update [the chain configurations](https://github.com/wormhole-foundation/docs.wormhole.com/blob/main/scripts/src/chains/rootstock.json){target=\_blank}

### Contracts

=== "MainNet"

    |Type|Contract|
    |----|--------|
    |Core|`0xbebdb6C8ddC678FfA9f8748f85C815C556Dd8ac6`|
    |Token Bridge|**N/A**|
    |NFT Bridge|**N/A**|

=== "TestNet"

    |Type|Contract|
    |----|--------|
    |Core|`0xbebdb6C8ddC678FfA9f8748f85C815C556Dd8ac6`|
    |Token Bridge|**N/A**|
    |NFT Bridge|**N/A**|

=== "Local Development"

    |Type|Contract|
    |----|--------|
    |Core|**N/A**|
    |Token Bridge|**N/A**|
    |NFT Bridge|**N/A**|

<!--ROOTSTOCK_CHAIN_DETAILS-->

<!--SEPOLIA_CHAIN_DETAILS-->

## Ethereum Sepolia

!!! note
    Sepolia is a TestNet-only chain and can be used as an alternative to Goerli. Note that a different chain ID is used for Sepolia.

### Quick Links

- No webpage available. Please update [the chain configurations](https://github.com/wormhole-foundation/docs.wormhole.com/blob/main/scripts/src/chains/sepolia.json){target=\_blank}
- No developer docs available. Please update [the chain configurations](https://github.com/wormhole-foundation/docs.wormhole.com/blob/main/scripts/src/chains/sepolia.json){target=\_blank}
- No explorer available. Please update [the chain configurations](https://github.com/wormhole-foundation/docs.wormhole.com/blob/main/scripts/src/chains/sepolia.json){target=\_blank}
- No faucet available. Please update [the chain configurations](https://github.com/wormhole-foundation/docs.wormhole.com/blob/main/scripts/src/chains/sepolia.json){target=\_blank}

### Chain Details

- **Name** - `sepolia`
- **Wormhole chain ID** - `10002`
- **Network chain ID**:
    - **MainNet** - <code>N/A</code>
    - **TestNet** - <code>Sepolia</code> - <code>11155111</code>
- **Contract source** - [ethereum/contracts/bridge/Bridge.sol](https://github.com/wormhole-foundation/wormhole/blob/main/ethereum/contracts/bridge/Bridge.sol){target=\_blank}

### Contracts

=== "MainNet"

    |Type|Contract|
    |----|--------|
    |Core|**N/A**|
    |Token Bridge|**N/A**|
    |NFT Bridge|**N/A**|

=== "TestNet"

    |Type|Contract|
    |----|--------|
    |Core|`0x4a8bc80Ed5a4067f1CCf107057b8270E0cC11A78`|
    |Token Bridge|`0xDB5492265f6038831E89f495670FF909aDe94bd9`|
    |NFT Bridge|`0x6a0B52ac198e4870e5F3797d5B403838a5bbFD99`|
    |Relayer|`0x7B1bD7a6b4E61c2a123AC6BC2cbfC614437D0470`|
    |Mock Provider|`0x7A0a53847776f7e94Cc35742971aCb2217b0Db81`|
    |Mock Integration|`0x68b7Cd0d27a6F04b2F65e11DD06182EFb255c9f0`|
    |CCTP|`0x2703483B1a5a7c577e8680de9Df8Be03c6f30e3c`|

=== "Local Development"

    |Type|Contract|
    |----|--------|
    |Core|**N/A**|
    |Token Bridge|**N/A**|
    |NFT Bridge|**N/A**|

<!--SEPOLIA_CHAIN_DETAILS-->

<!--HOLESKY_CHAIN_DETAILS-->

## Ethereum Holesky

!!! note
    Holesky is a TestNet only chain and can be used as an alternative to Goerli. Note that a different chain ID is used for Holesky.

### Quick Links

- No webpage available. Please update [the chain configurations](https://github.com/wormhole-foundation/docs.wormhole.com/blob/main/scripts/src/chains/holesky.json){target=\_blank}
- No developer docs available. Please update [the chain configurations](https://github.com/wormhole-foundation/docs.wormhole.com/blob/main/scripts/src/chains/holesky.json){target=\_blank}
- No explorer available. Please update [the chain configurations](https://github.com/wormhole-foundation/docs.wormhole.com/blob/main/scripts/src/chains/holesky.json){target=\_blank}
- No faucet available. Please update [the chain configurations](https://github.com/wormhole-foundation/docs.wormhole.com/blob/main/scripts/src/chains/holesky.json){target=\_blank}

### Chain Details

- **Name** - `holesky`
- **Wormhole chain ID** - `10006`
- **Network chain ID**:
    - **MainNet** - <code>N/A</code>
    - **TestNet** - <code>Holesky</code> - <code>17000</code>
- **Contract source** - [ethereum/contracts/bridge/Bridge.sol](https://github.com/wormhole-foundation/wormhole/blob/main/ethereum/contracts/bridge/Bridge.sol){target=\_blank}

### Contracts

=== "MainNet"

    |Type|Contract|
    |----|--------|
    |Core|**N/A**|
    |Token Bridge|**N/A**|
    |NFT Bridge|**N/A**|

=== "TestNet"

    |Type|Contract|
    |----|--------|
    |Core|`0xa10f2eF61dE1f19f586ab8B6F2EbA89bACE63F7a`|
    |Token Bridge|`0x76d093BbaE4529a342080546cAFEec4AcbA59EC6`|
    |NFT Bridge|`0xc8941d483c45eF8FB72E4d1F9dDE089C95fF8171`|

=== "Local Development"

    |Type|Contract|
    |----|--------|
    |Core|**N/A**|
    |Token Bridge|**N/A**|
    |NFT Bridge|**N/A**|

<!--HOLESKY_CHAIN_DETAILS-->

<!--ARBITRUM_SEPOLIA_CHAIN_DETAILS-->

## Arbitrum Sepolia

### Quick Links

- [Network website](https://arbitrum.io/){target=\_blank}
- No developer docs available. Please update [the chain configurations](https://github.com/wormhole-foundation/docs.wormhole.com/blob/main/scripts/src/chains/arbitrum_sepolia.json){target=\_blank}
- [Arbitrum Explorer](https://sepolia.arbiscan.io/){target=\_blank}

### Chain Details

- **Name** - `arbitrum_sepolia`
- **Wormhole chain ID** - `10003`
- **Network chain ID**:
    - **MainNet** - 
    - **TestNet** - <code>Sepolia</code> - <code>421614</code>
- **Contract source** - No source file available. Please update [the chain configurations](https://github.com/wormhole-foundation/docs.wormhole.com/blob/main/scripts/src/chains/arbitrum_sepolia.json){target=\_blank}

### Contracts

=== "MainNet"

    |Type|Contract|
    |----|--------|
    |Core|**N/A**|
    |Token Bridge|**N/A**|
    |NFT Bridge|**N/A**|

=== "TestNet"

    |Type|Contract|
    |----|--------|
    |Core|`0x6b9C8671cdDC8dEab9c719bB87cBd3e782bA6a35`|
    |Token Bridge|`0xC7A204bDBFe983FCD8d8E61D02b475D4073fF97e`|
    |NFT Bridge|`0x23908A62110e21C04F3A4e011d24F901F911744A`|
    |Relayer|`0x7B1bD7a6b4E61c2a123AC6BC2cbfC614437D0470`|
    |Mock Provider|`0x7A0a53847776f7e94Cc35742971aCb2217b0Db81`|
    |Mock Integration|`0x2B1502Ffe717817A0A101a687286bE294fe495f7`|
    |CCTP|`0x2703483B1a5a7c577e8680de9Df8Be03c6f30e3c`|

=== "Local Development"

    |Type|Contract|
    |----|--------|
    |Core|**N/A**|
    |Token Bridge|**N/A**|
    |NFT Bridge|**N/A**|

<!--ARBITRUM_SEPOLIA_CHAIN_DETAILS-->

<!--OPTIMISM_SEPOLIA_CHAIN_DETAILS-->

## Optimism Sepolia

### Quick Links

- [Network website](https://www.optimism.io/){target=\_blank}
- No developer docs available. Please update [the chain configurations](https://github.com/wormhole-foundation/docs.wormhole.com/blob/main/scripts/src/chains/optimism_sepolia.json){target=\_blank}
- No explorer available. Please update [the chain configurations](https://github.com/wormhole-foundation/docs.wormhole.com/blob/main/scripts/src/chains/optimism_sepolia.json){target=\_blank}
- No faucet available. Please update [the chain configurations](https://github.com/wormhole-foundation/docs.wormhole.com/blob/main/scripts/src/chains/optimism_sepolia.json){target=\_blank}

### Chain Details

- **Name** - `optimism_sepolia`
- **Wormhole chain ID** - `10005`
- **Network chain ID**:
    - **MainNet** - 
    - **TestNet** - <code>Optimism Sepolia</code> - <code>11155420</code>
- **Contract source** - [ethereum/contracts/bridge/Bridge.sol](https://github.com/wormhole-foundation/wormhole/blob/main/ethereum/contracts/bridge/Bridge.sol){target=\_blank}

### Consistency Levels

The [consistency level](/build/reference/consistency-levels/) options (i.e., finality) are:

|Level|Value|
|-----|-----|
|Instant|200|

!!! note
    If a value is passed that is _not_ in the set above, it's assumed to mean finalized.

For more information, see [https://community.optimism.io/docs/developers/bridge/comm-strategies/](https://community.optimism.io/docs/developers/bridge/comm-strategies/){target=\_blank}

### Contracts

=== "MainNet"

    |Type|Contract|
    |----|--------|
    |Core|**N/A**|
    |Token Bridge|**N/A**|
    |NFT Bridge|**N/A**|

=== "TestNet"

    |Type|Contract|
    |----|--------|
    |Core|`0x31377888146f3253211EFEf5c676D41ECe7D58Fe`|
    |Token Bridge|`0x99737Ec4B815d816c49A385943baf0380e75c0Ac`|
    |NFT Bridge|`0x27812285fbe85BA1DF242929B906B31EE3dd1b9f`|
    |Relayer|`0x93BAD53DDfB6132b0aC8E37f6029163E63372cEE`|
    |Mock Provider|`0x7A0a53847776f7e94Cc35742971aCb2217b0Db81`|
    |Mock Integration|`0xA404B69582bac287a7455FFf315938CCd92099c1`|
    |CCTP|`0x2703483B1a5a7c577e8680de9Df8Be03c6f30e3c`|

=== "Local Development"

    |Type|Contract|
    |----|--------|
    |Core|**N/A**|
    |Token Bridge|**N/A**|
    |NFT Bridge|**N/A**|

<!--OPTIMISM_SEPOLIA_CHAIN_DETAILS-->

<!--BASE_SEPOLIA_CHAIN_DETAILS-->

## Base Sepolia

### Quick Links

- [Network website](https://base.org/){target=\_blank}
- [Developer documentation](https://docs.base.org/){target=\_blank}
- [Etherscan](https://sepolia.basescan.org/){target=\_blank}

### Chain Details

- **Name** - `base_sepolia`
- **Wormhole chain ID** - `10004`
- **Network chain ID**:
    - **MainNet** - 
    - **TestNet** - <code>Base Sepolia</code> - <code>84532</code>
- **Contract source** - [ethereum/contracts/bridge/Bridge.sol](https://github.com/wormhole-foundation/wormhole/blob/main/ethereum/contracts/bridge/Bridge.sol){target=\_blank}

### Contracts

=== "MainNet"

    |Type|Contract|
    |----|--------|
    |Core|**N/A**|
    |Token Bridge|**N/A**|
    |NFT Bridge|**N/A**|

=== "TestNet"

    |Type|Contract|
    |----|--------|
    |Core|`0x79A1027a6A159502049F10906D333EC57E95F083`|
    |Token Bridge|`0x86F55A04690fd7815A3D802bD587e83eA888B239`|
    |NFT Bridge|`0x268557122Ffd64c85750d630b716471118F323c8`|
    |Relayer|`0x93BAD53DDfB6132b0aC8E37f6029163E63372cEE`|
    |Mock Provider|`0x7A0a53847776f7e94Cc35742971aCb2217b0Db81`|
    |Mock Integration|`0xA404B69582bac287a7455FFf315938CCd92099c1`|
    |CCTP|`0x2703483B1a5a7c577e8680de9Df8Be03c6f30e3c`|

=== "Local Development"

    |Type|Contract|
    |----|--------|
    |Core|**N/A**|
    |Token Bridge|**N/A**|
    |NFT Bridge|**N/A**|

<!--BASE_SEPOLIA_CHAIN_DETAILS-->

<!--SCROLL_CHAIN_DETAILS-->

## Scroll

### Quick Links

- [Network website](https://scroll.io/){target=\_blank}
- [Developer documentation](https://docs.scroll.io/en/home/){target=\_blank}
- No explorer available. Please update [the chain configurations](https://github.com/wormhole-foundation/docs.wormhole.com/blob/main/scripts/src/chains/scroll.json){target=\_blank}

### Chain Details

- **Name** - `scroll`
- **Wormhole chain ID** - `34`
- **Network chain ID**:
    - **MainNet** - <code>534352</code>
    - **TestNet** - <code>Sepolia</code> - <code>534351</code>
- **Contract source** - No source file available. Please update [the chain configurations](https://github.com/wormhole-foundation/docs.wormhole.com/blob/main/scripts/src/chains/scroll.json){target=\_blank}

### Contracts

=== "MainNet"

    |Type|Contract|
    |----|--------|
    |Core|`0xbebdb6C8ddC678FfA9f8748f85C815C556Dd8ac6`|
    |Token Bridge|`0x24850c6f61C438823F01B7A3BF2B89B72174Fa9d`|
    |NFT Bridge|**N/A**|
    |Relayer|`0x27428DD2d3DD32A4D7f7C497eAaa23130d894911`|

=== "TestNet"

    |Type|Contract|
    |----|--------|
    |Core|`0x055F47F1250012C6B20c436570a76e52c17Af2D5`|
    |Token Bridge|`0x22427d90B7dA3fA4642F7025A854c7254E4e45BF`|
    |NFT Bridge|**N/A**|

=== "Local Development"

    |Type|Contract|
    |----|--------|
    |Core|**N/A**|
    |Token Bridge|**N/A**|
    |NFT Bridge|**N/A**|

<!--SCROLL_CHAIN_DETAILS-->

<!--MANTLE_CHAIN_DETAILS-->

## Mantle

### Quick Links

- [Network website](https://www.mantle.xyz/){target=\_blank}
- [Developer documentation](https://docs.mantle.xyz/network/introduction/overview){target=\_blank}
- No explorer available. Please update [the chain configurations](https://github.com/wormhole-foundation/docs.wormhole.com/blob/main/scripts/src/chains/mantle.json){target=\_blank}

### Chain Details

- **Name** - `mantle`
- **Wormhole chain ID** - `35`
- **Network chain ID**:
    - **MainNet** - <code>5000</code>
    - **TestNet** - <code>Sepolia</code> - <code>5003</code>
- **Contract source** - No source file available. Please update [the chain configurations](https://github.com/wormhole-foundation/docs.wormhole.com/blob/main/scripts/src/chains/mantle.json){target=\_blank}

### Contracts

=== "MainNet"

    |Type|Contract|
    |----|--------|
    |Core|`0xbebdb6C8ddC678FfA9f8748f85C815C556Dd8ac6`|
    |Token Bridge|`0x24850c6f61C438823F01B7A3BF2B89B72174Fa9d`|
    |NFT Bridge|**N/A**|

=== "TestNet"

    |Type|Contract|
    |----|--------|
    |Core|`0x376428e7f26D5867e69201b275553C45B09EE090`|
    |Token Bridge|`0x75Bfa155a9D7A3714b0861c8a8aF0C4633c45b5D`|
    |NFT Bridge|**N/A**|

=== "Local Development"

    |Type|Contract|
    |----|--------|
    |Core|**N/A**|
    |Token Bridge|**N/A**|
    |NFT Bridge|**N/A**|

<!--MANTLE_CHAIN_DETAILS-->

<!--POLYGON_SEPOLIA_CHAIN_DETAILS-->

## Polygon Sepolia

### Quick Links

- [Network website](https://polygon.technology/){target=\_blank}
- No developer docs available. Please update [the chain configurations](https://github.com/wormhole-foundation/docs.wormhole.com/blob/main/scripts/src/chains/polygon_sepolia.json){target=\_blank}
- No explorer available. Please update [the chain configurations](https://github.com/wormhole-foundation/docs.wormhole.com/blob/main/scripts/src/chains/polygon_sepolia.json){target=\_blank}
- No faucet available. Please update [the chain configurations](https://github.com/wormhole-foundation/docs.wormhole.com/blob/main/scripts/src/chains/polygon_sepolia.json){target=\_blank}

### Chain Details

- **Name** - `polygon_sepolia`
- **Wormhole chain ID** - `10007`
- **Network chain ID**:
    - **MainNet** - 
    - **TestNet** - <code>Sepolia</code> - <code>80002</code>
- **Contract source** - [ethereum/contracts/bridge/Bridge.sol](https://github.com/wormhole-foundation/wormhole/blob/main/ethereum/contracts/bridge/Bridge.sol){target=\_blank}

### Consistency Levels

The [consistency level](/build/reference/consistency-levels/) options (i.e., finality) are:

|Level|Value|
|-----|-----|
|Instant|200|

!!! note
    If a value is passed that is _not_ in the set above, it's assumed to mean finalized.

For more information, see [https://docs.polygon.technology/pos/architecture/heimdall/checkpoints/](https://docs.polygon.technology/pos/architecture/heimdall/checkpoints/){target=\_blank}

### Contracts

=== "MainNet"

    |Type|Contract|
    |----|--------|
    |Core|**N/A**|
    |Token Bridge|**N/A**|
    |NFT Bridge|**N/A**|

=== "TestNet"

    |Type|Contract|
    |----|--------|
    |Core|`0x6b9C8671cdDC8dEab9c719bB87cBd3e782bA6a35`|
    |Token Bridge|`0xC7A204bDBFe983FCD8d8E61D02b475D4073fF97e`|
    |NFT Bridge|`0x23908A62110e21C04F3A4e011d24F901F911744A`|

=== "Local Development"

    |Type|Contract|
    |----|--------|
    |Core|**N/A**|
    |Token Bridge|**N/A**|
    |NFT Bridge|**N/A**|

<!--POLYGON_SEPOLIA_CHAIN_DETAILS-->

<!--BERACHAIN_CHAIN_DETAILS-->

## Berachain

### Quick Links

- No webpage available. Please update [the chain configurations](https://github.com/wormhole-foundation/docs.wormhole.com/blob/main/scripts/src/chains/berachain.json){target=\_blank}
- No developer docs available. Please update [the chain configurations](https://github.com/wormhole-foundation/docs.wormhole.com/blob/main/scripts/src/chains/berachain.json){target=\_blank}
- No explorer available. Please update [the chain configurations](https://github.com/wormhole-foundation/docs.wormhole.com/blob/main/scripts/src/chains/berachain.json){target=\_blank}
- No faucet available. Please update [the chain configurations](https://github.com/wormhole-foundation/docs.wormhole.com/blob/main/scripts/src/chains/berachain.json){target=\_blank}

### Chain Details

- **Name** - `berachain`
- **Wormhole chain ID** - `39`
- **Network chain ID**:
    - **MainNet** - 
    - **TestNet** - <code>80084</code>
- **Contract source** - No source file available. Please update [the chain configurations](https://github.com/wormhole-foundation/docs.wormhole.com/blob/main/scripts/src/chains/berachain.json){target=\_blank}

### Contracts

=== "MainNet"

    |Type|Contract|
    |----|--------|
    |Core|**N/A**|
    |Token Bridge|**N/A**|
    |NFT Bridge|**N/A**|

=== "TestNet"

    |Type|Contract|
    |----|--------|
    |Core|`0xBB73cB66C26740F31d1FabDC6b7A46a038A300dd`|
    |Token Bridge|`0xa10f2eF61dE1f19f586ab8B6F2EbA89bACE63F7a`|
    |NFT Bridge|**N/A**|

=== "Local Development"

    |Type|Contract|
    |----|--------|
    |Core|**N/A**|
    |Token Bridge|**N/A**|
    |NFT Bridge|**N/A**|

<!--BERACHAIN_CHAIN_DETAILS-->

<!--BLAST_CHAIN_DETAILS-->

## Blast

### Quick Links

- No webpage available. Please update [the chain configurations](https://github.com/wormhole-foundation/docs.wormhole.com/blob/main/scripts/src/chains/blast.json){target=\_blank}
- No developer docs available. Please update [the chain configurations](https://github.com/wormhole-foundation/docs.wormhole.com/blob/main/scripts/src/chains/blast.json){target=\_blank}
- No explorer available. Please update [the chain configurations](https://github.com/wormhole-foundation/docs.wormhole.com/blob/main/scripts/src/chains/blast.json){target=\_blank}
- No faucet available. Please update [the chain configurations](https://github.com/wormhole-foundation/docs.wormhole.com/blob/main/scripts/src/chains/blast.json){target=\_blank}

### Chain Details

- **Name** - `blast`
- **Wormhole chain ID** - `36`
- **Network chain ID**:
    - **MainNet** - <code>81457</code>
    - **TestNet** - <code>168587773</code>
- **Contract source** - No source file available. Please update [the chain configurations](https://github.com/wormhole-foundation/docs.wormhole.com/blob/main/scripts/src/chains/blast.json){target=\_blank}

### Contracts

=== "MainNet"

    |Type|Contract|
    |----|--------|
    |Core|`0xbebdb6C8ddC678FfA9f8748f85C815C556Dd8ac6`|
    |Token Bridge|`0x24850c6f61C438823F01B7A3BF2B89B72174Fa9d`|
    |NFT Bridge|**N/A**|
    |Relayer|`0x27428DD2d3DD32A4D7f7C497eAaa23130d894911`|

=== "TestNet"

    |Type|Contract|
    |----|--------|
    |Core|`0x473e002D7add6fB67a4964F13bFd61280Ca46886`|
    |Token Bridge|`0x430855B4D43b8AEB9D2B9869B74d58dda79C0dB2`|
    |NFT Bridge|**N/A**|

=== "Local Development"

    |Type|Contract|
    |----|--------|
    |Core|**N/A**|
    |Token Bridge|**N/A**|
    |NFT Bridge|**N/A**|

<!--BLAST_CHAIN_DETAILS-->

<!--LINEA_CHAIN_DETAILS-->

## Linea

### Quick Links

- No webpage available. Please update [the chain configurations](https://github.com/wormhole-foundation/docs.wormhole.com/blob/main/scripts/src/chains/linea.json){target=\_blank}
- No developer docs available. Please update [the chain configurations](https://github.com/wormhole-foundation/docs.wormhole.com/blob/main/scripts/src/chains/linea.json){target=\_blank}
- No explorer available. Please update [the chain configurations](https://github.com/wormhole-foundation/docs.wormhole.com/blob/main/scripts/src/chains/linea.json){target=\_blank}
- No faucet available. Please update [the chain configurations](https://github.com/wormhole-foundation/docs.wormhole.com/blob/main/scripts/src/chains/linea.json){target=\_blank}

### Chain Details

- **Name** - `linea`
- **Wormhole chain ID** - `38`
- **Network chain ID**:
    - **MainNet** - <code>59144</code>
    - **TestNet** - <code>59141</code>
- **Contract source** - No source file available. Please update [the chain configurations](https://github.com/wormhole-foundation/docs.wormhole.com/blob/main/scripts/src/chains/linea.json){target=\_blank}

### Contracts

=== "MainNet"

    |Type|Contract|
    |----|--------|
    |Core|**N/A**|
    |Token Bridge|**N/A**|
    |NFT Bridge|**N/A**|

=== "TestNet"

    |Type|Contract|
    |----|--------|
    |Core|`0x79A1027a6A159502049F10906D333EC57E95F083`|
    |Token Bridge|`0xC7A204bDBFe983FCD8d8E61D02b475D4073fF97e`|
    |NFT Bridge|**N/A**|

=== "Local Development"

    |Type|Contract|
    |----|--------|
    |Core|**N/A**|
    |Token Bridge|**N/A**|
    |NFT Bridge|**N/A**|

<!--LINEA_CHAIN_DETAILS-->

<!--SEIEVM_CHAIN_DETAILS-->

## Seievm

### Quick Links

- No webpage available. Please update [the chain configurations](https://github.com/wormhole-foundation/docs.wormhole.com/blob/main/scripts/src/chains/seievm.json){target=\_blank}
- No developer docs available. Please update [the chain configurations](https://github.com/wormhole-foundation/docs.wormhole.com/blob/main/scripts/src/chains/seievm.json){target=\_blank}
- No explorer available. Please update [the chain configurations](https://github.com/wormhole-foundation/docs.wormhole.com/blob/main/scripts/src/chains/seievm.json){target=\_blank}
- No faucet available. Please update [the chain configurations](https://github.com/wormhole-foundation/docs.wormhole.com/blob/main/scripts/src/chains/seievm.json){target=\_blank}

### Chain Details

- **Name** - `seievm`
- **Wormhole chain ID** - `40`
- **Network chain ID**:
    - **MainNet** - 
    - **TestNet** - 
- **Contract source** - No source file available. Please update [the chain configurations](https://github.com/wormhole-foundation/docs.wormhole.com/blob/main/scripts/src/chains/seievm.json){target=\_blank}

### Contracts

=== "MainNet"

    |Type|Contract|
    |----|--------|
    |Core|**N/A**|
    |Token Bridge|**N/A**|
    |NFT Bridge|**N/A**|

=== "TestNet"

    |Type|Contract|
    |----|--------|
    |Core|`0x07782FCe991dAb4DE7a3124032E534A0D059B4d8`|
    |Token Bridge|**N/A**|
    |NFT Bridge|**N/A**|

=== "Local Development"

    |Type|Contract|
    |----|--------|
    |Core|**N/A**|
    |Token Bridge|**N/A**|
    |NFT Bridge|**N/A**|

<!--SEIEVM_CHAIN_DETAILS-->

<!--XLAYER_CHAIN_DETAILS-->

## Xlayer

### Quick Links

- No webpage available. Please update [the chain configurations](https://github.com/wormhole-foundation/docs.wormhole.com/blob/main/scripts/src/chains/xlayer.json){target=\_blank}
- No developer docs available. Please update [the chain configurations](https://github.com/wormhole-foundation/docs.wormhole.com/blob/main/scripts/src/chains/xlayer.json){target=\_blank}
- No explorer available. Please update [the chain configurations](https://github.com/wormhole-foundation/docs.wormhole.com/blob/main/scripts/src/chains/xlayer.json){target=\_blank}
- No faucet available. Please update [the chain configurations](https://github.com/wormhole-foundation/docs.wormhole.com/blob/main/scripts/src/chains/xlayer.json){target=\_blank}

### Chain Details

- **Name** - `xlayer`
- **Wormhole chain ID** - `37`
- **Network chain ID**:
    - **MainNet** - 
    - **TestNet** - <code>195</code>
- **Contract source** - No source file available. Please update [the chain configurations](https://github.com/wormhole-foundation/docs.wormhole.com/blob/main/scripts/src/chains/xlayer.json){target=\_blank}

### Contracts

=== "MainNet"

    |Type|Contract|
    |----|--------|
    |Core|`0x194B123c5E96B9b2E49763619985790Dc241CAC0`|
    |Token Bridge|`0x5537857664B0f9eFe38C9f320F75fEf23234D904`|
    |NFT Bridge|**N/A**|

=== "TestNet"

    |Type|Contract|
    |----|--------|
    |Core|`0xA31aa3FDb7aF7Db93d18DDA4e19F811342EDF780`|
    |Token Bridge|`0xdA91a06299BBF302091B053c6B9EF86Eff0f930D`|
    |NFT Bridge|**N/A**|

=== "Local Development"

    |Type|Contract|
    |----|--------|
    |Core|**N/A**|
    |Token Bridge|**N/A**|
    |NFT Bridge|**N/A**|

<!--XLAYER_CHAIN_DETAILS-->