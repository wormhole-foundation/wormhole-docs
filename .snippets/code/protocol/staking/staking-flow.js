const program =
  new anchor.Program() <
  Staking >
  (simplerStakingIDL,
  {
    connection,
  });
const [config] = PublicKey.findProgramAddressSync(
  [Buffer.from('config')],
  program.programId
);

// PDA derivations for user and delegate
const [stakeAccountMetadata] = PublicKey.findProgramAddressSync(
  [Buffer.from('stake_metadata'), userPublicKey.toBuffer()],
  program.programId
);

const [stakeAccountCheckpoints] = PublicKey.findProgramAddressSync(
  [Buffer.from('owner'), userPublicKey.toBuffer(), Buffer.from([0, 0])],
  program.programId
);

const [custodyAuthority] = PublicKey.findProgramAddressSync(
  [Buffer.from('authority'), userPublicKey.toBuffer()],
  program.programId
);

const [stakeAccountCustody] = PublicKey.findProgramAddressSync(
  [Buffer.from('custody'), userPublicKey.toBuffer()],
  program.programId
);

const [eventAuthority] = PublicKey.findProgramAddressSync(
  [Buffer.from('__event_authority')],
  program.programId
);

const [currentDelegateStakeAccountMetadata] = PublicKey.findProgramAddressSync(
  [Buffer.from('stake_metadata'), currentDelegatePublicKey.toBuffer()],
  program.programId
);

const [currentDelegateStakeAccountCheckpoints] =
  PublicKey.findProgramAddressSync(
    [
      Buffer.from('owner'),
      currentDelegatePublicKey.toBuffer(),
      Buffer.from([0, 0]),
    ],
    program.programId
  );

const [delegateeStakeAccountMetadata] = PublicKey.findProgramAddressSync(
  [Buffer.from('stake_metadata'), delegateePublicKey.toBuffer()],
  program.programId
);

const [delegateeStakeAccountCheckpoints] = PublicKey.findProgramAddressSync(
  [Buffer.from('owner'), delegateePublicKey.toBuffer(), Buffer.from([0, 0])],
  program.programId
);

// 1. Ensure ATA (Associated Token Account) exists for the user
const userATA = getAssociatedTokenAddressSync(
  WTokenSolanaPublicKey,
  userPublicKey,
  false
);
const ataInfo = await connection.getAccountInfo(userATA);
if (!ataInfo) {
  createStakeAccTx.add(
    createAssociatedTokenAccountInstruction(
      walletProvider.publicKey,
      userATA,
      userPublicKey,
      WTokenSolanaPublicKey
    )
  );
}

// 2. Create the user's stake account if needed
const userStakeAccountInfo = await connection.getAccountInfo(
  stakeAccountMetadata
);
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
    .instruction();
  createStakeAccTx.add(createUserStakeIx);
}

// 3. Transfer tokens to custody
const transferIx = createTransferInstruction(
  userATA,
  stakeAccountCustody,
  userPublicKey,
  amount
);
createStakeAccTx.add(transferIx);

// 4. Create a delegate account if not self-delegation
const delegateeAccountInfo = await connection.getAccountInfo(
  delegateeStakeAccountMetadata
);
const isSelfDelegation = delegateePublicKey.equals(userPublicKey);
if (!delegateeAccountInfo && !isSelfDelegation) {
  const [delegateeCustodyAuthority] = PublicKey.findProgramAddressSync(
    [Buffer.from('authority'), delegateePublicKey.toBuffer()],
    program.programId
  );

  const [delegateeStakeAccountCustody] = PublicKey.findProgramAddressSync(
    [Buffer.from('custody'), delegateePublicKey.toBuffer()],
    program.programId
  );

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
    .instruction();
  createStakeAccTx.add(createDelegateeStakeIx);
}

// 5. Send delegate instructions
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
  .instruction();
createStakeAccTx.add(delegateIx);
