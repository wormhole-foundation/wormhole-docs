---
title: W Staking
description: Integrate W staking into your app on EVM and Solana. Learn flows, contract calls, and delegate discovery using the Tally API.
---

# W Staking Integration

This guide walks you through integrating native W staking for both EVM chains (Ethereum, Optimism, Arbitrum, Base) and Solana, including high-level differences, contract calls, and recommended delegate discovery via the Tally API.

## Overview

|                       | EVM (ETH, OP, ARB, BASE)                          | Solana                                         |
|-----------------------|---------------------------------------------------|------------------------------------------------|
| **How staking works** | Delegate your W tokens to another address.<br>Tokens stay in your wallet. | Move W tokens into a stake account and assign a delegate. |
| **Unstaking**         | Remove the delegate. Tokens don’t move.           | Withdraw tokens from stake account.            |
| **Partial staking**   | Not supported (delegation applies to full balance). | Supported. Stake any amount of W.           |
| **Voting Power**      | Delegate gets full voting rights for your W balance. | Delegate gets voting rights only for staked amount. |

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

- To stake, pass the delegate address.
- To unstake, pass the zero address (`0x000...000`).

Use the `delegates(address)` view function to check the current delegate for a given address.

!!!note "Important Notes"
    - There can only be one delegate per wallet. 
    - You can delegate to yourself or someone else.
    - Wormhole maintains a list of delegates using the Tally API (covers EVM and Solana).

## Solana Integration

On Solana, staking means moving W tokens into a stake account and assigning a delegate. You can stake any amount and delegate to any valid account (including yourself).

### Staking Flow (Solana)

