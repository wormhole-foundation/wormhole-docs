import { CONTRACTS } from '@certusone/wormhole-sdk';

export const WORMHOLE_CONTRACTS = CONTRACTS[NETWORK];
export const CORE_BRIDGE_PID = new PublicKey(WORMHOLE_CONTRACTS.solana.core);

// First, post the VAA to the core bridge
await postVaaSolana(
  connection,
  wallet.signTransaction,
  CORE_BRIDGE_PID,
  wallet.key(),
  vaaBytes
);

const program = createHelloWorldProgramInterface(connection, programId);
const parsed = isBytes(wormholeMessage)
  ? parseVaa(wormholeMessage)
  : wormholeMessage;

const ix = program.methods
  .receiveMessage([...parsed.hash])
  .accounts({
    payer: new PublicKey(payer),
    config: deriveConfigKey(programId),
    wormholeProgram: new PublicKey(wormholeProgramId),
    posted: derivePostedVaaKey(wormholeProgramId, parsed.hash),
    foreignEmitter: deriveForeignEmitterKey(programId, parsed.emitterChain),
    received: deriveReceivedKey(
      programId,
      parsed.emitterChain,
      parsed.sequence
    ),
  })
  .instruction();

const transaction = new Transaction().add(ix);
const { blockhash } = await connection.getLatestBlockhash(commitment);
transaction.recentBlockhash = blockhash;
transaction.feePayer = new PublicKey(payerAddress);

const signed = await wallet.signTxn(transaction);
const txid = await connection.sendRawTransaction(signed);

await connection.confirmTransaction(txid);
