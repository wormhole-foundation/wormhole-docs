Begin New Bundle: Reference


---

Page Title: Chain IDs

- Source (raw): https://raw.githubusercontent.com/wormhole-foundation/wormhole-docs/main/.ai/pages/products-reference-chain-ids.md
- Canonical (HTML): https://wormhole.com/docs/products/reference/chain-ids/
- Summary: This page documents the Wormhole-specific chain IDs for each chain and contrasts them to the more commonly referenced EVM chain IDs originating in EIP-155.

# Chain IDs

The following table documents the chain IDs used by Wormhole and places them alongside the more commonly referenced [EVM Chain IDs](https://chainlist.org/){target=\_blank}.

!!! note
    Please note, Wormhole chain IDs are different than the more commonly referenced [EVM chain IDs](https://chainlist.org/){target=\_blank}, specified in the Mainnet and Testnet ID columns.

!!!warning
    Wormhole Contributors recommend that all connected chains implement robust security practices including (but not exclusively): open sourcing code and running public bug bounty programs, undergoing security audits and publishing those reports, using version control with adequate access controls and mandatory code review, and high unit and integration test coverage where the results of those tests are available publicly. Connected chains that can't verifiably prove that they've implemented a high percentage of these practices may be noted below with the :warning: symbol. 
    
    Wormhole integrators are encouraged to understand the security assumptions of any chain before trusting messages from it. See the recommended security practices for chains in [Wormhole's security program](https://github.com/wormhole-foundation/wormhole/blob/main/SECURITY.md#chain-integrators){target=\_blank}.



=== "Mainnet"

    <table data-full-width="true" markdown><thead><th>Chain Name</th><th style="width:26%">Wormhole Chain ID</th><th>Network ID</th></thead><tbody><tr><td>Ethereum</td><td><code>2</code></td><td><code>1</code></td></tr><tr><td>Solana</td><td><code>1</code></td><td><code>Mainnet Beta</code> - <code>5eykt4UsFv8P8NJdTREpY1vzqKqZKvdpKuc147dw2N9d</code></td></tr><tr><td>Algorand</td><td><code>8</code></td><td><code>mainnet-v1.0</code></td></tr><tr><td>Aptos</td><td><code>22</code></td><td><code>1</code></td></tr><tr><td>Arbitrum</td><td><code>23</code></td><td><code>Arbitrum One</code> - <code>42161</code></td></tr><tr><td>Avalanche</td><td><code>6</code></td><td><code>C-Chain</code> - <code>43114</code></td></tr><tr><td>Base</td><td><code>30</code></td><td><code>Base</code> - <code>8453</code></td></tr><tr><td>Berachain</td><td><code>39</code></td><td></td></tr><tr><td>BNB Smart Chain</td><td><code>4</code></td><td><code>56</code></td></tr><tr><td>Celestia</td><td><code>4004</code></td><td><code>celestia</code></td></tr><tr><td>Celo</td><td><code>14</code></td><td><code>42220</code></td></tr><tr><td>Converge</td><td><code>53</code></td><td></td></tr><tr><td>Cosmos Hub</td><td><code>4000</code></td><td><code>cosmoshub-4</code></td></tr><tr><td>CreditCoin</td><td><code>59</code></td><td></td></tr><tr><td>Dymension</td><td><code>4007</code></td><td><code>dymension_1100-1</code></td></tr><tr><td>Evmos</td><td><code>4001</code></td><td><code>evmos_9001-2</code></td></tr><tr><td>Fantom</td><td><code>10</code></td><td><code>250</code></td></tr><tr><td>Fogo</td><td><code>51</code></td><td></td></tr><tr><td>HyperCore</td><td><code>65000</code></td><td><code>20000</code></td></tr><tr><td>HyperEVM :material-alert:{ title='⚠️ The HyperEVM integration is experimental, as its node software is not open source. Use Wormhole messaging on HyperEVM with caution.' }</td><td><code>47</code></td><td></td></tr><tr><td>Injective</td><td><code>19</code></td><td><code>injective-1</code></td></tr><tr><td>Ink</td><td><code>46</code></td><td></td></tr><tr><td>Kaia</td><td><code>13</code></td><td><code>8217</code></td></tr><tr><td>Kujira</td><td><code>4002</code></td><td><code>kaiyo-1</code></td></tr><tr><td>Linea</td><td><code>38</code></td><td><code>59144</code></td></tr><tr><td>Mantle</td><td><code>35</code></td><td><code>5000</code></td></tr><tr><td>Mezo</td><td><code>50</code></td><td></td></tr><tr><td>Moca</td><td><code>63</code></td><td><code>2288</code></td></tr><tr><td>Monad</td><td><code>48</code></td><td></td></tr><tr><td>Moonbeam</td><td><code>16</code></td><td><code>1284</code></td></tr><tr><td>NEAR</td><td><code>15</code></td><td><code>mainnet</code></td></tr><tr><td>Neutron</td><td><code>4003</code></td><td><code>neutron-1</code></td></tr><tr><td>Noble</td><td><code>4009</code></td><td><code>noble-1</code></td></tr><tr><td>Optimism</td><td><code>24</code></td><td><code>10</code></td></tr><tr><td>Osmosis</td><td><code>20</code></td><td><code>osmosis-1</code></td></tr><tr><td>Plasma</td><td><code>58</code></td><td></td></tr><tr><td>Plume</td><td><code>55</code></td><td><code>98866</code></td></tr><tr><td>Polygon</td><td><code>5</code></td><td><code>137</code></td></tr><tr><td>Provenance</td><td><code>4008</code></td><td><code>pio-mainnet-1</code></td></tr><tr><td>Pythnet</td><td><code>26</code></td><td></td></tr><tr><td>Scroll</td><td><code>34</code></td><td><code>534352</code></td></tr><tr><td>SEDA</td><td><code>4006</code></td><td></td></tr><tr><td>Sei</td><td><code>32</code></td><td><code>pacific-1</code></td></tr><tr><td>Seievm</td><td><code>40</code></td><td></td></tr><tr><td>Sonic</td><td><code>52</code></td><td><code>146</code></td></tr><tr><td>Stacks</td><td><code>60</code></td><td><code>1</code></td></tr><tr><td>Stargaze</td><td><code>4005</code></td><td><code>stargaze-1</code></td></tr><tr><td>Sui</td><td><code>21</code></td><td><code>35834a8a</code></td></tr><tr><td>Unichain</td><td><code>44</code></td><td><code></code></td></tr><tr><td>World Chain</td><td><code>45</code></td><td><code>480</code></td></tr><tr><td>X Layer</td><td><code>37</code></td><td><code>196</code></td></tr><tr><td>XRPL-EVM</td><td><code>57</code></td><td><code>1440000</code></td></tr></tbody></table>

=== "Testnet"

    <table data-full-width="true" markdown><thead><th>Chain Name</th><th style="width:26%">Wormhole Chain ID</th><th>Network ID</th></thead><tbody><tr><td>Ethereum Holesky</td><td><code>10006</code></td><td><code>Holesky</code> - <code>17000</code></td></tr><tr><td>Ethereum Sepolia</td><td><code>10002</code></td><td><code>Sepolia</code> - <code>11155111</code></td></tr><tr><td>Solana</td><td><code>1</code></td><td><code>Devnet</code> - <code>EtWTRABZaYq6iMfeYKouRu166VU2xqa1wcaWoxPkrZBG</code></td></tr><tr><td>Algorand</td><td><code>8</code></td><td><code>testnet-v1.0</code></td></tr><tr><td>Aptos</td><td><code>22</code></td><td><code>2</code></td></tr><tr><td>Arbitrum Sepolia</td><td><code>10003</code></td><td><code>Sepolia</code> - <code>421614</code></td></tr><tr><td>Avalanche</td><td><code>6</code></td><td><code>Fuji</code> - <code>43113</code></td></tr><tr><td>Base Sepolia</td><td><code>10004</code></td><td><code>Base Sepolia</code> - <code>84532</code></td></tr><tr><td>Berachain</td><td><code>39</code></td><td><code>80084</code></td></tr><tr><td>BNB Smart Chain</td><td><code>4</code></td><td><code>97</code></td></tr><tr><td>Celestia</td><td><code>4004</code></td><td><code>mocha-4</code></td></tr><tr><td>Celo</td><td><code>14</code></td><td><code>Alfajores</code> - <code>44787</code></td></tr><tr><td>Converge</td><td><code>53</code></td><td><code>52085145</code></td></tr><tr><td>Cosmos Hub</td><td><code>4000</code></td><td><code>theta-testnet-001</code></td></tr><tr><td>CreditCoin</td><td><code>59</code></td><td></td></tr><tr><td>Dymension</td><td><code>4007</code></td><td></td></tr><tr><td>Evmos</td><td><code>4001</code></td><td><code>evmos_9000-4</code></td></tr><tr><td>Fantom</td><td><code>10</code></td><td><code>4002</code></td></tr><tr><td>Fogo</td><td><code>51</code></td><td><code>9GGSFo95raqzZxWqKM5tGYvJp5iv4Dm565S4r8h5PEu9</code></td></tr><tr><td>HyperCore</td><td><code>65000</code></td><td><code>20000</code></td></tr><tr><td>HyperEVM :material-alert:{ title='⚠️ The HyperEVM integration is experimental, as its node software is not open source. Use Wormhole messaging on HyperEVM with caution.' }</td><td><code>47</code></td><td><code>998</code></td></tr><tr><td>Injective</td><td><code>19</code></td><td><code>injective-888</code></td></tr><tr><td>Ink</td><td><code>46</code></td><td><code>763373</code></td></tr><tr><td>Kaia</td><td><code>13</code></td><td><code>Kairos</code> - <code>1001</code></td></tr><tr><td>Kujira</td><td><code>4002</code></td><td><code>harpoon-4</code></td></tr><tr><td>Linea</td><td><code>38</code></td><td><code>59141</code></td></tr><tr><td>Mantle</td><td><code>35</code></td><td><code>Sepolia</code> - <code>5003</code></td></tr><tr><td>Mezo</td><td><code>50</code></td><td><code>31611</code></td></tr><tr><td>Moca</td><td><code>63</code></td><td><code>222888</code></td></tr><tr><td>Monad</td><td><code>48</code></td><td><code>10143</code></td></tr><tr><td>Moonbeam</td><td><code>16</code></td><td><code>Moonbase-Alphanet</code> - <code>1287</code></td></tr><tr><td>NEAR</td><td><code>15</code></td><td><code>testnet</code></td></tr><tr><td>Neutron</td><td><code>4003</code></td><td><code>pion-1</code></td></tr><tr><td>Noble</td><td><code>4009</code></td><td><code>grand-1</code></td></tr><tr><td>Optimism Sepolia</td><td><code>10005</code></td><td><code>Optimism Sepolia</code> - <code>11155420</code></td></tr><tr><td>Osmosis</td><td><code>20</code></td><td><code>osmo-test-5</code></td></tr><tr><td>Plasma</td><td><code>58</code></td><td></td></tr><tr><td>Plume</td><td><code>55</code></td><td><code>98867</code></td></tr><tr><td>Polygon Amoy</td><td><code>10007</code></td><td><code>Amoy</code> - <code>80002</code></td></tr><tr><td>Provenance</td><td><code>4008</code></td><td></td></tr><tr><td>Pythnet</td><td><code>26</code></td><td></td></tr><tr><td>Scroll</td><td><code>34</code></td><td><code>Sepolia</code> - <code>534351</code></td></tr><tr><td>SEDA</td><td><code>4006</code></td><td><code>seda-1-testnet</code></td></tr><tr><td>Sei</td><td><code>32</code></td><td><code>atlantic-2</code></td></tr><tr><td>Seievm</td><td><code>40</code></td><td></td></tr><tr><td>Sonic</td><td><code>52</code></td><td><code>57054</code></td></tr><tr><td>Stacks</td><td><code>60</code></td><td><code>2147483648</code></td></tr><tr><td>Stargaze</td><td><code>4005</code></td><td></td></tr><tr><td>Sui</td><td><code>21</code></td><td><code>4c78adac</code></td></tr><tr><td>Unichain</td><td><code>44</code></td><td><code>Unichain Sepolia</code> - <code>1301</code></td></tr><tr><td>World Chain</td><td><code>45</code></td><td><code>4801</code></td></tr><tr><td>X Layer</td><td><code>37</code></td><td><code>195</code></td></tr><tr><td>XRPL-EVM</td><td><code>57</code></td><td><code>1449000</code></td></tr></tbody></table>


---

Page Title: Contract Addresses

- Source (raw): https://raw.githubusercontent.com/wormhole-foundation/wormhole-docs/main/.ai/pages/products-reference-contract-addresses.md
- Canonical (HTML): https://wormhole.com/docs/products/reference/contract-addresses/
- Summary: This page documents the deployed contract addresses of the Wormhole contracts on each chain, including Core Contracts, TokenBridge, and more.

# Contract Addresses

## Core Contracts



=== "Mainnet"

    <table data-full-width="true" markdown><thead><th>Chain Name</th><th>Contract Address</th></thead><tbody><tr><td>Ethereum</td><td><code>0x98f3c9e6E3fAce36bAAd05FE09d375Ef1464288B</code></td></tr><tr><td>Solana</td><td><code>worm2ZoG2kUd4vFXhvjh93UUH596ayRfgQ2MgjNMTth</code></td></tr><tr><td>Algorand</td><td><code>842125965</code></td></tr><tr><td>Aptos</td><td><code>0x5bc11445584a763c1fa7ed39081f1b920954da14e04b32440cba863d03e19625</code></td></tr><tr><td>Arbitrum</td><td><code>0xa5f208e072434bC67592E4C49C1B991BA79BCA46</code></td></tr><tr><td>Avalanche</td><td><code>0x54a8e5f9c4CbA08F9943965859F6c34eAF03E26c</code></td></tr><tr><td>Base</td><td><code>0xbebdb6C8ddC678FfA9f8748f85C815C556Dd8ac6</code></td></tr><tr><td>Berachain</td><td><code>0xCa1D5a146B03f6303baF59e5AD5615ae0b9d146D</code></td></tr><tr><td>BNB Smart Chain</td><td><code>0x98f3c9e6E3fAce36bAAd05FE09d375Ef1464288B</code></td></tr><tr><td>Celo</td><td><code>0xa321448d90d4e5b0A732867c18eA198e75CAC48E</code></td></tr><tr><td>CreditCoin</td><td><code>0xaBf89de706B583424328B54dD05a8fC986750Da8</code></td></tr><tr><td>Fantom</td><td><code>0x126783A6Cb203a3E35344528B26ca3a0489a1485</code></td></tr><tr><td>Fogo</td><td><code>worm2mrQkG1B1KTz37erMfWN8anHkSK24nzca7UD8BB</code></td></tr><tr><td>HyperEVM :material-alert:{ title='⚠️ The HyperEVM integration is experimental, as its node software is not open source. Use Wormhole messaging on HyperEVM with caution.' }</td><td><code>0x7C0faFc4384551f063e05aee704ab943b8B53aB3</code></td></tr><tr><td>Injective</td><td><code>inj17p9rzwnnfxcjp32un9ug7yhhzgtkhvl9l2q74d</code></td></tr><tr><td>Ink</td><td><code>0xCa1D5a146B03f6303baF59e5AD5615ae0b9d146D</code></td></tr><tr><td>Kaia</td><td><code>0x0C21603c4f3a6387e241c0091A7EA39E43E90bb7</code></td></tr><tr><td>Linea</td><td><code>0x0C56aebD76E6D9e4a1Ec5e94F4162B4CBbf77b32</code></td></tr><tr><td>Mantle</td><td><code>0xbebdb6C8ddC678FfA9f8748f85C815C556Dd8ac6</code></td></tr><tr><td>Mezo</td><td><code>0xaBf89de706B583424328B54dD05a8fC986750Da8</code></td></tr><tr><td>Monad</td><td><code>0x194B123c5E96B9b2E49763619985790Dc241CAC0</code></td></tr><tr><td>Moonbeam</td><td><code>0xC8e2b0cD52Cf01b0Ce87d389Daa3d414d4cE29f3</code></td></tr><tr><td>NEAR</td><td><code>contract.wormhole_crypto.near</code></td></tr><tr><td>Neutron</td><td><code>neutron16rerygcpahqcxx5t8vjla46ym8ccn7xz7rtc6ju5ujcd36cmc7zs9zrunh</code></td></tr><tr><td>Optimism</td><td><code>0xEe91C335eab126dF5fDB3797EA9d6aD93aeC9722</code></td></tr><tr><td>Plume</td><td><code>0xaBf89de706B583424328B54dD05a8fC986750Da8</code></td></tr><tr><td>Polygon</td><td><code>0x7A4B5a56256163F07b2C80A7cA55aBE66c4ec4d7</code></td></tr><tr><td>Pythnet</td><td><code>H3fxXJ86ADW2PNuDDmZJg6mzTtPxkYCpNuQUTgmJ7AjU</code></td></tr><tr><td>Scroll</td><td><code>0xbebdb6C8ddC678FfA9f8748f85C815C556Dd8ac6</code></td></tr><tr><td>Sei</td><td><code>sei1gjrrme22cyha4ht2xapn3f08zzw6z3d4uxx6fyy9zd5dyr3yxgzqqncdqn</code></td></tr><tr><td>Seievm</td><td><code>0xCa1D5a146B03f6303baF59e5AD5615ae0b9d146D</code></td></tr><tr><td>Sui</td><td><code>0xaeab97f96cf9877fee2883315d459552b2b921edc16d7ceac6eab944dd88919c</code></td></tr><tr><td>Unichain</td><td><code>0xCa1D5a146B03f6303baF59e5AD5615ae0b9d146D</code></td></tr><tr><td>World Chain</td><td><code>0xcbcEe4e081464A15d8Ad5f58BB493954421eB506</code></td></tr><tr><td>X Layer</td><td><code>0x194B123c5E96B9b2E49763619985790Dc241CAC0</code></td></tr><tr><td>XRPL-EVM</td><td><code>0xaBf89de706B583424328B54dD05a8fC986750Da8</code></td></tr></tbody></table>

=== "Testnet"

    <table data-full-width="true" markdown><thead><th>Chain Name</th><th>Contract Address</th></thead><tbody><tr><td>Ethereum Holesky</td><td><code>0xa10f2eF61dE1f19f586ab8B6F2EbA89bACE63F7a</code></td></tr><tr><td>Ethereum Sepolia</td><td><code>0x4a8bc80Ed5a4067f1CCf107057b8270E0cC11A78</code></td></tr><tr><td>Solana</td><td><code>3u8hJUVTA4jH1wYAyUur7FFZVQ8H635K3tSHHF4ssjQ5</code></td></tr><tr><td>Algorand</td><td><code>86525623</code></td></tr><tr><td>Aptos</td><td><code>0x5bc11445584a763c1fa7ed39081f1b920954da14e04b32440cba863d03e19625</code></td></tr><tr><td>Arbitrum Sepolia</td><td><code>0x6b9C8671cdDC8dEab9c719bB87cBd3e782bA6a35</code></td></tr><tr><td>Avalanche</td><td><code>0x7bbcE28e64B3F8b84d876Ab298393c38ad7aac4C</code></td></tr><tr><td>Base Sepolia</td><td><code>0x79A1027a6A159502049F10906D333EC57E95F083</code></td></tr><tr><td>Berachain</td><td><code>0xBB73cB66C26740F31d1FabDC6b7A46a038A300dd</code></td></tr><tr><td>BNB Smart Chain</td><td><code>0x68605AD7b15c732a30b1BbC62BE8F2A509D74b4D</code></td></tr><tr><td>Celo</td><td><code>0x88505117CA88e7dd2eC6EA1E13f0948db2D50D56</code></td></tr><tr><td>Converge</td><td><code>0x556B259cFaCd9896B2773310080c7c3bcE90Ff01</code></td></tr><tr><td>CreditCoin</td><td><code>0xaBf89de706B583424328B54dD05a8fC986750Da8</code></td></tr><tr><td>Fantom</td><td><code>0x1BB3B4119b7BA9dfad76B0545fb3F531383c3bB7</code></td></tr><tr><td>Fogo</td><td><code>BhnQyKoQQgpuRTRo6D8Emz93PvXCYfVgHhnrR4T3qhw4</code></td></tr><tr><td>HyperEVM :material-alert:{ title='⚠️ The HyperEVM integration is experimental, as its node software is not open source. Use Wormhole messaging on HyperEVM with caution.' }</td><td><code>0xBB73cB66C26740F31d1FabDC6b7A46a038A300dd</code></td></tr><tr><td>Injective</td><td><code>inj1xx3aupmgv3ce537c0yce8zzd3sz567syuyedpg</code></td></tr><tr><td>Ink</td><td><code>0xBB73cB66C26740F31d1FabDC6b7A46a038A300dd</code></td></tr><tr><td>Kaia</td><td><code>0x1830CC6eE66c84D2F177B94D544967c774E624cA</code></td></tr><tr><td>Linea</td><td><code>0x79A1027a6A159502049F10906D333EC57E95F083</code></td></tr><tr><td>Mantle</td><td><code>0x376428e7f26D5867e69201b275553C45B09EE090</code></td></tr><tr><td>Mezo</td><td><code>0x268557122Ffd64c85750d630b716471118F323c8</code></td></tr><tr><td>Moca</td><td><code>0xaBf89de706B583424328B54dD05a8fC986750Da8</code></td></tr><tr><td>Monad</td><td><code>0xBB73cB66C26740F31d1FabDC6b7A46a038A300dd</code></td></tr><tr><td>Moonbeam</td><td><code>0xa5B7D85a8f27dd7907dc8FdC21FA5657D5E2F901</code></td></tr><tr><td>NEAR</td><td><code>wormhole.wormhole.testnet</code></td></tr><tr><td>Neutron</td><td><code>neutron1enf63k37nnv9cugggpm06mg70emcnxgj9p64v2s8yx7a2yhhzk2q6xesk4</code></td></tr><tr><td>Optimism Sepolia</td><td><code>0x31377888146f3253211EFEf5c676D41ECe7D58Fe</code></td></tr><tr><td>Osmosis</td><td><code>osmo1hggkxr0hpw83f8vuft7ruvmmamsxmwk2hzz6nytdkzyup9krt0dq27sgyx</code></td></tr><tr><td>Plasma</td><td><code>0xaBf89de706B583424328B54dD05a8fC986750Da8</code></td></tr><tr><td>Plume</td><td><code>0x81705b969cDcc6FbFde91a0C6777bE0EF3A75855</code></td></tr><tr><td>Polygon Amoy</td><td><code>0x6b9C8671cdDC8dEab9c719bB87cBd3e782bA6a35</code></td></tr><tr><td>Pythnet</td><td><code>EUrRARh92Cdc54xrDn6qzaqjA77NRrCcfbr8kPwoTL4z</code></td></tr><tr><td>Scroll</td><td><code>0x055F47F1250012C6B20c436570a76e52c17Af2D5</code></td></tr><tr><td>Sei</td><td><code>sei1nna9mzp274djrgzhzkac2gvm3j27l402s4xzr08chq57pjsupqnqaj0d5s</code></td></tr><tr><td>Seievm</td><td><code>0xBB73cB66C26740F31d1FabDC6b7A46a038A300dd</code></td></tr><tr><td>Sui</td><td><code>0x31358d198147da50db32eda2562951d53973a0c0ad5ed738e9b17d88b213d790</code></td></tr><tr><td>Unichain</td><td><code>0xBB73cB66C26740F31d1FabDC6b7A46a038A300dd</code></td></tr><tr><td>World Chain</td><td><code>0xe5E02cD12B6FcA153b0d7fF4bF55730AE7B3C93A</code></td></tr><tr><td>X Layer</td><td><code>0xA31aa3FDb7aF7Db93d18DDA4e19F811342EDF780</code></td></tr><tr><td>XRPL-EVM</td><td><code>0xaBf89de706B583424328B54dD05a8fC986750Da8</code></td></tr></tbody></table>

=== "Devnet"

    <table data-full-width="true" markdown><thead><th>Chain Name</th><th>Contract Address</th></thead><tbody><tr><td>Ethereum</td><td><code>0xC89Ce4735882C9F0f0FE26686c53074E09B0D550</code></td></tr><tr><td>Solana</td><td><code>Bridge1p5gheXUvJ6jGWGeCsgPKgnE3YgdGKRVCMY9o</code></td></tr><tr><td>Algorand</td><td><code>1004</code></td></tr><tr><td>Aptos</td><td><code>0xde0036a9600559e295d5f6802ef6f3f802f510366e0c23912b0655d972166017</code></td></tr><tr><td>BNB Smart Chain</td><td><code>0xC89Ce4735882C9F0f0FE26686c53074E09B0D550</code></td></tr><tr><td>NEAR</td><td><code>wormhole.test.near</code></td></tr><tr><td>Stacks</td><td><code>ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM</code></td></tr><tr><td>Sui</td><td><code>0x5a5160ca3c2037f4b4051344096ef7a48ebf4400b3f385e57ea90e1628a8bde0</code></td></tr></tbody></table>


## Wrapped Token Transfers (WTT)



=== "Mainnet"

    <table data-full-width="true" markdown><thead><th>Chain Name</th><th>Contract Address</th></thead><tbody><tr><td>Ethereum</td><td><code>0x3ee18B2214AFF97000D974cf647E7C347E8fa585</code></td></tr><tr><td>Solana</td><td><code>wormDTUJ6AWPNvk59vGQbDvGJmqbDTdgWgAqcLBCgUb</code></td></tr><tr><td>Algorand</td><td><code>842126029</code></td></tr><tr><td>Aptos</td><td><code>0x576410486a2da45eee6c949c995670112ddf2fbeedab20350d506328eefc9d4f</code></td></tr><tr><td>Arbitrum</td><td><code>0x0b2402144Bb366A632D14B83F244D2e0e21bD39c</code></td></tr><tr><td>Avalanche</td><td><code>0x0e082F06FF657D94310cB8cE8B0D9a04541d8052</code></td></tr><tr><td>Base</td><td><code>0x8d2de8d2f73F1F4cAB472AC9A881C9b123C79627</code></td></tr><tr><td>Berachain</td><td><code>0x3Ff72741fd67D6AD0668d93B41a09248F4700560</code></td></tr><tr><td>BNB Smart Chain</td><td><code>0xB6F6D86a8f9879A9c87f643768d9efc38c1Da6E7</code></td></tr><tr><td>Celo</td><td><code>0x796Dff6D74F3E27060B71255Fe517BFb23C93eed</code></td></tr><tr><td>Fantom</td><td><code>0x7C9Fc5741288cDFdD83CeB07f3ea7e22618D79D2</code></td></tr><tr><td>Fogo</td><td><code>wormQuCVWSSmPdjVmEzAWxAXViVyTSWnLyhff5hVYGS</code></td></tr><tr><td>Injective</td><td><code>inj1ghd753shjuwexxywmgs4xz7x2q732vcnxxynfn</code></td></tr><tr><td>Ink</td><td><code>0x3Ff72741fd67D6AD0668d93B41a09248F4700560</code></td></tr><tr><td>Kaia</td><td><code>0x5b08ac39EAED75c0439FC750d9FE7E1F9dD0193F</code></td></tr><tr><td>Linea</td><td><code>0x167E0752de62cb76EFc0Fbb165Bd342c6e2Bb251</code></td></tr><tr><td>Mantle</td><td><code>0x24850c6f61C438823F01B7A3BF2B89B72174Fa9d</code></td></tr><tr><td>Monad</td><td><code>0x0B2719cdA2F10595369e6673ceA3Ee2EDFa13BA7</code></td></tr><tr><td>Moonbeam</td><td><code>0xb1731c586ca89a23809861c6103f0b96b3f57d92</code></td></tr><tr><td>NEAR</td><td><code>contract.portalbridge.near</code></td></tr><tr><td>Optimism</td><td><code>0x1D68124e65faFC907325e3EDbF8c4d84499DAa8b</code></td></tr><tr><td>Polygon</td><td><code>0x5a58505a96D1dbf8dF91cB21B54419FC36e93fdE</code></td></tr><tr><td>Scroll</td><td><code>0x24850c6f61C438823F01B7A3BF2B89B72174Fa9d</code></td></tr><tr><td>Sei</td><td><code>sei1smzlm9t79kur392nu9egl8p8je9j92q4gzguewj56a05kyxxra0qy0nuf3</code></td></tr><tr><td>Seievm</td><td><code>0x3Ff72741fd67D6AD0668d93B41a09248F4700560</code></td></tr><tr><td>Sui</td><td><code>0xc57508ee0d4595e5a8728974a4a93a787d38f339757230d441e895422c07aba9</code></td></tr><tr><td>Unichain</td><td><code>0x3Ff72741fd67D6AD0668d93B41a09248F4700560</code></td></tr><tr><td>World Chain</td><td><code>0xc309275443519adca74c9136b02A38eF96E3a1f6</code></td></tr><tr><td>X Layer</td><td><code>0x5537857664B0f9eFe38C9f320F75fEf23234D904</code></td></tr><tr><td>XRPL-EVM</td><td><code>0x47F5195163270345fb4d7B9319Eda8C64C75E278</code></td></tr></tbody></table>

=== "Testnet"

    <table data-full-width="true" markdown><thead><th>Chain Name</th><th>Contract Address</th></thead><tbody><tr><td>Ethereum Holesky</td><td><code>0x76d093BbaE4529a342080546cAFEec4AcbA59EC6</code></td></tr><tr><td>Ethereum Sepolia</td><td><code>0xDB5492265f6038831E89f495670FF909aDe94bd9</code></td></tr><tr><td>Solana</td><td><code>DZnkkTmCiFWfYTfT41X3Rd1kDgozqzxWaHqsw6W4x2oe</code></td></tr><tr><td>Algorand</td><td><code>86525641</code></td></tr><tr><td>Aptos</td><td><code>0x576410486a2da45eee6c949c995670112ddf2fbeedab20350d506328eefc9d4f</code></td></tr><tr><td>Arbitrum Sepolia</td><td><code>0xC7A204bDBFe983FCD8d8E61D02b475D4073fF97e</code></td></tr><tr><td>Avalanche</td><td><code>0x61E44E506Ca5659E6c0bba9b678586fA2d729756</code></td></tr><tr><td>Base Sepolia</td><td><code>0x86F55A04690fd7815A3D802bD587e83eA888B239</code></td></tr><tr><td>Berachain</td><td><code>0xa10f2eF61dE1f19f586ab8B6F2EbA89bACE63F7a</code></td></tr><tr><td>BNB Smart Chain</td><td><code>0x9dcF9D205C9De35334D646BeE44b2D2859712A09</code></td></tr><tr><td>Celo</td><td><code>0x05ca6037eC51F8b712eD2E6Fa72219FEaE74E153</code></td></tr><tr><td>Fantom</td><td><code>0x599CEa2204B4FaECd584Ab1F2b6aCA137a0afbE8</code></td></tr><tr><td>Fogo</td><td><code>78HdStBqCMioGii9D8mF3zQaWDqDZBQWTUwjjpdmbJKX</code></td></tr><tr><td>HyperEVM :material-alert:{ title='⚠️ The HyperEVM integration is experimental, as its node software is not open source. Use Wormhole messaging on HyperEVM with caution.' }</td><td><code>0x4a8bc80Ed5a4067f1CCf107057b8270E0cC11A78</code></td></tr><tr><td>Injective</td><td><code>inj1q0e70vhrv063eah90mu97sazhywmeegp7myvnh</code></td></tr><tr><td>Ink</td><td><code>0x376428e7f26D5867e69201b275553C45B09EE090</code></td></tr><tr><td>Kaia</td><td><code>0xC7A13BE098720840dEa132D860fDfa030884b09A</code></td></tr><tr><td>Linea</td><td><code>0xC7A204bDBFe983FCD8d8E61D02b475D4073fF97e</code></td></tr><tr><td>Mantle</td><td><code>0x75Bfa155a9D7A3714b0861c8a8aF0C4633c45b5D</code></td></tr><tr><td>Mezo</td><td><code>0xA31aa3FDb7aF7Db93d18DDA4e19F811342EDF780</code></td></tr><tr><td>Moca</td><td><code>0xF97B81E513f53c7a6B57Bd0b103a6c295b3096C5</code></td></tr><tr><td>Monad</td><td><code>0xF323dcDe4d33efe83cf455F78F9F6cc656e6B659</code></td></tr><tr><td>Moonbeam</td><td><code>0xbc976D4b9D57E57c3cA52e1Fd136C45FF7955A96</code></td></tr><tr><td>NEAR</td><td><code>token.wormhole.testnet</code></td></tr><tr><td>Optimism Sepolia</td><td><code>0x99737Ec4B815d816c49A385943baf0380e75c0Ac</code></td></tr><tr><td>Polygon Amoy</td><td><code>0xC7A204bDBFe983FCD8d8E61D02b475D4073fF97e</code></td></tr><tr><td>Scroll</td><td><code>0x22427d90B7dA3fA4642F7025A854c7254E4e45BF</code></td></tr><tr><td>Sei</td><td><code>sei1jv5xw094mclanxt5emammy875qelf3v62u4tl4lp5nhte3w3s9ts9w9az2</code></td></tr><tr><td>Seievm</td><td><code>0x23908A62110e21C04F3A4e011d24F901F911744A</code></td></tr><tr><td>Sui</td><td><code>0x6fb10cdb7aa299e9a4308752dadecb049ff55a892de92992a1edbd7912b3d6da</code></td></tr><tr><td>Unichain</td><td><code>0xa10f2eF61dE1f19f586ab8B6F2EbA89bACE63F7a</code></td></tr><tr><td>World Chain</td><td><code>0x430855B4D43b8AEB9D2B9869B74d58dda79C0dB2</code></td></tr><tr><td>X Layer</td><td><code>0xdA91a06299BBF302091B053c6B9EF86Eff0f930D</code></td></tr><tr><td>XRPL-EVM</td><td><code>0x7d8eBc211C4221eA18E511E4f0fD50c5A539f275</code></td></tr></tbody></table>

=== "Devnet"

    <table data-full-width="true" markdown><thead><th>Chain Name</th><th>Contract Address</th></thead><tbody><tr><td>Ethereum</td><td><code>0x0290FB167208Af455bB137780163b7B7a9a10C16</code></td></tr><tr><td>Solana</td><td><code>B6RHG3mfcckmrYN1UhmJzyS1XX3fZKbkeUcpJe9Sy3FE</code></td></tr><tr><td>Algorand</td><td><code>1006</code></td></tr><tr><td>Aptos</td><td><code>0x84a5f374d29fc77e370014dce4fd6a55b58ad608de8074b0be5571701724da31</code></td></tr><tr><td>BNB Smart Chain</td><td><code>0x0290FB167208Af455bB137780163b7B7a9a10C16</code></td></tr><tr><td>NEAR</td><td><code>token.test.near</code></td></tr><tr><td>Sui</td><td><code>0xa6a3da85bbe05da5bfd953708d56f1a3a023e7fb58e5a824a3d4de3791e8f690</code></td></tr></tbody></table>


## Wormhole Relayer 



=== "Mainnet"

    <table data-full-width="true" markdown><thead><th>Chain Name</th><th>Contract Address</th></thead><tbody><tr><td>Ethereum</td><td><code>0x27428DD2d3DD32A4D7f7C497eAaa23130d894911</code></td></tr><tr><td>Arbitrum</td><td><code>0x27428DD2d3DD32A4D7f7C497eAaa23130d894911</code></td></tr><tr><td>Avalanche</td><td><code>0x27428DD2d3DD32A4D7f7C497eAaa23130d894911</code></td></tr><tr><td>Base</td><td><code>0x706f82e9bb5b0813501714ab5974216704980e31</code></td></tr><tr><td>Berachain</td><td><code>0x27428DD2d3DD32A4D7f7C497eAaa23130d894911</code></td></tr><tr><td>BNB Smart Chain</td><td><code>0x27428DD2d3DD32A4D7f7C497eAaa23130d894911</code></td></tr><tr><td>Celo</td><td><code>0x27428DD2d3DD32A4D7f7C497eAaa23130d894911</code></td></tr><tr><td>Fantom</td><td><code>0x27428DD2d3DD32A4D7f7C497eAaa23130d894911</code></td></tr><tr><td>Ink</td><td><code>0x27428DD2d3DD32A4D7f7C497eAaa23130d894911</code></td></tr><tr><td>Kaia</td><td><code>0x27428DD2d3DD32A4D7f7C497eAaa23130d894911</code></td></tr><tr><td>Mantle</td><td><code>0x27428DD2d3DD32A4D7f7C497eAaa23130d894911</code></td></tr><tr><td>Mezo</td><td><code>0x27428DD2d3DD32A4D7f7C497eAaa23130d894911</code></td></tr><tr><td>Moonbeam</td><td><code>0x27428DD2d3DD32A4D7f7C497eAaa23130d894911</code></td></tr><tr><td>Optimism</td><td><code>0x27428DD2d3DD32A4D7f7C497eAaa23130d894911</code></td></tr><tr><td>Plume</td><td><code>0x27428DD2d3DD32A4D7f7C497eAaa23130d894911</code></td></tr><tr><td>Polygon</td><td><code>0x27428DD2d3DD32A4D7f7C497eAaa23130d894911</code></td></tr><tr><td>Scroll</td><td><code>0x27428DD2d3DD32A4D7f7C497eAaa23130d894911</code></td></tr><tr><td>Seievm</td><td><code>0x27428DD2d3DD32A4D7f7C497eAaa23130d894911</code></td></tr><tr><td>Unichain</td><td><code>0x27428DD2d3DD32A4D7f7C497eAaa23130d894911</code></td></tr><tr><td>World Chain</td><td><code>0x1520cc9e779c56dab5866bebfb885c86840c33d3</code></td></tr><tr><td>X Layer</td><td><code>0x27428DD2d3DD32A4D7f7C497eAaa23130d894911</code></td></tr></tbody></table>

=== "Testnet"

    <table data-full-width="true" markdown><thead><th>Chain Name</th><th>Contract Address</th></thead><tbody><tr><td>Ethereum Sepolia</td><td><code>0x7B1bD7a6b4E61c2a123AC6BC2cbfC614437D0470</code></td></tr><tr><td>Arbitrum Sepolia</td><td><code>0x7B1bD7a6b4E61c2a123AC6BC2cbfC614437D0470</code></td></tr><tr><td>Avalanche</td><td><code>0xA3cF45939bD6260bcFe3D66bc73d60f19e49a8BB</code></td></tr><tr><td>Base Sepolia</td><td><code>0x93BAD53DDfB6132b0aC8E37f6029163E63372cEE</code></td></tr><tr><td>Berachain</td><td><code>0x362fca37E45fe1096b42021b543f462D49a5C8df</code></td></tr><tr><td>BNB Smart Chain</td><td><code>0x80aC94316391752A193C1c47E27D382b507c93F3</code></td></tr><tr><td>Celo</td><td><code>0x306B68267Deb7c5DfCDa3619E22E9Ca39C374f84</code></td></tr><tr><td>Fantom</td><td><code>0x7B1bD7a6b4E61c2a123AC6BC2cbfC614437D0470</code></td></tr><tr><td>Ink</td><td><code>0x362fca37E45fe1096b42021b543f462D49a5C8df</code></td></tr><tr><td>Mezo</td><td><code>0x362fca37E45fe1096b42021b543f462D49a5C8df</code></td></tr><tr><td>Monad</td><td><code>0x362fca37E45fe1096b42021b543f462D49a5C8df</code></td></tr><tr><td>Moonbeam</td><td><code>0x0591C25ebd0580E0d4F27A82Fc2e24E7489CB5e0</code></td></tr><tr><td>Optimism Sepolia</td><td><code>0x93BAD53DDfB6132b0aC8E37f6029163E63372cEE</code></td></tr><tr><td>Polygon Amoy</td><td><code>0x362fca37E45fe1096b42021b543f462D49a5C8df</code></td></tr><tr><td>Seievm</td><td><code>0x362fca37E45fe1096b42021b543f462D49a5C8df</code></td></tr><tr><td>Unichain</td><td><code>0x362fca37E45fe1096b42021b543f462D49a5C8df</code></td></tr><tr><td>XRPL-EVM</td><td><code>0x362fca37E45fe1096b42021b543f462D49a5C8df</code></td></tr></tbody></table>

=== "Devnet"

    <table data-full-width="true" markdown><thead><th>Chain Name</th><th>Contract Address</th></thead><tbody><tr><td>Ethereum</td><td><code>0xcC680D088586c09c3E0E099a676FA4b6e42467b4</code></td></tr><tr><td>BNB Smart Chain</td><td><code>0xcC680D088586c09c3E0E099a676FA4b6e42467b4</code></td></tr></tbody></table>


## CCTP



=== "Mainnet"

    <table data-full-width="true" markdown><thead><th>Chain Name</th><th>Contract Address</th></thead><tbody><tr><td>Ethereum</td><td><code>0xAaDA05BD399372f0b0463744C09113c137636f6a</code></td></tr><tr><td>Arbitrum</td><td><code>0x2703483B1a5a7c577e8680de9Df8Be03c6f30e3c</code></td></tr><tr><td>Avalanche</td><td><code>0x09Fb06A271faFf70A651047395AaEb6265265F13</code></td></tr><tr><td>Base</td><td><code>0x03faBB06Fa052557143dC28eFCFc63FC12843f1D</code></td></tr><tr><td>Optimism</td><td><code>0x2703483B1a5a7c577e8680de9Df8Be03c6f30e3c</code></td></tr><tr><td>Polygon</td><td><code>0x0FF28217dCc90372345954563486528aa865cDd6</code></td></tr></tbody></table>

=== "Testnet"

    <table data-full-width="true" markdown><thead><th>Chain Name</th><th>Contract Address</th></thead><tbody><tr><td>Ethereum Sepolia</td><td><code>0x2703483B1a5a7c577e8680de9Df8Be03c6f30e3c</code></td></tr><tr><td>Arbitrum Sepolia</td><td><code>0x2703483B1a5a7c577e8680de9Df8Be03c6f30e3c</code></td></tr><tr><td>Avalanche</td><td><code>0x58f4c17449c90665891c42e14d34aae7a26a472e</code></td></tr><tr><td>Base Sepolia</td><td><code>0x2703483B1a5a7c577e8680de9Df8Be03c6f30e3c</code></td></tr><tr><td>Optimism Sepolia</td><td><code>0x2703483B1a5a7c577e8680de9Df8Be03c6f30e3c</code></td></tr></tbody></table>


## Settlement Token Router

=== "Mainnet"

    <table data-full-width="true" markdown><thead><tr><th>Chain Name</th><th>Contract Address</th></tr></thead><tbody><tr><td>Ethereum</td><td><code>0x70287c79ee41C5D1df8259Cd68Ba0890cd389c47</code></td></tr><tr><td>Solana</td><td><code>28topqjtJzMnPaGFmmZk68tzGmj9W9aMntaEK3QkgtRe</code></td></tr><tr><td>Arbitrum</td><td><code>0x70287c79ee41C5D1df8259Cd68Ba0890cd389c47</code></td></tr><tr><td>Avalanche</td><td><code>0x70287c79ee41C5D1df8259Cd68Ba0890cd389c47</code></td></tr><tr><td>Base</td><td><code>0x70287c79ee41C5D1df8259Cd68Ba0890cd389c47</code></td></tr><tr><td>Optimism</td><td><code>0x70287c79ee41C5D1df8259Cd68Ba0890cd389c47</code></td></tr><tr><td>Polygon</td><td><code>0x70287c79ee41C5D1df8259Cd68Ba0890cd389c47</code></td></tr></tbody></table>

=== "Testnet"

    <table data-full-width="true" markdown><thead><tr><th>Chain Name</th><th>Contract Address</th></tr></thead><tbody><tr><td>Solana</td><td><code>tD8RmtdcV7bzBeuFgyrFc8wvayj988ChccEzRQzo6md</code></td></tr><tr><td>Arbitrum Sepolia</td><td><code>0xe0418C44F06B0b0D7D1706E01706316DBB0B210E</code></td></tr><tr><td>Optimism Sepolia</td><td><code>0x6BAa7397c18abe6221b4f6C3Ac91C88a9faE00D8</code></td></tr></tbody></table>

## Executor



=== "Mainnet"

    <table data-full-width="true" markdown><thead><th>Chain Name</th><th>Contract Address</th></thead><tbody><tr><td>Ethereum</td><td><code>0x84EEe8dBa37C36947397E1E11251cA9A06Fc6F8a</code></td></tr><tr><td>Solana</td><td><code>execXUrAsMnqMmTHj5m7N1YQgsDz3cwGLYCYyuDRciV</code></td></tr><tr><td>Aptos</td><td><code>0x11aa75c059e1a7855be66b931bf340a2e0973274ac16b5f519c02ceafaf08a18</code></td></tr><tr><td>Arbitrum</td><td><code>0x3980f8318fc03d79033Bbb421A622CDF8d2Eeab4</code></td></tr><tr><td>Avalanche</td><td><code>0x4661F0E629E4ba8D04Ee90080Aee079740B00381</code></td></tr><tr><td>Base</td><td><code>0x9E1936E91A4a5AE5A5F75fFc472D6cb8e93597ea</code></td></tr><tr><td>Berachain</td><td><code>0x0Dd7a5a32311b8D87A615Cc7f079B632D3d5e2D3</code></td></tr><tr><td>BNB Smart Chain</td><td><code>0xeC8cCCD058DbF28e5D002869Aa9aFa3992bf4ee0</code></td></tr><tr><td>Celo</td><td><code>0xe6Ea5087c6860B94Cf098a403506262D8F28cF05</code></td></tr><tr><td>CreditCoin</td><td><code>0xd2e420188f17607Aa6344ee19c3e76Cf86CA7BDe</code></td></tr><tr><td>Fogo</td><td><code>execXUrAsMnqMmTHj5m7N1YQgsDz3cwGLYCYyuDRciV</code></td></tr><tr><td>HyperEVM :material-alert:{ title='⚠️ The HyperEVM integration is experimental, as its node software is not open source. Use Wormhole messaging on HyperEVM with caution.' }</td><td><code>0xd7717899cc4381033Bc200431286D0AC14265F78</code></td></tr><tr><td>Ink</td><td><code>0x3e44a5F45cbD400acBEF534F51e616043B211Ddd</code></td></tr><tr><td>Linea</td><td><code>0x23aF2B5296122544A9A7861da43405D5B15a9bD3</code></td></tr><tr><td>Mezo</td><td><code>0x0f9b8E144Cc5C5e7C0073829Afd30F26A50c5606</code></td></tr><tr><td>Monad</td><td><code>0xC04dE634982cAdF2A677310b73630B7Ac56A3f65</code></td></tr><tr><td>Moonbeam</td><td><code>0x85D06449C78064c2E02d787e9DC71716786F8D19</code></td></tr><tr><td>Optimism</td><td><code>0x85B704501f6AE718205C0636260768C4e72ac3e7</code></td></tr><tr><td>Polygon</td><td><code>0x0B23efA164aB3eD08e9a39AC7aD930Ff4F5A5e81</code></td></tr><tr><td>Scroll</td><td><code>0xcFAdDE24640e395F5A71456A825D0D7C3741F075</code></td></tr><tr><td>Seievm</td><td><code>0x25f1c923fb7a5aefa5f0a2b419fc70f2368e66e5</code></td></tr><tr><td>Sonic</td><td><code>0x3Fdc36b4260Da38fBDba1125cCBD33DD0AC74812</code></td></tr><tr><td>Sui</td><td><code>0xdb0fe8bb1e2b5be628adbea0636063325073e1070ee11e4281457dfd7f158235</code></td></tr><tr><td>Unichain</td><td><code>0x764dD868eAdD27ce57BCB801E4ca4a193d231Aed</code></td></tr><tr><td>World Chain</td><td><code>0x8689b4E6226AdC8fa8FF80aCc3a60AcE31e8804B</code></td></tr><tr><td>XRPL-EVM</td><td><code>0x8345E90Dcd92f5Cf2FAb0C8E2A56A5bc2c30d896</code></td></tr></tbody></table>

=== "Testnet"

    <table data-full-width="true" markdown><thead><th>Chain Name</th><th>Contract Address</th></thead><tbody><tr><td>Ethereum Sepolia</td><td><code>0xD0fb39f5a3361F21457653cB70F9D0C9bD86B66B</code></td></tr><tr><td>Solana</td><td><code>execXUrAsMnqMmTHj5m7N1YQgsDz3cwGLYCYyuDRciV</code></td></tr><tr><td>Aptos</td><td><code>0x139717c339f08af674be77143507a905aa28cbc67a0e53e7095c07b630d73815</code></td></tr><tr><td>Arbitrum Sepolia</td><td><code>0xBF161de6B819c8af8f2230Bcd99a9B3592f6F87b</code></td></tr><tr><td>Avalanche</td><td><code>0x4661F0E629E4ba8D04Ee90080Aee079740B00381</code></td></tr><tr><td>Base Sepolia</td><td><code>0x51B47D493CBA7aB97e3F8F163D6Ce07592CE4482</code></td></tr><tr><td>Converge</td><td><code>0xAab9935349B9c08e0e970720F6D640d5B91C293E</code></td></tr><tr><td>Fogo</td><td><code>execXUrAsMnqMmTHj5m7N1YQgsDz3cwGLYCYyuDRciV</code></td></tr><tr><td>Mezo</td><td><code>0x0f9b8E144Cc5C5e7C0073829Afd30F26A50c5606</code></td></tr><tr><td>Monad</td><td><code>0xC04dE634982cAdF2A677310b73630B7Ac56A3f65</code></td></tr><tr><td>Optimism Sepolia</td><td><code>0x5856651eB82aeb6979B4954317194d48e1891b3c</code></td></tr><tr><td>Plume</td><td><code>0x8fc2FbA8F962fbE89a9B02f03557a011c335A455</code></td></tr><tr><td>Seievm</td><td><code>0x25f1c923Fb7A5aEFA5F0A2b419fC70f2368e66e5</code></td></tr><tr><td>Sui</td><td><code>0x4000cfe2955d8355b3d3cf186f854fea9f787a457257056926fde1ec977670eb</code></td></tr><tr><td>XRPL-EVM</td><td><code>0x4d9525D94D275dEB495b7C8840b154Ae04cfaC2A</code></td></tr></tbody></table>

## Guardian Governance

=== "Mainnet"

    <table data-full-width="true" markdown><thead><th>Chain Name</th><th>Contract Address</th></thead><tbody>
    <tr><td>Solana</td><td><code>NGoD1yTeq5KaURrZo7MnCTFzTA4g62ygakJCnzMLCfm</code></td></tr>
    <tr><td>Ethereum</td><td><code>0x23Fea5514DFC9821479fBE18BA1D7e1A61f6FfCf</code></td></tr>
    <tr><td>Arbitrum</td><td><code>0x36CF4c88FA548c6Ad9fcDc696e1c27Bb3306163F</code></td></tr>
    <tr><td>Avalanche</td><td><code>0x169D91C797edF56100F1B765268145660503a423</code></td></tr>
    <tr><td>Base</td><td><code>0x838a95B6a3E06B6f11C437e22f3C7561a6ec40F1</code></td></tr>
    <tr><td>Fogo</td><td><code>ngoLQ35zgtP3SxWrjAJ8Mz2H8BPFVeZoxyBPotPYwnB</code></td></tr>
    <tr><td>HyperEVM :material-alert:{ title='⚠️ The HyperEVM integration is experimental, as its node software is not open source. Use Wormhole messaging on HyperEVM with caution.' }</td><td><code>0x574B7864119C9223A9870Ea614dC91A8EE09E512</code></td></tr>
    <tr><td>Optimism</td><td><code>0x0E09a3081837ff23D2e59B179E0Bc48A349Afbd8</code></td></tr>
    <tr><td>Monad</td><td><code>0x574B7864119C9223A9870Ea614dC91A8EE09E512</code></td></tr>
    <tr><td>Unichain</td><td><code>0x574b7864119c9223a9870ea614dc91a8ee09e512</code></td></tr>
    <tr><td>XRPL-EVM</td><td><code>0x574B7864119C9223A9870Ea614dC91A8EE09E512</code></td></tr>
    </tbody>
    </table>


=== "Testnet"

    
    <table data-full-width="true" markdown><thead><th>Chain Name</th><th>Contract Address</th></thead><tbody><tr><td>Ethereum Sepolia</td><td><code>0x9517F0164c1d089ad72E669E57b9088790966dBd</code></td></tr><tr><td>Arbitrum Sepolia</td><td><code>0x81b65A48DCAccBA04aCa3C055C4112b0715b90c0</code></td></tr><tr><td>Base Sepolia</td><td><code>0x720A59128B96Eda6EC2940c7899406E4dc56d0DC</code></td></tr><tr><td>Optimism Sepolia</td><td><code>0xcE1DE1eA4b040D324a07719043A6234C94fd0b5d</code></td></tr><tr><td>XRPL-EVM</td><td><code>0x574B7864119C9223A9870Ea614dC91A8EE09E512</code></td></tr></tbody></table>


!!! note
    Guardian-governed ownership contracts are used where an owner is required, without adding new trust assumptions. They only accept instructions signed by a quorum of Wormhole Guardians, validated on-chain by the Wormhole Core contracts. Implementations: [EVM](https://github.com/wormhole-foundation/native-token-transfers/blob/main/evm/src/wormhole/Governance.sol){target=\_blank} and [SVM](https://github.com/wormhole-foundation/native-token-transfers/blob/main/solana/programs/wormhole-governance/src/instructions/governance.rs){target=\_blank}.


## Read-Only Deployments

=== "Mainnet"

    <table data-full-width="true" markdown><thead><th>Chain Name</th><th>Contract Address</th></thead><tbody>
    <tr><td>Acala</td><td><code>0xa321448d90d4e5b0A732867c18eA198e75CAC48E</code></td></tr>
    <tr><td>Aurora</td><td><code>0x51b5123a7b0F9b2bA265f9c4C8de7D78D52f510F</code></td></tr>
    <tr><td>Blast</td><td><code>0xbebdb6C8ddC678FfA9f8748f85C815C556Dd8ac6</code></td></tr>
    <tr><td>Corn</td><td><code>0xa683c66045ad16abb1bCE5ad46A64d95f9A25785</code></td></tr>
    <tr><td>Gnosis</td><td><code>0xa321448d90d4e5b0A732867c18eA198e75CAC48E</code></td></tr>
    <tr><td>Goat</td><td><code>0x352A86168e6988A1aDF9A15Cb00017AAd3B67155</code></td></tr>
    <tr><td>Karura</td><td><code>0xa321448d90d4e5b0A732867c18eA198e75CAC48E</code></td></tr>
    <tr><td>LightLink</td><td><code>0x352A86168e6988A1aDF9A15Cb00017AAd3B67155</code></td></tr>
    <tr><td>Oasis</td><td><code>0xfE8cD454b4A1CA468B57D79c0cc77Ef5B6f64585</code></td></tr>
    <tr><td>Rootstock</td><td><code>0xbebdb6C8ddC678FfA9f8748f85C815C556Dd8ac6</code></td></tr>
    <tr><td>Sonic</td><td><code>0x352A86168e6988A1aDF9A15Cb00017AAd3B67155</code></td></tr>
    <tr><td>Telos</td><td><code>0x352A86168e6988A1aDF9A15Cb00017AAd3B67155</code></td></tr>
    <tr><td>Terra</td><td><code>terra1dq03ugtd40zu9hcgdzrsq6z2z4hwhc9tqk2uy5</code></td></tr>
    <tr><td>Terra 2.0</td><td><code>terra12mrnzvhx3rpej6843uge2yyfppfyd3u9c3uq223q8sl48huz9juqffcnhp</code></td></tr>
    <tr><td>SNAXchain</td><td><code>0xc1BA3CC4bFE724A08FbbFbF64F8db196738665f4</code></td></tr>
    <tr><td>XPLA</td><td><code>xpla1jn8qmdda5m6f6fqu9qv46rt7ajhklg40ukpqchkejcvy8x7w26cqxamv3w</code></td></tr>
    </tbody>
    </table>
!!! note  
    Read-only deployments allow Wormhole messages to be received on chains not fully integrated with Wormhole Guardians. These deployments support cross-chain data verification but cannot originate messages. For example, a governance message can be sent from a fully integrated chain and processed on a read-only chain, but the read-only chain cannot send messages back.


---

Page Title: Core Contract (EVM)

- Source (raw): https://raw.githubusercontent.com/wormhole-foundation/wormhole-docs/main/.ai/pages/products-messaging-reference-core-contract-evm.md
- Canonical (HTML): https://wormhole.com/docs/products/messaging/reference/core-contract-evm/
- Summary: Reference for the Wormhole Core contract on EVM chains. Covers the proxy structure, components, state variables, functions, events, and errors.

# Core Contract (EVM)

The [Wormhole Core Contract on EVM](https://github.com/wormhole-foundation/wormhole/blob/main/ethereum/contracts/Implementation.sol){target=\_blank} chains is a proxy-based contract responsible for receiving and verifying Wormhole messages (VAAs). It implements the messaging interface and delegates logic to upgradeable implementation contracts.

## Structure Overview

The Wormhole Core system consists of a proxy contract and a modular implementation constructed through layered inheritance.

```text
Wormhole.sol (Proxy)
└── Implementation.sol
    └── Governance.sol
        ├── Getters.sol
        ├── GovernanceStructs.sol
        ├── Messages.sol
        ├── Setters.sol
        └── Structs.sol
```

**Key Components:**

 - **Wormhole.sol**: The upgradeable proxy contract that delegates all logic to `Implementation.sol`.
 - **Implementation.sol**: The main logic contract, which handles message publication and initialization. Inherits from Governance.sol.
 - **Governance.sol**: Core governance logic for processing upgrades, setting fees, and updating the Guardian set. Also responsible for verifying governance VAAs and performing privileged actions.
 - **Getters.sol**: Exposes view functions to access internal contract state, such as current Guardian sets, fees, and contract configuration.
 - **GovernanceStructs.sol**: Provides structures and helpers for processing governance-related VAAs.
 - **Messages.sol**: Handles VAA parsing and verification.
 - **Setters.sol**: Contains internal functions for mutating contract state.
 - **Structs.sol**: Defines core data structures like GuardianSet and VM (VAA Message) used across multiple modules.

## State Variables

 - **`provider` ++"Structs.Provider"++**: Holds metadata like `chainId`, `governanceChainId`, and `governanceContract`. This is a nested struct.
 - **`guardianSets` ++"mapping(uint32 => GuardianSet)"++**: Mapping of all Guardian sets by index.
 - **`guardianSetIndex` ++"uint32"++**: Index of the currently active Guardian set.
 - **`guardianSetExpiry` ++"uint32"++**: How long a Guardian set remains valid after it's replaced (in seconds).
 - **`sequences` ++"mapping(address => uint64)"++**: Tracks message sequences per emitter (used to enforce message ordering).
 - **`consumedGovernanceActions` ++"mapping(bytes32 => bool)"++**: Used to prevent governance VAAs from being reused (replay protection).
 - **`initializedImplementations` ++"mapping(address => bool)"++**: Tracks which implementation addresses have been initialized (for upgrade safety).
 - **`messageFee` ++"uint256"++**: The amount (in native gas token) required to post a message. Set via governance.
 - **`evmChainId` ++"uint256"++**: The actual EVM chain ID (e.g., 1 for Ethereum, 10 for Optimism). Used in fork recovery.

## Events

### LogMessagePublished

Emitted when a message is published via `publishMessage`. *(Defined in [Implementation.sol](https://github.com/wormhole-foundation/wormhole/blob/main/ethereum/contracts/Implementation.sol){target=\_blank})*

```solidity
event LogMessagePublished(
    address indexed sender,
    uint64 sequence,
    uint32 nonce,
    bytes payload,
    uint8 consistencyLevel
)
```

??? interface "Parameters"

    `sender` ++"address"++  

    Address that called `publishMessage`.

    ---

    `sequence` ++"uint64"++

    The sequence number of the message.

    ---

    `nonce` ++"uint32"++

    The provided nonce.

    ---

    `payload` ++"bytes"++

    The payload that was published.

    ---

    `consistencyLevel` ++"uint8"++

    Finality level requested.

### ContractUpgraded

Emitted when the Core Contract is upgraded to a new implementation via governance. *(Defined in [Governance.sol](https://github.com/wormhole-foundation/wormhole/blob/main/ethereum/contracts/Governance.sol){target=\_blank})*

```solidity
event ContractUpgraded(
    address indexed oldContract,
    address indexed newContract
)
```

??? interface "Parameters"

    `oldContract` ++"address"++

    The address of the previous implementation.

    ---

    `newContract` ++"address"++

    The address of the new implementation.

### GuardianSetAdded

Emitted when a new Guardian set is registered via governance. *(Defined in [Governance.sol](https://github.com/wormhole-foundation/wormhole/blob/main/ethereum/contracts/Governance.sol){target=\_blank})*

```solidity
event GuardianSetAdded(
    uint32 indexed index
)
```

??? interface "Parameters"

    `index` ++"uint32"++

    Index of the newly added Guardian set.

### LogGuardianSetChanged

Emitted when the active Guardian set is changed. *(Defined in [State.sol](https://github.com/wormhole-foundation/wormhole/blob/main/ethereum/contracts/State.sol){target=\_blank})*

```solidity
event LogGuardianSetChanged(
    uint32 oldGuardianIndex,
    uint32 newGuardianIndex
)
```

??? interface "Parameters"

    `oldGuardianIndex` ++"uint32"++

    The previous active Guardian set index.

    ---

    `newGuardianIndex` ++"uint32"++

    The new active Guardian set index.

## Functions

### publishMessage

Publishes a message to Wormhole's Guardian Network. *(Defined in [Implementation.sol](https://github.com/wormhole-foundation/wormhole/blob/main/ethereum/contracts/Implementation.sol){target=\_blank})*

```solidity
function publishMessage(
    uint32 nonce,
    bytes memory payload,
    uint8 consistencyLevel
) public payable returns (uint64 sequence)
```

??? interface "Parameters"

    `nonce` ++"uint32"++

    Custom sequence identifier for the emitter.

    ---

    `payload` ++"bytes"++

    Arbitrary user data to be included in the message.

    ---

    `consistencyLevel` ++"uint8"++

    Finality requirement for Guardian attestation (e.g., safe or finalized).

??? interface "Returns"

    `sequence` ++"uint64"++

    Unique sequence number assigned to this message.

### getCurrentGuardianSetIndex

Returns the index of the currently active Guardian set. *(Defined in [Getters.sol](https://github.com/wormhole-foundation/wormhole/blob/main/ethereum/contracts/Getters.sol){target=\_blank})*

Each VAA includes the index of the Guardian set that signed it. This function allows contracts to retrieve the current index, ensuring the VAA is verified against the correct set.

```solidity
function getCurrentGuardianSetIndex() external view returns (uint32)
```

??? interface "Returns"

    `index` ++"uint32"++

    The index of the active Guardian set used to verify signatures.

### getGuardianSet

Retrieves metadata for a given Guardian set index. *(Defined in [Getters.sol](https://github.com/wormhole-foundation/wormhole/blob/main/ethereum/contracts/Getters.sol){target=\_blank})*

```solidity
function getGuardianSet(uint32 index) external view returns (address[] memory keys, uint32 expirationTime)
```

??? interface "Parameters"

    `index` ++"uint32"++

    Guardian set index to query.

??? interface "Returns"

    `keys` ++"address[]"++

    Public keys of the guardians in this set.

    ---

    `expirationTime` ++"uint32"++

    Timestamp after which the Guardian set is considered expired.

### getGuardianSetExpiry

Returns the expiration time of a specific Guardian set index. *(Defined in [Getters.sol](https://github.com/wormhole-foundation/wormhole/blob/main/ethereum/contracts/Getters.sol){target=\_blank})*

```solidity
function getGuardianSetExpiry(uint32 index) external view returns (uint32)
```

??? interface "Parameters"

    `index` ++"uint32"++

    The index of the Guardian set to query.

??? interface "Returns"

    `expiry` ++"uint32"++

    UNIX timestamp after which the set is no longer valid.

### messageFee

Returns the current fee (in native tokens) required to publish a message. *(Defined in [Getters.sol](https://github.com/wormhole-foundation/wormhole/blob/main/ethereum/contracts/Getters.sol){target=\_blank})*

```solidity
function messageFee() public view returns (uint256)
```

??? interface "Returns"

    `fee` ++"uint256"++

    Fee in Wei required to publish a message successfully. Must be sent as `msg.value`.

### nextSequence

Retrieves the next sequence number for a given emitter address. *(Defined in [Getters.sol](https://github.com/wormhole-foundation/wormhole/blob/main/ethereum/contracts/Getters.sol){target=\_blank})*

```solidity
function nextSequence(address emitter) external view returns (uint64)
```

??? interface "Parameters"

    `emitter` ++"address"++

    The address for which the next sequence will be issued.

??? interface "Returns"

    `sequence` ++"uint64"++

    The next sequence number for the specified emitter.

### parseAndVerifyVM

Verifies signatures and parses a signed VAA. *(Defined in [Messages.sol](https://github.com/wormhole-foundation/wormhole/blob/main/ethereum/contracts/Messages.sol){target=\_blank})*

```solidity
function parseAndVerifyVM(bytes memory encodedVM)
    external
    view
    returns (
        VM memory vm,
        bool valid,
        string memory reason
    )
```

??? interface "Parameters"

    `encodedVM` ++"bytes"++

    Serialized signed VAA from Guardians.

??? interface "Returns"

    `vm` ++"VM memory"++

    Full parsed VAA contents

    ---

    `valid` ++"bool"++

    Whether the VAA is valid according to the current Guardian set.

    ---

    `reason` ++"string"++

    Reason for invalidity if `valid` is false (invalid).

### verifyVM

Performs low-level VAA signature verification. *(Defined in [Messages.sol](https://github.com/wormhole-foundation/wormhole/blob/main/ethereum/contracts/Messages.sol){target=\_blank})*

```solidity
function verifyVM(bytes memory encodedVM)
    public view returns (bool isValid, string memory reason)
```

??? interface "Parameters"

    `encodedVM` ++"bytes"++

    Serialized signed VAA to verify.

??? interface "Returns"

    `isValid` ++"bool"++

    `true` if the signatures are valid and meet the quorum.

    ---

    `reason` ++"string"++

    Explanation for failure if `isValid` is `false`.

### verifySignatures

Used to verify individual Guardian signatures against a VAA digest. *(Defined in [Messages.sol](https://github.com/wormhole-foundation/wormhole/blob/main/ethereum/contracts/Messages.sol){target=\_blank})*

```solidity
function verifySignatures(
    bytes32 hash,
    Structs.Signature[] memory signatures,
    GuardianSet memory guardianSet
) public view returns (bool)
```

??? interface "Parameters"

    `hash` ++"bytes32"++

    The message digest to verify.

    ---

    `signatures` ++"Structs.Signature[]"++

    An array of Guardian signatures.

    ---

    `guardianSet` ++"GuardianSet memory"++

    Guardian set to validate against.

??? interface "Returns"

    `isValid` ++"bool"++

    `true` if the required number of valid signatures is present.

### quorum

Returns the number of Guardian signatures required to reach quorum. *(Defined in [Governance.sol](https://github.com/wormhole-foundation/wormhole/blob/main/ethereum/contracts/Governance.sol){target=\_blank})*

```solidity
function quorum() public view returns (uint8)
```

??? interface "Returns"

    `quorum` ++"uint8"++

    Number of valid Guardian signatures required to reach consensus for VAA verification.

### chainId

Returns Wormhole chain ID used internally by the protocol. *(Defined in [Getters.sol](https://github.com/wormhole-foundation/wormhole/blob/main/ethereum/contracts/Getters.sol){target=\_blank})*

```solidity
function chainId() public view returns (uint16)
```

??? interface "Returns"

    `id` ++"uint16"++

    Wormhole-specific chain identifier. 

### evmChainId

Returns the EVM chain ID (i.e., value from `block.chainid`). *(Defined in [Getters.sol](https://github.com/wormhole-foundation/wormhole/blob/main/ethereum/contracts/Getters.sol){target=\_blank})*

```solidity
function evmChainId() public view returns (uint256)
```

??? interface "Returns"

    `id` ++"uint256"++

    Native EVM chain ID for the current network.

## Errors

### Invalid Fee

Reverts when the message fee (`msg.value`) sent is not equal to the required fee returned by `messageFee()`. *(Defined in [Implementation.sol](https://github.com/wormhole-foundation/wormhole/blob/main/ethereum/contracts/Implementation.sol){target=\_blank})*

### Unsupported

Reverts on any call to the fallback function. The contract does not support arbitrary calls. *(Defined in [Implementation.sol](https://github.com/wormhole-foundation/wormhole/blob/main/ethereum/contracts/Implementation.sol){target=\_blank})*

### The Wormhole Contract Does Not Accept Assets

Reverts when native tokens (ETH) are sent directly to the contract via the `receive()` function. *(Defined in [Implementation.sol](https://github.com/wormhole-foundation/wormhole/blob/main/ethereum/contracts/Implementation.sol){target=\_blank})*

### Already Initialized

Reverts when trying to call `initialize()` on an implementation that has already been initialized. *(Defined in [Implementation.sol](https://github.com/wormhole-foundation/wormhole/blob/main/ethereum/contracts/Implementation.sol){target=\_blank}, via `initializer` modifier)*

### Unknown Chain ID

Reverts inside the `initialize()` function if the chain ID stored by the contract does not match any known Wormhole chain. *(Defined in [Implementation.sol](https://github.com/wormhole-foundation/wormhole/blob/main/ethereum/contracts/Implementation.sol){target=\_blank})*

### Invalid Fork

Reverts when attempting to perform a governance action intended only for forked chains on a non-forked chain. *(Defined in [Governance.sol](https://github.com/wormhole-foundation/wormhole/blob/main/ethereum/contracts/Governance.sol){target=\_blank})*

### Invalid Module

Reverts if the VAA’s module field doesn’t match the expected "Core" module. *(Defined in [Governance.sol](https://github.com/wormhole-foundation/wormhole/blob/main/ethereum/contracts/Governance.sol){target=\_blank})*

### Invalid Chain

Reverts if the VAA’s target chain doesn’t match the chain on which this contract is deployed. *(Defined in [Governance.sol](https://github.com/wormhole-foundation/wormhole/blob/main/ethereum/contracts/Governance.sol){target=\_blank})*

### New Guardian Set is Empty

Reverts when trying to register a new Guardian set that has no keys. *(Defined in [Governance.sol](https://github.com/wormhole-foundation/wormhole/blob/main/ethereum/contracts/Governance.sol){target=\_blank})*

### Index Must Increase in Steps of 1

Reverts when the new Guardian set index is not exactly one greater than the current. *(Defined in [Governance.sol](https://github.com/wormhole-foundation/wormhole/blob/main/ethereum/contracts/Governance.sol){target=\_blank})*

### Not a Fork

Reverts when trying to recover chain ID on a non-forked chain. *(Defined in [Governance.sol](https://github.com/wormhole-foundation/wormhole/blob/main/ethereum/contracts/Governance.sol){target=\_blank})*

### Invalid EVM Chain

Reverts if the recovered chain ID doesn't match the current `block.chainid`. *(Defined in [Governance.sol](https://github.com/wormhole-foundation/wormhole/blob/main/ethereum/contracts/Governance.sol){target=\_blank})*

### Governance Action Already Consumed

Reverts when the same governance VAA is submitted more than once. *(Defined in [Governance.sol](https://github.com/wormhole-foundation/wormhole/blob/main/ethereum/contracts/Governance.sol){target=\_blank})*

### Wrong Governance Contract

Reverts when the governance VAA’s emitter address doesn't match the expected governance contract address. *(Defined in [Governance.sol](https://github.com/wormhole-foundation/wormhole/blob/main/ethereum/contracts/Governance.sol){target=\_blank})*

### Wrong Governance Chain

Reverts when the governance VAA’s emitter chain doesn't match the expected governance chain (Solana). *(Defined in [Governance.sol](https://github.com/wormhole-foundation/wormhole/blob/main/ethereum/contracts/Governance.sol){target=\_blank})*

### Not Signed by Current Guardian Set

Reverts if the Guardian set index in the VAA doesn’t match the current Guardian set. *(Defined in [Governance.sol](https://github.com/wormhole-foundation/wormhole/blob/main/ethereum/contracts/Governance.sol){target=\_blank})*


---

Page Title: Core Contract (Solana)

- Source (raw): https://raw.githubusercontent.com/wormhole-foundation/wormhole-docs/main/.ai/pages/products-messaging-reference-core-contract-solana.md
- Canonical (HTML): https://wormhole.com/docs/products/messaging/reference/core-contract-solana/
- Summary: Reference for the Wormhole Core program on Solana. Covers architecture, PDA accounts, and instructions for posting, verifying, and processing VAAs.

# Core Contract (Solana)

The [Wormhole Core Program on Solana](https://github.com/wormhole-foundation/wormhole/blob/main/solana/bridge/program/src/lib.rs){target=\_blank} is a native Solana program responsible for posting, verifying, and relaying Wormhole messages (VAAs). It implements core messaging functionality, Guardian set updates, and upgradeability.

## Structure Overview

The Wormhole Core program on Solana is implemented using modular Rust files. Logic is separated across instruction dispatch, account definitions, core types, and signature verification.

```text
lib.rs
├── instructions.rs
├── accounts.rs
├── api.rs
│   ├── post_message
│   ├── verify_signatures
│   ├── post_vaa
│   ├── upgrade_contract
│   └── upgrade_guardian_set
├── types.rs
└── vaa.rs
```

**Key Components:**

 - **lib.rs**: Program entry point and instruction dispatcher. Registers all handlers and exposes the on-chain processor.
 - **instructions.rs**: Defines the `WormholeInstruction` enum and maps it to individual instruction handlers.
 - **accounts.rs**: Specifies the account constraints and validation logic for each instruction.
 - **api.rs**: Contains the main logic for processing instructions such as message posting, VAA verification, upgrades, and governance actions.
 - **types.rs**: Defines shared structs and enums used throughout the program, including configuration and `GuardianSet` formats.
 - **vaa.rs**: Implements VAA parsing, hashing, and signature-related logic used to verify Wormhole messages.
 - **error.rs** (not listed above): Defines custom error types used across the program for precise failure handling.
 - **wasm.rs** (not listed above): Provides WebAssembly bindings for testing and external tooling; not used on-chain.

## State Accounts

Below are on-chain PDAs used to store persistent state for the core contract. All are derived using deterministic seeds with the program ID.

 - **`bridge` ++"BridgeData"++**: Stores global config like the active Guardian set index, message fee, and Guardian set expiration time. (Derived at PDA seed `["Bridge"]`)
 - **`guardianSets` ++"GuardianSetData"++**: Mapping of Guardian sets by index. Each Guardian set includes public key hashes and creation/expiration times. (Derived at PDA seed `["GuardianSet", index]`)
 - **`sequences` ++"SequenceTracker"++**: Tracks the last sequence number used by each emitter, enforcing strict message ordering. (Derived at PDA seed `["Sequence", emitter]`)
 - **`postedVAAs` ++"PostedVAAData"++**: Stores verified and finalized VAAs, preventing replay. (Derived at PDA seed `["PostedVAA", hash]`)
 - **`claims` ++"ClaimData"++**: Tracks consumed governance VAAs to ensure replay protection. (Derived at PDA seed `["Claim", emitter, sequence]`)
 - **`feeCollector` ++"FeeCollector"++**: Holds lamports collected via message fees, and can be drained via governance. (Derived at PDA seed `["fee_collector"]`)

## Instructions

### initialize

Initializes the Wormhole Core contract on Solana with a Guardian set and fee configuration. This should be called only once at deployment time. *(Defined in [api/initialize.rs](https://github.com/wormhole-foundation/wormhole/blob/main/solana/bridge/program/src/api/initialize.rs){target=\_blank})*

```rust
initialize(
    payer: Pubkey,
    fee: u64,
    guardian_set_expiration_time: u32,
    initial_guardians: &[[u8; 20]]
)
```

??? interface "Accounts"

    - **`Bridge`**: PDA to store global configuration.
    - **`GuardianSet`**: PDA for Guardian set at index 0.
    - **`FeeCollector`**: PDA to collect message posting fees.
    - **`Payer`**: Funds account creation.
    - **`Clock`, `Rent`, `SystemProgram`**: Solana system accounts.

??? interface "Parameters"

    `fee` ++"u64"++

    Fee in lamports required to post messages.

    ---

    `guardian_set_expiration_time` ++"u32"++

    Time in seconds after which the Guardian set expires.

    ---

    `initial_guardians` ++"[[u8; 20]]"++

    List of Guardian public key hashes (Ethereum-style addresses).

### post_message

Posts a Wormhole message to the Solana Core contract. *(Defined in [api/post_message.rs](https://github.com/wormhole-foundation/wormhole/blob/main/solana/bridge/program/src/api/post_message.rs){target=\_blank})*

```rust
PostMessage {
    nonce: u32,
    payload: Vec<u8>,
    consistency_level: u8
}
```

??? interface "Accounts"

    - **`Bridge`**: PDA for global config.
    - **`Message`**: PDA where the posted message will be stored.
    - **`Emitter`**: The emitting account (must sign).
    - **`Sequence`**: PDA tracking the emitter’s message sequence.
    - **`Payer`**: Pays for account creation and fees.
    - **`FeeCollector`**: PDA that collects message fees.
    - **`Clock`, `Rent`, `SystemProgram`**: Solana system accounts.

??? interface "Parameters"

    `nonce` ++"u32"++

    Unique nonce to disambiguate messages with the same payload.

    ---

    `payload` ++"Vec<u8>"++

    The arbitrary message payload to be posted.

    ---

    `consistency_level` ++"u8"++

    Level of finality required before the message is processed.

    `1` = Confirmed, `32` = Finalized.

### post_message_unreliable

Posts a Wormhole message without requiring reliable delivery. Used for lightweight publishing when finality isn't critical. *(Defined in [api/post_message.rs](https://github.com/wormhole-foundation/wormhole/blob/main/solana/bridge/program/src/api/post_message.rs){target=\_blank})*

```rust
PostMessageUnreliable {
    nonce: u32,
    payload: Vec<u8>,
    consistency_level: u8
}
```

??? interface "Accounts"

    - **`Bridge`**: PDA for global config.
    - **`Message`**: PDA where the posted message will be stored.
    - **`Emitter`**: The emitting account (must sign).
    - **`Sequence`**: PDA tracking the emitter’s message sequence.
    - **`Payer`**: Pays for account creation and fees.
    - **`FeeCollector`**: PDA that collects message fees.
    - **`Clock`, `Rent`, `SystemProgram`**: Solana system accounts.

??? interface "Parameters"

    `nonce` ++"u32"++

    Unique nonce to disambiguate messages with the same payload.

    ---

    `payload` ++"Vec<u8>"++

    The arbitrary message payload to be posted.

    ---

    `consistency_level` ++"u8"++

    Level of finality required before the message is processed. `1` = Confirmed, `32` = Finalized.

### verify_signatures

Verifies Guardian signatures over a VAA body hash. This is the first step in VAA processing and is required before posting the VAA. *(Defined in [api/verify_signature.rs](https://github.com/wormhole-foundation/wormhole/blob/main/solana/bridge/program/src/api/verify_signature.rs){target=\_blank})*

```rust
VerifySignatures {
    signers: [i8; 19]
}
```

??? interface "Accounts"

    - **`Payer`**: Pays for account creation and fees.
    - **`GuardianSet`**: PDA holding the current Guardian set.
    - **`SignatureSet`**: PDA that will store the verified signature data.
    - **`InstructionsSysvar`**: Required to access prior instructions (e.g., secp256k1 sigverify).
    - **`Rent`, `SystemProgram`**: Solana system accounts.

??? interface "Parameters"

    `signers` ++"[i8; 19]"++

    A mapping from Guardian index to its position in the instruction payload (or -1 if not present).

    Used to correlate secp256k1 verify instructions with Guardian set entries.

### post_vaa

Finalizes a VAA after signature verification. This stores the message on-chain and marks it as consumed. *(Defined in [api/post_vaa.rs](https://github.com/wormhole-foundation/wormhole/blob/main/solana/bridge/program/src/api/post_vaa.rs){target=\_blank})*

```rust
PostVAA {
    version: u8,
    guardian_set_index: u32,
    timestamp: u32,
    nonce: u32,
    emitter_chain: u16,
    emitter_address: [u8; 32],
    sequence: u64,
    consistency_level: u8,
    payload: Vec<u8>
}
```

??? interface "Accounts"

    - **`GuardianSet`**: PDA of the Guardian set used to verify the VAA.
    - **`Bridge`**: Global Wormhole state.
    - **`SignatureSet`**: Verified signature PDA (from verify_signatures).
    - **`PostedVAA`**: PDA where the VAA will be stored.
    - **`Payer`**: Funds the account creation.
    - **`Clock`, `Rent`, `SystemProgram`**: Solana system accounts.

??? interface "Parameters"

    `version` ++"u8"++

    VAA protocol version.

    ---

    `guardian_set_index` ++"u32"++

    Index of the Guardian Set that signed this VAA.

    ---

    `timestamp` ++"u32"++

    The time the emitter submitted the message.

    ---

    `nonce` ++"u32"++

    Unique identifier for the message.

    ---

    `emitter_chain` ++"u16"++

    ID of the chain where the message originated.

    ---

    `emitter_address` ++"[u8; 32]"++

    Address of the contract or account that emitted the message.

    ---

    `sequence` ++"u64"++

    Monotonically increasing sequence number for the emitter.

    ---

    `consistency_level` ++"u8"++

    Required confirmation level before the message is accepted.
    
    `1` = Confirmed, `32` = Finalized.

    ---

    `payload` ++"Vec<u8>"++

    Arbitrary data being transferred in the message.

### set_fees

Updates the message posting fee for the core bridge contract. *(Defined in [api/governance.rs](https://github.com/wormhole-foundation/wormhole/blob/main/solana/bridge/program/src/api/governance.rs){target=\_blank})*

```rust
SetFees {}
```

This function is called via governance and requires a valid governance VAA. The VAA payload must contain the new fee value.

??? interface "Accounts"

    - **`Payer`**: Funds transaction execution.
    - **`Bridge`**: PDA storing global Wormhole state.
    - **`Message`**: The PostedVAA account containing the governance message.
    - **`Claim`**: PDA that ensures this governance message hasn't been processed already.
    - **`SystemProgram`**: Required by Solana for creating/initializing accounts.

### transfer_fees

Transfers the accumulated message posting fees from the contract to a specified recipient. *(Defined in [api/governance.rs](https://github.com/wormhole-foundation/wormhole/blob/main/solana/bridge/program/src/api/governance.rs){target=\_blank})*

```rust
TransferFees {}
```

This function is triggered via a governance VAA and transfers the fee balance from the `FeeCollector` to the recipient address specified in the VAA payload.

??? interface "Accounts"

    - **`Payer`**: Funds transaction execution.
    - **`Bridge`**: PDA storing global Wormhole state.
    - **`Message`**: PostedVAA account containing the governance message.
    - **`FeeCollector`**: PDA holding the accumulated fees.
    - **`Recipient`**: The account that will receive the fees.
    - **`Claim`**: PDA that ensures this governance message hasn't been processed already.
    - **`Rent`, `SystemProgram`**: Standard Solana system accounts.

### upgrade_contract

Upgrades the deployed Wormhole program using a governance VAA. *(Defined in [api/governance.rs](https://github.com/wormhole-foundation/wormhole/blob/main/solana/bridge/program/src/api/governance.rs){target=\_blank})*

```rust
UpgradeContract {}
```

This instruction allows authorized governance messages to trigger an upgrade of the on-chain Wormhole program logic to a new address.

??? interface "Accounts"

    - **`Payer`**: Funds transaction execution.
    - **`Bridge`**: PDA storing global Wormhole state.
    - **`Message`**: PostedVAA account containing the governance message.
    - **`Claim`**: PDA that ensures this governance message hasn't been processed already.
    - **`UpgradeAuthority`**: PDA with authority to perform the upgrade (seeded with "upgrade").
    - **`Spill`**: Account that receives remaining funds from the upgrade buffer.
    - **`NewContract`**: Account holding the new program data.
    - **`ProgramData`**: Metadata account for the upgradable program.
    - **`Program`**: Current program to be upgraded.
    - **`Rent`, `Clock`**: System accounts used during the upgrade process.
    - **`BPFLoaderUpgradeable`**: Solana system program for upgrades.
    - **`SystemProgram`**: Required by Solana for creating/initializing accounts.

### upgrade_guardian_set

Upgrades the current Guardian set using a governance VAA. *(Defined in [api/governance.rs](https://github.com/wormhole-foundation/wormhole/blob/main/solana/bridge/program/src/api/governance.rs){target=\_blank})*

```rust
UpgradeGuardianSet {}
```

This instruction replaces the active Guardian set with a new one, allowing the Wormhole network to rotate its validator keys securely through governance.

??? interface "Accounts"

    - **`Payer`**: Funds transaction execution.
    - **`Bridge`**: PDA storing global Wormhole state.
    - **`Message`**: PostedVAA account containing the governance message.
    - **`Claim`**: PDA that ensures this governance message hasn't been processed already.
    - **`GuardianSetOld`**: Current (active) Guardian set PDA.
    - **`GuardianSetNew`**: PDA for the newly proposed Guardian set.
    - **`SystemProgram`**: Standard Solana system accounts.

## Errors

### GuardianSetMismatch

The Guardian set index does not match the expected value. *(Defined in [error.rs](https://github.com/wormhole-foundation/wormhole/blob/main/solana/bridge/program/src/error.rs){target=\_blank})*

### InstructionAtWrongIndex

The instruction was found at the wrong index. *(Defined in [error.rs](https://github.com/wormhole-foundation/wormhole/blob/main/solana/bridge/program/src/error.rs){target=\_blank})*

### InsufficientFees

Insufficient fees were provided to post the message. *(Defined in [error.rs](https://github.com/wormhole-foundation/wormhole/blob/main/solana/bridge/program/src/error.rs){target=\_blank})*

### InvalidFeeRecipient

The recipient address does not match the one specified in the governance VAA. *(Defined in [error.rs](https://github.com/wormhole-foundation/wormhole/blob/main/solana/bridge/program/src/error.rs){target=\_blank})*

### InvalidGovernanceAction

The action specified in the governance payload is invalid. *(Defined in [error.rs](https://github.com/wormhole-foundation/wormhole/blob/main/solana/bridge/program/src/error.rs){target=\_blank})*

### InvalidGovernanceChain

The governance VAA was not emitted by a valid governance chain. *(Defined in [error.rs](https://github.com/wormhole-foundation/wormhole/blob/main/solana/bridge/program/src/error.rs){target=\_blank})*

### InvalidGovernanceKey

The emitter address in the governance VAA is not the expected governance key. *(Defined in [error.rs](https://github.com/wormhole-foundation/wormhole/blob/main/solana/bridge/program/src/error.rs){target=\_blank})*

### InvalidGovernanceModule

The module string in the governance VAA header is invalid. *(Defined in [error.rs](https://github.com/wormhole-foundation/wormhole/blob/main/solana/bridge/program/src/error.rs){target=\_blank})*

### InvalidGovernanceWithdrawal

Fee withdrawal would cause the fee collector account to drop below rent-exempt balance. *(Defined in [error.rs](https://github.com/wormhole-foundation/wormhole/blob/main/solana/bridge/program/src/error.rs){target=\_blank})*

### InvalidGuardianSetUpgrade

The Guardian set upgrade VAA is invalid (e.g., skipped index or mismatched current index). *(Defined in [error.rs](https://github.com/wormhole-foundation/wormhole/blob/main/solana/bridge/program/src/error.rs){target=\_blank})*

### InvalidHash

The hash computed from the VAA does not match the expected result. *(Defined in [error.rs](https://github.com/wormhole-foundation/wormhole/blob/main/solana/bridge/program/src/error.rs){target=\_blank})*

### InvalidSecpInstruction

The SECP256k1 instruction used for signature verification is malformed. *(Defined in [error.rs](https://github.com/wormhole-foundation/wormhole/blob/main/solana/bridge/program/src/error.rs){target=\_blank})*

### MathOverflow

An arithmetic overflow occurred during computation. *(Defined in [error.rs](https://github.com/wormhole-foundation/wormhole/blob/main/solana/bridge/program/src/error.rs){target=\_blank})*

### PostVAAConsensusFailed

Not enough valid signatures were collected to achieve quorum. *(Defined in [error.rs](https://github.com/wormhole-foundation/wormhole/blob/main/solana/bridge/program/src/error.rs){target=\_blank})*

### PostVAAGuardianSetExpired

The Guardian set used to verify the VAA has already expired. *(Defined in [error.rs](https://github.com/wormhole-foundation/wormhole/blob/main/solana/bridge/program/src/error.rs){target=\_blank})*

### TooManyGuardians

The Guardian set exceeds the maximum allowed number of guardians. *(Defined in [error.rs](https://github.com/wormhole-foundation/wormhole/blob/main/solana/bridge/program/src/error.rs){target=\_blank})*

### VAAAlreadyExecuted

The VAA has already been executed and cannot be processed again. *(Defined in [error.rs](https://github.com/wormhole-foundation/wormhole/blob/main/solana/bridge/program/src/error.rs){target=\_blank})*

### VAAInvalid

The VAA is structurally invalid or fails to decode. *(Defined in [error.rs](https://github.com/wormhole-foundation/wormhole/blob/main/solana/bridge/program/src/error.rs){target=\_blank})*

### InvalidPayloadLength

The payload length is incorrect or malformed. *(Defined in [error.rs](https://github.com/wormhole-foundation/wormhole/blob/main/solana/bridge/program/src/error.rs){target=\_blank})*

### EmitterChanged

The emitter address changed unexpectedly. *(Defined in [error.rs](https://github.com/wormhole-foundation/wormhole/blob/main/solana/bridge/program/src/error.rs){target=\_blank})*


---

Page Title: Executor Addresses

- Source (raw): https://raw.githubusercontent.com/wormhole-foundation/wormhole-docs/main/.ai/pages/products-messaging-reference-executor-addresses.md
- Canonical (HTML): https://wormhole.com/docs/products/messaging/reference/executor-addresses/
- Summary: Reference list of deployed Executor contract addresses across integrations, including CCTP, NTT, WTT, and referrer variants.

# Executor Addresses

## Executor



=== "Mainnet"

    <table data-full-width="true" markdown><thead><th>Chain Name</th><th>Contract Address</th></thead><tbody><tr><td>Ethereum</td><td><code>0x84EEe8dBa37C36947397E1E11251cA9A06Fc6F8a</code></td></tr><tr><td>Solana</td><td><code>execXUrAsMnqMmTHj5m7N1YQgsDz3cwGLYCYyuDRciV</code></td></tr><tr><td>Aptos</td><td><code>0x11aa75c059e1a7855be66b931bf340a2e0973274ac16b5f519c02ceafaf08a18</code></td></tr><tr><td>Arbitrum</td><td><code>0x3980f8318fc03d79033Bbb421A622CDF8d2Eeab4</code></td></tr><tr><td>Avalanche</td><td><code>0x4661F0E629E4ba8D04Ee90080Aee079740B00381</code></td></tr><tr><td>Base</td><td><code>0x9E1936E91A4a5AE5A5F75fFc472D6cb8e93597ea</code></td></tr><tr><td>Berachain</td><td><code>0x0Dd7a5a32311b8D87A615Cc7f079B632D3d5e2D3</code></td></tr><tr><td>BNB Smart Chain</td><td><code>0xeC8cCCD058DbF28e5D002869Aa9aFa3992bf4ee0</code></td></tr><tr><td>Celo</td><td><code>0xe6Ea5087c6860B94Cf098a403506262D8F28cF05</code></td></tr><tr><td>CreditCoin</td><td><code>0xd2e420188f17607Aa6344ee19c3e76Cf86CA7BDe</code></td></tr><tr><td>Fogo</td><td><code>execXUrAsMnqMmTHj5m7N1YQgsDz3cwGLYCYyuDRciV</code></td></tr><tr><td>HyperEVM :material-alert:{ title='⚠️ The HyperEVM integration is experimental, as its node software is not open source. Use Wormhole messaging on HyperEVM with caution.' }</td><td><code>0xd7717899cc4381033Bc200431286D0AC14265F78</code></td></tr><tr><td>Ink</td><td><code>0x3e44a5F45cbD400acBEF534F51e616043B211Ddd</code></td></tr><tr><td>Linea</td><td><code>0x23aF2B5296122544A9A7861da43405D5B15a9bD3</code></td></tr><tr><td>Mezo</td><td><code>0x0f9b8E144Cc5C5e7C0073829Afd30F26A50c5606</code></td></tr><tr><td>Monad</td><td><code>0xC04dE634982cAdF2A677310b73630B7Ac56A3f65</code></td></tr><tr><td>Moonbeam</td><td><code>0x85D06449C78064c2E02d787e9DC71716786F8D19</code></td></tr><tr><td>Optimism</td><td><code>0x85B704501f6AE718205C0636260768C4e72ac3e7</code></td></tr><tr><td>Polygon</td><td><code>0x0B23efA164aB3eD08e9a39AC7aD930Ff4F5A5e81</code></td></tr><tr><td>Scroll</td><td><code>0xcFAdDE24640e395F5A71456A825D0D7C3741F075</code></td></tr><tr><td>Seievm</td><td><code>0x25f1c923fb7a5aefa5f0a2b419fc70f2368e66e5</code></td></tr><tr><td>Sonic</td><td><code>0x3Fdc36b4260Da38fBDba1125cCBD33DD0AC74812</code></td></tr><tr><td>Sui</td><td><code>0xdb0fe8bb1e2b5be628adbea0636063325073e1070ee11e4281457dfd7f158235</code></td></tr><tr><td>Unichain</td><td><code>0x764dD868eAdD27ce57BCB801E4ca4a193d231Aed</code></td></tr><tr><td>World Chain</td><td><code>0x8689b4E6226AdC8fa8FF80aCc3a60AcE31e8804B</code></td></tr><tr><td>XRPL-EVM</td><td><code>0x8345E90Dcd92f5Cf2FAb0C8E2A56A5bc2c30d896</code></td></tr></tbody></table>

=== "Testnet"

    <table data-full-width="true" markdown><thead><th>Chain Name</th><th>Contract Address</th></thead><tbody><tr><td>Ethereum Sepolia</td><td><code>0xD0fb39f5a3361F21457653cB70F9D0C9bD86B66B</code></td></tr><tr><td>Solana</td><td><code>execXUrAsMnqMmTHj5m7N1YQgsDz3cwGLYCYyuDRciV</code></td></tr><tr><td>Aptos</td><td><code>0x139717c339f08af674be77143507a905aa28cbc67a0e53e7095c07b630d73815</code></td></tr><tr><td>Arbitrum Sepolia</td><td><code>0xBF161de6B819c8af8f2230Bcd99a9B3592f6F87b</code></td></tr><tr><td>Avalanche</td><td><code>0x4661F0E629E4ba8D04Ee90080Aee079740B00381</code></td></tr><tr><td>Base Sepolia</td><td><code>0x51B47D493CBA7aB97e3F8F163D6Ce07592CE4482</code></td></tr><tr><td>Converge</td><td><code>0xAab9935349B9c08e0e970720F6D640d5B91C293E</code></td></tr><tr><td>Fogo</td><td><code>execXUrAsMnqMmTHj5m7N1YQgsDz3cwGLYCYyuDRciV</code></td></tr><tr><td>Mezo</td><td><code>0x0f9b8E144Cc5C5e7C0073829Afd30F26A50c5606</code></td></tr><tr><td>Monad</td><td><code>0xC04dE634982cAdF2A677310b73630B7Ac56A3f65</code></td></tr><tr><td>Optimism Sepolia</td><td><code>0x5856651eB82aeb6979B4954317194d48e1891b3c</code></td></tr><tr><td>Plume</td><td><code>0x8fc2FbA8F962fbE89a9B02f03557a011c335A455</code></td></tr><tr><td>Seievm</td><td><code>0x25f1c923Fb7A5aEFA5F0A2b419fC70f2368e66e5</code></td></tr><tr><td>Sui</td><td><code>0x4000cfe2955d8355b3d3cf186f854fea9f787a457257056926fde1ec977670eb</code></td></tr><tr><td>XRPL-EVM</td><td><code>0x4d9525D94D275dEB495b7C8840b154Ae04cfaC2A</code></td></tr></tbody></table>

## CCTP with Executor



=== "Mainnet v1"

    <table data-full-width="true" markdown><thead><th>Chain Name</th><th>Contract Address</th></thead><tbody><tr><td>Ethereum</td><td><code>0xeEFb36c4458dA7798742cf038C5c27E07aB9c51E</code></td></tr><tr><td>Solana</td><td><code>CXGRA5SCc8jxDbaQPZrmmZNu2JV34DP7gFW4m31uC1zs</code></td></tr><tr><td>Aptos</td><td><code>0x9f5ad7d5c2d067ca4abb6d8d6aba44c15596b71a1def8eb4596089b527bb2eb1</code></td></tr><tr><td>Arbitrum</td><td><code>0x55Dd4466BFec29527C54A72fd306efb54e5F7027</code></td></tr><tr><td>Avalanche</td><td><code>0xd331819478b74d8a7B8EA631118B4a4e50F6EbD1</code></td></tr><tr><td>Base</td><td><code>0x08FEB1838C3d7F8509DA1EBb9a11a94c1f006cb2</code></td></tr><tr><td>OP Mainnet</td><td><code>0xBC6f9d1CBa49DB365728478cefa02F6743617637</code></td></tr><tr><td>Polygon PoS</td><td><code>0x007995f2AEcfBC745f20a7AE8D3a02c0EbF46264</code></td></tr><tr><td>Unichain</td><td><code>0xA7aBDb8f2108901c586543BD5e10E4fA263F4A47</code></td></tr></tbody></table>

=== "Testnet v1"

    <table data-full-width="true" markdown><thead><th>Chain Name</th><th>Contract Address</th></thead><tbody><tr><td>Ethereum Sepolia</td><td><code>0x0F78904c750801391EbBf308181e9d6fc892B0f3</code></td></tr><tr><td>Solana Devnet</td><td><code>CXGRA5SCc8jxDbaQPZrmmZNu2JV34DP7gFW4m31uC1zs</code></td></tr><tr><td>Aptos Testnet</td><td><code>0x14a12d1fd6ef371b70c2113155534ec152ec7f779e281b54866c796c9a4a58d3?</code></td></tr><tr><td>Arbitrum Sepolia</td><td><code>0xc9c0A1030331D5dA0599D243eFd4682D906066D9</code></td></tr><tr><td>Avalanche Fuji</td><td><code>0x2cfEC91B50f657Cc86Ec693542527ac3e03bF742</code></td></tr><tr><td>Base Sepolia</td><td><code>0x4983C6bD3bB7DA9EECe71cfa7AE4C67CAbf362F0</code></td></tr><tr><td>Optimism Sepolia</td><td><code>0x1F2e73E9AF5eecEdAF03b4F295f83BD587290867</code></td></tr><tr><td>Polygon Sepolia (Amoy)</td><td><code>0x2aE8EBeC0387759161B8D7680F0EF9bD0B962FbF</code></td></tr></tbody></table>

=== "Mainnet v2"

    <table data-full-width="true" markdown><thead><th>Chain Name</th><th>Contract Address</th></thead><tbody><tr><td>Ethereum</td><td><code>0x2cCf230467FE7387674BAa657747F0B5485c7fEC</code></td></tr><tr><td>Solana</td><td><code>Supported</code></td></tr><tr><td>Arbitrum</td><td><code>0x8442d68524217601ed126f6859694e4b0c7c66a1</code></td></tr><tr><td>Avalanche</td><td><code>0x3952914628650Ca510404872D84DfF10A844C5B5</code></td></tr><tr><td>Base</td><td><code>0xbd8d42f40a11b37bD1b3770D754f9629F7cd5679</code></td></tr><tr><td>Codex</td><td><code>0xE1Df8709CAa70c5eCEa0c27871cA7029Fcb0A0bd</code></td></tr><tr><td>HyperEVM</td><td><code>0xACD054f83c0b852d02503191e2c26527A7E72B1f</code></td></tr><tr><td>Ink Mainnet</td><td><code>0xD71898Ec48D36eba65eeb104AF87b00C24A8F201</code></td></tr><tr><td>Linea</td><td><code>0xc48c126468BE919068dE1983F00F65af759a4E87</code></td></tr><tr><td>Monad</td><td><code>0xA4d775410FB35d8cE49Ad98d3f483A55e532de73</code></td></tr><tr><td>OP Mainnet</td><td><code>0xd0a8940b2e743e33b682daec4d52b46713606c9d</code></td></tr><tr><td>Plume</td><td><code>0x486228859880ec6c05175035bEe2e5383D23B0fE</code></td></tr><tr><td>Polygon PoS</td><td><code>0xc8a8e6d760dcbd5d6746e2f66cd2ffa722dd1e59</code></td></tr><tr><td>SeiEVM</td><td><code>0xf4FefFc03EEFB06B009bFB168b60B30edf7abc12</code></td></tr><tr><td>Sonic</td><td><code>0xc39BF082ec91D9bC385F956D24a8D66C0c26223d</code></td></tr><tr><td>Unichain</td><td><code>0xD5D5D640D8b758672Cc7A078734175c4433866d5</code></td></tr><tr><td>World Chain</td><td><code>0x789f2b91f7B35D5B890983328340c4600339B354</code></td></tr></tbody></table>

=== "Testnet v2"

    <table data-full-width="true" markdown><thead><th>Chain Name</th><th>Contract Address</th></thead><tbody><tr><td>Ethereum Sepolia</td><td><code>0x6BC3a8275e3DC861977e9244990283cDecA5Fa2F</code></td></tr><tr><td>Solana Devnet</td><td><code>Supported</code></td></tr><tr><td>Arbitrum Sepolia</td><td><code>0x239D8D2Ea8d12fcd428696442411719B65908962</code></td></tr><tr><td>Avalanche Fuji</td><td><code>0x949d1c6Da779C599E70C78AE075A7Ad17C53A5bF</code></td></tr><tr><td>Base Sepolia</td><td><code>0xa2B4F26b85206EA838B6A1fcD41590D6061f7D53</code></td></tr><tr><td>Ink</td><td><code>0xD7E9D4609652297B4aa56F23d57Fd83954Ea8040</code></td></tr><tr><td>Optimism Sepolia</td><td><code>0xb2ab6055E2Dee08534fc17871a11a585070D5012</code></td></tr><tr><td>Polygon Sepolia (Amoy)</td><td><code>0x58c07cb3A04c972a11e1E5fd7073369401305a31</code></td></tr><tr><td>SeiEVM Testnet</td><td><code>0xDC735908C3eCF29f40D8CA5f6407F2d94d316a9F</code></td></tr></tbody></table>


## NTT with Executor



=== "Mainnet"

    <table data-full-width="true" markdown><thead><th>Chain Name</th><th>Contract Address</th></thead><tbody><tr><td>Ethereum</td><td><code>0xD2D9c936165a85F27a5a7e07aFb974D022B89463</code></td></tr><tr><td>Solana</td><td><code>nex1gkSWtRBheEJuQZMqHhbMG5A45qPU76KqnCZNVHR</code></td></tr><tr><td>Arbitrum</td><td><code>0x0Af42A597b0C201D4dcf450DcD0c06d55ddC1C77</code></td></tr><tr><td>Avalanche</td><td><code>0x4e9Af03fbf1aa2b79A2D4babD3e22e09f18Bb8EE</code></td></tr><tr><td>Base</td><td><code>0x83216747fC21b86173D800E2960c0D5395de0F30</code></td></tr><tr><td>Berachain</td><td><code>0x0a2AF374Cc9CCCbB0Acc4E34B20b9d02a0f08c30</code></td></tr><tr><td>BSC</td><td><code>0x39B57Dd9908F8be02CfeE283b67eA1303Bc29fe1</code></td></tr><tr><td>Celo</td><td><code>0x3d69869fcB9e1CD1F4020b637fb8256030BAc8fC</code></td></tr><tr><td>CreditCoin</td><td><code>0x5454b995719626256C96fb57454b044ffb3Da2F9</code></td></tr><tr><td>Fogo</td><td><code>nex1gkSWtRBheEJuQZMqHhbMG5A45qPU76KqnCZNVHR</code></td></tr><tr><td>HyperEVM</td><td><code>0x431017B1718b86898C7590fFcCC380DEf0456393</code></td></tr><tr><td>Ink Mainnet</td><td><code>0x420370DC2ECC4D44b47514B7859fd11809BbeFF5</code></td></tr><tr><td>Linea</td><td><code>0xEAa5AddB5b8939Eb73F7faF46e193EefECaF13E9</code></td></tr><tr><td>Mezo</td><td><code>0x484b5593BbB90383f94FB299470F09427cf6cfE2</code></td></tr><tr><td>Monad</td><td><code>0x93FE94Ad887a1B04DBFf1f736bfcD1698D4cfF66</code><br>Multi Ntt: <code>0xFEA937F7124E19124671f1685671d3f04a9Af4E4</code></td></tr><tr><td>Moonbeam</td><td><code>0x1365593C8bae71a55e48E105a2Bb76d5928c7DE3</code></td></tr><tr><td>OP Mainnet</td><td><code>0x85C0129bE5226C9F0Cf4e419D2fefc1c3FCa25cF</code></td></tr><tr><td>Plume</td><td><code>0x6Eb53371f646788De6B4D0225a4Ed1d9267188AD</code></td></tr><tr><td>Polygon PoS</td><td><code>0x6762157b73941e36cEd0AEf54614DdE545d0F990</code></td></tr><tr><td>Scroll</td><td><code>0x055625d48968f99409244E8c3e03FbE73B235a62</code></td></tr><tr><td>SeiEVM</td><td><code>0x3F2D6441C7a59Dfe80f8e14142F9E28F6D440445</code></td></tr><tr><td>Sonic</td><td><code>0xaCa00703bb87F31D6F9fCcc963548b48FA46DfeB</code></td></tr><tr><td>Unichain</td><td><code>0x607723D6353Dae3ef62B7B277Cfabd0F4bc6CB4C</code></td></tr><tr><td>World Chain</td><td><code>0x66b1644400D51e104272337226De3EF1A820eC79</code></td></tr><tr><td>XRPLEVM</td><td><code>0x6bBd1ff3bB303F88835A714EE3241bF45DE26d29</code></td></tr></tbody></table>

=== "Testnet"

    <table data-full-width="true" markdown><thead><th>Chain Name</th><th>Contract Address</th></thead><tbody><tr><td>Ethereum Sepolia</td><td><code>0x54DD7080aE169DD923fE56d0C4f814a0a17B8f41</code></td></tr><tr><td>Solana Devnet</td><td><code>nex1gkSWtRBheEJuQZMqHhbMG5A45qPU76KqnCZNVHR</code></td></tr><tr><td>Arbitrum Sepolia</td><td><code>0xd048170F1ECB8D47E499D3459aC379DA023E2C1B</code></td></tr><tr><td>Avalanche Fuji</td><td><code>0x4e9Af03fbf1aa2b79A2D4babD3e22e09f18Bb8EE</code></td></tr><tr><td>Base Sepolia</td><td><code>0x5845E08d890E21687F7Ebf7CbAbD360cD91c6245</code></td></tr><tr><td>BSC Testnet</td><td><code>0x39B57Dd9908F8be02CfeE283b67eA1303Bc29fe1</code></td></tr><tr><td>Celo</td><td><code>0x3d69869fcB9e1CD1F4020b637fb8256030BAc8fC</code></td></tr><tr><td>Converge Testnet</td><td><code>0x3d8c26b67BDf630FBB44F09266aFA735F1129197</code></td></tr><tr><td>Fogo Testnet</td><td><code>nex1gkSWtRBheEJuQZMqHhbMG5A45qPU76KqnCZNVHR</code></td></tr><tr><td>Ink</td><td><code>0xF420BFFf922D11c2bBF587C9dF71b83651fAf8Bc</code></td></tr><tr><td>Mezo Testnet</td><td><code>0x484b5593BbB90383f94FB299470F09427cf6cfE2</code></td></tr><tr><td>Moca</td><td><code>0x47f26bF9253Eb398fBAf825D7565FE975D839a71</code></td></tr><tr><td>Monad Testnet</td><td><code>0x93FE94Ad887a1B04DBFf1f736bfcD1698D4cfF66</code></td></tr><tr><td>Optimism Sepolia</td><td><code>0xaDB1C56D363FF5A75260c3bd27dd7C1fC8421EF5</code></td></tr><tr><td>Plume Testnet</td><td><code>0x6Eb53371f646788De6B4D0225a4Ed1d9267188AD</code></td></tr><tr><td>Polygon Sepolia (Amoy)</td><td><code>0x2982B9566E912458fE711FB1Fd78158264596937</code></td></tr><tr><td>SeiEVM Testnet</td><td><code>0x3F2D6441C7a59Dfe80f8e14142F9E28F6D440445</code></td></tr><tr><td>XRPL EVM Testnet</td><td><code>0xcDD9d7C759b29680f7a516d0058de8293b2AC7b1</code></td></tr></tbody></table>


## WTT Executor



=== "Mainnet"

    <table data-full-width="true" markdown><thead><th>Chain Name</th><th>Contract Address</th></thead><tbody><tr><td>Ethereum</td><td><code>0xa8969F3f8D97b3Ed89D4e2EC19B6B0CfD504b212</code></td></tr><tr><td>Solana</td><td><code>tbr7Qje6qBzPwfM52csL5KFi8ps5c5vDyiVVBLYVdRf</code></td></tr><tr><td>Arbitrum</td><td><code>0x04C98824a64d75CD1E9Bc418088b4c9A99048153</code></td></tr><tr><td>Avalanche</td><td><code>0x8849F05675E034b54506caB84450c8C82694a786</code></td></tr><tr><td>Base</td><td><code>0xD8B736EF27Fc997b1d00F22FE37A58145D3BDA07</code></td></tr><tr><td>Berachain</td><td><code>0xFAeFa20CB3759AEd2310E25015F05d62D8567A3F</code></td></tr><tr><td>BNB Smart Chain</td><td><code>0x2513515340fF71DD5AF02fC1BdB9615704d91524</code></td></tr><tr><td>Celo</td><td><code>0xe478DEe705BEae591395B08934FA19F54df316BE</code></td></tr><tr><td>Fantom</td><td><code>0xcafd2f0a35a4459fa40c0517e17e6fa2939441ca</code></td></tr><tr><td>Fogo</td><td><code>tbr7Qje6qBzPwfM52csL5KFi8ps5c5vDyiVVBLYVdRf</code></td></tr><tr><td>Ink</td><td><code>0x4bFB47F4c8A904d2C24e73601D175FE3a38aAb5B</code></td></tr><tr><td>Monad</td><td><code>0xf7E051f93948415952a2239582823028DacA948e</code></td></tr><tr><td>Moonbeam</td><td><code>0xF6b9616C63Fa48D07D82c93CE02B5d9111c51a3d</code></td></tr><tr><td>Optimism</td><td><code>0x37aC29617AE74c750a1e4d55990296BAF9b8De73</code></td></tr><tr><td>Polygon</td><td><code>0x1d98CA4221516B9ac4869F5CeA7E6bb9C41609D6</code></td></tr><tr><td>Scroll</td><td><code>0x05129e142e7d5A518D81f19Db342fBF5f7E26A18</code></td></tr><tr><td>Seievm</td><td><code>0x7C129bc8F6188d12c0d1BBDE247F134148B97618</code></td></tr><tr><td>Sui</td><td><code>0x57f4e0ba41a7045e29d435bc66cc4175f381eb700e6ec16d4fdfe92e5a4dff9f</code></td></tr><tr><td>Unichain</td><td><code>0x9Bca817F67f01557aeD615130825A28F4C5f3b87</code></td></tr><tr><td>World Chain</td><td><code>0xc0565Bd29b34603C0383598E16843d95Ae9c4f65</code></td></tr><tr><td>XRPL-EVM</td><td><code>0x37bCc9d175124F77Bfce68589d2a8090eF846B85</code></td></tr></tbody></table>

=== "Testnet"

    <table data-full-width="true" markdown><thead><th>Chain Name</th><th>Contract Address</th></thead><tbody><tr><td>Ethereum Sepolia</td><td><code>0xb0b2119067cF04fa959f654250BD49fE1BD6F53c</code></td></tr><tr><td>Solana</td><td><code>tbr7Qje6qBzPwfM52csL5KFi8ps5c5vDyiVVBLYVdRf</code></td></tr><tr><td>Arbitrum Sepolia</td><td><code>0xaE8dc4a7438801Ec4edC0B035EcCCcF3807F4CC1</code></td></tr><tr><td>Avalanche</td><td><code>0x10Ce9a35883C44640e8B12fea4Cc1e77F77D8c52</code></td></tr><tr><td>Base Sepolia</td><td><code>0x523d25D33B975ad72283f73B1103354352dBCBb8</code></td></tr><tr><td>BNB Smart Chain</td><td><code>0x9563a59c15842a6f322b10f69d1dd88b41f2e97b</code></td></tr><tr><td>Celo</td><td><code>0x9563a59c15842a6f322b10f69d1dd88b41f2e97b</code></td></tr><tr><td>Fantom</td><td><code>0x9563a59c15842a6f322b10f69d1dd88b41f2e97b</code></td></tr><tr><td>Fogo</td><td><code>tbr7Qje6qBzPwfM52csL5KFi8ps5c5vDyiVVBLYVdRf</code></td></tr><tr><td>Mezo</td><td><code>0x2002a44b1106DF83671Fb419A2079a75e2a34808</code></td></tr><tr><td>Monad</td><td><code>0x5Ba2c39cF0624BB5fBe94E919519aEA0DdD68454</code></td></tr><tr><td>Moonbeam</td><td><code>0x9563a59c15842a6f322b10f69d1dd88b41f2e97b</code></td></tr><tr><td>Optimism Sepolia</td><td><code>0xaE8dc4a7438801Ec4edC0B035EcCCcF3807F4CC1</code></td></tr><tr><td>Sui</td><td><code>0xb30040e5120f8cb853b691cb6d45981ae884b1d68521a9dc7c3ae881c0031923</code></td></tr><tr><td>XRPL-EVM</td><td><code>0xb00224c60fe6ab134c8544dc29350286545f8dcc</code></td></tr></tbody></table>

## WTT Executor with Referrer



=== "Mainnet"

    <table data-full-width="true" markdown><thead><th>Chain Name</th><th>Contract Address</th></thead><tbody><tr><td>Ethereum</td><td><code>0x412f30e9f8B4a1e99eaE90209A6b00f5C3cc8739</code></td></tr><tr><td>Arbitrum</td><td><code>0x412f30e9f8B4a1e99eaE90209A6b00f5C3cc8739</code></td></tr><tr><td>Avalanche</td><td><code>0x412f30e9f8B4a1e99eaE90209A6b00f5C3cc8739</code></td></tr><tr><td>Base</td><td><code>0x412f30e9f8B4a1e99eaE90209A6b00f5C3cc8739</code></td></tr><tr><td>Berachain</td><td><code>0x412f30e9f8B4a1e99eaE90209A6b00f5C3cc8739</code></td></tr><tr><td>BNB Smart Chain</td><td><code>0x412f30e9f8B4a1e99eaE90209A6b00f5C3cc8739</code></td></tr><tr><td>Celo</td><td><code>0x412f30e9f8B4a1e99eaE90209A6b00f5C3cc8739</code></td></tr><tr><td>Ink</td><td><code>0x412f30e9f8B4a1e99eaE90209A6b00f5C3cc8739</code></td></tr><tr><td>Monad</td><td><code>0x412f30e9f8B4a1e99eaE90209A6b00f5C3cc8739</code></td></tr><tr><td>Moonbeam</td><td><code>0x412f30e9f8B4a1e99eaE90209A6b00f5C3cc8739</code></td></tr><tr><td>Optimism</td><td><code>0x412f30e9f8B4a1e99eaE90209A6b00f5C3cc8739</code></td></tr><tr><td>Polygon</td><td><code>0x412f30e9f8B4a1e99eaE90209A6b00f5C3cc8739</code></td></tr><tr><td>Scroll</td><td><code>0x412f30e9f8B4a1e99eaE90209A6b00f5C3cc8739</code></td></tr><tr><td>Seievm</td><td><code>0x412f30e9f8B4a1e99eaE90209A6b00f5C3cc8739</code></td></tr><tr><td>Unichain</td><td><code>0x412f30e9f8B4a1e99eaE90209A6b00f5C3cc8739</code></td></tr><tr><td>World Chain</td><td><code>0x412f30e9f8B4a1e99eaE90209A6b00f5C3cc8739</code></td></tr><tr><td>XRPL-EVM</td><td><code>0x13a35c075D6Acc1Fb9BddFE5FE38e7672789e4db</code></td></tr></tbody></table>

=== "Testnet"

    <table data-full-width="true" markdown><thead><th>Chain Name</th><th>Contract Address</th></thead><tbody><tr><td>Ethereum Sepolia</td><td><code>0x412f30e9f8B4a1e99eaE90209A6b00f5C3cc8739</code></td></tr><tr><td>Avalanche</td><td><code>0x412f30e9f8B4a1e99eaE90209A6b00f5C3cc8739</code></td></tr><tr><td>Base Sepolia</td><td><code>0x412f30e9f8B4a1e99eaE90209A6b00f5C3cc8739</code></td></tr><tr><td>Mezo</td><td><code>0x412f30e9f8B4a1e99eaE90209A6b00f5C3cc8739</code></td></tr><tr><td>Monad</td><td><code>0x412f30e9f8B4a1e99eaE90209A6b00f5C3cc8739</code></td></tr><tr><td>XRPL-EVM</td><td><code>0x17CFAAf9e8a5ABb1eee758dB9040F945c9EAC907</code></td></tr></tbody></table>


---

Page Title: Executor Addresses

- Source (raw): https://raw.githubusercontent.com/wormhole-foundation/wormhole-docs/main/.ai/pages/products-reference-executor-addresses.md
- Canonical (HTML): https://wormhole.com/docs/products/reference/executor-addresses/
- Summary: Reference list of deployed Executor contract addresses across integrations, including CCTP, NTT, WTT, and referrer variants.

# Executor Addresses

## Executor



=== "Mainnet"

    <table data-full-width="true" markdown><thead><th>Chain Name</th><th>Contract Address</th></thead><tbody><tr><td>Ethereum</td><td><code>0x84EEe8dBa37C36947397E1E11251cA9A06Fc6F8a</code></td></tr><tr><td>Solana</td><td><code>execXUrAsMnqMmTHj5m7N1YQgsDz3cwGLYCYyuDRciV</code></td></tr><tr><td>Aptos</td><td><code>0x11aa75c059e1a7855be66b931bf340a2e0973274ac16b5f519c02ceafaf08a18</code></td></tr><tr><td>Arbitrum</td><td><code>0x3980f8318fc03d79033Bbb421A622CDF8d2Eeab4</code></td></tr><tr><td>Avalanche</td><td><code>0x4661F0E629E4ba8D04Ee90080Aee079740B00381</code></td></tr><tr><td>Base</td><td><code>0x9E1936E91A4a5AE5A5F75fFc472D6cb8e93597ea</code></td></tr><tr><td>Berachain</td><td><code>0x0Dd7a5a32311b8D87A615Cc7f079B632D3d5e2D3</code></td></tr><tr><td>BNB Smart Chain</td><td><code>0xeC8cCCD058DbF28e5D002869Aa9aFa3992bf4ee0</code></td></tr><tr><td>Celo</td><td><code>0xe6Ea5087c6860B94Cf098a403506262D8F28cF05</code></td></tr><tr><td>CreditCoin</td><td><code>0xd2e420188f17607Aa6344ee19c3e76Cf86CA7BDe</code></td></tr><tr><td>Fogo</td><td><code>execXUrAsMnqMmTHj5m7N1YQgsDz3cwGLYCYyuDRciV</code></td></tr><tr><td>HyperEVM :material-alert:{ title='⚠️ The HyperEVM integration is experimental, as its node software is not open source. Use Wormhole messaging on HyperEVM with caution.' }</td><td><code>0xd7717899cc4381033Bc200431286D0AC14265F78</code></td></tr><tr><td>Ink</td><td><code>0x3e44a5F45cbD400acBEF534F51e616043B211Ddd</code></td></tr><tr><td>Linea</td><td><code>0x23aF2B5296122544A9A7861da43405D5B15a9bD3</code></td></tr><tr><td>Mezo</td><td><code>0x0f9b8E144Cc5C5e7C0073829Afd30F26A50c5606</code></td></tr><tr><td>Monad</td><td><code>0xC04dE634982cAdF2A677310b73630B7Ac56A3f65</code></td></tr><tr><td>Moonbeam</td><td><code>0x85D06449C78064c2E02d787e9DC71716786F8D19</code></td></tr><tr><td>Optimism</td><td><code>0x85B704501f6AE718205C0636260768C4e72ac3e7</code></td></tr><tr><td>Polygon</td><td><code>0x0B23efA164aB3eD08e9a39AC7aD930Ff4F5A5e81</code></td></tr><tr><td>Scroll</td><td><code>0xcFAdDE24640e395F5A71456A825D0D7C3741F075</code></td></tr><tr><td>Seievm</td><td><code>0x25f1c923fb7a5aefa5f0a2b419fc70f2368e66e5</code></td></tr><tr><td>Sonic</td><td><code>0x3Fdc36b4260Da38fBDba1125cCBD33DD0AC74812</code></td></tr><tr><td>Sui</td><td><code>0xdb0fe8bb1e2b5be628adbea0636063325073e1070ee11e4281457dfd7f158235</code></td></tr><tr><td>Unichain</td><td><code>0x764dD868eAdD27ce57BCB801E4ca4a193d231Aed</code></td></tr><tr><td>World Chain</td><td><code>0x8689b4E6226AdC8fa8FF80aCc3a60AcE31e8804B</code></td></tr><tr><td>XRPL-EVM</td><td><code>0x8345E90Dcd92f5Cf2FAb0C8E2A56A5bc2c30d896</code></td></tr></tbody></table>

=== "Testnet"

    <table data-full-width="true" markdown><thead><th>Chain Name</th><th>Contract Address</th></thead><tbody><tr><td>Ethereum Sepolia</td><td><code>0xD0fb39f5a3361F21457653cB70F9D0C9bD86B66B</code></td></tr><tr><td>Solana</td><td><code>execXUrAsMnqMmTHj5m7N1YQgsDz3cwGLYCYyuDRciV</code></td></tr><tr><td>Aptos</td><td><code>0x139717c339f08af674be77143507a905aa28cbc67a0e53e7095c07b630d73815</code></td></tr><tr><td>Arbitrum Sepolia</td><td><code>0xBF161de6B819c8af8f2230Bcd99a9B3592f6F87b</code></td></tr><tr><td>Avalanche</td><td><code>0x4661F0E629E4ba8D04Ee90080Aee079740B00381</code></td></tr><tr><td>Base Sepolia</td><td><code>0x51B47D493CBA7aB97e3F8F163D6Ce07592CE4482</code></td></tr><tr><td>Converge</td><td><code>0xAab9935349B9c08e0e970720F6D640d5B91C293E</code></td></tr><tr><td>Fogo</td><td><code>execXUrAsMnqMmTHj5m7N1YQgsDz3cwGLYCYyuDRciV</code></td></tr><tr><td>Mezo</td><td><code>0x0f9b8E144Cc5C5e7C0073829Afd30F26A50c5606</code></td></tr><tr><td>Monad</td><td><code>0xC04dE634982cAdF2A677310b73630B7Ac56A3f65</code></td></tr><tr><td>Optimism Sepolia</td><td><code>0x5856651eB82aeb6979B4954317194d48e1891b3c</code></td></tr><tr><td>Plume</td><td><code>0x8fc2FbA8F962fbE89a9B02f03557a011c335A455</code></td></tr><tr><td>Seievm</td><td><code>0x25f1c923Fb7A5aEFA5F0A2b419fC70f2368e66e5</code></td></tr><tr><td>Sui</td><td><code>0x4000cfe2955d8355b3d3cf186f854fea9f787a457257056926fde1ec977670eb</code></td></tr><tr><td>XRPL-EVM</td><td><code>0x4d9525D94D275dEB495b7C8840b154Ae04cfaC2A</code></td></tr></tbody></table>

## CCTP With Executor



=== "Mainnet v1"

    <table data-full-width="true" markdown><thead><th>Chain Name</th><th>Contract Address</th></thead><tbody><tr><td>Ethereum</td><td><code>0xeEFb36c4458dA7798742cf038C5c27E07aB9c51E</code></td></tr><tr><td>Solana</td><td><code>CXGRA5SCc8jxDbaQPZrmmZNu2JV34DP7gFW4m31uC1zs</code></td></tr><tr><td>Aptos</td><td><code>0x9f5ad7d5c2d067ca4abb6d8d6aba44c15596b71a1def8eb4596089b527bb2eb1</code></td></tr><tr><td>Arbitrum</td><td><code>0x55Dd4466BFec29527C54A72fd306efb54e5F7027</code></td></tr><tr><td>Avalanche</td><td><code>0xd331819478b74d8a7B8EA631118B4a4e50F6EbD1</code></td></tr><tr><td>Base</td><td><code>0x08FEB1838C3d7F8509DA1EBb9a11a94c1f006cb2</code></td></tr><tr><td>OP Mainnet</td><td><code>0xBC6f9d1CBa49DB365728478cefa02F6743617637</code></td></tr><tr><td>Polygon PoS</td><td><code>0x007995f2AEcfBC745f20a7AE8D3a02c0EbF46264</code></td></tr><tr><td>Unichain</td><td><code>0xA7aBDb8f2108901c586543BD5e10E4fA263F4A47</code></td></tr></tbody></table>

=== "Testnet v1"

    <table data-full-width="true" markdown><thead><th>Chain Name</th><th>Contract Address</th></thead><tbody><tr><td>Ethereum Sepolia</td><td><code>0x0F78904c750801391EbBf308181e9d6fc892B0f3</code></td></tr><tr><td>Solana Devnet</td><td><code>CXGRA5SCc8jxDbaQPZrmmZNu2JV34DP7gFW4m31uC1zs</code></td></tr><tr><td>Aptos Testnet</td><td><code>0x14a12d1fd6ef371b70c2113155534ec152ec7f779e281b54866c796c9a4a58d3?</code></td></tr><tr><td>Arbitrum Sepolia</td><td><code>0xc9c0A1030331D5dA0599D243eFd4682D906066D9</code></td></tr><tr><td>Avalanche Fuji</td><td><code>0x2cfEC91B50f657Cc86Ec693542527ac3e03bF742</code></td></tr><tr><td>Base Sepolia</td><td><code>0x4983C6bD3bB7DA9EECe71cfa7AE4C67CAbf362F0</code></td></tr><tr><td>Optimism Sepolia</td><td><code>0x1F2e73E9AF5eecEdAF03b4F295f83BD587290867</code></td></tr><tr><td>Polygon Sepolia (Amoy)</td><td><code>0x2aE8EBeC0387759161B8D7680F0EF9bD0B962FbF</code></td></tr></tbody></table>

=== "Mainnet v2"

    <table data-full-width="true" markdown><thead><th>Chain Name</th><th>Contract Address</th></thead><tbody><tr><td>Ethereum</td><td><code>0x2cCf230467FE7387674BAa657747F0B5485c7fEC</code></td></tr><tr><td>Solana</td><td><code>Supported</code></td></tr><tr><td>Arbitrum</td><td><code>0x8442d68524217601ed126f6859694e4b0c7c66a1</code></td></tr><tr><td>Avalanche</td><td><code>0x3952914628650Ca510404872D84DfF10A844C5B5</code></td></tr><tr><td>Base</td><td><code>0xbd8d42f40a11b37bD1b3770D754f9629F7cd5679</code></td></tr><tr><td>Codex</td><td><code>0xE1Df8709CAa70c5eCEa0c27871cA7029Fcb0A0bd</code></td></tr><tr><td>HyperEVM</td><td><code>0xACD054f83c0b852d02503191e2c26527A7E72B1f</code></td></tr><tr><td>Ink Mainnet</td><td><code>0xD71898Ec48D36eba65eeb104AF87b00C24A8F201</code></td></tr><tr><td>Linea</td><td><code>0xc48c126468BE919068dE1983F00F65af759a4E87</code></td></tr><tr><td>Monad</td><td><code>0xA4d775410FB35d8cE49Ad98d3f483A55e532de73</code></td></tr><tr><td>OP Mainnet</td><td><code>0xd0a8940b2e743e33b682daec4d52b46713606c9d</code></td></tr><tr><td>Plume</td><td><code>0x486228859880ec6c05175035bEe2e5383D23B0fE</code></td></tr><tr><td>Polygon PoS</td><td><code>0xc8a8e6d760dcbd5d6746e2f66cd2ffa722dd1e59</code></td></tr><tr><td>SeiEVM</td><td><code>0xf4FefFc03EEFB06B009bFB168b60B30edf7abc12</code></td></tr><tr><td>Sonic</td><td><code>0xc39BF082ec91D9bC385F956D24a8D66C0c26223d</code></td></tr><tr><td>Unichain</td><td><code>0xD5D5D640D8b758672Cc7A078734175c4433866d5</code></td></tr><tr><td>World Chain</td><td><code>0x789f2b91f7B35D5B890983328340c4600339B354</code></td></tr></tbody></table>

=== "Testnet v2"

    <table data-full-width="true" markdown><thead><th>Chain Name</th><th>Contract Address</th></thead><tbody><tr><td>Ethereum Sepolia</td><td><code>0x6BC3a8275e3DC861977e9244990283cDecA5Fa2F</code></td></tr><tr><td>Solana Devnet</td><td><code>Supported</code></td></tr><tr><td>Arbitrum Sepolia</td><td><code>0x239D8D2Ea8d12fcd428696442411719B65908962</code></td></tr><tr><td>Avalanche Fuji</td><td><code>0x949d1c6Da779C599E70C78AE075A7Ad17C53A5bF</code></td></tr><tr><td>Base Sepolia</td><td><code>0xa2B4F26b85206EA838B6A1fcD41590D6061f7D53</code></td></tr><tr><td>Ink</td><td><code>0xD7E9D4609652297B4aa56F23d57Fd83954Ea8040</code></td></tr><tr><td>Optimism Sepolia</td><td><code>0xb2ab6055E2Dee08534fc17871a11a585070D5012</code></td></tr><tr><td>Polygon Sepolia (Amoy)</td><td><code>0x58c07cb3A04c972a11e1E5fd7073369401305a31</code></td></tr><tr><td>SeiEVM Testnet</td><td><code>0xDC735908C3eCF29f40D8CA5f6407F2d94d316a9F</code></td></tr></tbody></table>


## NTT With Executor



=== "Mainnet"

    <table data-full-width="true" markdown><thead><th>Chain Name</th><th>Contract Address</th></thead><tbody><tr><td>Ethereum</td><td><code>0xD2D9c936165a85F27a5a7e07aFb974D022B89463</code></td></tr><tr><td>Solana</td><td><code>nex1gkSWtRBheEJuQZMqHhbMG5A45qPU76KqnCZNVHR</code></td></tr><tr><td>Arbitrum</td><td><code>0x0Af42A597b0C201D4dcf450DcD0c06d55ddC1C77</code></td></tr><tr><td>Avalanche</td><td><code>0x4e9Af03fbf1aa2b79A2D4babD3e22e09f18Bb8EE</code></td></tr><tr><td>Base</td><td><code>0x83216747fC21b86173D800E2960c0D5395de0F30</code></td></tr><tr><td>Berachain</td><td><code>0x0a2AF374Cc9CCCbB0Acc4E34B20b9d02a0f08c30</code></td></tr><tr><td>BSC</td><td><code>0x39B57Dd9908F8be02CfeE283b67eA1303Bc29fe1</code></td></tr><tr><td>Celo</td><td><code>0x3d69869fcB9e1CD1F4020b637fb8256030BAc8fC</code></td></tr><tr><td>CreditCoin</td><td><code>0x5454b995719626256C96fb57454b044ffb3Da2F9</code></td></tr><tr><td>Fogo</td><td><code>nex1gkSWtRBheEJuQZMqHhbMG5A45qPU76KqnCZNVHR</code></td></tr><tr><td>HyperEVM</td><td><code>0x431017B1718b86898C7590fFcCC380DEf0456393</code></td></tr><tr><td>Ink Mainnet</td><td><code>0x420370DC2ECC4D44b47514B7859fd11809BbeFF5</code></td></tr><tr><td>Linea</td><td><code>0xEAa5AddB5b8939Eb73F7faF46e193EefECaF13E9</code></td></tr><tr><td>Mezo</td><td><code>0x484b5593BbB90383f94FB299470F09427cf6cfE2</code></td></tr><tr><td>Monad</td><td><code>0x93FE94Ad887a1B04DBFf1f736bfcD1698D4cfF66</code><br>Multi Ntt: <code>0xFEA937F7124E19124671f1685671d3f04a9Af4E4</code></td></tr><tr><td>Moonbeam</td><td><code>0x1365593C8bae71a55e48E105a2Bb76d5928c7DE3</code></td></tr><tr><td>OP Mainnet</td><td><code>0x85C0129bE5226C9F0Cf4e419D2fefc1c3FCa25cF</code></td></tr><tr><td>Plume</td><td><code>0x6Eb53371f646788De6B4D0225a4Ed1d9267188AD</code></td></tr><tr><td>Polygon PoS</td><td><code>0x6762157b73941e36cEd0AEf54614DdE545d0F990</code></td></tr><tr><td>Scroll</td><td><code>0x055625d48968f99409244E8c3e03FbE73B235a62</code></td></tr><tr><td>SeiEVM</td><td><code>0x3F2D6441C7a59Dfe80f8e14142F9E28F6D440445</code></td></tr><tr><td>Sonic</td><td><code>0xaCa00703bb87F31D6F9fCcc963548b48FA46DfeB</code></td></tr><tr><td>Unichain</td><td><code>0x607723D6353Dae3ef62B7B277Cfabd0F4bc6CB4C</code></td></tr><tr><td>World Chain</td><td><code>0x66b1644400D51e104272337226De3EF1A820eC79</code></td></tr><tr><td>XRPLEVM</td><td><code>0x6bBd1ff3bB303F88835A714EE3241bF45DE26d29</code></td></tr></tbody></table>

=== "Testnet"

    <table data-full-width="true" markdown><thead><th>Chain Name</th><th>Contract Address</th></thead><tbody><tr><td>Ethereum Sepolia</td><td><code>0x54DD7080aE169DD923fE56d0C4f814a0a17B8f41</code></td></tr><tr><td>Solana Devnet</td><td><code>nex1gkSWtRBheEJuQZMqHhbMG5A45qPU76KqnCZNVHR</code></td></tr><tr><td>Arbitrum Sepolia</td><td><code>0xd048170F1ECB8D47E499D3459aC379DA023E2C1B</code></td></tr><tr><td>Avalanche Fuji</td><td><code>0x4e9Af03fbf1aa2b79A2D4babD3e22e09f18Bb8EE</code></td></tr><tr><td>Base Sepolia</td><td><code>0x5845E08d890E21687F7Ebf7CbAbD360cD91c6245</code></td></tr><tr><td>BSC Testnet</td><td><code>0x39B57Dd9908F8be02CfeE283b67eA1303Bc29fe1</code></td></tr><tr><td>Celo</td><td><code>0x3d69869fcB9e1CD1F4020b637fb8256030BAc8fC</code></td></tr><tr><td>Converge Testnet</td><td><code>0x3d8c26b67BDf630FBB44F09266aFA735F1129197</code></td></tr><tr><td>Fogo Testnet</td><td><code>nex1gkSWtRBheEJuQZMqHhbMG5A45qPU76KqnCZNVHR</code></td></tr><tr><td>Ink</td><td><code>0xF420BFFf922D11c2bBF587C9dF71b83651fAf8Bc</code></td></tr><tr><td>Mezo Testnet</td><td><code>0x484b5593BbB90383f94FB299470F09427cf6cfE2</code></td></tr><tr><td>Moca</td><td><code>0x47f26bF9253Eb398fBAf825D7565FE975D839a71</code></td></tr><tr><td>Monad Testnet</td><td><code>0x93FE94Ad887a1B04DBFf1f736bfcD1698D4cfF66</code></td></tr><tr><td>Optimism Sepolia</td><td><code>0xaDB1C56D363FF5A75260c3bd27dd7C1fC8421EF5</code></td></tr><tr><td>Plume Testnet</td><td><code>0x6Eb53371f646788De6B4D0225a4Ed1d9267188AD</code></td></tr><tr><td>Polygon Sepolia (Amoy)</td><td><code>0x2982B9566E912458fE711FB1Fd78158264596937</code></td></tr><tr><td>SeiEVM Testnet</td><td><code>0x3F2D6441C7a59Dfe80f8e14142F9E28F6D440445</code></td></tr><tr><td>XRPL EVM Testnet</td><td><code>0xcDD9d7C759b29680f7a516d0058de8293b2AC7b1</code></td></tr></tbody></table>


## WTT Executor



=== "Mainnet"

    <table data-full-width="true" markdown><thead><th>Chain Name</th><th>Contract Address</th></thead><tbody><tr><td>Ethereum</td><td><code>0xa8969F3f8D97b3Ed89D4e2EC19B6B0CfD504b212</code></td></tr><tr><td>Solana</td><td><code>tbr7Qje6qBzPwfM52csL5KFi8ps5c5vDyiVVBLYVdRf</code></td></tr><tr><td>Arbitrum</td><td><code>0x04C98824a64d75CD1E9Bc418088b4c9A99048153</code></td></tr><tr><td>Avalanche</td><td><code>0x8849F05675E034b54506caB84450c8C82694a786</code></td></tr><tr><td>Base</td><td><code>0xD8B736EF27Fc997b1d00F22FE37A58145D3BDA07</code></td></tr><tr><td>Berachain</td><td><code>0xFAeFa20CB3759AEd2310E25015F05d62D8567A3F</code></td></tr><tr><td>BNB Smart Chain</td><td><code>0x2513515340fF71DD5AF02fC1BdB9615704d91524</code></td></tr><tr><td>Celo</td><td><code>0xe478DEe705BEae591395B08934FA19F54df316BE</code></td></tr><tr><td>Fantom</td><td><code>0xcafd2f0a35a4459fa40c0517e17e6fa2939441ca</code></td></tr><tr><td>Fogo</td><td><code>tbr7Qje6qBzPwfM52csL5KFi8ps5c5vDyiVVBLYVdRf</code></td></tr><tr><td>Ink</td><td><code>0x4bFB47F4c8A904d2C24e73601D175FE3a38aAb5B</code></td></tr><tr><td>Monad</td><td><code>0xf7E051f93948415952a2239582823028DacA948e</code></td></tr><tr><td>Moonbeam</td><td><code>0xF6b9616C63Fa48D07D82c93CE02B5d9111c51a3d</code></td></tr><tr><td>Optimism</td><td><code>0x37aC29617AE74c750a1e4d55990296BAF9b8De73</code></td></tr><tr><td>Polygon</td><td><code>0x1d98CA4221516B9ac4869F5CeA7E6bb9C41609D6</code></td></tr><tr><td>Scroll</td><td><code>0x05129e142e7d5A518D81f19Db342fBF5f7E26A18</code></td></tr><tr><td>Seievm</td><td><code>0x7C129bc8F6188d12c0d1BBDE247F134148B97618</code></td></tr><tr><td>Sui</td><td><code>0x57f4e0ba41a7045e29d435bc66cc4175f381eb700e6ec16d4fdfe92e5a4dff9f</code></td></tr><tr><td>Unichain</td><td><code>0x9Bca817F67f01557aeD615130825A28F4C5f3b87</code></td></tr><tr><td>World Chain</td><td><code>0xc0565Bd29b34603C0383598E16843d95Ae9c4f65</code></td></tr><tr><td>XRPL-EVM</td><td><code>0x37bCc9d175124F77Bfce68589d2a8090eF846B85</code></td></tr></tbody></table>

=== "Testnet"

    <table data-full-width="true" markdown><thead><th>Chain Name</th><th>Contract Address</th></thead><tbody><tr><td>Ethereum Sepolia</td><td><code>0xb0b2119067cF04fa959f654250BD49fE1BD6F53c</code></td></tr><tr><td>Solana</td><td><code>tbr7Qje6qBzPwfM52csL5KFi8ps5c5vDyiVVBLYVdRf</code></td></tr><tr><td>Arbitrum Sepolia</td><td><code>0xaE8dc4a7438801Ec4edC0B035EcCCcF3807F4CC1</code></td></tr><tr><td>Avalanche</td><td><code>0x10Ce9a35883C44640e8B12fea4Cc1e77F77D8c52</code></td></tr><tr><td>Base Sepolia</td><td><code>0x523d25D33B975ad72283f73B1103354352dBCBb8</code></td></tr><tr><td>BNB Smart Chain</td><td><code>0x9563a59c15842a6f322b10f69d1dd88b41f2e97b</code></td></tr><tr><td>Celo</td><td><code>0x9563a59c15842a6f322b10f69d1dd88b41f2e97b</code></td></tr><tr><td>Fantom</td><td><code>0x9563a59c15842a6f322b10f69d1dd88b41f2e97b</code></td></tr><tr><td>Fogo</td><td><code>tbr7Qje6qBzPwfM52csL5KFi8ps5c5vDyiVVBLYVdRf</code></td></tr><tr><td>Mezo</td><td><code>0x2002a44b1106DF83671Fb419A2079a75e2a34808</code></td></tr><tr><td>Monad</td><td><code>0x5Ba2c39cF0624BB5fBe94E919519aEA0DdD68454</code></td></tr><tr><td>Moonbeam</td><td><code>0x9563a59c15842a6f322b10f69d1dd88b41f2e97b</code></td></tr><tr><td>Optimism Sepolia</td><td><code>0xaE8dc4a7438801Ec4edC0B035EcCCcF3807F4CC1</code></td></tr><tr><td>Sui</td><td><code>0xb30040e5120f8cb853b691cb6d45981ae884b1d68521a9dc7c3ae881c0031923</code></td></tr><tr><td>XRPL-EVM</td><td><code>0xb00224c60fe6ab134c8544dc29350286545f8dcc</code></td></tr></tbody></table>

## WTT Executor With Referrer



=== "Mainnet"

    <table data-full-width="true" markdown><thead><th>Chain Name</th><th>Contract Address</th></thead><tbody><tr><td>Ethereum</td><td><code>0x412f30e9f8B4a1e99eaE90209A6b00f5C3cc8739</code></td></tr><tr><td>Arbitrum</td><td><code>0x412f30e9f8B4a1e99eaE90209A6b00f5C3cc8739</code></td></tr><tr><td>Avalanche</td><td><code>0x412f30e9f8B4a1e99eaE90209A6b00f5C3cc8739</code></td></tr><tr><td>Base</td><td><code>0x412f30e9f8B4a1e99eaE90209A6b00f5C3cc8739</code></td></tr><tr><td>Berachain</td><td><code>0x412f30e9f8B4a1e99eaE90209A6b00f5C3cc8739</code></td></tr><tr><td>BNB Smart Chain</td><td><code>0x412f30e9f8B4a1e99eaE90209A6b00f5C3cc8739</code></td></tr><tr><td>Celo</td><td><code>0x412f30e9f8B4a1e99eaE90209A6b00f5C3cc8739</code></td></tr><tr><td>Ink</td><td><code>0x412f30e9f8B4a1e99eaE90209A6b00f5C3cc8739</code></td></tr><tr><td>Monad</td><td><code>0x412f30e9f8B4a1e99eaE90209A6b00f5C3cc8739</code></td></tr><tr><td>Moonbeam</td><td><code>0x412f30e9f8B4a1e99eaE90209A6b00f5C3cc8739</code></td></tr><tr><td>Optimism</td><td><code>0x412f30e9f8B4a1e99eaE90209A6b00f5C3cc8739</code></td></tr><tr><td>Polygon</td><td><code>0x412f30e9f8B4a1e99eaE90209A6b00f5C3cc8739</code></td></tr><tr><td>Scroll</td><td><code>0x412f30e9f8B4a1e99eaE90209A6b00f5C3cc8739</code></td></tr><tr><td>Seievm</td><td><code>0x412f30e9f8B4a1e99eaE90209A6b00f5C3cc8739</code></td></tr><tr><td>Unichain</td><td><code>0x412f30e9f8B4a1e99eaE90209A6b00f5C3cc8739</code></td></tr><tr><td>World Chain</td><td><code>0x412f30e9f8B4a1e99eaE90209A6b00f5C3cc8739</code></td></tr><tr><td>XRPL-EVM</td><td><code>0x13a35c075D6Acc1Fb9BddFE5FE38e7672789e4db</code></td></tr></tbody></table>

=== "Testnet"

    <table data-full-width="true" markdown><thead><th>Chain Name</th><th>Contract Address</th></thead><tbody><tr><td>Ethereum Sepolia</td><td><code>0x412f30e9f8B4a1e99eaE90209A6b00f5C3cc8739</code></td></tr><tr><td>Avalanche</td><td><code>0x412f30e9f8B4a1e99eaE90209A6b00f5C3cc8739</code></td></tr><tr><td>Base Sepolia</td><td><code>0x412f30e9f8B4a1e99eaE90209A6b00f5C3cc8739</code></td></tr><tr><td>Mezo</td><td><code>0x412f30e9f8B4a1e99eaE90209A6b00f5C3cc8739</code></td></tr><tr><td>Monad</td><td><code>0x412f30e9f8B4a1e99eaE90209A6b00f5C3cc8739</code></td></tr><tr><td>XRPL-EVM</td><td><code>0x17CFAAf9e8a5ABb1eee758dB9040F945c9EAC907</code></td></tr></tbody></table>


---

Page Title: Relayer Contract

- Source (raw): https://raw.githubusercontent.com/wormhole-foundation/wormhole-docs/main/.ai/pages/products-messaging-reference-relayer-contract.md
- Canonical (HTML): https://wormhole.com/docs/products/messaging/reference/relayer-contract/
- Summary: Reference for the Wormhole Relayer contract on EVM chains. Covers the proxy structure, components, state variables, functions, events, and errors.

# Relayer Contract

The [Wormhole Relayer Contract on EVM](https://github.com/wormhole-foundation/wormhole/blob/main/relayer/ethereum/contracts/relayer/wormholeRelayer/WormholeRelayer.sol){target=\_blank} enables cross-chain message delivery with automatic execution on the destination chain. It publishes delivery instructions as Wormhole messages and defines the logic to process them via the `deliver` function. The contract supports optional value forwarding, gas refunds, message overrides, and integration with third-party delivery providers.

## Structure Overview

The Wormhole Relayer system on EVM is implemented as a modular, upgradeable contract suite, organized through layered inheritance and interfaces.

```text
IWormholeRelayer.sol (Interface)
└── WormholeRelayerBase.sol
    ├── WormholeRelayer.sol
    ├── CircleRelayer.sol
    └── TypedUnits.sol
DeliveryProvider.sol (Standalone)
```

**Key Components:**

 - **IWormholeRelayer.sol**: Defines the public interface for the Wormhole Relayer, including delivery functions and fee quoting.
 - **WormholeRelayerBase.sol**: Base logic contract shared by both WormholeRelayer and CircleRelayer. Handles delivery processing, fee management, and VAA parsing.
 - **WormholeRelayer.sol**: Main relayer implementation used with the Wormhole Messaging protocol. Inherits from `WormholeRelayerBase`.
 - **CircleRelayer.sol**: Specialized implementation for Circle messages. Also extends `WormholeRelayerBase`, but is out of scope for this reference.
 - **TypedUnits.sol**: Utility module for safe unit conversions, fee accounting, and delivery quote handling.
 - **DeliveryProvider.sol**: Separate contract that sets and manages delivery pricing and supported chains. Queried by the relayer when calculating fees.

## State Variables

 - **`chainId` ++"uint16"++**: Wormhole chain ID for the current network (e.g., 2 for Ethereum).
 - **`wormhole` ++"IWormhole"++**: Address of the core Wormhole messaging contract used to verify VAAs.
 - **`deliveryProvider` ++"address"++**: Address of the Delivery Provider contract responsible for quoting and setting delivery prices.
 - **`rewardAddress` ++"address"++**: Address that receives excess fees collected from users.
 - **`gasOverheads` ++"mapping(uint16 => GasOverhead)"++**: Per-chain gas overheads used to calculate delivery costs.
 - **`supportedChains` ++"mapping(uint16 => bool)"++**: Tracks which destination chains are supported for message delivery.
 - **`deliveries` ++"mapping(bytes32 => bool)"++**: Records completed deliveries (by VAA hash) to prevent replay.
 - **`deliverySuccessBlock` ++"mapping(bytes32 => uint256)"++**: Stores the block number when a delivery succeeded (used for auditing).
 - **`owner` ++"address"++**: Contract owner with permission to update system parameters (e.g., gas overheads).
 - **`chainHash` ++"uint256"++**: EVM chain ID hash used for cross-checking delivery source chain.
 - **`implementation` ++"address"++**: Address of the current logic contract (used in proxy pattern).

## Events

### SendEvent

Emitted when a send instruction is published and payment is handled. *(Defined in [IWormholeRelayerTyped.sol](https://github.com/wormhole-foundation/wormhole/blob/main/relayer/ethereum/contracts/interfaces/relayer/IWormholeRelayerTyped.sol){target=\_blank})*

```solidity
event SendEvent(
    uint64 indexed sequence,
    LocalNative deliveryQuote,
    LocalNative paymentForExtraReceiverValue
);
```

??? interface "Parameters"

    `sequence` ++"uint64"++

    Sequence number of the published delivery instruction message.

    ---

    `deliveryQuote` ++"LocalNative"++

    Price charged by the delivery provider (in source chain currency units).

    ---

    `paymentForExtraReceiverValue` ++"LocalNative"++

    Extra amount (in source chain currency units) used to top up the receiver value on the target chain.

### Delivery

Emitted after a delivery attempt is executed by a delivery provider. *(Defined in [IWormholeRelayerTyped.sol](https://github.com/wormhole-foundation/wormhole/blob/main/relayer/ethereum/contracts/interfaces/relayer/IWormholeRelayerTyped.sol){target=\_blank})*

```solidity
event Delivery(
    address indexed recipientContract,
    uint16 indexed sourceChain,
    uint64 indexed sequence,
    bytes32 deliveryVaaHash,
    DeliveryStatus status,
    Gas gasUsed,
    RefundStatus refundStatus,
    bytes additionalStatusInfo,
    bytes overridesInfo
);
```

??? interface "Parameters"

    `recipientContract` ++"address"++

    Target contract that was called.

    ---

    `sourceChain` ++"uint16"++

    Wormhole chain ID where the delivery was requested.

    ---

    `sequence` ++"uint64"++

    Sequence number of the delivery VAA on the source chain.

    ---

    `deliveryVaaHash` ++"bytes32"++

    Hash of the delivery VAA.

    ---

    `status` ++"DeliveryStatus"++

    `SUCCESS` if the target call did not revert; `RECEIVER_FAILURE` if it reverted.

    ---

    `gasUsed` ++"Gas"++

    Gas consumed when calling the target contract.

    ---

    `refundStatus` ++"RefundStatus"++

    Result of the refund path (same-chain or cross-chain) or `NO_REFUND_REQUESTED`.

    ---

    `additionalStatusInfo` ++"bytes"++

    Empty on success; otherwise, truncated return data from the revert.

    ---

    `overridesInfo` ++"bytes"++

    Empty if not an override; otherwise, an encoded `DeliveryOverride`.

### ContractUpgraded (WormholeRelayer)

Emitted when the Wormhole Relayer contract is upgraded to a new implementation via governance. *(Defined in [WormholeRelayerGovernance.sol](https://github.com/wormhole-foundation/wormhole/blob/main/relayer/ethereum/contracts/relayer/wormholeRelayer/WormholeRelayerGovernance.sol){target=\_blank})*

```solidity
event ContractUpgraded(
    address indexed oldContract,
    address indexed newContract
);
```

??? interface "Parameters"

    `oldContract` ++"address"++

    Address of the previous implementation.

    ---

    `newContract` ++"address"++

    Address of the new implementation.

### ContractUpgraded (DeliveryProvider)

Emitted when the Delivery Provider contract is upgraded to a new implementation. *(Defined in [DeliveryProviderGovernance.sol](https://github.com/wormhole-foundation/wormhole/blob/main/relayer/ethereum/contracts/relayer/deliveryProvider/DeliveryProviderGovernance.sol){target=\_blank})*

```solidity
event ContractUpgraded(
    address indexed oldContract,
    address indexed newContract
);
```

??? interface "Parameters"

    `oldContract` ++"address"++

    Address of the previous implementation.

    ---

    `newContract` ++"address"++

    Address of the new implementation.

### ChainSupportUpdated

Emitted when Delivery Provider support for a target chain is changed. *(Defined in [DeliveryProviderGovernance.sol](https://github.com/wormhole-foundation/wormhole/blob/main/relayer/ethereum/contracts/relayer/deliveryProvider/DeliveryProviderGovernance.sol){target=\_blank})*

```solidity
event ChainSupportUpdated(
    uint16 targetChain,
    bool isSupported
);
```

??? interface "Parameters"

    `targetChain` ++"uint16"++

    Wormhole chain ID whose support setting changed.

    ---

    `isSupported` ++"bool"++

    Whether deliveries to `targetChain` are supported.

### OwnershipTransfered

Emitted when Delivery Provider ownership is transferred. *(Defined in [DeliveryProviderGovernance.sol](https://github.com/wormhole-foundation/wormhole/blob/main/relayer/ethereum/contracts/relayer/deliveryProvider/DeliveryProviderGovernance.sol){target=\_blank})*

```solidity
event OwnershipTransfered(
    address indexed oldOwner,
    address indexed newOwner
);
```

??? interface "Parameters"

    `oldOwner` ++"address"++

    Previous owner.

    ---

    `newOwner` ++"address"++

    New owner.

### RewardAddressUpdated

Emitted when the Delivery Provider reward address is updated. *(Defined in [DeliveryProviderGovernance.sol](https://github.com/wormhole-foundation/wormhole/blob/main/relayer/ethereum/contracts/relayer/deliveryProvider/DeliveryProviderGovernance.sol){target=\_blank})*

```solidity
event RewardAddressUpdated(
    address indexed newAddress
);
```

??? interface "Parameters"

    `newAddress` ++"address"++

    New reward address.

### TargetChainAddressUpdated

Emitted when the Delivery Provider's peer address for a target chain is updated. *(Defined in [DeliveryProviderGovernance.sol](https://github.com/wormhole-foundation/wormhole/blob/main/relayer/ethereum/contracts/relayer/deliveryProvider/DeliveryProviderGovernance.sol){target=\_blank})*

```solidity
event TargetChainAddressUpdated(
    uint16 indexed targetChain,
    bytes32 indexed newAddress
);
```

??? interface "Parameters"

    `targetChain` ++"uint16"++

    Wormhole chain ID whose peer address changed.

    ---

    `newAddress` ++"bytes32"++

    New peer address in Wormhole bytes32 format.

### DeliverGasOverheadUpdated

Emitted when the configured gas overhead for deliveries is updated. *(Defined in [DeliveryProviderGovernance.sol](https://github.com/wormhole-foundation/wormhole/blob/main/relayer/ethereum/contracts/relayer/deliveryProvider/DeliveryProviderGovernance.sol){target=\_blank})*

```solidity
event DeliverGasOverheadUpdated(
    Gas indexed oldGasOverhead,
    Gas indexed newGasOverhead
);
```

??? interface "Parameters"

    `oldGasOverhead` ++"Gas"++

    Previous overhead value.

    ---

    `newGasOverhead` ++"Gas"++

    New overhead value.

### WormholeRelayerUpdated

Emitted when the Delivery Provider's associated Wormhole Relayer address is updated. *(Defined in [DeliveryProviderGovernance.sol](https://github.com/wormhole-foundation/wormhole/blob/main/relayer/ethereum/contracts/relayer/deliveryProvider/DeliveryProviderGovernance.sol){target=\_blank})*

```solidity
event WormholeRelayerUpdated(
    address coreRelayer
);
```

??? interface "Parameters"

    `coreRelayer` ++"address"++

    New Wormhole Relayer contract address on this chain.

### AssetConversionBufferUpdated

Emitted when the Delivery Provider's asset conversion buffer is updated. *(Defined in [DeliveryProviderGovernance.sol](https://github.com/wormhole-foundation/wormhole/blob/main/relayer/ethereum/contracts/relayer/deliveryProvider/DeliveryProviderGovernance.sol){target=\_blank})*

```solidity
event AssetConversionBufferUpdated(
    uint16 targetChain,
    uint16 buffer,
    uint16 bufferDenominator
);
```

??? interface "Parameters"

    `targetChain` ++"uint16"++

    Wormhole chain ID whose buffer settings changed.

    ---

    `buffer` ++"uint16"++

    Buffer numerator.

    ---

    `bufferDenominator` ++"uint16"++

    Buffer denominator.

## Functions

### sendPayloadToEvm

Publishes an instruction for the default delivery provider to relay a payload to an EVM target. Must be called with `msg.value == quoteEVMDeliveryPrice(targetChain, receiverValue, gasLimit)`. *(Defined in [WormholeRelayerSend.sol](https://github.com/wormhole-foundation/wormhole/blob/main/relayer/ethereum/contracts/relayer/wormholeRelayer/WormholeRelayerSend.sol){target=\_blank})*

```solidity
function sendPayloadToEvm(
    uint16 targetChain,
    address targetAddress,
    bytes memory payload,
    TargetNative receiverValue,
    Gas gasLimit
) external payable returns (uint64 sequence)
```

??? interface "Parameters"

    `targetChain` ++"uint16"++
    
    Wormhole chain ID of the destination chain.

    ---

    `targetAddress` ++"address"++
    
    Contract on the destination chain (must implement `IWormholeReceiver`).

    ---

    `payload` ++"bytes"++
    
    Bytes delivered to `targetAddress`.

    ---

    `receiverValue` ++"TargetNative"++
    
    Value (destination chain Wei) to forward to `targetAddress`.

    ---

    `gasLimit` ++"Gas"++

    Gas limit for calling `targetAddress`.

??? interface "Returns"

    `sequence` ++"uint64"++

    Sequence number of the published delivery instruction.

### sendPayloadToEvm (with refund)

Same as above, but sends any refund to refundAddress on refundChain. *(Defined in [WormholeRelayerSend.sol](https://github.com/wormhole-foundation/wormhole/blob/main/relayer/ethereum/contracts/relayer/wormholeRelayer/WormholeRelayerSend.sol){target=\_blank})*

```solidity
function sendPayloadToEvm(
    uint16 targetChain,
    address targetAddress,
    bytes memory payload,
    TargetNative receiverValue,
    Gas gasLimit,
    uint16 refundChain,
    address refundAddress
) external payable returns (uint64 sequence)
```

??? interface "Parameters"

    `targetChain` ++"uint16"++
    
    Wormhole chain ID of the destination chain.

    ---

    `targetAddress` ++"address"++
    
    Contract on the destination chain (must implement `IWormholeReceiver`).

    ---

    `payload` ++"bytes"++
    
    Bytes delivered to `targetAddress`.

    ---

    `receiverValue` ++"TargetNative"++
    
    Value (destination chain Wei) to forward to `targetAddress`.

    ---

    `gasLimit` ++"Gas"++
    
    Gas limit for calling `targetAddress`.

    ---

    `refundChain` ++"uint16"++
    
    Wormhole chain ID where refunds should be sent.

    ---

    `refundAddress` ++"address"++

    Address on `refundChain` to receive refunds.

??? interface "Returns"

    `sequence` ++"uint64"++

    Sequence number of the published delivery instruction.

### sendVaasToEvm (with refund)

Publishes an instruction (default delivery provider) to relay a payload and additional VAAs. Refunds go to `refundAddress` on `refundChain`. *(Defined in [WormholeRelayerSend.sol](https://github.com/wormhole-foundation/wormhole/blob/main/relayer/ethereum/contracts/relayer/wormholeRelayer/WormholeRelayerSend.sol){target=\_blank})*

```solidity
function sendVaasToEvm(
    uint16 targetChain,
    address targetAddress,
    bytes memory payload,
    TargetNative receiverValue,
    Gas gasLimit,
    VaaKey[] memory vaaKeys,
    uint16 refundChain,
    address refundAddress
) external payable returns (uint64 sequence)
```

??? interface "Parameters"

    `targetChain` ++"uint16"++

    Wormhole chain ID of the destination chain.

    ---  

    `targetAddress` ++"address"++

    Contract on the destination chain (must implement `IWormholeReceiver`).

    ---  

    `payload` ++"bytes"++

    Bytes delivered to `targetAddress`.

    ---  

    `receiverValue` ++"TargetNative"++

    Value (destination chain Wei) to forward to `targetAddress`.

    ---  

    `gasLimit` ++"Gas"++

    Gas limit for calling `targetAddress`.

    ---  

    `vaaKeys` ++"VaaKey[]"++

    Extra Wormhole messages (VAAs) to deliver along with `payload`.

    ---  

    `refundChain` ++"uint16"++

    Wormhole chain ID where any refund will be sent.

    ---  

    `refundAddress` ++"address"++

    Address on `refundChain` that receives any refund.

??? interface "Returns"

    `sequence` ++"uint64"++

    Sequence number of the published delivery instruction.

### sendToEvm (MessageKeys)

Publishes an instruction using a specific delivery provider, optionally attaching extra receiver value funded on the source chain and arbitrary MessageKeys (e.g., VAAs or other supported keys). *(Defined in [WormholeRelayerSend.sol](https://github.com/wormhole-foundation/wormhole/blob/main/relayer/ethereum/contracts/relayer/wormholeRelayer/WormholeRelayerSend.sol){target=\_blank})*

```solidity
function sendToEvm(
    uint16 targetChain,
    address targetAddress,
    bytes memory payload,
    TargetNative receiverValue,
    LocalNative paymentForExtraReceiverValue,
    Gas gasLimit,
    uint16 refundChain,
    address refundAddress,
    address deliveryProviderAddress,
    MessageKey[] memory messageKeys,
    uint8 consistencyLevel
) external payable returns (uint64 sequence)
```

??? interface "Parameters"

    `targetChain` ++"uint16"++

    Wormhole chain ID of the destination chain.

    ---

    `targetAddress` ++"address"++

    Contract on the destination chain (must implement `IWormholeReceiver`).

    ---

    `payload` ++"bytes"++

    Bytes delivered to `targetAddress`.

    ---

    `receiverValue` ++"TargetNative"++  
    Value (destination chain Wei) to forward to `targetAddress`.

    ---

    `paymentForExtraReceiverValue` ++"LocalNative"++

    Extra source chain amount. The delivery provider converts this to destination native and adds it to `receiverValue`.

    ---

    `gasLimit` ++"Gas"++

    Gas limit for calling `targetAddress` on the destination chain.

    ---

    `refundChain` ++"uint16"++

    Wormhole chain ID where any refund will be sent.

    ---

    `refundAddress` ++"address"++

    Address on `refundChain` that receives any refund.

    ---

    `deliveryProviderAddress` ++"address"++

    Chosen delivery provider (must implement `IDeliveryProvider`).

    ---

    `messageKeys` ++"MessageKey[]"++

    External messages to deliver (e.g., VAAs). Each key’s `keyType` **must** be supported by the delivery provider; otherwise the call reverts.

    ---

    `consistencyLevel` ++"uint8"++

    Wormhole publishing consistency (e.g., instant vs. finalized) used when emitting the delivery instruction.

??? interface "Returns"

    `sequence` ++"uint64"++

    Sequence number of the published delivery instruction.

### send (MessageKeys, generic)

Generic chain-agnostic form (addresses are Wormhole-formatted bytes32, and execution params are encoded). *(Defined in [WormholeRelayerSend.sol](https://github.com/wormhole-foundation/wormhole/blob/main/relayer/ethereum/contracts/relayer/wormholeRelayer/WormholeRelayerSend.sol){target=\_blank})*

```solidity
function send(
    uint16 targetChain,
    bytes32 targetAddress,
    bytes memory payload,
    TargetNative receiverValue,
    LocalNative paymentForExtraReceiverValue,
    bytes memory encodedExecutionParameters,
    uint16 refundChain,
    bytes32 refundAddress,
    address deliveryProviderAddress,
    MessageKey[] memory messageKeys,
    uint8 consistencyLevel
) external payable returns (uint64 sequence)
```

??? interface "Parameters"

    `targetChain` ++"uint16"++

    Wormhole chain ID of the destination chain.

    ---

    `targetAddress` ++"bytes32"++

    Wormhole-formatted 32-byte address of the destination contract.

    ---

    `payload` ++"bytes"++

    Bytes delivered to `targetAddress`.

    ---

    `receiverValue` ++"TargetNative"++

    Amount of destination chain native (e.g., Wei) forwarded to `targetAddress`.

    ---

    `paymentForExtraReceiverValue` ++"LocalNative"++

    Extra source chain native to be converted by the delivery provider and added to `receiverValue`.

    ---

    `encodedExecutionParameters` ++"bytes"++

    Versioned execution params for the target chain (e.g., for EVM use `encodeEvmExecutionParamsV1(EvmExecutionParamsV1(gasLimit))`).

    ---

    `refundChain` ++"uint16"++

    Wormhole chain ID where any refund will be sent.

    ---

    `refundAddress` ++"bytes32"++

    Wormhole-formatted address on `refundChain` that receives any refund.

    ---

    `deliveryProviderAddress` ++"address"++

    Chosen delivery provider (must implement `IDeliveryProvider`).

    ---

    `messageKeys` ++"MessageKey[]"++

    External messages to deliver (e.g., VAAs). Each key’s `keyType` **must** be supported by the delivery provider.

    ---

    `consistencyLevel` ++"uint8"++

    Wormhole publishing consistency used when emitting the delivery instruction.

??? interface "Returns"

    `sequence` ++"uint64"++

    Sequence number of the published delivery instruction.

### resendToEvm

Requests a previously published delivery instruction to be redelivered (EVM convenience). *(Defined in [WormholeRelayerSend.sol](https://github.com/wormhole-foundation/wormhole/blob/main/relayer/ethereum/contracts/relayer/wormholeRelayer/WormholeRelayerSend.sol){target=\_blank})*

```solidity
function resendToEvm(
    VaaKey memory deliveryVaaKey,
    uint16 targetChain,
    TargetNative newReceiverValue,
    Gas newGasLimit,
    address newDeliveryProviderAddress
) external payable returns (uint64 sequence)
```

??? interface "Parameters"

    `deliveryVaaKey` ++"VaaKey"++

    Identifies the original delivery instruction VAA.

    ---  

    `targetChain` ++"uint16"++

    Wormhole chain ID where the message should be redelivered.

    ---  

    `newReceiverValue` ++"TargetNative"++

    Updated value sent to the target contract.

    ---  

    `newGasLimit` ++"Gas"++

    Updated gas limit for the target call.

    ---  

    `newDeliveryProviderAddress` ++"address"++

    Delivery provider to use for the redelivery.

??? interface "Returns"

    `sequence` ++"uint64"++

    Sequence number of the redelivery instruction.

### resend (generic)

Generic redelivery (chain-agnostic execution params). *(Defined in [WormholeRelayerSend.sol](https://github.com/wormhole-foundation/wormhole/blob/main/relayer/ethereum/contracts/relayer/wormholeRelayer/WormholeRelayerSend.sol){target=\_blank})*

```solidity
function resend(
    VaaKey memory deliveryVaaKey,
    uint16 targetChain,
    TargetNative newReceiverValue,
    bytes memory newEncodedExecutionParameters,
    address newDeliveryProviderAddress
) external payable returns (uint64 sequence)
```

??? interface "Parameters"

    `deliveryVaaKey` ++"VaaKey"++
    
    Identifies the original delivery instruction VAA.

    ---  

    `targetChain` ++"uint16"++
    
    Wormhole chain ID where the message should be redelivered.

    ---  

    `newReceiverValue` ++"TargetNative"++
    
    Updated value to forward to the target contract on the destination chain.

    ---  

    `newEncodedExecutionParameters` ++"bytes"++
    
    Versioned, chain-specific execution params for the redelivery (e.g., for EVM use `encodeEvmExecutionParamsV1(EvmExecutionParamsV1(gasLimit))`).

    ---  

    `newDeliveryProviderAddress` ++"address"++
    
    Delivery provider to use for the redelivery (must implement `IDeliveryProvider`).

??? interface "Returns"

    `sequence` ++"uint64"++

    Sequence number of the redelivery instruction.

### quoteEVMDeliveryPrice (default provider)

Returns the price and refund-per-gas info for an EVM delivery using the default provider. *(Defined in [WormholeRelayerSend.sol](https://github.com/wormhole-foundation/wormhole/blob/main/relayer/ethereum/contracts/relayer/wormholeRelayer/WormholeRelayerSend.sol){target=\_blank})*

```solidity
function quoteEVMDeliveryPrice(
    uint16 targetChain,
    TargetNative receiverValue,
    Gas gasLimit
) external view returns (LocalNative nativePriceQuote, GasPrice targetChainRefundPerGasUnused)
```

??? interface "Parameters"

    `targetChain` ++"uint16"++

    Wormhole chain ID of the destination chain.

    ---

    `receiverValue` ++"TargetNative"++

    Amount of destination chain Wei that will be forwarded to the target contract.

    ---

    `gasLimit` ++"Gas"++

    Gas limit that will be used to call the target contract.

??? interface "Returns"

    `nativePriceQuote` ++"LocalNative"++

    Source chain price to request the delivery.
    
    ---

    `targetChainRefundPerGasUnused` ++"GasPrice"++

    Refund rate per unused gas on target chain.

### quoteEVMDeliveryPrice (explicit provider)

Same as above, but quotes using a given provider. *(Defined in [WormholeRelayerSend.sol](https://github.com/wormhole-foundation/wormhole/blob/main/relayer/ethereum/contracts/relayer/wormholeRelayer/WormholeRelayerSend.sol){target=\_blank})*

```solidity
function quoteEVMDeliveryPrice(
    uint16 targetChain,
    TargetNative receiverValue,
    Gas gasLimit,
    address deliveryProviderAddress
) external view returns (LocalNative nativePriceQuote, GasPrice targetChainRefundPerGasUnused)
```

??? interface "Parameters"

    `targetChain` ++"uint16"++

    Wormhole chain ID of the destination chain.

    ---

    `receiverValue` ++"TargetNative"++

    Amount of destination chain Wei to forward to the target contract.

    ---

    `gasLimit` ++"Gas"++

    Gas limit to call the target contract with.

    ---

    `deliveryProviderAddress` ++"address"++

    Address of the chosen provider (implements `IDeliveryProvider`).

??? interface "Returns"

    `nativePriceQuote` ++"LocalNative"++

    Source chain price to request this delivery.

    ---

    `targetChainRefundPerGasUnused` ++"GasPrice"++

    Refund rate per unit of unused gas on the destination chain.

### quoteDeliveryPrice (generic)

Generic quote (versioned execution params), returning price and provider's encoded execution info. *(Defined in [WormholeRelayerSend.sol](https://github.com/wormhole-foundation/wormhole/blob/main/relayer/ethereum/contracts/relayer/wormholeRelayer/WormholeRelayerSend.sol){target=\_blank})*

```solidity
function quoteDeliveryPrice(
    uint16 targetChain,
    TargetNative receiverValue,
    bytes memory encodedExecutionParameters,
    address deliveryProviderAddress
) external view returns (LocalNative nativePriceQuote, bytes memory encodedExecutionInfo)
```

??? interface "Parameters"

    `targetChain` ++"uint16"++

    Wormhole chain ID of the destination chain.

    ---

    `receiverValue` ++"TargetNative"++

    Amount of destination chain Wei to forward to the target contract.

    ---

    `encodedExecutionParameters` ++"bytes"++

    Versioned execution parameters (e.g., for `EVM_V1`, encodes the gas limit).

    ---

    `deliveryProviderAddress` ++"address"++

    Address of the chosen provider (implements `IDeliveryProvider`).

??? interface "Returns"

    `nativePriceQuote` ++"LocalNative"++

    Source chain price to request this delivery.

    ---

    `encodedExecutionInfo` ++"bytes"++

    Provider's encoded execution info (e.g., for `EVM_V1`, includes gas limit and refund-per-gas).

### quoteNativeForChain

Converts a source chain amount into extra value that will be delivered on the target chain. *(Defined in [WormholeRelayerSend.sol](https://github.com/wormhole-foundation/wormhole/blob/main/relayer/ethereum/contracts/relayer/wormholeRelayer/WormholeRelayerSend.sol){target=\_blank})*

```solidity
function quoteNativeForChain(
    uint16 targetChain,
    LocalNative currentChainAmount,
    address deliveryProviderAddress
) external view returns (TargetNative targetChainAmount)
```

??? interface "Parameters"

    `targetChain` ++"uint16"++

    Wormhole chain ID of the destination chain.

    ---

    `currentChainAmount` ++"LocalNative"++

    Amount paid on the source chain to fund extra receiver value.

    ---

    `deliveryProviderAddress` ++"address"++

    Address of the chosen provider (implements `IDeliveryProvider`).

??? interface "Returns"

    `targetChainAmount` ++"TargetNative"++

    Extra destination chain Wei that will be added to the call's value.

### getDefaultDeliveryProvider

Returns the current default delivery provider address. *(Defined in [WormholeRelayerSend.sol](https://github.com/wormhole-foundation/wormhole/blob/main/relayer/ethereum/contracts/relayer/wormholeRelayer/WormholeRelayerSend.sol){target=\_blank})*

```solidity
function getDefaultDeliveryProvider() external view returns (address deliveryProvider)
```

??? interface "Returns"

    `deliveryProvider` ++"address"++

    Address of the default `IDeliveryProvider` on this chain.

### deliver

Called by a delivery provider to execute a delivery on the target chain. *(Defined in [WormholeRelayerDelivery.sol](https://github.com/wormhole-foundation/wormhole/blob/main/relayer/ethereum/contracts/relayer/wormholeRelayer/WormholeRelayerDelivery.sol){target=\_blank})*

```solidity
function deliver(
    bytes[] memory encodedVMs,
    bytes memory encodedDeliveryVAA,
    address payable relayerRefundAddress,
    bytes memory deliveryOverrides
) external payable
```

??? interface "Parameters"

    `encodedVMs` ++"bytes[]"+

    Signed Wormhole messages to relay.

    ---

    `encodedDeliveryVAA` ++"bytes"++

    Signed WormholeRelayer instruction VAA.

    ---

    `relayerRefundAddress` ++"address payable"++

    Address to receive any relayer refund.

    ---

    `deliveryOverrides` ++"bytes"++

    Optional encoded overrides (or empty).

### deliveryAttempted

Checks whether a delivery attempt has been made for a given hash. *(Defined in [WormholeRelayerBase.sol](https://github.com/wormhole-foundation/wormhole/blob/main/relayer/ethereum/contracts/relayer/wormholeRelayer/WormholeRelayerBase.sol){target=\_blank})*

```solidity
function deliveryAttempted(bytes32 deliveryHash) external view returns (bool attempted)
```

??? interface "Parameters"

    `deliveryHash` ++"bytes32"++

    Hash of the delivery VAA.

??? interface "Returns"

    `attempted` ++"bool"++

    `true` if a success or failure block was recorded for this hash.

### deliverySuccessBlock

Block number when a delivery was successfully executed. *(Defined in [WormholeRelayerBase.sol](https://github.com/wormhole-foundation/wormhole/blob/main/relayer/ethereum/contracts/relayer/wormholeRelayer/WormholeRelayerBase.sol){target=\_blank})*

```solidity
function deliverySuccessBlock(bytes32 deliveryHash) external view returns (uint256 blockNumber)
```

??? interface "Parameters"

    `deliveryHash` ++"bytes32"++

    Hash of the delivery VAA.

??? interface "Returns"

    `blockNumber` ++"uint256"++

    Block number where the delivery was marked successful (0 if never successful).

### deliveryFailureBlock

Block number of the latest failed delivery attempt. *(Defined in [WormholeRelayerBase.sol](https://github.com/wormhole-foundation/wormhole/blob/main/relayer/ethereum/contracts/relayer/wormholeRelayer/WormholeRelayerBase.sol){target=\_blank})*

```solidity
function deliveryFailureBlock(bytes32 deliveryHash) external view returns (uint256 blockNumber)
```

??? interface "Parameters"

    `deliveryHash` ++"bytes32"++

    Hash of the delivery VAA.

??? interface "Returns"

    `blockNumber` ++"uint256"++

    Block number of the most recent failed attempt (0 if none).

### getRegisteredWormholeRelayerContract

Returns the registered Wormhole Relayer contract address (wormhole format) for a given chain ID. *(Defined in [WormholeRelayerBase.sol](https://github.com/wormhole-foundation/wormhole/blob/main/relayer/ethereum/contracts/relayer/wormholeRelayer/WormholeRelayerBase.sol){target=\_blank})*

```solidity
function getRegisteredWormholeRelayerContract(uint16 chainId) external view returns (bytes32)
```

??? interface "Parameters"

    `chainId` ++"uint16"++

    Wormhole chain ID.

??? interface "Returns"

    `address` ++"bytes32"++

    Wormhole-formatted address of the relayer contract registered for `chainId` (zero if none).

### registerWormholeRelayerContract

Registers a Wormhole Relayer contract deployed on another chain (governance VM required). *(Defined in [WormholeRelayerGovernance.sol](https://github.com/wormhole-foundation/wormhole/blob/main/relayer/ethereum/contracts/relayer/wormholeRelayer/WormholeRelayerGovernance.sol){target=\_blank})*

```solidity
function registerWormholeRelayerContract(bytes memory encodedVm) external
```

??? interface "Parameters"

    `encodedVm` ++"bytes"++

    Signed governance VM that encodes the `foreignChainId` and `foreignContractAddress`.

### setDefaultDeliveryProvider

Sets the default delivery provider via a governance VM. *(Defined in [WormholeRelayerGovernance.sol](https://github.com/wormhole-foundation/wormhole/blob/main/relayer/ethereum/contracts/relayer/wormholeRelayer/WormholeRelayerGovernance.sol){target=\_blank})*

```solidity
function setDefaultDeliveryProvider(bytes memory encodedVm) external
```

??? interface "Parameters"

    `encodedVm` ++"bytes"++

    Signed governance VM that encodes the new provider address.

### submitContractUpgrade

Upgrades the Wormhole Relayer contract to a new implementation (governance VM required). *(Defined in [WormholeRelayerGovernance.sol](https://github.com/wormhole-foundation/wormhole/blob/main/relayer/ethereum/contracts/relayer/wormholeRelayer/WormholeRelayerGovernance.sol){target=\_blank})*

```solidity
function submitContractUpgrade(bytes memory encodedVm) external
```

??? interface "Parameters"

    `encodedVm` ++"bytes"++

    Signed governance VM that encodes the new implementation address.

## Errors

### InvalidDeliveryVaa

Thrown when the delivery VAA fails `parseAndVerifyVM`. *(Used in [WormholeRelayerDelivery.sol](https://github.com/wormhole-foundation/wormhole/blob/main/relayer/ethereum/contracts/relayer/wormholeRelayer/WormholeRelayerDelivery.sol){target=\_blank}, defined in [IWormholeRelayerTyped.sol](https://github.com/wormhole-foundation/wormhole/blob/main/relayer/ethereum/contracts/interfaces/relayer/IWormholeRelayerTyped.sol){target=\_blank})*

### InvalidEmitter

Emitted when the VAA emitter is not the registered Wormhole Relayer for the source chain. *(Used in WormholeRelayerDelivery.sol, defined in [IWormholeRelayerTyped.sol](https://github.com/wormhole-foundation/wormhole/blob/main/relayer/ethereum/contracts/interfaces/relayer/IWormholeRelayerTyped.sol){target=\_blank})*

### InsufficientRelayerFunds

Reverts if `msg.value` is less than the required execution + refund budget on the target chain. *(Used in [WormholeRelayerDelivery.sol](https://github.com/wormhole-foundation/wormhole/blob/main/relayer/ethereum/contracts/relayer/wormholeRelayer/WormholeRelayerDelivery.sol){target=\_blank}, defined in [IWormholeRelayerTyped.sol](https://github.com/wormhole-foundation/wormhole/blob/main/relayer/ethereum/contracts/interfaces/relayer/IWormholeRelayerTyped.sol){target=\_blank})*

### TargetChainIsNotThisChain

Reverts when the instruction's `targetChain` does not match the current chain. *(Used in [WormholeRelayerDelivery.sol](https://github.com/wormhole-foundation/wormhole/blob/main/relayer/ethereum/contracts/relayer/wormholeRelayer/WormholeRelayerDelivery.sol){target=\_blank}, defined in [IWormholeRelayerTyped.sol](https://github.com/wormhole-foundation/wormhole/blob/main/relayer/ethereum/contracts/interfaces/relayer/IWormholeRelayerTyped.sol){target=\_blank})*

### MessageKeysLengthDoesNotMatchMessagesLength

Reverts when the provided message keys do not match the number of delivered messages. (Used in [WormholeRelayerDelivery.sol](https://github.com/wormhole-foundation/wormhole/blob/main/relayer/ethereum/contracts/relayer/wormholeRelayer/WormholeRelayerDelivery.sol){target=\_blank}), defined in [IWormholeRelayerTyped.sol](https://github.com/wormhole-foundation/wormhole/blob/main/relayer/ethereum/contracts/interfaces/relayer/IWormholeRelayerTyped.sol){target=\_blank})

### VaaKeysDoNotMatchVaas

Reverts when described VAAs don't match the actual VAAs delivered. *(Used in [WormholeRelayerDelivery.sol](https://github.com/wormhole-foundation/wormhole/blob/main/relayer/ethereum/contracts/relayer/wormholeRelayer/WormholeRelayerDelivery.sol){target=\_blank}, defined in [IWormholeRelayerTyped.sol](https://github.com/wormhole-foundation/wormhole/blob/main/relayer/ethereum/contracts/interfaces/relayer/IWormholeRelayerTyped.sol){target=\_blank})*

### InvalidOverrideGasLimit

Reverts if a redelivery override sets a gas limit lower than the original. *(Used in [WormholeRelayerDelivery.sol](https://github.com/wormhole-foundation/wormhole/blob/main/relayer/ethereum/contracts/relayer/wormholeRelayer/WormholeRelayerDelivery.sol){target=\_blank}, defined in [IWormholeRelayerTyped.sol](https://github.com/wormhole-foundation/wormhole/blob/main/relayer/ethereum/contracts/interfaces/relayer/IWormholeRelayerTyped.sol){target=\_blank})*

### InvalidOverrideReceiverValue

Reverts if a redelivery override sets a receiver value lower than the original. *(Used in [WormholeRelayerDelivery.sol](https://github.com/wormhole-foundation/wormhole/blob/main/relayer/ethereum/contracts/relayer/wormholeRelayer/WormholeRelayerDelivery.sol){target=\_blank}, defined in [IWormholeRelayerTyped.sol](https://github.com/wormhole-foundation/wormhole/blob/main/relayer/ethereum/contracts/interfaces/relayer/IWormholeRelayerTyped.sol){target=\_blank})*

### InvalidMsgValue

Reverts when msg.value does not equal `wormholeMessageFee` + `deliveryQuote` + `paymentForExtraReceiverValue`. *(Used in [WormholeRelayerBase.sol](https://github.com/wormhole-foundation/wormhole/blob/main/relayer/ethereum/contracts/relayer/wormholeRelayer/WormholeRelayerBase.sol){target=\_blank}, defined in [IWormholeRelayerTyped.sol](https://github.com/wormhole-foundation/wormhole/blob/main/relayer/ethereum/contracts/interfaces/relayer/IWormholeRelayerTyped.sol){target=\_blank})*

### ReentrantDelivery

Reverts on re-entrant calls to relayer entrypoints guarded by `nonReentrant`. *(Used in [WormholeRelayerBase.sol](https://github.com/wormhole-foundation/wormhole/blob/main/relayer/ethereum/contracts/relayer/wormholeRelayer/WormholeRelayerBase.sol){target=\_blank}, defined in [IWormholeRelayerTyped.sol](https://github.com/wormhole-foundation/wormhole/blob/main/relayer/ethereum/contracts/interfaces/relayer/IWormholeRelayerTyped.sol){target=\_blank})*

### CallerNotApproved(address msgSender)

Custom error declared for access checks. *(Defined in [DeliveryProvider.sol](https://github.com/wormhole-foundation/wormhole/blob/main/relayer/ethereum/contracts/relayer/deliveryProvider/DeliveryProvider.sol){target=\_blank})*

### PriceIsZero(uint16 chain)

Reverts if a required price value for a chain is zero during quoting/conversion. *(Defined in [DeliveryProvider.sol](https://github.com/wormhole-foundation/wormhole/blob/main/relayer/ethereum/contracts/relayer/deliveryProvider/DeliveryProvider.sol){target=\_blank})*

### Overflow(uint256 value, uint256 max)

Reverts when an internal quote exceeds a type's allowed maximum (e.g., gas overhead/price bounds). *(Defined in [DeliveryProvider.sol](https://github.com/wormhole-foundation/wormhole/blob/main/relayer/ethereum/contracts/relayer/deliveryProvider/DeliveryProvider.sol){target=\_blank})*

### MaxRefundGreaterThanGasLimitCost(uint256 maxRefund, uint256 gasLimitCost)

Declared to guard refund limits vs. gas limit cost. *(Defined in [DeliveryProvider.sol](https://github.com/wormhole-foundation/wormhole/blob/main/relayer/ethereum/contracts/relayer/deliveryProvider/DeliveryProvider.sol){target=\_blank})*

### MaxRefundGreaterThanGasLimitCostOnSourceChain(uint256 maxRefund, uint256 gasLimitCost)

Declared to guard source chain refund limits vs. gas limit cost. *(Defined in [DeliveryProvider.sol](https://github.com/wormhole-foundation/wormhole/blob/main/relayer/ethereum/contracts/relayer/deliveryProvider/DeliveryProvider.sol){target=\_blank})*

### ExceedsMaximumBudget(uint16 targetChain, uint256 exceedingValue, uint256 maximumBudget)

Reverts when required target-chain Wei (receiver value + gas) exceeds that chain's configured maximum budget. *(Defined in [DeliveryProvider.sol](https://github.com/wormhole-foundation/wormhole/blob/main/relayer/ethereum/contracts/relayer/deliveryProvider/DeliveryProvider.sol){target=\_blank})*

### ChainIdIsZero()

Reverts if an update is attempted with `chainId = 0`. *(Defined in [DeliveryProviderGovernance.sol](https://github.com/wormhole-foundation/wormhole/blob/main/relayer/ethereum/contracts/relayer/deliveryProvider/DeliveryProviderGovernance.sol){target=\_blank})*

### GasPriceIsZero()

Reverts if a price update sets gas price to zero. *(Defined in [DeliveryProviderGovernance.sol](https://github.com/wormhole-foundation/wormhole/blob/main/relayer/ethereum/contracts/relayer/deliveryProvider/DeliveryProviderGovernance.sol){target=\_blank})*

### NativeCurrencyPriceIsZero()

Reverts if a price update sets native currency price to zero. *(Defined in [DeliveryProviderGovernance.sol](https://github.com/wormhole-foundation/wormhole/blob/main/relayer/ethereum/contracts/relayer/deliveryProvider/DeliveryProviderGovernance.sol){target=\_blank})*

### FailedToInitializeImplementation(string reason)

Reverts if the implementation's `initialize()` delegatecall fails during upgrade/setup. *(Defined in [DeliveryProviderGovernance.sol](https://github.com/wormhole-foundation/wormhole/blob/main/relayer/ethereum/contracts/relayer/deliveryProvider/DeliveryProviderGovernance.sol){target=\_blank} and [DeliveryProviderSetup.sol](https://github.com/wormhole-foundation/wormhole/blob/main/relayer/ethereum/contracts/relayer/deliveryProvider/DeliveryProviderSetup.sol){target=\_blank})*

### WrongChainId()

Reverts when an operation is invoked with a chainId that doesn't match the contract's configured chain. *(Defined in [DeliveryProviderGovernance.sol](https://github.com/wormhole-foundation/wormhole/blob/main/relayer/ethereum/contracts/relayer/deliveryProvider/DeliveryProviderGovernance.sol){target=\_blank})*

### AddressIsZero()

Reverts if a zero address is provided where a nonzero address is required (e.g., ownership handoff). *(Defined in [DeliveryProviderGovernance.sol](https://github.com/wormhole-foundation/wormhole/blob/main/relayer/ethereum/contracts/relayer/deliveryProvider/DeliveryProviderGovernance.sol){target=\_blank})*

### CallerMustBePendingOwner()

Reverts if `confirmOwnershipTransferRequest` is called by an address other than `pendingOwner`. *(Defined in [DeliveryProviderGovernance.sol](https://github.com/wormhole-foundation/wormhole/blob/main/relayer/ethereum/contracts/relayer/deliveryProvider/DeliveryProviderGovernance.sol){target=\_blank})*

### CallerMustBeOwner()

Reverts on functions guarded by `onlyOwner` when `msg.sender` is not the owner. *(Defined in [DeliveryProviderGovernance.sol](https://github.com/wormhole-foundation/wormhole/blob/main/relayer/ethereum/contracts/relayer/deliveryProvider/DeliveryProviderGovernance.sol){target=\_blank})*

### CallerMustBeOwnerOrPricingWallet()

Reverts on functions guarded by `onlyOwnerOrPricingWallet` when caller is neither. *(Defined in [DeliveryProviderGovernance.sol](https://github.com/wormhole-foundation/wormhole/blob/main/relayer/ethereum/contracts/relayer/deliveryProvider/DeliveryProviderGovernance.sol){target=\_blank})*

### ImplementationAlreadyInitialized()

Reverts if `initialize()` is called on an implementation that was already initialized. *(Defined in [DeliveryProviderImplementation.sol](https://github.com/wormhole-foundation/wormhole/blob/main/relayer/ethereum/contracts/relayer/deliveryProvider/DeliveryProviderImplementation.sol){target=\_blank})*

### ImplementationAddressIsZero()

Reverts if `setup()` is called with a zero implementation address. *(Defined in [DeliveryProviderSetup.sol](https://github.com/wormhole-foundation/wormhole/blob/main/relayer/ethereum/contracts/relayer/deliveryProvider/DeliveryProviderSetup.sol){target=\_blank})*

### UnexpectedExecutionInfoVersion

Reverts when the `executionInfoVersion` in the delivery VAA does not match the expected version. *(Defined in [WormholeRelayerDelivery.sol](https://github.com/wormhole-foundation/wormhole/blob/main/relayer/ethereum/contracts/relayer/wormholeRelayer/WormholeRelayerDelivery.sol){target=\_blank})*

### VersionMismatchOverride

Reverts when the override's `executionInfoVersion` does not match the original delivery's version. *(Defined in [WormholeRelayerDelivery.sol](https://github.com/wormhole-foundation/wormhole/blob/main/relayer/ethereum/contracts/relayer/wormholeRelayer/WormholeRelayerDelivery.sol){target=\_blank})*


---

Page Title: Supported Networks

- Source (raw): https://raw.githubusercontent.com/wormhole-foundation/wormhole-docs/main/.ai/pages/products-reference-supported-networks.md
- Canonical (HTML): https://wormhole.com/docs/products/reference/supported-networks/
- Summary: Learn about the networks each Wormhole product supports, and explore links to documentation, official websites, and block explorers.

# Supported Networks

Wormhole supports many blockchains across mainnet, testnet, and devnets. You can use these tables to verify if your desired chains are supported by the Wormhole products you plan to include in your integration. 

## Supported Networks by Product

### Connect



<div class="full-width" markdown>

<table data-full-width="true" markdown><thead><th>Blockchain</th><th>Environment</th><th>Mainnet</th><th>Testnet</th><th>Devnet</th><th>Quick Links</th></thead><tbody><tr><td>Ethereum</td><td>EVM</td><td>:white_check_mark:</td><td>:white_check_mark:</td><td>:white_check_mark:</td><td>:material-web: <a href="https://ethereum.org/" target="_blank">Website</a><br>:material-file-document: <a href="https://ethereum.org/en/developers/docs/" target="_blank">Developer Docs</a><br>:octicons-package-16: <a href="https://etherscan.io/" target="_blank">Block Explorer</a></td></tr><tr><td>Solana</td><td>SVM</td><td>:white_check_mark:</td><td>:white_check_mark:</td><td>:x:</td><td>:material-web: <a href="https://solana.com/" target="_blank">Website</a><br>:material-file-document: <a href="https://solana.com/docs" target="_blank">Developer Docs</a><br>:octicons-package-16: <a href="https://explorer.solana.com/" target="_blank">Block Explorer</a></td></tr><tr><td>Aptos</td><td>Move VM</td><td>:white_check_mark:</td><td>:white_check_mark:</td><td>:x:</td><td>:material-web: <a href="https://aptosnetwork.com/" target="_blank">Website</a><br>:material-file-document: <a href="https://aptos.dev/" target="_blank">Developer Docs</a><br>:octicons-package-16: <a href="https://explorer.aptoslabs.com/" target="_blank">Block Explorer</a></td></tr><tr><td>Arbitrum</td><td>EVM</td><td>:white_check_mark:</td><td>:white_check_mark:</td><td>:x:</td><td>:material-web: <a href="https://arbitrum.io/" target="_blank">Website</a><br>:material-file-document: <a href="https://docs.arbitrum.io/" target="_blank">Developer Docs</a><br>:octicons-package-16: <a href="https://arbiscan.io/" target="_blank">Block Explorer</a></td></tr><tr><td>Avalanche</td><td>EVM</td><td>:white_check_mark:</td><td>:white_check_mark:</td><td>:x:</td><td>:material-web: <a href="https://www.avax.network/" target="_blank">Website</a><br>:material-file-document: <a href="https://build.avax.network/docs" target="_blank">Developer Docs</a><br>:octicons-package-16: <a href="https://snowtrace.io/" target="_blank">Block Explorer</a></td></tr><tr><td>Base</td><td>EVM</td><td>:white_check_mark:</td><td>:white_check_mark:</td><td>:x:</td><td>:material-web: <a href="https://base.org/" target="_blank">Website</a><br>:material-file-document: <a href="https://docs.base.org/" target="_blank">Developer Docs</a><br>:octicons-package-16: <a href="https://base-goerli.blockscout.com/" target="_blank">Block Explorer</a></td></tr><tr><td>Berachain</td><td>EVM</td><td>:white_check_mark:</td><td>:x:</td><td>:x:</td><td>:material-web: <a href="https://www.berachain.com/" target="_blank">Website</a><br>:material-file-document: <a href="https://docs.berachain.com/" target="_blank">Developer Docs</a><br>:octicons-package-16: <a href="https://berascan.com/" target="_blank">Block Explorer</a></td></tr><tr><td>BNB Smart Chain</td><td>EVM</td><td>:white_check_mark:</td><td>:white_check_mark:</td><td>:x:</td><td>:material-web: <a href="https://www.bnbchain.org/en/bnb-smart-chain" target="_blank">Website</a><br>:material-file-document: <a href="https://docs.bnbchain.org/" target="_blank">Developer Docs</a><br>:octicons-package-16: <a href="https://bscscan.com/" target="_blank">Block Explorer</a></td></tr><tr><td>Celo</td><td>EVM</td><td>:white_check_mark:</td><td>:white_check_mark:</td><td>:x:</td><td>:material-web: <a href="https://celo.org/" target="_blank">Website</a><br>:material-file-document: <a href="https://docs.celo.org/" target="_blank">Developer Docs</a><br>:octicons-package-16: <a href="https://celo.blockscout.com/" target="_blank">Block Explorer</a></td></tr><tr><td>Fantom</td><td>EVM</td><td>:white_check_mark:</td><td>:white_check_mark:</td><td>:x:</td><td>:material-web: <a href="https://fantom.foundation/" target="_blank">Website</a><br>:material-file-document: <a href="https://docs.fantom.foundation/" target="_blank">Developer Docs</a><br>:octicons-package-16: <a href="https://explorer.fantom.network/" target="_blank">Block Explorer</a></td></tr><tr><td>Mantle</td><td>EVM</td><td>:white_check_mark:</td><td>:white_check_mark:</td><td>:x:</td><td>:material-web: <a href="https://www.mantle.xyz/" target="_blank">Website</a><br>:material-file-document: <a href="https://docs.mantle.xyz/network/" target="_blank">Developer Docs</a><br>:octicons-package-16: <a href="https://mantlescan.xyz/" target="_blank">Block Explorer</a></td></tr><tr><td>Mezo</td><td>EVM</td><td>:x:</td><td>:white_check_mark:</td><td>:x:</td><td>:material-web: <a href="https://mezo.org/" target="_blank">Website</a><br>:material-file-document: <a href="https://mezo.org/docs/developers/" target="_blank">Developer Docs</a><br>:octicons-package-16: <a href="https://explorer.test.mezo.org/" target="_blank">Block Explorer</a></td></tr><tr><td>Moonbeam</td><td>EVM</td><td>:white_check_mark:</td><td>:white_check_mark:</td><td>:x:</td><td>:material-web: <a href="https://moonbeam.network/" target="_blank">Website</a><br>:material-file-document: <a href="https://docs.moonbeam.network/" target="_blank">Developer Docs</a><br>:octicons-package-16: <a href="https://moonscan.io/" target="_blank">Block Explorer</a></td></tr><tr><td>Optimism</td><td>EVM</td><td>:white_check_mark:</td><td>:white_check_mark:</td><td>:x:</td><td>:material-web: <a href="https://www.optimism.io/" target="_blank">Website</a><br>:material-file-document: <a href="https://docs.optimism.io/" target="_blank">Developer Docs</a><br>:octicons-package-16: <a href="https://optimistic.etherscan.io/" target="_blank">Block Explorer</a></td></tr><tr><td>Osmosis</td><td>CosmWasm</td><td>:x:</td><td>:x:</td><td>:white_check_mark:</td><td>:material-web: <a href="https://osmosis.zone/" target="_blank">Website</a><br>:material-file-document: <a href="https://docs.osmosis.zone/" target="_blank">Developer Docs</a><br>:octicons-package-16: <a href="https://docs.osmosis.zone/overview/endpoints#explorers" target="_blank">Block Explorer</a></td></tr><tr><td>Polygon</td><td>EVM</td><td>:white_check_mark:</td><td>:x:</td><td>:x:</td><td>:material-web: <a href="https://polygon.technology/" target="_blank">Website</a><br>:material-file-document: <a href="https://docs.polygon.technology/" target="_blank">Developer Docs</a><br>:octicons-package-16: <a href="https://polygonscan.com/" target="_blank">Block Explorer</a></td></tr><tr><td>Scroll</td><td>EVM</td><td>:white_check_mark:</td><td>:white_check_mark:</td><td>:x:</td><td>:material-web: <a href="https://scroll.io/" target="_blank">Website</a><br>:material-file-document: <a href="https://docs.scroll.io/en/home/" target="_blank">Developer Docs</a><br>:octicons-package-16: <a href="https://scrollscan.com/" target="_blank">Block Explorer</a></td></tr><tr><td>Sui</td><td>Sui Move VM</td><td>:white_check_mark:</td><td>:white_check_mark:</td><td>:x:</td><td>:material-web: <a href="https://sui.io/" target="_blank">Website</a><br>:material-file-document: <a href="https://docs.sui.io/" target="_blank">Developer Docs</a><br>:octicons-package-16: <a href="https://suiscan.xyz/" target="_blank">Block Explorer</a></td></tr><tr><td>Unichain</td><td>EVM</td><td>:white_check_mark:</td><td>:white_check_mark:</td><td>:x:</td><td>:material-web: <a href="https://www.unichain.org/" target="_blank">Website</a><br>:material-file-document: <a href="https://docs.unichain.org/docs" target="_blank">Developer Docs</a><br>:octicons-package-16: <a href="https://sepolia.uniscan.xyz/" target="_blank">Block Explorer</a></td></tr><tr><td>World Chain</td><td>EVM</td><td>:white_check_mark:</td><td>:white_check_mark:</td><td>:x:</td><td>:material-web: <a href="https://world.org/world-chain" target="_blank">Website</a><br>:material-file-document: <a href="https://docs.world.org/" target="_blank">Developer Docs</a><br>:octicons-package-16: <a href="https://docs.world.org/world-chain/providers/explorers" target="_blank">Block Explorer</a></td></tr><tr><td>X Layer</td><td>EVM</td><td>:white_check_mark:</td><td>:white_check_mark:</td><td>:x:</td><td>:material-web: <a href="https://web3.okx.com/xlayer" target="_blank">Website</a><br>:material-file-document: <a href="https://web3.okx.com/xlayer/docs/developer/build-on-xlayer/about-xlayer" target="_blank">Developer Docs</a><br>:octicons-package-16: <a href="https://web3.okx.com/explorer/x-layer" target="_blank">Block Explorer</a></td></tr></tbody></table>

</div>


### NTT



<div class="full-width" markdown>

<table data-full-width="true" markdown><thead><th>Blockchain</th><th>Environment</th><th>Mainnet</th><th>Testnet</th><th>Devnet</th><th>Quick Links</th></thead><tbody><tr><td>Ethereum</td><td>EVM</td><td>:white_check_mark:</td><td>:white_check_mark:</td><td>:white_check_mark:</td><td>:material-web: <a href="https://ethereum.org/" target="_blank">Website</a><br>:material-file-document: <a href="https://ethereum.org/en/developers/docs/" target="_blank">Developer Docs</a><br>:octicons-package-16: <a href="https://etherscan.io/" target="_blank">Block Explorer</a></td></tr><tr><td>Solana</td><td>SVM</td><td>:white_check_mark:</td><td>:white_check_mark:</td><td>:white_check_mark:</td><td>:material-web: <a href="https://solana.com/" target="_blank">Website</a><br>:material-file-document: <a href="https://solana.com/docs" target="_blank">Developer Docs</a><br>:octicons-package-16: <a href="https://explorer.solana.com/" target="_blank">Block Explorer</a></td></tr><tr><td>Arbitrum</td><td>EVM</td><td>:white_check_mark:</td><td>:white_check_mark:</td><td>:x:</td><td>:material-web: <a href="https://arbitrum.io/" target="_blank">Website</a><br>:material-file-document: <a href="https://docs.arbitrum.io/" target="_blank">Developer Docs</a><br>:octicons-package-16: <a href="https://arbiscan.io/" target="_blank">Block Explorer</a></td></tr><tr><td>Avalanche</td><td>EVM</td><td>:white_check_mark:</td><td>:white_check_mark:</td><td>:x:</td><td>:material-web: <a href="https://www.avax.network/" target="_blank">Website</a><br>:material-file-document: <a href="https://build.avax.network/docs" target="_blank">Developer Docs</a><br>:octicons-package-16: <a href="https://snowtrace.io/" target="_blank">Block Explorer</a></td></tr><tr><td>Base</td><td>EVM</td><td>:white_check_mark:</td><td>:white_check_mark:</td><td>:x:</td><td>:material-web: <a href="https://base.org/" target="_blank">Website</a><br>:material-file-document: <a href="https://docs.base.org/" target="_blank">Developer Docs</a><br>:octicons-package-16: <a href="https://base-goerli.blockscout.com/" target="_blank">Block Explorer</a></td></tr><tr><td>Berachain</td><td>EVM</td><td>:white_check_mark:</td><td>:white_check_mark:</td><td>:x:</td><td>:material-web: <a href="https://www.berachain.com/" target="_blank">Website</a><br>:material-file-document: <a href="https://docs.berachain.com/" target="_blank">Developer Docs</a><br>:octicons-package-16: <a href="https://berascan.com/" target="_blank">Block Explorer</a></td></tr><tr><td>BNB Smart Chain</td><td>EVM</td><td>:white_check_mark:</td><td>:white_check_mark:</td><td>:white_check_mark:</td><td>:material-web: <a href="https://www.bnbchain.org/en/bnb-smart-chain" target="_blank">Website</a><br>:material-file-document: <a href="https://docs.bnbchain.org/" target="_blank">Developer Docs</a><br>:octicons-package-16: <a href="https://bscscan.com/" target="_blank">Block Explorer</a></td></tr><tr><td>Celo</td><td>EVM</td><td>:white_check_mark:</td><td>:white_check_mark:</td><td>:x:</td><td>:material-web: <a href="https://celo.org/" target="_blank">Website</a><br>:material-file-document: <a href="https://docs.celo.org/" target="_blank">Developer Docs</a><br>:octicons-package-16: <a href="https://celo.blockscout.com/" target="_blank">Block Explorer</a></td></tr><tr><td>Converge</td><td>EVM</td><td>:x:</td><td>:white_check_mark:</td><td>:x:</td><td>:material-web: <a href="https://www.convergeonchain.xyz/" target="_blank">Website</a><br></td></tr><tr><td>CreditCoin</td><td>EVM</td><td>:white_check_mark:</td><td>:x:</td><td>:x:</td><td>:material-web: <a href="https://creditcoin.org/" target="_blank">Website</a><br>:material-file-document: <a href="https://docs.creditcoin.org/" target="_blank">Developer Docs</a><br>:octicons-package-16: <a href="https://creditcoin.subscan.io/" target="_blank">Block Explorer</a></td></tr><tr><td>Fantom</td><td>EVM</td><td>:white_check_mark:</td><td>:white_check_mark:</td><td>:x:</td><td>:material-web: <a href="https://fantom.foundation/" target="_blank">Website</a><br>:material-file-document: <a href="https://docs.fantom.foundation/" target="_blank">Developer Docs</a><br>:octicons-package-16: <a href="https://explorer.fantom.network/" target="_blank">Block Explorer</a></td></tr><tr><td>Fogo</td><td>SVM</td><td>:white_check_mark:</td><td>:white_check_mark:</td><td>:x:</td><td>:material-web: <a href="https://www.fogo.io/" target="_blank">Website</a><br>:octicons-package-16: <a href="https://fogoscan.com/?cluster=testnet" target="_blank">Block Explorer</a></td></tr><tr><td>HyperEVM :material-alert:{ title='⚠️ The HyperEVM integration is experimental, as its node software is not open source. Use Wormhole messaging on HyperEVM with caution.' }</td><td>EVM</td><td>:white_check_mark:</td><td>:x:</td><td>:x:</td><td>:material-web: <a href="https://hyperfoundation.org/" target="_blank">Website</a><br>:material-file-document: <a href="https://hyperliquid.gitbook.io/hyperliquid-docs" target="_blank">Developer Docs</a><br></td></tr><tr><td>Ink</td><td>EVM</td><td>:white_check_mark:</td><td>:white_check_mark:</td><td>:x:</td><td>:material-web: <a href="https://inkonchain.com/" target="_blank">Website</a><br>:material-file-document: <a href="https://docs.inkonchain.com/" target="_blank">Developer Docs</a><br>:octicons-package-16: <a href="https://explorer-sepolia.inkonchain.com/" target="_blank">Block Explorer</a></td></tr><tr><td>Kaia</td><td>EVM</td><td>:white_check_mark:</td><td>:x:</td><td>:x:</td><td>:material-web: <a href="https://www.kaia.io/" target="_blank">Website</a><br>:material-file-document: <a href="https://docs.kaia.io/" target="_blank">Developer Docs</a><br>:octicons-package-16: <a href="https://kaiascan.io/" target="_blank">Block Explorer</a></td></tr><tr><td>Linea</td><td>EVM</td><td>:white_check_mark:</td><td>:x:</td><td>:x:</td><td>:material-web: <a href="https://linea.build/" target="_blank">Website</a><br>:material-file-document: <a href="https://docs.linea.build/" target="_blank">Developer Docs</a><br>:octicons-package-16: <a href="https://docs.linea.build/get-started/build/block-explorers" target="_blank">Block Explorer</a></td></tr><tr><td>Mantle</td><td>EVM</td><td>:white_check_mark:</td><td>:x:</td><td>:x:</td><td>:material-web: <a href="https://www.mantle.xyz/" target="_blank">Website</a><br>:material-file-document: <a href="https://docs.mantle.xyz/network/" target="_blank">Developer Docs</a><br>:octicons-package-16: <a href="https://mantlescan.xyz/" target="_blank">Block Explorer</a></td></tr><tr><td>Mezo</td><td>EVM</td><td>:white_check_mark:</td><td>:white_check_mark:</td><td>:x:</td><td>:material-web: <a href="https://mezo.org/" target="_blank">Website</a><br>:material-file-document: <a href="https://mezo.org/docs/developers/" target="_blank">Developer Docs</a><br>:octicons-package-16: <a href="https://explorer.test.mezo.org/" target="_blank">Block Explorer</a></td></tr><tr><td>Monad</td><td>EVM</td><td>:white_check_mark:</td><td>:white_check_mark:</td><td>:x:</td><td>:material-web: <a href="https://www.monad.xyz/" target="_blank">Website</a><br>:material-file-document: <a href="https://docs.monad.xyz/" target="_blank">Developer Docs</a><br>:octicons-package-16: <a href="https://testnet.monvision.io/" target="_blank">Block Explorer</a></td></tr><tr><td>Moonbeam</td><td>EVM</td><td>:white_check_mark:</td><td>:white_check_mark:</td><td>:x:</td><td>:material-web: <a href="https://moonbeam.network/" target="_blank">Website</a><br>:material-file-document: <a href="https://docs.moonbeam.network/" target="_blank">Developer Docs</a><br>:octicons-package-16: <a href="https://moonscan.io/" target="_blank">Block Explorer</a></td></tr><tr><td>Optimism</td><td>EVM</td><td>:white_check_mark:</td><td>:white_check_mark:</td><td>:x:</td><td>:material-web: <a href="https://www.optimism.io/" target="_blank">Website</a><br>:material-file-document: <a href="https://docs.optimism.io/" target="_blank">Developer Docs</a><br>:octicons-package-16: <a href="https://optimistic.etherscan.io/" target="_blank">Block Explorer</a></td></tr><tr><td>Plume</td><td>EVM</td><td>:white_check_mark:</td><td>:white_check_mark:</td><td>:x:</td><td>:material-web: <a href="https://plume.org/" target="_blank">Website</a><br>:material-file-document: <a href="https://docs.plume.org/plume" target="_blank">Developer Docs</a><br>:octicons-package-16: <a href="https://explorer.plume.org/" target="_blank">Block Explorer</a></td></tr><tr><td>Polygon</td><td>EVM</td><td>:white_check_mark:</td><td>:white_check_mark:</td><td>:x:</td><td>:material-web: <a href="https://polygon.technology/" target="_blank">Website</a><br>:material-file-document: <a href="https://docs.polygon.technology/" target="_blank">Developer Docs</a><br>:octicons-package-16: <a href="https://polygonscan.com/" target="_blank">Block Explorer</a></td></tr><tr><td>Scroll</td><td>EVM</td><td>:white_check_mark:</td><td>:x:</td><td>:x:</td><td>:material-web: <a href="https://scroll.io/" target="_blank">Website</a><br>:material-file-document: <a href="https://docs.scroll.io/en/home/" target="_blank">Developer Docs</a><br>:octicons-package-16: <a href="https://scrollscan.com/" target="_blank">Block Explorer</a></td></tr><tr><td>Seievm</td><td>EVM</td><td>:white_check_mark:</td><td>:white_check_mark:</td><td>:x:</td><td>:material-web: <a href="https://www.sei.io/" target="_blank">Website</a><br>:material-file-document: <a href="https://docs.sei.io/evm" target="_blank">Developer Docs</a><br>:octicons-package-16: <a href="https://seistream.app/" target="_blank">Block Explorer</a></td></tr><tr><td>Sui</td><td>Sui Move VM</td><td>:white_check_mark:</td><td>:white_check_mark:</td><td>:x:</td><td>:material-web: <a href="https://sui.io/" target="_blank">Website</a><br>:material-file-document: <a href="https://docs.sui.io/" target="_blank">Developer Docs</a><br>:octicons-package-16: <a href="https://suiscan.xyz/" target="_blank">Block Explorer</a></td></tr><tr><td>Unichain</td><td>EVM</td><td>:white_check_mark:</td><td>:white_check_mark:</td><td>:x:</td><td>:material-web: <a href="https://www.unichain.org/" target="_blank">Website</a><br>:material-file-document: <a href="https://docs.unichain.org/docs" target="_blank">Developer Docs</a><br>:octicons-package-16: <a href="https://sepolia.uniscan.xyz/" target="_blank">Block Explorer</a></td></tr><tr><td>World Chain</td><td>EVM</td><td>:white_check_mark:</td><td>:x:</td><td>:x:</td><td>:material-web: <a href="https://world.org/world-chain" target="_blank">Website</a><br>:material-file-document: <a href="https://docs.world.org/" target="_blank">Developer Docs</a><br>:octicons-package-16: <a href="https://docs.world.org/world-chain/providers/explorers" target="_blank">Block Explorer</a></td></tr><tr><td>X Layer</td><td>EVM</td><td>:white_check_mark:</td><td>:x:</td><td>:x:</td><td>:material-web: <a href="https://web3.okx.com/xlayer" target="_blank">Website</a><br>:material-file-document: <a href="https://web3.okx.com/xlayer/docs/developer/build-on-xlayer/about-xlayer" target="_blank">Developer Docs</a><br>:octicons-package-16: <a href="https://web3.okx.com/explorer/x-layer" target="_blank">Block Explorer</a></td></tr><tr><td>XRPL-EVM</td><td>EVM</td><td>:white_check_mark:</td><td>:white_check_mark:</td><td>:x:</td><td>:material-web: <a href="https://www.xrplevm.org/" target="_blank">Website</a><br>:material-file-document: <a href="https://docs.xrplevm.org/" target="_blank">Developer Docs</a><br>:octicons-package-16: <a href="https://explorer.xrplevm.org/" target="_blank">Block Explorer</a></td></tr></tbody></table>

</div>


### WTT



<div class="full-width" markdown>

<table data-full-width="true" markdown><thead><th>Blockchain</th><th>Environment</th><th>Mainnet</th><th>Testnet</th><th>Devnet</th><th>Quick Links</th></thead><tbody><tr><td>Ethereum</td><td>EVM</td><td>:white_check_mark:</td><td>:white_check_mark:</td><td>:white_check_mark:</td><td>:material-web: <a href="https://ethereum.org/" target="_blank">Website</a><br>:material-file-document: <a href="https://ethereum.org/en/developers/docs/" target="_blank">Developer Docs</a><br>:octicons-package-16: <a href="https://etherscan.io/" target="_blank">Block Explorer</a></td></tr><tr><td>Solana</td><td>SVM</td><td>:white_check_mark:</td><td>:white_check_mark:</td><td>:white_check_mark:</td><td>:material-web: <a href="https://solana.com/" target="_blank">Website</a><br>:material-file-document: <a href="https://solana.com/docs" target="_blank">Developer Docs</a><br>:octicons-package-16: <a href="https://explorer.solana.com/" target="_blank">Block Explorer</a></td></tr><tr><td>Algorand</td><td>AVM</td><td>:white_check_mark:</td><td>:white_check_mark:</td><td>:white_check_mark:</td><td>:material-web: <a href="https://algorandtechnologies.com/" target="_blank">Website</a><br>:material-file-document: <a href="https://developer.algorand.org" target="_blank">Developer Docs</a><br>:octicons-package-16: <a href="https://allo.info/" target="_blank">Block Explorer</a></td></tr><tr><td>Aptos</td><td>Move VM</td><td>:white_check_mark:</td><td>:white_check_mark:</td><td>:white_check_mark:</td><td>:material-web: <a href="https://aptosnetwork.com/" target="_blank">Website</a><br>:material-file-document: <a href="https://aptos.dev/" target="_blank">Developer Docs</a><br>:octicons-package-16: <a href="https://explorer.aptoslabs.com/" target="_blank">Block Explorer</a></td></tr><tr><td>Arbitrum</td><td>EVM</td><td>:white_check_mark:</td><td>:white_check_mark:</td><td>:x:</td><td>:material-web: <a href="https://arbitrum.io/" target="_blank">Website</a><br>:material-file-document: <a href="https://docs.arbitrum.io/" target="_blank">Developer Docs</a><br>:octicons-package-16: <a href="https://arbiscan.io/" target="_blank">Block Explorer</a></td></tr><tr><td>Avalanche</td><td>EVM</td><td>:white_check_mark:</td><td>:white_check_mark:</td><td>:x:</td><td>:material-web: <a href="https://www.avax.network/" target="_blank">Website</a><br>:material-file-document: <a href="https://build.avax.network/docs" target="_blank">Developer Docs</a><br>:octicons-package-16: <a href="https://snowtrace.io/" target="_blank">Block Explorer</a></td></tr><tr><td>Base</td><td>EVM</td><td>:white_check_mark:</td><td>:white_check_mark:</td><td>:x:</td><td>:material-web: <a href="https://base.org/" target="_blank">Website</a><br>:material-file-document: <a href="https://docs.base.org/" target="_blank">Developer Docs</a><br>:octicons-package-16: <a href="https://base-goerli.blockscout.com/" target="_blank">Block Explorer</a></td></tr><tr><td>Berachain</td><td>EVM</td><td>:white_check_mark:</td><td>:white_check_mark:</td><td>:x:</td><td>:material-web: <a href="https://www.berachain.com/" target="_blank">Website</a><br>:material-file-document: <a href="https://docs.berachain.com/" target="_blank">Developer Docs</a><br>:octicons-package-16: <a href="https://berascan.com/" target="_blank">Block Explorer</a></td></tr><tr><td>BNB Smart Chain</td><td>EVM</td><td>:white_check_mark:</td><td>:white_check_mark:</td><td>:white_check_mark:</td><td>:material-web: <a href="https://www.bnbchain.org/en/bnb-smart-chain" target="_blank">Website</a><br>:material-file-document: <a href="https://docs.bnbchain.org/" target="_blank">Developer Docs</a><br>:octicons-package-16: <a href="https://bscscan.com/" target="_blank">Block Explorer</a></td></tr><tr><td>Celo</td><td>EVM</td><td>:white_check_mark:</td><td>:white_check_mark:</td><td>:x:</td><td>:material-web: <a href="https://celo.org/" target="_blank">Website</a><br>:material-file-document: <a href="https://docs.celo.org/" target="_blank">Developer Docs</a><br>:octicons-package-16: <a href="https://celo.blockscout.com/" target="_blank">Block Explorer</a></td></tr><tr><td>Fantom</td><td>EVM</td><td>:white_check_mark:</td><td>:white_check_mark:</td><td>:x:</td><td>:material-web: <a href="https://fantom.foundation/" target="_blank">Website</a><br>:material-file-document: <a href="https://docs.fantom.foundation/" target="_blank">Developer Docs</a><br>:octicons-package-16: <a href="https://explorer.fantom.network/" target="_blank">Block Explorer</a></td></tr><tr><td>Fogo</td><td>SVM</td><td>:white_check_mark:</td><td>:white_check_mark:</td><td>:x:</td><td>:material-web: <a href="https://www.fogo.io/" target="_blank">Website</a><br>:octicons-package-16: <a href="https://fogoscan.com/?cluster=testnet" target="_blank">Block Explorer</a></td></tr><tr><td>HyperEVM :material-alert:{ title='⚠️ The HyperEVM integration is experimental, as its node software is not open source. Use Wormhole messaging on HyperEVM with caution.' }</td><td>EVM</td><td>:x:</td><td>:white_check_mark:</td><td>:x:</td><td>:material-web: <a href="https://hyperfoundation.org/" target="_blank">Website</a><br>:material-file-document: <a href="https://hyperliquid.gitbook.io/hyperliquid-docs" target="_blank">Developer Docs</a><br></td></tr><tr><td>Injective</td><td>CosmWasm</td><td>:white_check_mark:</td><td>:white_check_mark:</td><td>:x:</td><td>:material-web: <a href="https://injective.com/" target="_blank">Website</a><br>:material-file-document: <a href="https://docs.injective.network/" target="_blank">Developer Docs</a><br>:octicons-package-16: <a href="https://explorer.injective.network/" target="_blank">Block Explorer</a></td></tr><tr><td>Ink</td><td>EVM</td><td>:white_check_mark:</td><td>:white_check_mark:</td><td>:x:</td><td>:material-web: <a href="https://inkonchain.com/" target="_blank">Website</a><br>:material-file-document: <a href="https://docs.inkonchain.com/" target="_blank">Developer Docs</a><br>:octicons-package-16: <a href="https://explorer-sepolia.inkonchain.com/" target="_blank">Block Explorer</a></td></tr><tr><td>Kaia</td><td>EVM</td><td>:white_check_mark:</td><td>:white_check_mark:</td><td>:x:</td><td>:material-web: <a href="https://www.kaia.io/" target="_blank">Website</a><br>:material-file-document: <a href="https://docs.kaia.io/" target="_blank">Developer Docs</a><br>:octicons-package-16: <a href="https://kaiascan.io/" target="_blank">Block Explorer</a></td></tr><tr><td>Linea</td><td>EVM</td><td>:white_check_mark:</td><td>:white_check_mark:</td><td>:x:</td><td>:material-web: <a href="https://linea.build/" target="_blank">Website</a><br>:material-file-document: <a href="https://docs.linea.build/" target="_blank">Developer Docs</a><br>:octicons-package-16: <a href="https://docs.linea.build/get-started/build/block-explorers" target="_blank">Block Explorer</a></td></tr><tr><td>Mantle</td><td>EVM</td><td>:white_check_mark:</td><td>:white_check_mark:</td><td>:x:</td><td>:material-web: <a href="https://www.mantle.xyz/" target="_blank">Website</a><br>:material-file-document: <a href="https://docs.mantle.xyz/network/" target="_blank">Developer Docs</a><br>:octicons-package-16: <a href="https://mantlescan.xyz/" target="_blank">Block Explorer</a></td></tr><tr><td>Mezo</td><td>EVM</td><td>:x:</td><td>:white_check_mark:</td><td>:x:</td><td>:material-web: <a href="https://mezo.org/" target="_blank">Website</a><br>:material-file-document: <a href="https://mezo.org/docs/developers/" target="_blank">Developer Docs</a><br>:octicons-package-16: <a href="https://explorer.test.mezo.org/" target="_blank">Block Explorer</a></td></tr><tr><td>Moca</td><td>EVM</td><td>:x:</td><td>:white_check_mark:</td><td>:x:</td><td>:material-web: <a href="https://mocachain.org/en" target="_blank">Website</a><br>:material-file-document: <a href="https://mocacoin.gitbook.io/litepaper" target="_blank">Developer Docs</a><br>:octicons-package-16: <a href="https://devnet-scan.mocachain.org/" target="_blank">Block Explorer</a></td></tr><tr><td>Monad</td><td>EVM</td><td>:white_check_mark:</td><td>:white_check_mark:</td><td>:x:</td><td>:material-web: <a href="https://www.monad.xyz/" target="_blank">Website</a><br>:material-file-document: <a href="https://docs.monad.xyz/" target="_blank">Developer Docs</a><br>:octicons-package-16: <a href="https://testnet.monvision.io/" target="_blank">Block Explorer</a></td></tr><tr><td>Moonbeam</td><td>EVM</td><td>:white_check_mark:</td><td>:white_check_mark:</td><td>:x:</td><td>:material-web: <a href="https://moonbeam.network/" target="_blank">Website</a><br>:material-file-document: <a href="https://docs.moonbeam.network/" target="_blank">Developer Docs</a><br>:octicons-package-16: <a href="https://moonscan.io/" target="_blank">Block Explorer</a></td></tr><tr><td>NEAR</td><td>NEAR VM</td><td>:white_check_mark:</td><td>:white_check_mark:</td><td>:white_check_mark:</td><td>:material-web: <a href="https://near.org/" target="_blank">Website</a><br>:material-file-document: <a href="https://docs.near.org/" target="_blank">Developer Docs</a><br>:octicons-package-16: <a href="https://nearblocks.io/" target="_blank">Block Explorer</a></td></tr><tr><td>Optimism</td><td>EVM</td><td>:white_check_mark:</td><td>:white_check_mark:</td><td>:x:</td><td>:material-web: <a href="https://www.optimism.io/" target="_blank">Website</a><br>:material-file-document: <a href="https://docs.optimism.io/" target="_blank">Developer Docs</a><br>:octicons-package-16: <a href="https://optimistic.etherscan.io/" target="_blank">Block Explorer</a></td></tr><tr><td>Polygon</td><td>EVM</td><td>:white_check_mark:</td><td>:white_check_mark:</td><td>:x:</td><td>:material-web: <a href="https://polygon.technology/" target="_blank">Website</a><br>:material-file-document: <a href="https://docs.polygon.technology/" target="_blank">Developer Docs</a><br>:octicons-package-16: <a href="https://polygonscan.com/" target="_blank">Block Explorer</a></td></tr><tr><td>Scroll</td><td>EVM</td><td>:white_check_mark:</td><td>:white_check_mark:</td><td>:x:</td><td>:material-web: <a href="https://scroll.io/" target="_blank">Website</a><br>:material-file-document: <a href="https://docs.scroll.io/en/home/" target="_blank">Developer Docs</a><br>:octicons-package-16: <a href="https://scrollscan.com/" target="_blank">Block Explorer</a></td></tr><tr><td>Sei</td><td>CosmWasm</td><td>:white_check_mark:</td><td>:white_check_mark:</td><td>:x:</td><td>:material-web: <a href="https://www.sei.io/" target="_blank">Website</a><br>:material-file-document: <a href="https://docs.sei.io/" target="_blank">Developer Docs</a><br>:octicons-package-16: <a href="https://docs.sei.io/learn/explorers#sei-explorers" target="_blank">Block Explorer</a></td></tr><tr><td>Seievm</td><td>EVM</td><td>:white_check_mark:</td><td>:white_check_mark:</td><td>:x:</td><td>:material-web: <a href="https://www.sei.io/" target="_blank">Website</a><br>:material-file-document: <a href="https://docs.sei.io/evm" target="_blank">Developer Docs</a><br>:octicons-package-16: <a href="https://seistream.app/" target="_blank">Block Explorer</a></td></tr><tr><td>Sui</td><td>Sui Move VM</td><td>:white_check_mark:</td><td>:white_check_mark:</td><td>:white_check_mark:</td><td>:material-web: <a href="https://sui.io/" target="_blank">Website</a><br>:material-file-document: <a href="https://docs.sui.io/" target="_blank">Developer Docs</a><br>:octicons-package-16: <a href="https://suiscan.xyz/" target="_blank">Block Explorer</a></td></tr><tr><td>Unichain</td><td>EVM</td><td>:white_check_mark:</td><td>:white_check_mark:</td><td>:x:</td><td>:material-web: <a href="https://www.unichain.org/" target="_blank">Website</a><br>:material-file-document: <a href="https://docs.unichain.org/docs" target="_blank">Developer Docs</a><br>:octicons-package-16: <a href="https://sepolia.uniscan.xyz/" target="_blank">Block Explorer</a></td></tr><tr><td>World Chain</td><td>EVM</td><td>:white_check_mark:</td><td>:white_check_mark:</td><td>:x:</td><td>:material-web: <a href="https://world.org/world-chain" target="_blank">Website</a><br>:material-file-document: <a href="https://docs.world.org/" target="_blank">Developer Docs</a><br>:octicons-package-16: <a href="https://docs.world.org/world-chain/providers/explorers" target="_blank">Block Explorer</a></td></tr><tr><td>X Layer</td><td>EVM</td><td>:white_check_mark:</td><td>:white_check_mark:</td><td>:x:</td><td>:material-web: <a href="https://web3.okx.com/xlayer" target="_blank">Website</a><br>:material-file-document: <a href="https://web3.okx.com/xlayer/docs/developer/build-on-xlayer/about-xlayer" target="_blank">Developer Docs</a><br>:octicons-package-16: <a href="https://web3.okx.com/explorer/x-layer" target="_blank">Block Explorer</a></td></tr><tr><td>XRPL-EVM</td><td>EVM</td><td>:white_check_mark:</td><td>:white_check_mark:</td><td>:x:</td><td>:material-web: <a href="https://www.xrplevm.org/" target="_blank">Website</a><br>:material-file-document: <a href="https://docs.xrplevm.org/" target="_blank">Developer Docs</a><br>:octicons-package-16: <a href="https://explorer.xrplevm.org/" target="_blank">Block Explorer</a></td></tr></tbody></table>

</div>


### CCTP



<div class="full-width" markdown>

<table data-full-width="true" markdown><thead><th>Blockchain</th><th>Environment</th><th>Mainnet</th><th>Testnet</th><th>Devnet</th><th>Quick Links</th></thead><tbody><tr><td>Ethereum</td><td>EVM</td><td>:white_check_mark:</td><td>:white_check_mark:</td><td>:x:</td><td>:material-web: <a href="https://ethereum.org/" target="_blank">Website</a><br>:material-file-document: <a href="https://ethereum.org/en/developers/docs/" target="_blank">Developer Docs</a><br>:octicons-package-16: <a href="https://etherscan.io/" target="_blank">Block Explorer</a></td></tr><tr><td>Solana</td><td>SVM</td><td>:white_check_mark:</td><td>:white_check_mark:</td><td>:x:</td><td>:material-web: <a href="https://solana.com/" target="_blank">Website</a><br>:material-file-document: <a href="https://solana.com/docs" target="_blank">Developer Docs</a><br>:octicons-package-16: <a href="https://explorer.solana.com/" target="_blank">Block Explorer</a></td></tr><tr><td>Aptos</td><td>Move VM</td><td>:white_check_mark:</td><td>:white_check_mark:</td><td>:x:</td><td>:material-web: <a href="https://aptosnetwork.com/" target="_blank">Website</a><br>:material-file-document: <a href="https://aptos.dev/" target="_blank">Developer Docs</a><br>:octicons-package-16: <a href="https://explorer.aptoslabs.com/" target="_blank">Block Explorer</a></td></tr><tr><td>Arbitrum</td><td>EVM</td><td>:white_check_mark:</td><td>:white_check_mark:</td><td>:x:</td><td>:material-web: <a href="https://arbitrum.io/" target="_blank">Website</a><br>:material-file-document: <a href="https://docs.arbitrum.io/" target="_blank">Developer Docs</a><br>:octicons-package-16: <a href="https://arbiscan.io/" target="_blank">Block Explorer</a></td></tr><tr><td>Avalanche</td><td>EVM</td><td>:white_check_mark:</td><td>:white_check_mark:</td><td>:x:</td><td>:material-web: <a href="https://www.avax.network/" target="_blank">Website</a><br>:material-file-document: <a href="https://build.avax.network/docs" target="_blank">Developer Docs</a><br>:octicons-package-16: <a href="https://snowtrace.io/" target="_blank">Block Explorer</a></td></tr><tr><td>Base</td><td>EVM</td><td>:white_check_mark:</td><td>:white_check_mark:</td><td>:x:</td><td>:material-web: <a href="https://base.org/" target="_blank">Website</a><br>:material-file-document: <a href="https://docs.base.org/" target="_blank">Developer Docs</a><br>:octicons-package-16: <a href="https://base-goerli.blockscout.com/" target="_blank">Block Explorer</a></td></tr><tr><td>HyperCore</td><td>EVM</td><td>:white_check_mark:</td><td>:x:</td><td>:x:</td><td>:material-web: <a href="https://hyperliquid.gitbook.io/hyperliquid-docs/hypercore" target="_blank">Website</a><br>:material-file-document: <a href="https://hyperliquid.gitbook.io/hyperliquid-docs/hypercore" target="_blank">Developer Docs</a><br></td></tr><tr><td>HyperEVM :material-alert:{ title='⚠️ The HyperEVM integration is experimental, as its node software is not open source. Use Wormhole messaging on HyperEVM with caution.' }</td><td>EVM</td><td>:white_check_mark:</td><td>:white_check_mark:</td><td>:x:</td><td>:material-web: <a href="https://hyperfoundation.org/" target="_blank">Website</a><br>:material-file-document: <a href="https://hyperliquid.gitbook.io/hyperliquid-docs" target="_blank">Developer Docs</a><br></td></tr><tr><td>Ink</td><td>EVM</td><td>:white_check_mark:</td><td>:x:</td><td>:x:</td><td>:material-web: <a href="https://inkonchain.com/" target="_blank">Website</a><br>:material-file-document: <a href="https://docs.inkonchain.com/" target="_blank">Developer Docs</a><br>:octicons-package-16: <a href="https://explorer-sepolia.inkonchain.com/" target="_blank">Block Explorer</a></td></tr><tr><td>Linea</td><td>EVM</td><td>:white_check_mark:</td><td>:white_check_mark:</td><td>:x:</td><td>:material-web: <a href="https://linea.build/" target="_blank">Website</a><br>:material-file-document: <a href="https://docs.linea.build/" target="_blank">Developer Docs</a><br>:octicons-package-16: <a href="https://docs.linea.build/get-started/build/block-explorers" target="_blank">Block Explorer</a></td></tr><tr><td>Monad</td><td>EVM</td><td>:white_check_mark:</td><td>:x:</td><td>:x:</td><td>:material-web: <a href="https://www.monad.xyz/" target="_blank">Website</a><br>:material-file-document: <a href="https://docs.monad.xyz/" target="_blank">Developer Docs</a><br>:octicons-package-16: <a href="https://testnet.monvision.io/" target="_blank">Block Explorer</a></td></tr><tr><td>Optimism</td><td>EVM</td><td>:white_check_mark:</td><td>:white_check_mark:</td><td>:x:</td><td>:material-web: <a href="https://www.optimism.io/" target="_blank">Website</a><br>:material-file-document: <a href="https://docs.optimism.io/" target="_blank">Developer Docs</a><br>:octicons-package-16: <a href="https://optimistic.etherscan.io/" target="_blank">Block Explorer</a></td></tr><tr><td>Plume</td><td>EVM</td><td>:white_check_mark:</td><td>:x:</td><td>:x:</td><td>:material-web: <a href="https://plume.org/" target="_blank">Website</a><br>:material-file-document: <a href="https://docs.plume.org/plume" target="_blank">Developer Docs</a><br>:octicons-package-16: <a href="https://explorer.plume.org/" target="_blank">Block Explorer</a></td></tr><tr><td>Polygon</td><td>EVM</td><td>:white_check_mark:</td><td>:white_check_mark:</td><td>:x:</td><td>:material-web: <a href="https://polygon.technology/" target="_blank">Website</a><br>:material-file-document: <a href="https://docs.polygon.technology/" target="_blank">Developer Docs</a><br>:octicons-package-16: <a href="https://polygonscan.com/" target="_blank">Block Explorer</a></td></tr><tr><td>Seievm</td><td>EVM</td><td>:white_check_mark:</td><td>:white_check_mark:</td><td>:x:</td><td>:material-web: <a href="https://www.sei.io/" target="_blank">Website</a><br>:material-file-document: <a href="https://docs.sei.io/evm" target="_blank">Developer Docs</a><br>:octicons-package-16: <a href="https://seistream.app/" target="_blank">Block Explorer</a></td></tr><tr><td>Sonic</td><td>EVM</td><td>:white_check_mark:</td><td>:white_check_mark:</td><td>:x:</td><td>:material-web: <a href="https://www.soniclabs.com/" target="_blank">Website</a><br>:material-file-document: <a href="https://docs.soniclabs.com/" target="_blank">Developer Docs</a><br>:octicons-package-16: <a href="https://sonicscan.org/" target="_blank">Block Explorer</a></td></tr><tr><td>Sui</td><td>Sui Move VM</td><td>:white_check_mark:</td><td>:white_check_mark:</td><td>:x:</td><td>:material-web: <a href="https://sui.io/" target="_blank">Website</a><br>:material-file-document: <a href="https://docs.sui.io/" target="_blank">Developer Docs</a><br>:octicons-package-16: <a href="https://suiscan.xyz/" target="_blank">Block Explorer</a></td></tr><tr><td>Unichain</td><td>EVM</td><td>:white_check_mark:</td><td>:white_check_mark:</td><td>:x:</td><td>:material-web: <a href="https://www.unichain.org/" target="_blank">Website</a><br>:material-file-document: <a href="https://docs.unichain.org/docs" target="_blank">Developer Docs</a><br>:octicons-package-16: <a href="https://sepolia.uniscan.xyz/" target="_blank">Block Explorer</a></td></tr><tr><td>World Chain</td><td>EVM</td><td>:white_check_mark:</td><td>:x:</td><td>:x:</td><td>:material-web: <a href="https://world.org/world-chain" target="_blank">Website</a><br>:material-file-document: <a href="https://docs.world.org/" target="_blank">Developer Docs</a><br>:octicons-package-16: <a href="https://docs.world.org/world-chain/providers/explorers" target="_blank">Block Explorer</a></td></tr></tbody></table>

</div>


### Settlement



<div class="full-width" markdown>

<table data-full-width="true" markdown><thead><th>Blockchain</th><th>Environment</th><th>Mainnet</th><th>Testnet</th><th>Devnet</th><th>Quick Links</th></thead><tbody><tr><td>Ethereum</td><td>EVM</td><td>:white_check_mark:</td><td>:x:</td><td>:x:</td><td>:material-web: <a href="https://ethereum.org/" target="_blank">Website</a><br>:material-file-document: <a href="https://ethereum.org/en/developers/docs/" target="_blank">Developer Docs</a><br>:octicons-package-16: <a href="https://etherscan.io/" target="_blank">Block Explorer</a></td></tr><tr><td>Solana</td><td>SVM</td><td>:white_check_mark:</td><td>:white_check_mark:</td><td>:x:</td><td>:material-web: <a href="https://solana.com/" target="_blank">Website</a><br>:material-file-document: <a href="https://solana.com/docs" target="_blank">Developer Docs</a><br>:octicons-package-16: <a href="https://explorer.solana.com/" target="_blank">Block Explorer</a></td></tr><tr><td>Arbitrum</td><td>EVM</td><td>:white_check_mark:</td><td>:white_check_mark:</td><td>:x:</td><td>:material-web: <a href="https://arbitrum.io/" target="_blank">Website</a><br>:material-file-document: <a href="https://docs.arbitrum.io/" target="_blank">Developer Docs</a><br>:octicons-package-16: <a href="https://arbiscan.io/" target="_blank">Block Explorer</a></td></tr><tr><td>Avalanche</td><td>EVM</td><td>:white_check_mark:</td><td>:x:</td><td>:x:</td><td>:material-web: <a href="https://www.avax.network/" target="_blank">Website</a><br>:material-file-document: <a href="https://build.avax.network/docs" target="_blank">Developer Docs</a><br>:octicons-package-16: <a href="https://snowtrace.io/" target="_blank">Block Explorer</a></td></tr><tr><td>Base</td><td>EVM</td><td>:white_check_mark:</td><td>:x:</td><td>:x:</td><td>:material-web: <a href="https://base.org/" target="_blank">Website</a><br>:material-file-document: <a href="https://docs.base.org/" target="_blank">Developer Docs</a><br>:octicons-package-16: <a href="https://base-goerli.blockscout.com/" target="_blank">Block Explorer</a></td></tr><tr><td>Optimism</td><td>EVM</td><td>:white_check_mark:</td><td>:white_check_mark:</td><td>:x:</td><td>:material-web: <a href="https://www.optimism.io/" target="_blank">Website</a><br>:material-file-document: <a href="https://docs.optimism.io/" target="_blank">Developer Docs</a><br>:octicons-package-16: <a href="https://optimistic.etherscan.io/" target="_blank">Block Explorer</a></td></tr><tr><td>Polygon</td><td>EVM</td><td>:white_check_mark:</td><td>:x:</td><td>:x:</td><td>:material-web: <a href="https://polygon.technology/" target="_blank">Website</a><br>:material-file-document: <a href="https://docs.polygon.technology/" target="_blank">Developer Docs</a><br>:octicons-package-16: <a href="https://polygonscan.com/" target="_blank">Block Explorer</a></td></tr><tr><td>Sui</td><td>Sui Move VM</td><td>:white_check_mark:</td><td>:x:</td><td>:x:</td><td>:material-web: <a href="https://sui.io/" target="_blank">Website</a><br>:material-file-document: <a href="https://docs.sui.io/" target="_blank">Developer Docs</a><br>:octicons-package-16: <a href="https://suiscan.xyz/" target="_blank">Block Explorer</a></td></tr><tr><td>Unichain</td><td>EVM</td><td>:white_check_mark:</td><td>:x:</td><td>:x:</td><td>:material-web: <a href="https://www.unichain.org/" target="_blank">Website</a><br>:material-file-document: <a href="https://docs.unichain.org/docs" target="_blank">Developer Docs</a><br>:octicons-package-16: <a href="https://sepolia.uniscan.xyz/" target="_blank">Block Explorer</a></td></tr></tbody></table>

</div>


### Multigov



<div class="full-width" markdown>

<table data-full-width="true" markdown><thead><th>Blockchain</th><th>Environment</th><th>Mainnet</th><th>Testnet</th><th>Devnet</th><th>Quick Links</th></thead><tbody><tr><td>Ethereum</td><td>EVM</td><td>:white_check_mark:</td><td>:white_check_mark:</td><td>:white_check_mark:</td><td>:material-web: <a href="https://ethereum.org/" target="_blank">Website</a><br>:material-file-document: <a href="https://ethereum.org/en/developers/docs/" target="_blank">Developer Docs</a><br>:octicons-package-16: <a href="https://etherscan.io/" target="_blank">Block Explorer</a></td></tr><tr><td>Solana</td><td>SVM</td><td>:white_check_mark:</td><td>:white_check_mark:</td><td>:white_check_mark:</td><td>:material-web: <a href="https://solana.com/" target="_blank">Website</a><br>:material-file-document: <a href="https://solana.com/docs" target="_blank">Developer Docs</a><br>:octicons-package-16: <a href="https://explorer.solana.com/" target="_blank">Block Explorer</a></td></tr><tr><td>Arbitrum</td><td>EVM</td><td>:white_check_mark:</td><td>:white_check_mark:</td><td>:white_check_mark:</td><td>:material-web: <a href="https://arbitrum.io/" target="_blank">Website</a><br>:material-file-document: <a href="https://docs.arbitrum.io/" target="_blank">Developer Docs</a><br>:octicons-package-16: <a href="https://arbiscan.io/" target="_blank">Block Explorer</a></td></tr><tr><td>Avalanche</td><td>EVM</td><td>:white_check_mark:</td><td>:white_check_mark:</td><td>:white_check_mark:</td><td>:material-web: <a href="https://www.avax.network/" target="_blank">Website</a><br>:material-file-document: <a href="https://build.avax.network/docs" target="_blank">Developer Docs</a><br>:octicons-package-16: <a href="https://snowtrace.io/" target="_blank">Block Explorer</a></td></tr><tr><td>Base</td><td>EVM</td><td>:white_check_mark:</td><td>:white_check_mark:</td><td>:white_check_mark:</td><td>:material-web: <a href="https://base.org/" target="_blank">Website</a><br>:material-file-document: <a href="https://docs.base.org/" target="_blank">Developer Docs</a><br>:octicons-package-16: <a href="https://base-goerli.blockscout.com/" target="_blank">Block Explorer</a></td></tr><tr><td>Berachain</td><td>EVM</td><td>:white_check_mark:</td><td>:white_check_mark:</td><td>:white_check_mark:</td><td>:material-web: <a href="https://www.berachain.com/" target="_blank">Website</a><br>:material-file-document: <a href="https://docs.berachain.com/" target="_blank">Developer Docs</a><br>:octicons-package-16: <a href="https://berascan.com/" target="_blank">Block Explorer</a></td></tr><tr><td>BNB Smart Chain</td><td>EVM</td><td>:white_check_mark:</td><td>:white_check_mark:</td><td>:white_check_mark:</td><td>:material-web: <a href="https://www.bnbchain.org/en/bnb-smart-chain" target="_blank">Website</a><br>:material-file-document: <a href="https://docs.bnbchain.org/" target="_blank">Developer Docs</a><br>:octicons-package-16: <a href="https://bscscan.com/" target="_blank">Block Explorer</a></td></tr><tr><td>Celo</td><td>EVM</td><td>:white_check_mark:</td><td>:white_check_mark:</td><td>:white_check_mark:</td><td>:material-web: <a href="https://celo.org/" target="_blank">Website</a><br>:material-file-document: <a href="https://docs.celo.org/" target="_blank">Developer Docs</a><br>:octicons-package-16: <a href="https://celo.blockscout.com/" target="_blank">Block Explorer</a></td></tr><tr><td>Converge</td><td>EVM</td><td>:white_check_mark:</td><td>:white_check_mark:</td><td>:white_check_mark:</td><td>:material-web: <a href="https://www.convergeonchain.xyz/" target="_blank">Website</a><br></td></tr><tr><td>CreditCoin</td><td>EVM</td><td>:white_check_mark:</td><td>:white_check_mark:</td><td>:white_check_mark:</td><td>:material-web: <a href="https://creditcoin.org/" target="_blank">Website</a><br>:material-file-document: <a href="https://docs.creditcoin.org/" target="_blank">Developer Docs</a><br>:octicons-package-16: <a href="https://creditcoin.subscan.io/" target="_blank">Block Explorer</a></td></tr><tr><td>Fantom</td><td>EVM</td><td>:white_check_mark:</td><td>:white_check_mark:</td><td>:white_check_mark:</td><td>:material-web: <a href="https://fantom.foundation/" target="_blank">Website</a><br>:material-file-document: <a href="https://docs.fantom.foundation/" target="_blank">Developer Docs</a><br>:octicons-package-16: <a href="https://explorer.fantom.network/" target="_blank">Block Explorer</a></td></tr><tr><td>HyperCore</td><td>EVM</td><td>:white_check_mark:</td><td>:white_check_mark:</td><td>:white_check_mark:</td><td>:material-web: <a href="https://hyperliquid.gitbook.io/hyperliquid-docs/hypercore" target="_blank">Website</a><br>:material-file-document: <a href="https://hyperliquid.gitbook.io/hyperliquid-docs/hypercore" target="_blank">Developer Docs</a><br></td></tr><tr><td>HyperEVM :material-alert:{ title='⚠️ The HyperEVM integration is experimental, as its node software is not open source. Use Wormhole messaging on HyperEVM with caution.' }</td><td>EVM</td><td>:white_check_mark:</td><td>:white_check_mark:</td><td>:white_check_mark:</td><td>:material-web: <a href="https://hyperfoundation.org/" target="_blank">Website</a><br>:material-file-document: <a href="https://hyperliquid.gitbook.io/hyperliquid-docs" target="_blank">Developer Docs</a><br></td></tr><tr><td>Ink</td><td>EVM</td><td>:white_check_mark:</td><td>:white_check_mark:</td><td>:white_check_mark:</td><td>:material-web: <a href="https://inkonchain.com/" target="_blank">Website</a><br>:material-file-document: <a href="https://docs.inkonchain.com/" target="_blank">Developer Docs</a><br>:octicons-package-16: <a href="https://explorer-sepolia.inkonchain.com/" target="_blank">Block Explorer</a></td></tr><tr><td>Kaia</td><td>EVM</td><td>:white_check_mark:</td><td>:white_check_mark:</td><td>:white_check_mark:</td><td>:material-web: <a href="https://www.kaia.io/" target="_blank">Website</a><br>:material-file-document: <a href="https://docs.kaia.io/" target="_blank">Developer Docs</a><br>:octicons-package-16: <a href="https://kaiascan.io/" target="_blank">Block Explorer</a></td></tr><tr><td>Linea</td><td>EVM</td><td>:white_check_mark:</td><td>:white_check_mark:</td><td>:white_check_mark:</td><td>:material-web: <a href="https://linea.build/" target="_blank">Website</a><br>:material-file-document: <a href="https://docs.linea.build/" target="_blank">Developer Docs</a><br>:octicons-package-16: <a href="https://docs.linea.build/get-started/build/block-explorers" target="_blank">Block Explorer</a></td></tr><tr><td>Mantle</td><td>EVM</td><td>:white_check_mark:</td><td>:white_check_mark:</td><td>:white_check_mark:</td><td>:material-web: <a href="https://www.mantle.xyz/" target="_blank">Website</a><br>:material-file-document: <a href="https://docs.mantle.xyz/network/" target="_blank">Developer Docs</a><br>:octicons-package-16: <a href="https://mantlescan.xyz/" target="_blank">Block Explorer</a></td></tr><tr><td>Mezo</td><td>EVM</td><td>:white_check_mark:</td><td>:white_check_mark:</td><td>:white_check_mark:</td><td>:material-web: <a href="https://mezo.org/" target="_blank">Website</a><br>:material-file-document: <a href="https://mezo.org/docs/developers/" target="_blank">Developer Docs</a><br>:octicons-package-16: <a href="https://explorer.test.mezo.org/" target="_blank">Block Explorer</a></td></tr><tr><td>Moca</td><td>EVM</td><td>:white_check_mark:</td><td>:white_check_mark:</td><td>:white_check_mark:</td><td>:material-web: <a href="https://mocachain.org/en" target="_blank">Website</a><br>:material-file-document: <a href="https://mocacoin.gitbook.io/litepaper" target="_blank">Developer Docs</a><br>:octicons-package-16: <a href="https://devnet-scan.mocachain.org/" target="_blank">Block Explorer</a></td></tr><tr><td>Monad</td><td>EVM</td><td>:white_check_mark:</td><td>:white_check_mark:</td><td>:white_check_mark:</td><td>:material-web: <a href="https://www.monad.xyz/" target="_blank">Website</a><br>:material-file-document: <a href="https://docs.monad.xyz/" target="_blank">Developer Docs</a><br>:octicons-package-16: <a href="https://testnet.monvision.io/" target="_blank">Block Explorer</a></td></tr><tr><td>Moonbeam</td><td>EVM</td><td>:white_check_mark:</td><td>:white_check_mark:</td><td>:white_check_mark:</td><td>:material-web: <a href="https://moonbeam.network/" target="_blank">Website</a><br>:material-file-document: <a href="https://docs.moonbeam.network/" target="_blank">Developer Docs</a><br>:octicons-package-16: <a href="https://moonscan.io/" target="_blank">Block Explorer</a></td></tr><tr><td>Optimism</td><td>EVM</td><td>:white_check_mark:</td><td>:white_check_mark:</td><td>:white_check_mark:</td><td>:material-web: <a href="https://www.optimism.io/" target="_blank">Website</a><br>:material-file-document: <a href="https://docs.optimism.io/" target="_blank">Developer Docs</a><br>:octicons-package-16: <a href="https://optimistic.etherscan.io/" target="_blank">Block Explorer</a></td></tr><tr><td>Plasma</td><td>EVM</td><td>:white_check_mark:</td><td>:white_check_mark:</td><td>:white_check_mark:</td><td>:material-web: <a href="https://www.plasma.to/" target="_blank">Website</a><br>:material-file-document: <a href="https://docs.plasma.to/docs/get-started/introduction/start-here" target="_blank">Developer Docs</a><br>:octicons-package-16: <a href="https://plasmascan.to/" target="_blank">Block Explorer</a></td></tr><tr><td>Plume</td><td>EVM</td><td>:white_check_mark:</td><td>:white_check_mark:</td><td>:white_check_mark:</td><td>:material-web: <a href="https://plume.org/" target="_blank">Website</a><br>:material-file-document: <a href="https://docs.plume.org/plume" target="_blank">Developer Docs</a><br>:octicons-package-16: <a href="https://explorer.plume.org/" target="_blank">Block Explorer</a></td></tr><tr><td>Polygon</td><td>EVM</td><td>:white_check_mark:</td><td>:white_check_mark:</td><td>:white_check_mark:</td><td>:material-web: <a href="https://polygon.technology/" target="_blank">Website</a><br>:material-file-document: <a href="https://docs.polygon.technology/" target="_blank">Developer Docs</a><br>:octicons-package-16: <a href="https://polygonscan.com/" target="_blank">Block Explorer</a></td></tr><tr><td>Scroll</td><td>EVM</td><td>:white_check_mark:</td><td>:white_check_mark:</td><td>:white_check_mark:</td><td>:material-web: <a href="https://scroll.io/" target="_blank">Website</a><br>:material-file-document: <a href="https://docs.scroll.io/en/home/" target="_blank">Developer Docs</a><br>:octicons-package-16: <a href="https://scrollscan.com/" target="_blank">Block Explorer</a></td></tr><tr><td>Sei</td><td>CosmWasm</td><td>:white_check_mark:</td><td>:white_check_mark:</td><td>:white_check_mark:</td><td>:material-web: <a href="https://www.sei.io/" target="_blank">Website</a><br>:material-file-document: <a href="https://docs.sei.io/" target="_blank">Developer Docs</a><br>:octicons-package-16: <a href="https://docs.sei.io/learn/explorers#sei-explorers" target="_blank">Block Explorer</a></td></tr><tr><td>Seievm</td><td>EVM</td><td>:white_check_mark:</td><td>:white_check_mark:</td><td>:white_check_mark:</td><td>:material-web: <a href="https://www.sei.io/" target="_blank">Website</a><br>:material-file-document: <a href="https://docs.sei.io/evm" target="_blank">Developer Docs</a><br>:octicons-package-16: <a href="https://seistream.app/" target="_blank">Block Explorer</a></td></tr><tr><td>Sonic</td><td>EVM</td><td>:white_check_mark:</td><td>:white_check_mark:</td><td>:white_check_mark:</td><td>:material-web: <a href="https://www.soniclabs.com/" target="_blank">Website</a><br>:material-file-document: <a href="https://docs.soniclabs.com/" target="_blank">Developer Docs</a><br>:octicons-package-16: <a href="https://sonicscan.org/" target="_blank">Block Explorer</a></td></tr><tr><td>Unichain</td><td>EVM</td><td>:white_check_mark:</td><td>:white_check_mark:</td><td>:white_check_mark:</td><td>:material-web: <a href="https://www.unichain.org/" target="_blank">Website</a><br>:material-file-document: <a href="https://docs.unichain.org/docs" target="_blank">Developer Docs</a><br>:octicons-package-16: <a href="https://sepolia.uniscan.xyz/" target="_blank">Block Explorer</a></td></tr><tr><td>World Chain</td><td>EVM</td><td>:white_check_mark:</td><td>:white_check_mark:</td><td>:white_check_mark:</td><td>:material-web: <a href="https://world.org/world-chain" target="_blank">Website</a><br>:material-file-document: <a href="https://docs.world.org/" target="_blank">Developer Docs</a><br>:octicons-package-16: <a href="https://docs.world.org/world-chain/providers/explorers" target="_blank">Block Explorer</a></td></tr><tr><td>X Layer</td><td>EVM</td><td>:white_check_mark:</td><td>:white_check_mark:</td><td>:white_check_mark:</td><td>:material-web: <a href="https://web3.okx.com/xlayer" target="_blank">Website</a><br>:material-file-document: <a href="https://web3.okx.com/xlayer/docs/developer/build-on-xlayer/about-xlayer" target="_blank">Developer Docs</a><br>:octicons-package-16: <a href="https://web3.okx.com/explorer/x-layer" target="_blank">Block Explorer</a></td></tr><tr><td>XRPL-EVM</td><td>EVM</td><td>:white_check_mark:</td><td>:white_check_mark:</td><td>:white_check_mark:</td><td>:material-web: <a href="https://www.xrplevm.org/" target="_blank">Website</a><br>:material-file-document: <a href="https://docs.xrplevm.org/" target="_blank">Developer Docs</a><br>:octicons-package-16: <a href="https://explorer.xrplevm.org/" target="_blank">Block Explorer</a></td></tr></tbody></table>

</div>


---

Page Title: Testnet Faucets

- Source (raw): https://raw.githubusercontent.com/wormhole-foundation/wormhole-docs/main/.ai/pages/products-reference-testnet-faucets.md
- Canonical (HTML): https://wormhole.com/docs/products/reference/testnet-faucets/
- Summary: This page includes resources to quickly find the Testnet tokens you need to deploy and test applications and contracts on Wormhole's supported networks.

# Testnet Faucets

Don't let the need for testnet tokens get in the way of buildling your next great idea with Wormhole. Use this guide to quickly locate the testnet token faucets you need to deploy and test applications and contracts on Wormhole's supported networks.




<div class="full-width" markdown>

### EVM

<table data-full-width="true" markdown><thead><th>Testnet</th><th>Environment</th><th>Token</th><th>Faucet</th></thead><tbody><tr><td>Ethereum Holesky</td><td>EVM</td><td>ETH</td><td><a href="https://www.alchemy.com/faucets/ethereum-holesky" target="_blank">Alchemy Faucet</a></td></tr><tr><td>Ethereum Sepolia</td><td>EVM</td><td>ETH</td><td><a href="https://www.alchemy.com/faucets/ethereum-sepolia" target="_blank">Alchemy Faucet</a></td></tr><tr><td>Arbitrum Sepolia</td><td>EVM</td><td>ETH</td><td><a href="https://docs.arbitrum.io/for-devs/dev-tools-and-resources/chain-info#faucets" target="_blank">List of Faucets</a></td></tr><tr><td>Avalanche</td><td>EVM</td><td>AVAX</td><td><a href="https://core.app/tools/testnet-faucet/?subnet=c&token=c" target="_blank">Official Avalanche Faucet</a></td></tr><tr><td>Base Sepolia</td><td>EVM</td><td>ETH</td><td><a href="https://docs.base.org/docs/tools/network-faucets/" target="_blank">List of Faucets</a></td></tr><tr><td>Berachain</td><td>EVM</td><td>BERA</td><td><a href="https://bartio.faucet.berachain.com/" target="_blank">Official Berachain Faucet</a></td></tr><tr><td>BNB Smart Chain</td><td>EVM</td><td>BNB</td><td><a href="https://testnet.binance.org/faucet-smart/" target="_blank">Official BNB Faucet</a></td></tr><tr><td>Celo</td><td>EVM</td><td>CELO</td><td><a href="https://faucet.celo.org/alfajores" target="_blank">Official Celo Faucet</a></td></tr><tr><td>Fantom</td><td>EVM</td><td>FTM</td><td><a href="https://faucet.fantom.network/" target="_blank">Official Fantom Faucet</a></td></tr><tr><td>HyperEVM :material-alert:{ title='⚠️ The HyperEVM integration is experimental, as its node software is not open source. Use Wormhole messaging on HyperEVM with caution.' }</td><td>EVM</td><td>mock USDC</td><td><a href="https://app.hyperliquid-testnet.xyz/drip" target="_blank">Official Hyperliquid Faucet</a></td></tr><tr><td>Ink</td><td>EVM</td><td>ETH</td><td><a href="https://inkonchain.com/faucet" target="_blank">Official Ink Faucet</a></td></tr><tr><td>Kaia</td><td>EVM</td><td>KAIA</td><td><a href="https://www.kaia.io/faucet" target="_blank">Official Kaia Faucet</a></td></tr><tr><td>Linea</td><td>EVM</td><td>ETH</td><td><a href="https://docs.linea.build/get-started/how-to/get-testnet-eth" target="_blank">List of Faucets</a></td></tr><tr><td>Mantle</td><td>EVM</td><td>MNT</td><td><a href="https://faucet.sepolia.mantle.xyz/" target="_blank">Official Mantle Faucet</a></td></tr><tr><td>Moca</td><td>EVM</td><td>MOCA</td><td><a href="https://devnet-scan.mocachain.org/faucet" target="_blank">Official Moca Faucet</a></td></tr><tr><td>Monad</td><td>EVM</td><td>MON</td><td><a href="https://testnet.monad.xyz/" target="_blank">Official Monad Faucet</a></td></tr><tr><td>Moonbeam</td><td>EVM</td><td>DEV</td><td><a href="https://faucet.moonbeam.network/" target="_blank">Official Moonbeam Faucet</a></td></tr><tr><td>Optimism Sepolia</td><td>EVM</td><td>ETH</td><td><a href="https://console.optimism.io/faucet" target="_blank">Superchain Faucet</a></td></tr><tr><td>Plasma</td><td>EVM</td><td>XPL</td><td><a href="https://www.gas.zip/faucet/plasma" target="_blank">Plasma Faucet</a></td></tr><tr><td>Plume</td><td>EVM</td><td>PLUME</td><td><a href="https://faucet.plume.org/" target="_blank">Official Plume Faucet</a></td></tr><tr><td>Polygon Amoy</td><td>EVM</td><td>POL</td><td><a href="https://faucet.polygon.technology/" target="_blank">Official Polygon Faucet</a></td></tr><tr><td>Scroll</td><td>EVM</td><td>SCR</td><td><a href="https://docs.scroll.io/en/developers/faq/#testnet-eth" target="_blank">List of Faucets</a></td></tr><tr><td>Seievm</td><td>EVM</td><td>SEI</td><td><a href="https://atlantic-2.app.sei.io/faucet" target="_blank">Sei Atlantic-2 Faucet</a></td></tr><tr><td>Unichain</td><td>EVM</td><td>ETH</td><td><a href="https://faucet.quicknode.com/unichain/sepolia" target="_blank">QuickNode Faucet</a></td></tr><tr><td>World Chain</td><td>EVM</td><td>ETH</td><td><a href="https://www.alchemy.com/faucets/world-chain-sepolia" target="_blank">Alchemy Faucet</a></td></tr><tr><td>X Layer</td><td>EVM</td><td>OKB</td><td><a href="https://web3.okx.com/xlayer/faucet" target="_blank">X Layer Official Faucet</a></td></tr><tr><td>XRPL-EVM</td><td>EVM</td><td>XRP</td><td><a href="https://faucet.xrplevm.org/" target="_blank">XRPL Official Faucet</a></td></tr></tbody></table>

### SVM

<table data-full-width="true" markdown><thead><th>Testnet</th><th>Environment</th><th>Token</th><th>Faucet</th></thead><tbody><tr><td>Pythnet</td><td>SVM</td><td>ETH</td><td><a href="https://console.optimism.io/faucet" target="_blank">Superchain Faucet</a></td></tr></tbody></table>

### AVM

<table data-full-width="true" markdown><thead><th>Testnet</th><th>Environment</th><th>Token</th><th>Faucet</th></thead><tbody><tr><td>Algorand</td><td>AVM</td><td>ALGO</td><td><a href="https://bank.testnet.algorand.network/" target="_blank">Official Algorand Faucet</a></td></tr></tbody></table>

### CosmWasm

<table data-full-width="true" markdown><thead><th>Testnet</th><th>Environment</th><th>Token</th><th>Faucet</th></thead><tbody><tr><td>Celestia</td><td>CosmWasm</td><td>TIA</td><td><a href="https://discord.gg/celestiacommunity" target="_blank">Discord Faucet</a></td></tr><tr><td>Cosmos Hub</td><td>CosmWasm</td><td>ATOM</td><td><a href="https://discord.com/invite/cosmosnetwork" target="_blank">Discord Faucet</a></td></tr><tr><td>Injective</td><td>CosmWasm</td><td>INJ</td><td><a href="https://testnet.faucet.injective.network/" target="_blank">Official Injective Faucet</a></td></tr><tr><td>Kujira</td><td>CosmWasm</td><td>KUJI</td><td><a href="https://discord.com/channels/970650215801569330/1009931570263629854" target="_blank">Discord Faucet</a></td></tr><tr><td>Neutron</td><td>CosmWasm</td><td>NTRN</td><td><a href="https://docs.neutron.org/neutron/faq#where-is-the-testnet-faucet" target="_blank">List of Faucets</a></td></tr><tr><td>Noble</td><td>CosmWasm</td><td>USDC</td><td><a href="https://faucet.circle.com/" target="_blank">Circle Faucet</a></td></tr><tr><td>Osmosis</td><td>CosmWasm</td><td>OSMO</td><td><a href="https://faucet.testnet.osmosis.zone/" target="_blank">Official Osmosis Faucet</a></td></tr><tr><td>SEDA</td><td>CosmWasm</td><td>SEDA</td><td><a href="https://devnet.explorer.seda.xyz/faucet" target="_blank">Official SEDA Faucet</a></td></tr><tr><td>Sei</td><td>CosmWasm</td><td>SEI</td><td><a href="https://atlantic-2.app.sei.io/faucet" target="_blank">Sei Atlantic-2 Faucet</a></td></tr></tbody></table>

### Move VM

<table data-full-width="true" markdown><thead><th>Testnet</th><th>Environment</th><th>Token</th><th>Faucet</th></thead><tbody><tr><td>Aptos</td><td>Move VM</td><td>APT</td><td><a href="https://www.aptosfaucet.com/" target="_blank">Official Aptos Faucet</a></td></tr></tbody></table>

### NEAR VM

<table data-full-width="true" markdown><thead><th>Testnet</th><th>Environment</th><th>Token</th><th>Faucet</th></thead><tbody><tr><td>NEAR</td><td>NEAR VM</td><td>NEAR</td><td><a href="https://near-faucet.io/" target="_blank">Official NEAR Faucet</a></td></tr></tbody></table>

### Sui Move VM

<table data-full-width="true" markdown><thead><th>Testnet</th><th>Environment</th><th>Token</th><th>Faucet</th></thead><tbody><tr><td>Sui</td><td>Sui Move VM</td><td>SUI</td><td><a href="https://docs.sui.io/guides/developer/getting-started/get-coins" target="_blank">List of Faucets</a></td></tr></tbody></table>

</div>


---

Page Title: Wormhole Finality | Consistency Levels

- Source (raw): https://raw.githubusercontent.com/wormhole-foundation/wormhole-docs/main/.ai/pages/products-reference-consistency-levels.md
- Canonical (HTML): https://wormhole.com/docs/products/reference/consistency-levels/
- Summary: This page documents how long to wait for finality before signing, based on each chain’s consistency (finality) level and consensus mechanism.

# Wormhole Finality

The following table documents each chain's `consistencyLevel` values (i.e., finality reached before signing). The consistency level defines how long the Guardians should wait before signing a VAA. The finalization time depends on the specific chain's consensus mechanism. The consistency level is a `u8`, so any single byte may be used. However, a small subset has particular meanings. If the `consistencyLevel` isn't one of those specific values, the `Otherwise` column describes how it's interpreted.



<table data-full-width="true" markdown><thead><th>Chain</th><th>Instant</th><th>Safe</th><th>Finalized</th><th>Otherwise</th><th>Time to Finalize</th><th>Details</th></thead><tbody><tr><td>Ethereum</td><td>200</td><td>201</td><td></td><td>finalized</td><td>~ 19min</td><td><a href="https://www.alchemy.com/overviews/ethereum-commitment-levels" target="_blank">Details</a></td></tr><tr><td>Solana</td><td></td><td>0</td><td>1</td><td></td><td>~ 14s</td><td><a href="https://docs.anza.xyz/consensus/commitments/" target="_blank">Details</a></td></tr><tr><td>Algorand</td><td></td><td></td><td>0</td><td></td><td>~ 4s</td><td><a href="https://developer.algorand.org/docs/get-started/basics/why_algorand/#finality" target="_blank">Details</a></td></tr><tr><td>Aptos</td><td></td><td></td><td>0</td><td></td><td>~ 4s</td><td><a href="https://aptos.dev/network/blockchain/validator-nodes#overview" target="_blank">Details</a></td></tr><tr><td>Arbitrum</td><td>200</td><td>201</td><td></td><td>finalized</td><td>~ 18min</td><td><a href="https://docs.arbitrum.io/learn-more/faq#how-many-blocks-are-needed-for-a-transaction-to-be-confirmedfinalized-in-arbitrum" target="_blank">Details</a></td></tr><tr><td>Avalanche</td><td>200</td><td></td><td></td><td>finalized</td><td>~ 2s</td><td><a href="https://build.avax.network/docs/dapps/advanced-tutorials/exchange-integration#determining-finality" target="_blank">Details</a></td></tr><tr><td>Base</td><td>200</td><td>201</td><td></td><td>finalized</td><td>~ 18min</td><td></td></tr><tr><td>Berachain</td><td>200</td><td></td><td></td><td>finalized</td><td>~ 4s</td><td></td></tr><tr><td>BNB Smart Chain</td><td>200</td><td>201</td><td></td><td>finalized</td><td>~ 12s</td><td><a href="https://docs.bnbchain.org/bnb-smart-chain/introduction/?h=finality" target="_blank">Details</a></td></tr><tr><td>Celestia</td><td></td><td></td><td>0</td><td></td><td>~ 5s</td><td></td></tr><tr><td>Celo</td><td>200</td><td></td><td></td><td>finalized</td><td>~ 10s</td><td></td></tr><tr><td>Converge</td><td></td><td></td><td>0</td><td></td><td>~ 7min</td><td></td></tr><tr><td>Cosmos Hub</td><td></td><td></td><td>0</td><td></td><td>~ 5s</td><td></td></tr><tr><td>CreditCoin</td><td></td><td></td><td>0</td><td></td><td>~ 60s</td><td></td></tr><tr><td>Dymension</td><td></td><td></td><td>0</td><td></td><td>~ 5s</td><td></td></tr><tr><td>Evmos</td><td></td><td></td><td>0</td><td></td><td>~ 2s</td><td></td></tr><tr><td>Fantom</td><td>200</td><td></td><td></td><td>finalized</td><td>~ 5s</td><td></td></tr><tr><td>Fogo</td><td></td><td></td><td>0</td><td></td><td>~ 14s</td><td></td></tr><tr><td>HyperEVM :material-alert:{ title='⚠️ The HyperEVM integration is experimental, as its node software is not open source. Use Wormhole messaging on HyperEVM with caution.' }</td><td></td><td></td><td>0</td><td></td><td>~ 2s</td><td></td></tr><tr><td>Injective</td><td></td><td></td><td>0</td><td></td><td>~ 3s</td><td></td></tr><tr><td>Ink</td><td></td><td></td><td>0</td><td></td><td>~ 9min</td><td></td></tr><tr><td>Kaia</td><td>200</td><td></td><td></td><td>finalized</td><td>~ 1s</td><td></td></tr><tr><td>Kujira</td><td></td><td></td><td>0</td><td></td><td>~ 3s</td><td></td></tr><tr><td>Mantle</td><td>200</td><td>201</td><td></td><td>finalized</td><td>~ 18min</td><td></td></tr><tr><td>Mezo</td><td></td><td></td><td>0</td><td></td><td>~ 8s</td><td></td></tr><tr><td>Moca</td><td></td><td></td><td>0</td><td></td><td>~ 1s</td><td></td></tr><tr><td>Monad</td><td></td><td></td><td>0</td><td></td><td>~ 2s</td><td></td></tr><tr><td>Moonbeam</td><td>200</td><td>201</td><td></td><td>finalized</td><td>~ 24s</td><td><a href="https://docs.moonbeam.network/builders/ethereum/json-rpc/moonbeam-custom-api/#finality-rpc-endpoints" target="_blank">Details</a></td></tr><tr><td>NEAR</td><td></td><td></td><td>0</td><td></td><td>~ 2s</td><td><a href="https://nomicon.io/ChainSpec/Consensus" target="_blank">Details</a></td></tr><tr><td>Neutron</td><td></td><td></td><td>0</td><td></td><td>~ 5s</td><td></td></tr><tr><td>Optimism</td><td>200</td><td>201</td><td></td><td>finalized</td><td>~ 18min</td><td></td></tr><tr><td>Osmosis</td><td></td><td></td><td>0</td><td></td><td>~ 6s</td><td></td></tr><tr><td>Plasma</td><td></td><td></td><td>0</td><td></td><td>~ 3s</td><td></td></tr><tr><td>Plume</td><td></td><td></td><td>0</td><td></td><td>~ 18min</td><td></td></tr><tr><td>Polygon</td><td>200</td><td></td><td></td><td>finalized</td><td>~ 6s</td><td><a href="https://docs.polygon.technology/pos/architecture/heimdall/checkpoints/" target="_blank">Details</a></td></tr><tr><td>Scroll</td><td>200</td><td></td><td></td><td>finalized</td><td>~ 50min</td><td></td></tr><tr><td>Sei</td><td></td><td></td><td>0</td><td></td><td>~ 1s</td><td></td></tr><tr><td>Seievm</td><td></td><td></td><td>0</td><td></td><td>~ 1s</td><td></td></tr><tr><td>Sonic</td><td></td><td></td><td>0</td><td></td><td>~ 1s</td><td></td></tr><tr><td>Stacks</td><td></td><td></td><td>0</td><td></td><td>~ 61min</td><td></td></tr><tr><td>Stargaze</td><td></td><td></td><td>0</td><td></td><td>~ 5s</td><td></td></tr><tr><td>Sui</td><td></td><td></td><td>0</td><td></td><td>~ 3s</td><td><a href="https://docs.sui.io/concepts/sui-architecture/consensus" target="_blank">Details</a></td></tr><tr><td>Unichain</td><td>200</td><td>201</td><td></td><td>finalized</td><td>~ 18min</td><td></td></tr><tr><td>World Chain</td><td></td><td></td><td>0</td><td></td><td>~ 18min</td><td></td></tr><tr><td>X Layer</td><td>200</td><td>201</td><td></td><td>finalized</td><td>~ 16min</td><td></td></tr><tr><td>XRPL-EVM</td><td></td><td></td><td>0</td><td></td><td>~ 10s</td><td></td></tr></tbody></table>


---

Page Title: Wormhole Formatted Addresses

- Source (raw): https://raw.githubusercontent.com/wormhole-foundation/wormhole-docs/main/.ai/pages/products-reference-wormhole-formatted-addresses.md
- Canonical (HTML): https://wormhole.com/docs/products/reference/wormhole-formatted-addresses/
- Summary: Explanation of Wormhole formatted 32-byte hex addresses, their conversion, and usage across different blockchain platforms.

# Wormhole Formatted Addresses

Wormhole formatted addresses are 32-byte hex representations of addresses from any supported blockchain. Whether an address originates from EVM, Solana, Cosmos, or another ecosystem, Wormhole standardizes all addresses into this format to ensure cross-chain compatibility.

This uniform format is essential for smooth interoperability in token transfers and messaging across chains. Wormhole uses formatted addresses throughout the [Wormhole SDK](https://github.com/wormhole-foundation/wormhole-sdk-ts){target=\_blank}, especially in cross-chain transactions, such as transfer functions that utilize the `bytes32` representation for recipient addresses.

## Platform-Specific Address Formats

Each blockchain ecosystem Wormhole supports has its method for formatting native addresses. To enable cross-chain compatibility, Wormhole converts these native addresses into the standardized 32-byte hex format.

Here’s an overview of the native address formats and how they are normalized to the Wormhole format:

| Platform        | Native Address Format            | Wormhole Formatted Address |
|-----------------|----------------------------------|----------------------------|
| EVM             |  Hex (e.g., 0x...)               |  32-byte Hex               |
| Solana          |  Base58                          |  32-byte Hex               |
| CosmWasm        |  Bech32                          |  32-byte Hex               |
| Algorand        |  Algorand App ID                 |  32-byte Hex               |
| Sui             |  Hex                             |  32-byte Hex               |
| Aptos           |  Hex                             |  32-byte Hex               |
| Near            |  SHA-256                         |  32-byte Hex               |

These conversions allow Wormhole to interact seamlessly with various chains using a uniform format for all addresses.

### Address Format Handling

The Wormhole SDK provides mappings that associate each platform with its native address format. You can find this mapping in the Wormhole SDK file [`platforms.ts`](https://github.com/wormhole-foundation/wormhole-sdk-ts/blob/007f61b27c650c1cf0fada2436f79940dfa4f211/core/base/src/constants/platforms.ts#L93-L102){target=\_blank}:

```typescript
const platformAddressFormatEntries = [
  ['Evm', 'hex'],
  ['Solana', 'base58'],
  ['Cosmwasm', 'bech32'],
  ['Algorand', 'algorandAppId'],
  ['Sui', 'hex'],
  ['Aptos', 'hex'],
  ['Near', 'sha256'],
];
```

These entries define how the [`UniversalAddress`](https://github.com/wormhole-foundation/wormhole-sdk-ts/blob/007f61b27c650c1cf0fada2436f79940dfa4f211/core/definitions/src/universalAddress.ts#L23){target=\_blank} class handles different address formats based on the platform.

## Universal Address Methods

The `UniversalAddress` class is essential for working with Wormhole formatted addresses. It converts native blockchain addresses into the standardized 32-byte hex format used across Wormhole operations.

Key functions:

 - **`new UniversalAddress()`**: Use the `UniversalAddress` constructor to convert native addresses into the Wormhole format.

    ```typescript
    const universalAddress = new UniversalAddress('0x123...', 'hex');
    ```

 - **`toUniversalAddress()`**: Converts a platform-specific address into the Wormhole formatted 32-byte hex address.

    ```typescript
    const ethAddress: NativeAddress<'Evm'> = toNative('Ethereum', '0x0C9...');
    const universalAddress = ethAddress.toUniversalAddress().toString();
    ```

 - **`toNative()`**: Converts the Wormhole formatted address back to a native address for a specific blockchain platform.

    ```typescript
    const nativeAddress = universalAddress.toNative('Evm');
    ```

 - **`toString()`**: Returns the Wormhole formatted address as a hex string, which can be used in various SDK operations.

    ```typescript
    console.log(universalAddress.toString());
    ```

These methods allow developers to convert between native addresses and the Wormhole format, ensuring cross-chain compatibility.

## Convert Between Native and Wormhole Formatted Addresses

The Wormhole SDK allows developers to easily convert between native addresses and Wormhole formatted addresses when building cross-chain applications.

### Convert a Native Address to a Wormhole Formatted Address

Example conversions for EVM and Solana:

=== "EVM"

    ```typescript
    import { toNative } from '@wormhole-foundation/sdk-core';

    const ethAddress: NativeAddress<'Evm'> = toNative(
      'Ethereum',
      '0x0C99567DC6f8f1864cafb580797b4B56944EEd28'
    );
    const universalAddress = ethAddress.toUniversalAddress().toString();
    console.log('Universal Address (EVM):', universalAddress);

    ```

=== "Solana"

    ```typescript
    import { toNative } from '@wormhole-foundation/sdk-core';

    const solAddress: NativeAddress<'Solana'> = toNative(
      'Solana',
      '6zZHv9EiqQYcdg52ueADRY6NbCXa37VKPngEHaokZq5J'
    );
    const universalAddressSol = solAddress.toUniversalAddress().toString();
    console.log('Universal Address (Solana):', universalAddressSol);

    ```

The result is a standardized address format that is ready for cross-chain operations.

### Convert Back to Native Addresses

Below is how you can convert a Wormhole formatted address back to an EVM or Solana native address:

```typescript
const nativeAddressEvm = universalAddress.toNative('Evm');
console.log('EVM Native Address:', nativeAddressEvm);

const nativeAddressSolana = universalAddress.toNative('Solana');
console.log('Solana Native Address:', nativeAddressSolana);
```

These conversions ensure that your cross-chain applications can seamlessly handle addresses across different ecosystems.

## Use Cases for Wormhole Formatted Addresses

### Cross-chain Token Transfers

Cross-chain token transfers require addresses to be converted into a standard format. For example, when transferring tokens from Ethereum to Solana, the Ethereum address is converted into a Wormhole formatted address to ensure compatibility. After the transfer, the Wormhole formatted address is converted back into the Solana native format.

### Smart Contract Interactions

In smart contract interactions, especially when building dApps that communicate across multiple chains, Wormhole formatted addresses provide a uniform way to reference addresses. This ensures that addresses from different blockchains can interact seamlessly, whether you're sending messages or making cross-chain contract calls.

### DApp Development

For cross-chain dApp development, Wormhole formatted addresses simplify handling user wallet addresses across various blockchains. This allows developers to manage addresses consistently, regardless of whether they work with EVM, Solana, or another supported platform.

### Relayers and Infrastructure

Finally, relayers and infrastructure components, such as Wormhole Guardians, rely on the standardized format to efficiently process and relay cross-chain messages. A uniform address format simplifies operations, ensuring smooth interoperability across multiple blockchains.