```js 
 // Initialize the staking program and config
 // See Program IDs and ABIs section for more details
  
  const program = new anchor.Program<Staking>(simplerStakingIDL, {
    connection,
  })
  const [config] = PublicKey.findProgramAddressSync(
    [Buffer.from('config')],
    program.programId,
  )

  // PDA derivations for user and delegate
	
  const [stakeAccountMetadata] = PublicKey.findProgramAddressSync(
    [Buffer.from('stake_metadata'), userPublicKey.toBuffer()],
    program.programId,
  )

  const [stakeAccountCheckpoints] = PublicKey.findProgramAddressSync(
    [Buffer.from('owner'), userPublicKey.toBuffer(), Buffer.from([0, 0])],
    program.programId,
  )

  const [custodyAuthority] = PublicKey.findProgramAddressSync(
    [Buffer.from('authority'), userPublicKey.toBuffer()],
    program.programId,
  )

  const [stakeAccountCustody] = PublicKey.findProgramAddressSync(
    [Buffer.from('custody'), userPublicKey.toBuffer()],
    program.programId,
  )

  const [eventAuthority] = PublicKey.findProgramAddressSync(
    [Buffer.from('__event_authority')],
    program.programId,
  )

  const [currentDelegateStakeAccountMetadata] =
    PublicKey.findProgramAddressSync(
      [Buffer.from('stake_metadata'), currentDelegatePublicKey.toBuffer()],
      program.programId,
    )

  const [currentDelegateStakeAccountCheckpoints] =
    PublicKey.findProgramAddressSync(
      [
        Buffer.from('owner'),
        currentDelegatePublicKey.toBuffer(),
        Buffer.from([0, 0]),
      ],
      program.programId,
    )

  const [delegateeStakeAccountMetadata] = PublicKey.findProgramAddressSync(
    [Buffer.from('stake_metadata'), delegateePublicKey.toBuffer()],
    program.programId,
  )

  const [delegateeStakeAccountCheckpoints] = PublicKey.findProgramAddressSync(
    [Buffer.from('owner'), delegateePublicKey.toBuffer(), Buffer.from([0, 0])],
    program.programId,
  )
  
// 1. Ensure ATA exists for the user
const userATA = getAssociatedTokenAddressSync(WTokenSolanaPublicKey, userPublicKey, false)
const ataInfo = await connection.getAccountInfo(userATA)
if (!ataInfo) {
  createStakeAccTx.add(
    createAssociatedTokenAccountInstruction(
      walletProvider.publicKey,
      userATA,
      userPublicKey,
      WTokenSolanaPublicKey
    )
  )
}

// 2. Create the user's stake account if needed
  
const userStakeAccountInfo = await connection.getAccountInfo(stakeAccountMetadata)
if (!userStakeAccountInfo) {
  const createUserStakeIx = await program.methods
    .createStakeAccount()
    .accountsStrict({
      payer: walletProvider.publicKey,
      config,
      stakeAccountCheckpoints,
      stakeAccountMetadata,
      custodyAuthority,
      mint: WTokenSolanaPublicKey,
      stakeAccountCustody,
      tokenProgram: TOKEN_PROGRAM_ID,
      systemProgram: anchor.web3.SystemProgram.programId,
    })
    .instruction()
  createStakeAccTx.add(createUserStakeIx)
}

// 3. Transfer tokens to custody

const transferIx = createTransferInstruction(userATA, stakeAccountCustody, userPublicKey, amount)
createStakeAccTx.add(transferIx)

// 4. Create a delegate account if not self-delegation
  
const delegateeAccountInfo = await connection.getAccountInfo(delegateeStakeAccountMetadata)
const isSelfDelegation = delegateePublicKey.equals(userPublicKey)
if (!delegateeAccountInfo && !isSelfDelegation) {
  const [delegateeCustodyAuthority] = PublicKey.findProgramAddressSync([
    Buffer.from('authority'),
    delegateePublicKey.toBuffer()
  ], program.programId)

  const [delegateeStakeAccountCustody] = PublicKey.findProgramAddressSync([
    Buffer.from('custody'),
    delegateePublicKey.toBuffer()
  ], program.programId)

  const createDelegateeStakeIx = await program.methods
    .createStakeAccount()
    .accountsStrict({
      payer: walletProvider.publicKey,
      config,
      stakeAccountCheckpoints: delegateeStakeAccountCheckpoints,
      stakeAccountMetadata: delegateeStakeAccountMetadata,
      custodyAuthority: delegateeCustodyAuthority,
      mint: WTokenSolanaPublicKey,
      stakeAccountCustody: delegateeStakeAccountCustody,
      tokenProgram: TOKEN_PROGRAM_ID,
      systemProgram: anchor.web3.SystemProgram.programId,
    })
    .instruction()
  createStakeAccTx.add(createDelegateeStakeIx)
}

// 5. Send delegate instruction
const delegateIx = await program.methods
  .delegate(delegateePublicKey, currentDelegatePublicKey)
  .accountsStrict({
    payer: walletProvider.publicKey,
    currentDelegateStakeAccountCheckpoints,
    currentDelegateStakeAccountMetadata,
    delegateeStakeAccountCheckpoints,
    delegateeStakeAccountMetadata,
    stakeAccountMetadata,
    custodyAuthority,
    stakeAccountCustody,
    vestingConfig: null,
    vestingBalance: null,
    config,
    mint: WTokenSolanaPublicKey,
    systemProgram: anchor.web3.SystemProgram.programId,
    eventAuthority,
    program: program.programId,
  })
  .instruction()
createStakeAccTx.add(delegateIx)
```

Staking Steps:

1. Ensure the user has a W token ATA.
2. Create a stake account if it doesn't exist.
3. Transfer tokens to the stake custody account.
4. Create a delegate stake account if needed.
5. Send the `delegate()` instruction.

### Unstaking Flow (Solana)

```js 
const withdrawIx = await program.methods
.withdrawTokens(
    new BN(amount.toString()),
    delegateePublicKey, // current delegate (who owns your stake)
    userPublicKey, // withdraw back to yourself
)
.accountsStrict({
    payer: walletProvider.publicKey,
    currentDelegateStakeAccountCheckpoints,
    currentDelegateStakeAccountMetadata,
    destination: userATA,
    stakeAccountMetadata,
    stakeAccountCustody,
    custodyAuthority,
    config,
    tokenProgram: TOKEN_PROGRAM_ID,
    systemProgram: anchor.web3.SystemProgram.programId,
    eventAuthority,
    program: program.programId,
})
.instruction()

withdrawTx.add(withdrawIx)
```

1. Confirm the user’s stake metadata and custody accounts.
2. Call `withdrawTokens()` to move tokens back to the user’s ATA.

!!!note "Important Notes"
    - Solana integration uses `@solana/web3.js`, `@solana/spl-token`, and `@coral-xyz/anchor`.
    - Delegating to an active voter is generally recommended (see [Tally API](https://apidocs.tally.xyz/){target=\_blank}).
    - Both self- and third-party delegation are supported.

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

