---
title: W Staking
description: Integrate W staking into your app on EVM and Solana. Learn flows, contract calls, and delegate discovery using the Tally API.
---

# W Staking Integration

W staking allows users to stake their W tokens to participate in governance and earn staking rewards in return, while retaining control over their tokens. This guide walks you through integrating native W staking for both EVM chains (Ethereum, Optimism, Arbitrum, Base) and Solana, including high-level differences, contract calls, and recommended delegate discovery via the [Tally API](https://apidocs.tally.xyz/){target=\_blank}.

## Staking and Voting Comparison

|                     | EVM (ETH, OP, ARB, BASE)                          | Solana                                         |
|---------------------|---------------------------------------------------|------------------------------------------------|
| **Staking**         | Delegate your W tokens to another address.<br>Tokens stay in your wallet. | Move W tokens into a stake account and assign a delegate. |
| **Unstaking**       | Delegation removed; no token movement.                   | Withdraw tokens from stake account.     |
| **Partial Staking** | Not supported (delegation applies to your full balance). | Supported; stake any amount of W.       |
| **Voting Power**    | The delegate gets full voting rights for your W balance. | The delegate gets voting rights only for the amount staked. |

## EVM Integration (ETH, OP, ARB, BASE)

On EVM chains, staking is done by delegating your W balance to a delegate address using a single contract call. Tokens remain in your wallet, and delegation applies to your entire W balance.

### W Token Contract Call

```js 
const tx = await writeContractAsync({
  address: W_TOKEN_ADDRESS,
  abi: ERC1967,
  functionName: 'delegate',
  args: [isStaking ? delegateAddress : zeroAddress],
  chainId: chainId,
})
```

- To stake, pass the `delegateAddress`.
- To unstake, pass the `zeroAddress` (`0x000...000`).

Use the `delegates(address)` view function to check the current delegate for a given address.

!!!note "Important Notes"
    - There can only be one delegate per wallet. 
    - You can delegate to yourself or someone else.
    - Wormhole maintains a list of delegates using the Tally API (covers EVM and Solana).

## Solana Integration


On Solana, staking means moving W into a stake custody account that’s tied to the staker and assigning a delegate for the voting power of the amount you staked. Any amount can be staked, and the delegate can be yourself or another party.

### Prerequisites

- `@solana/web3.js`, `@solana/spl-token`, and `@coral-xyz/anchor` installed.
- A connection to the target cluster (e.g., mainnet).
- The W token mint on Solana.
- The [Staking program ID](#program-ids-and-abis){target=\_blank} (Anchor program) and its IDL.

### Inputs to  Provide

| Input        | Type         | Description                                     | Example                                                 |
|--------------|--------------|-------------------------------------------------|---------------------------------------------------------|
| `connection` | `Connection` | An RPC connection to the target Solana cluster. | `new Connection('https://api.mainnet-beta.solana.com')` |
| `wallet` | `AnchorProvider.wallet` | The wallet that signs transactions and pays fees. | `provider.wallet` |
| `programId` | `PublicKey` | The deployed staking program ID. | `new PublicKey('MGoV9M6YUsdhJzjzH9JMCW2tRe1LLxF1CjwqKC7DR1B')` |
| `idl` | `Idl` | The IDL for the staking program. | Loaded JSON file |
| `wMint` | `PublicKey` | The W token mint address on Solana. | `new PublicKey('85VBFQZC9TZkfaptBWjvUw7YbZjy52A6mjtPGjstQAmQ')` |
| `userPublicKey` | `PublicKey` | The staker’s wallet public key. | `wallet.publicKey` |
| `delegateePublicKey` | `PublicKey` | The address of the delegate who will receive voting power. | `new PublicKey('<DELEGATE_ADDRESS>')` |
| `currentDelegatePublicKey` | `PublicKey` | Your current delegate’s address when switching delegates (or `null` if staking for the first time). | `null` |
| `amount` | `BN` or `bigint` | The number of W tokens to stake in base units (respecting the token’s decimals). | `new BN(10 * 10 ** 9)` if W has 9 decimals |

### Staking Flow (Solana)

Initialize the staking program and config. See [Program IDs and ABIs section](/docs/protocol/staking/w-staking/#program-ids-and-abis) for more details.

Staking steps:

1. Ensure the user has a W token ATA (Associated Token Account).
2. Create a stake account if one doesn't already exist.
3. Transfer tokens to the stake custody account.
4. Create a delegate stake account if needed.
5. Send the `delegate()` instruction.

```js   
--8<-- 'code/protocol/staking/staking-flow.js'
```

### Unstaking Flow (Solana)

Unstaking moves your staked W tokens back into your wallet’s Associated Token Account (ATA). To do this, the staking program withdraws tokens from the custody account and returns them to the user.

Unstaking steps:

1. Confirm the user’s stake metadata and custody accounts.
2. Call the `withdrawTokens()` instruction to move tokens back to the user’s ATA.

```js 
--8<-- 'code/protocol/staking/unstaking-flow.js'
```

!!!note "Important Notes"
    - Delegating to an active voter is generally recommended (see [Tally API](https://apidocs.tally.xyz/){target=\_blank}).
    - Both self and third-party delegation are supported.

## Using the Tally API

Wormhole leverages the [Tally API](https://apidocs.tally.xyz/){target=\_blank} to fetch live delegate and voting data across both EVM and Solana.

- To fetch Solana delegates, use the Program ID as the `governorId`.
- You will need your Tally `organizationId`.

## Program IDs and ABIs

**EVM**

- W Token Contract: `0xb0ffa8000886e57f86dd5264b9582b2ad87b2b91`
- ERC1967 delegate ABI ([Etherscan link](https://etherscan.io/address/0xb0ffa8000886e57f86dd5264b9582b2ad87b2b91#readProxyContract){target=\_blank})

**Solana**

- W Token Address: `85VBFQZC9TZkfaptBWjvUw7YbZjy52A6mjtPGjstQAmQ`
- Current MultiGov Program ID: `MGoV9M6YUsdhJzjzH9JMCW2tRe1LLxF1CjwqKC7DR1B`
- IDL: [Solscan IDL](https://solscan.io/account/MGoV9M6YUsdhJzjzH9JMCW2tRe1LLxF1CjwqKC7DR1B#anchorProgramIdl){target=\_blank}

To integrate with an Anchor program, you need the IDL file (as shown in the sample code above) : 

- You can retrieve it from: [Solscan IDL](https://solscan.io/account/MGoV9M6YUsdhJzjzH9JMCW2tRe1LLxF1CjwqKC7DR1B#anchorProgramIdl){target=\_blank}
- As seen in:

```js
const program = new anchor.Program<Staking>(simplerStakingIDL, {
  connection,
})
```

For PDA derivations, Tally API integration, or custom integrations, you will need the Program ID. Example PDA derivation use case:

```js
// If you already have the IDL/program above, use program.programId
const programId = new PublicKey(
    'MGoV9M6YUsdhJzjzH9JMCW2tRe1LLxF1CjwqKC7DR1B',
)
const [pda] = PublicKey.findProgramAddressSync(
    [Buffer.from('stake_metadata'), wallet.toBuffer()],
    programId,
)
```

Implementation of a Tally API call using ProgramID:

```js
solanaGovernorId = 'solana:5eykt4UsFv8P8NJdTREpY1vzqKqZKvdp:MGoV9M6YUsdhJzjzH9JMCW2tRe1LLxF1CjwqKC7DR1B'
const resp = await this.tally.query(
    gql`
        query Delegates($input: DelegatesInput!) {
            delegates(input: $input) {
                nodes {
                    ... on Delegate {
                      id
                      account {
                        address
                        bio
                        name
                        picture
                        twitter
                      }
                      votesCount
                      delegatorsCount
                      statement {
                        statementSummary
                      }
                      token {
                        symbol
                        decimals
                      }
                    }
                  }
                  pageInfo {
                    firstCursor
                    lastCursor
                  }
                }
              }
            `,
            {
              input: {
                sort: { isDescending: true, sortBy: 'votes' },
                page: { afterCursor: cursor, limit: 20 },
                filters: {
                  governorId: this.solanaGovernorId,
                },
              },
            },
)
```

