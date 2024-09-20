---
title: Security
description: Explore Wormhole's security features, including the Guardian network, governance, monitoring, open-source development, and bug bounty programs.
---

# Security

## Core Security Assumptions

At its core, Wormhole is secured by a network of [Guardian](/docs/learn/infrastructure/guardians/){target=\_blank} nodes that validate and sign messages. If a super majority (e.g., 13 out of 19) of Guardians sign the same message, it can be considered valid. A smart contract on the target chain will verify the signatures and format of the message before approving any transaction.

- Wormhole's core security primitive is its signed messages (signed [VAAs](/docs/learn/fundamentals/glossary/#vaa){target=\_blank})
- The Guardian network is currently secured by a collection of 19 of the world's top [validator companies](https://wormhole-foundation.github.io/wormhole-dashboard/#/?endpoint=Mainnet){target=\_blank}
- Guardians produce signed state attestations (signed VAAs) when requested by a Core Contract integrator
- Every Guardian runs full nodes (rather than light nodes) of every blockchain in the Wormhole network, so if a blockchain suffers a consensus attack or hard fork, the blockchain will disconnect from the network rather than potentially produce invalid signed VAAs
- Any Signed VAA can be verified as authentic by the Core Contract of any other chain
- [Relayers](/docs/learn/fundamentals/glossary/#relayer){target=\_blank} are considered untrusted in the Wormhole ecosystem

In summary:

- **Core integrators aren't exposed to risk from chains and contracts they don't integrate with**
- By default, you only trust Wormhole's signing process and the core contracts of the chains you're on
- You can expand your contract and chain dependencies as you see fit

Core assumptions aside, many other factors impact the real-world security of decentralized platforms. Here is more information on additional measures that have been put in place to ensure the security of Wormhole.

## Guardian Network

Wormhole is an evolving platform. While the Guardian set currently comprises 19 validators, this is a limitation of current blockchain technology.

### Governance

Governance is the process through which contract upgrades happen. Guardians manually vote on governance proposals that originate inside the Guardian Network and are then submitted to ecosystem contracts.

This means that governance actions are held to the same security standard as the rest of the system. A two-thirds supermajority of the Guardians is required to pass any governance action.

Governance messages can target any of the various wormhole modules, including the core contracts and all currently deployed token bridge contracts. When a Guardian signs such a message, its signature implies a vote on the action in question. Once more than two-thirds of the Guardians have signed, the message and governance action are considered valid.

All governance actions and contract upgrades have been managed via Wormhole's on-chain governance system.

Via governance, the Guardians can:

- Change the current Guardian set
- Expand the Guardian set
- Upgrade ecosystem contract implementations

The governance system is fully open source in the core repository. See the [Open Source section](#open-source){target=\_blank} for contract source.

## Monitoring

A key element of Wormhole's defense-in-depth strategy is that each Guardian is a highly competent validator company with its own in-house processes for running, monitoring, and securing blockchain operations. This heterogeneous approach to monitoring increases the likelihood that fraudulent activity is detected and reduces the number of single failure points in the system.

Guardians are not just running Wormhole validators; they're running validators for every blockchain inside of Wormhole as well, which allows them to perform monitoring holistically across decentralized computing rather than just at a few single points.

Guardians monitor:

- Block production and consensus of each blockchain - if a blockchain's consensus is violated, it will be disconnected from the network until the Guardians resolve the issue
- Smart contract level data - via processes like the Governor, Guardians constantly monitor the circulating supply and token movements across all supported blockchains
- Guardian level activity - the Guardian Network functions as an autonomous decentralized computing network, complete with its blockchain ([Gateway](/docs/learn/messaging/gateway/){target=\_blank})

## Gateway And Asset Layer Protections

One of the most powerful aspects of the Wormhole ecosystem is that Guardians effectively have the entire state of DeFi available to them.

Gateway is a Cosmos-based blockchain that runs internally to the Guardian network, whereby the Guardians can effectively execute smart contracts against the current state of all blockchains rather than just one blockchain.

This enables additional protection for the Wormhole Asset Layer in addition to the core assumptions:

- **Global Accountant** - the accountant tracks the total circulating supply of all Wormhole assets across all chains and prevents any blockchain from bridging assets which would violate the supply invariant

In addition to the Global Accountant, Guardians may only sign transfers that do not violate the requirements of the Governor. The [Governor](https://github.com/wormhole-foundation/wormhole/blob/main/whitepapers/0007_governor.md){target=\_blank} tracks inflows and outflows of all blockchains and delays suspicious transfers that may indicate an exploit.

## Open Source

Wormhole builds in the open and is always open source.

- **[Wormhole core repository](https://github.com/wormhole-foundation/wormhole){target=\_blank}**
- **[Wormhole Foundation GitHub organization](https://github.com/wormhole-foundation){target=\_blank}**
- **[Wormhole contract deployments](/docs/learn/infrastructure/core-contracts/){target=\_blank}**

## Audits

Wormhole has been heavily audited, with _29 third-party audits completed_ and more started. Audits have been performed by the following firms:

- [Trail of Bits](https://www.trailofbits.com/){target=\_blank}
- [Neodyme](https://neodyme.io/en/){target=\_blank}
- [Kudelski](https://kudelskisecurity.com/){target=\_blank}
- [OtterSec](https://osec.io/){target=\_blank}
- [Certik](https://www.certik.com/){target=\_blank}
- [Hacken](https://hacken.io/){target=\_blank}
- [Zellic](https://www.zellic.io/){target=\_blank}
- [Coinspect](https://www.coinspect.com/){target=\_blank}
- [Halborn](https://www.halborn.com/){target=\_blank}
- [Cantina](https://cantina.xyz/welcome){target=\_blank}

All audits and final reports can be found in [security page of the GitHub Repo](https://github.com/wormhole-foundation/wormhole/blob/main/SECURITY.md#3rd-party-security-audits){target=\blank}.

## Bug Bounties

Wormhole has one of the largest bug bounty programs in software development and has repeatedly shown commitment to engaging with the white hat community.

Wormhole runs a bug bounty program through [Immunefi](https://immunefi.com/bug-bounty/wormhole/){target=\blank} program, with a top payout of **5 million dollars**.

If you are interested in contributing to Wormhole security, please look at this section for [Getting Started as a White Hat](https://github.com/wormhole-foundation/wormhole/blob/main/SECURITY.md#white-hat-hacking){target=\blank}, and follow the [Wormhole Contributor Guidelines](https://github.com/wormhole-foundation/wormhole/blob/main/CONTRIBUTING.md){target=\blank}.

For more information about submitting to the bug bounty programs, refer to the [Wormhole Immunefi page](https://immunefi.com/bug-bounty/wormhole/){target=\blank}.

## Learn More

The [SECURITY.md](https://github.com/wormhole-foundation/wormhole/blob/main/SECURITY.md){target=\blank} from the official repository has the latest security policies and updates.
