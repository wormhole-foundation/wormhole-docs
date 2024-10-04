---
title: MultiGov Guides
description: Access step-by-step guides for executing cross-chain governance actions, including treasury management proposals with MultiGov and Wormhole.
---

# Cross-Chain Treasury Management Proposal

This guide walks through the process of creating and executing a cross-chain governance proposal to mint W tokens to both the Optimism and Arbitrum treasuries. In this tutorial, we'll cover how to create a proposal on the Hub Chain (Ethereum Mainnet), cast votes from Spoke Chains (Optimism and Arbitrum), aggregate votes, and execute the proposal.

## Create a Proposal (Hub Chain - Ethereum Mainnet)

The first step is to create a proposal on the Hub Chain, which in this case is Ethereum Mainnet. The proposal will contain instructions to mint 10 W tokens to the Optimism treasury and 15 ETH to the Arbitrum treasury.
In the following code snippet, we initialize the proposal with two transactions, each targeting the Hub's Message Dispatcher contract. These transactions will relay the governance actions to the respective spoke chains via Wormhole.

Key actions:

- Define the proposal targets (two transactions to the Message Dispatcher)
- Set values for each transaction (in this case, both are 0 as we're not transferring any native ETH)
- Encode the calldata for minting 10 W tokens on Optimism and sending 15 ETH to Arbitrum
- Finally, we submit the proposal to the `HubGovernor` contract


```solidity
HubGovernor governor = HubGovernor(GOVERNOR_ADDRESS);
// Prepare proposal details
address[] memory targets = new address[](2);
targets[0] = HUB_MESSAGE_DISPATCHER_ADDRESS;
targets[1] = HUB_MESSAGE_DISPATCHER_ADDRESS;
uint256[] memory values = new uint256[](2);
values[0] = 0;
values[1] = 0;
bytes[] memory calldatas = new bytes[](2);
// Prepare message for Optimism to mint 10 W tokens
// bytes created using abi.encodeWithSignature("mint(address,uint256)", 0xB0fFa8000886e57F86dd5264b9582b2Ad87b2b91, 10e18)
calldatas[0] = abi.encodeWithSignature(
    "dispatch(bytes)", 
    abi.encode(
        OPTIMISM_WORMHOLE_CHAIN_ID,
        [OPTIMISM_WORMHOLE_TREASURY_ADDRESS],
        [uint256(10 ether)],
        [hex"0x40c10f19000000000000000000000000b0ffa8000886e57f86dd5264b9582b2ad87b2b910000000000000000000000000000000000000000000000008ac7230489e8000000000000000000000000000000000000000000000000000000000000"] 
    )
);
// Prepare message for Arbitrum to receive 15 ETH
calldatas[1] = abi.encodeWithSignature(
    "dispatch(bytes)", 
    abi.encode(
        ARBITRUM_WORMHOLE_CHAIN_ID,
        [ARBITRUM_WORMHOLE_TREASURY_ADDRESS],
        [uint256(15 ether)],
        [hex"0x40c10f19000000000000000000000000b0ffa8000886e57f86dd5264b9582b2ad87b2b910000000000000000000000000000000000000000000000008ac7230489e8000000000000000000000000000000000000000000000000000000000000"] 
    )
);
string memory description = "Mint 10 W to Optimism treasury and 10 W to Arbitrum treasury via Wormhole";
// Create the proposal
uint256 proposalId = governor.propose(
    targets, values, calldatas, description
)
```

??? interface "Parameters"

    `GOVERNOR_ADDRESS` ++"address"++

    The address of the `HubGovernor` contract on Ethereum Mainnet.

    ---

    `targets` ++"address[]"++

    An array that specifies the addresses that will receive the proposal's actions. Here, both are set to the `HUB_MESSAGE_DISPATCHER_ADDRESS`.

    ---

    `values` ++"uint256[]"++

    An array containing the value of each transaction (in wei). In this case, both are set to zero because no ETH is being transferred.

    ---

    `calldatas` ++"bytes[]"++

    The calldata for the proposal. These are encoded contract calls containing cross-chain dispatch instructions for minting tokens and sending ETH. The calldata specifies minting 10 W tokens to the Optimism treasury and sending 15 ETH to the Arbitrum treasury.

    ---

    `description` ++"string"++

    A description of the proposal, outlining the intent to mint tokens to Optimism and send ETH to Arbitrum.

??? interface "Returns"

    `proposalId` ++"uint256"++

    The ID of the newly created proposal on the Hub Chain. 

## Vote on the Proposal via Spoke

Once the proposal is created on the Hub Chain, stakeholders can cast their votes on the spoke chains. This snippet demonstrates how to connect to a spoke chain and cast a vote for the proposal. The voting power (weight) is calculated based on each stakeholder's token holdings on the spoke chain.

Key actions:

- Connect to the `SpokeVoteAggregator` contract on the spoke chain. This contract aggregates votes from the spoke chains and relays them to the Hub Chain
- Cast a vote in support of the proposal

```solidity
// Connect to the SpokeVoteAggregator contract of the desired chain
SpokeVoteAggregator voteAggregator = SpokeVoteAggregator(VOTE_AGGREGATOR_ADDRESS);
// Cast a vote
uint8 support = 1; // 1 for supporting, 0 for opposing
uint256 weight = voteAggregator.castVote(proposalId, support);
```

??? interface "Parameters"

    `VOTE_AGGREGATOR_ADDRESS` ++"address"++

    The address of the `SpokeVoteAggregator` contract on the spoke chain (Optimism or Arbitrum).

    ---

    `proposalId` ++"uint256"++

    The ID of the proposal created on the Hub Chain, which is being voted on.

    ---

    `support` ++"uint8"++

    The vote being cast (`1` for supporting the proposal, `0` for opposing).

??? interface "Returns"

    `weight` ++"uint256"++

    The weight of the vote, determined by the voter’s token holdings on the spoke chain.

## Vote Aggregation (Background Process)

In the background, votes cast on the spoke chains are aggregated and sent back to the Hub Chain for final tallying. This is typically handled off-chain by a "crank turner" service, which periodically queries the vote status and updates the Hub Chain.

Key actions:

- Aggregate votes from different chains and submit them to the Hub Chain for tallying


```solidity
// Aggregate votes sent to Hub (this would typically be done by a "crank turner" off-chain)
hubVotePool.crossChainVote(queryResponseRaw, signatures);
```

??? interface "Parameters"

    `queryResponseRaw` ++"bytes"++

    The raw vote data from the spoke chains.

    ---

    `signatures` ++"bytes"++

    Cryptographic signatures that verify the validity of the votes from the spoke chains.

## Execute Proposal and Dispatch Cross-Chain Messages

After the proposal passes and the votes are tallied, the next step is to execute the proposal. The `HubGovernor` contract will dispatch the cross-chain messages to the spoke chains, where the respective treasuries will receive the tokens.

Key actions:

- Execute the proposal after the voting period ends and the proposal passes
- The `execute` function finalizes the proposal execution by dispatching the cross-chain governance actions. The descriptionHash ensures that the executed proposal matches the one that was voted on.

```solidity
HubGovernor governor = HubGovernor(GOVERNOR_ADDRESS);
// Standard timelock execution
governor.execute(targets, values, calldatas, descriptionHash);
```

??? interface "Parameters"

    `governor` ++"HubGovernor"++

    The `HubGovernor` contract instance.

    ---

    `targets` ++"address[]"++

    An array containing the target addresses for the proposal’s transactions (in this case, the `HUB_MESSAGE_DISPATCHER_ADDRESS` for both).

    ---

    `values` ++"uint256[]"++

    An array of values (in wei) associated with each transaction (both are zero in this case).

    ---

    `calldatas` ++"bytes[]"++

    The encoded transaction data to dispatch the governance actions (e.g., minting tokens and transferring ETH).

    ---

    `descriptionHash` ++"bytes32"++

    A hash of the proposal’s description, used to verify the proposal before execution.

??? interface "Returns"

    No direct return, but executing this function finalizes the cross-chain governance actions by dispatching the encoded messages via Wormhole to the spoke chains.

Once the proposal is executed, the encoded messages will be dispatched via Wormhole to the spoke chains, where the Optimism and Arbitrum treasuries will receive their respective funds.