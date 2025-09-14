const withdrawIx = await program.methods
.withdrawTokens(
    new BN(amount.toString()),
    delegateePublicKey, // current delegate (who owns your stake)
    userPublicKey, // recipient of the withdrawn tokens
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