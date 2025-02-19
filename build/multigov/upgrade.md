---
title: Upgrading MultiGov
description: Learn the process and key considerations for upgrading MultiGov, ensuring system integrity and careful planning across cross-chain components.
---

# Upgrade MultiGov Contracts

MultiGov is designed to be flexible but stable. Upgrades should be rare and carefully considered due to the system's complexity and cross-chain nature. When upgrades are necessary, they must be meticulously planned and executed to ensure system integrity and continuity.

## Key Considerations for Upgrades

- **`HubGovernor`**:
    - Not upgradeable. A new deployment requires redeploying several components of the MultiGov system. Refer to the [Process for Major System Upgrade](/docs/build/multigov/upgrade/#process-for-major-system-upgrade) section for more details 

- **`HubVotePool`**:
    - Can be replaced by setting a new `HubVotePool` on the `HubGovernor`
    - Requires re-registering all spokes on the new `HubVotePool`
    - Must register the query type and implementation for vote decoding by calling `registerQueryType` on the new `HubVotePool` <!-- put registerQueryType link back in once repo is public https://github.com/wormhole-foundation/example-multigov/blob/main/evm/src/HubVotePool.sol#L84 -->
    - A new proposal would have to authorize the governor to use the newly created hub vote pool and will also handle registering the appropriate query decoders and registering the appropriate spoke `SpokeVoteAggregators`

- **`SpokeMessageExecutor`**:
    - Upgradeable via [UUPS](https://www.rareskills.io/post/uups-proxy){target=\_blank} proxy pattern
    - Stores critical parameters in `SpokeMessageExecutorStorage`

- **`HubEvmSpokeAggregateProposer`**:
    - Needs redeployment if `HubGovernor` changes
    - Requires re-registering all spokes after redeployment

- **`HubProposalMetadata`**:
    - Needs redeployment if `HubGovernor` changes, as it references `HubGovernor` as a parameter

- **`SpokeMetadataCollector`**:
    - Requires redeployment if the hub chain ID changes or if `HubProposalMetadata` changes

## Process for Major System Upgrade 

1. **New `HubGovernor` deployment**:
    - Deploy the new `HubGovernor` contract
1. **Component redeployment**:
    - Redeploy `HubEvmSpokeAggregateProposer` with the new `HubGovernor` address
    - Redeploy `HubProposalMetadata` referencing the new `HubGovernor`
    - If hub chain ID changes, redeploy `SpokeMetadataCollector` on all spoke chains
1. **`HubVotePool` update**:
    - Set the new `HubVotePool` on the new `HubGovernor`
    - Register all spokes on the new `HubVotePool`
    - Register the query type and implementation for vote decoding (`HubEvmSpokeVoteDecoder`)
1. **Spoke re-registration**:
    - Re-register all spokes on the new `HubEvmSpokeAggregateProposer`
1. **Verification and testing**:
    - Conduct thorough testing of the new system setup
    - Verify all cross-chain interactions are functioning correctly
1. **System transition and deprecation**:
    - Create a proposal to switch the timelock to the new governor
    - Communicate clearly to the community what changes were made
1. **Monitoring**:
    - Implement a transition period where the new system is closely monitored
    - Address any issues that arise promptly

## Important Considerations

- Always prioritize system stability, upgrades should only be performed when absolutely necessary
- Thoroughly audit all new contract implementations before proposing an upgrade
- Account for all affected components across all chains in the upgrade plan
- Provide comprehensive documentation for the community about the upgrade process and any changes in functionality
- Always test upgrades extensively on testnets before implementing in production