import { Wormhole, wormhole, signSendWait } from "@wormhole-foundation/sdk";
import solana from "@wormhole-foundation/sdk/solana";
import sui from "@wormhole-foundation/sdk/sui";
import bs58 from "bs58";
import { Transaction } from "@mysten/sui/transactions";
import * as fs from "fs";
import * as path from "path";
import {
  DATA_OBJ,
  EMITTER_CAP,
  PKG_ID,
  SOLANA_PUBLIC_KEY,
  STATE_OBJ,
  WORMHOLE_PKG_ID,
} from "./constants";
import { getSigner, client } from "./utils";
import { bcs } from "@mysten/sui/bcs";

const emit_sol_msg = async () => {
  const sol = await solana();
  const wh = await wormhole("Testnet", [solana]);
  const chain = wh.getChain("Solana");
  const rpc = await chain.getRpc();
  const signer = await sol.getSigner(
    rpc,
    "2HBbkiwYdnuXzLMVxVCHCut962HQVFDrba4x4MLCAQCJqbFV3WKACPoN4hV1byM1dv6rsVP2LZmcC2bxqRsYyw5U",
  );
  const cha = Wormhole.chainAddress(chain.chain, signer.address());
  const coreBridge = await chain.getWormholeCore();

  const amountBcs = [40, 10, 0, 0, 0, 0, 0, 0];
  const userAddress = Array.from(bs58.decode(signer.address()));
  const chain_u8 = 0;
  const operation = 0;
  const payload = Uint8Array.from(
    amountBcs.concat(userAddress).concat(chain_u8).concat(operation),
  );
  const publishTxs = coreBridge.publishMessage(
    //Emmiter
    cha.address,
    // Payload
    // encoding.bytes.encode('USD:500'),
    payload,
    // Nonce (user defined)
    3301,
    // ConsistencyLevel
    0,
  );

  const txids = await signSendWait(chain, publishTxs, signer);
  console.dir(txids, { depth: 5 });
  const txid = txids[0].txid;
  const [whm] = await chain.parseTransaction(txid);
  // const [whm] = await chain.parseTransaction("4LUumUVtjhSioeRjFhSVjVeMBnnhBWYsgrqvj4bNJTSNW1Vf4GiRwzz2GEQ85UifPUtm23eMit4PNCooZ93kJ7ot");
  const vaa = await wh.getVaa(whm!, "Uint8Array", 60_000);
  console.log(vaa);
  const vaaBuf = await wh.getVaaBytes(whm!, 60_000);
  const filePath = path.join(__dirname, "vaa_result.json");
  fs.writeFileSync(filePath, JSON.stringify(Array.from(vaaBuf!)));
  return vaaBuf;
};

const updateSuiContract = async (vaa: Uint8Array) => {
  const signer = getSigner();
  const tx = new Transaction();
  tx.moveCall({
    target: `${PKG_ID}::messages::receive_message`,
    arguments: [
      tx.pure.vector("u8", Array.from(vaa)),
      tx.object(STATE_OBJ),
      tx.object("0x6"), // Clock
      tx.object(DATA_OBJ),
    ],
  });

  const response = client.signAndExecuteTransaction({
    transaction: tx,
    signer,
    options: {
      showEffects: true,
    },
  });

  console.log(response);
};

const getEmitterCap = async () => {
  const signer = getSigner();
  const tx = new Transaction();
  const cap = tx.moveCall({
    target: `${WORMHOLE_PKG_ID}::emitter::new`,
    arguments: [tx.object(STATE_OBJ)],
  });
  tx.transferObjects([cap], tx.pure.address(signer.toSuiAddress()));

  const response = await client.signAndExecuteTransaction({
    transaction: tx,
    signer,
    options: {
      showEffects: true,
      showObjectChanges: true,
    },
  });

  // We expect a single created
  const change: any = response.objectChanges?.filter(
    item => item.type === "created",
  );
  console.log(change[0].objectId);
};

const sendSuiMsg = async () => {
  const nonce = 17;
  const signer = getSigner();
  const tx = new Transaction();
  const msg = tx.moveCall({
    target: `${PKG_ID}::messages::new_message`,
    arguments: [
      tx.object(DATA_OBJ),
      tx.pure.vector("u8", SOLANA_PUBLIC_KEY),
      tx.pure.u32(nonce),
      tx.object(EMITTER_CAP),
    ],
  });
  const fee = tx.moveCall({
    target: "0x2::coin::zero",
    typeArguments: ["0x2::sui::SUI"],
  });
  tx.moveCall({
    target: `${WORMHOLE_PKG_ID}::publish_message::publish_message`,
    arguments: [
      tx.object(STATE_OBJ),
      fee,
      msg,
      tx.object("0x6"), // clock object
    ],
  });

  const response = await client.signAndExecuteTransaction({
    transaction: tx,
    signer,
    options: {
      showEffects: true,
      showEvents: true,
    },
  });

  return response.digest;
};

const readSuiMsg = async (txDigest: string) => {
  const wh = await wormhole("Testnet", [sui]);
  const chain = wh.getChain("Sui");
  const [whm] = await chain.parseTransaction(
    txDigest,
  );
  const vaa = await wh.getVaa(whm!, "Uint8Array", 60_000);
//   console.log(vaa);
  const pointsBcs =   Array.from(vaa?.payload || []).slice(0,8);
  // transforming bcs to number, this can be done with @mysten/sui/bcs
  const points = bcs.U64.parse(Uint8Array.from(pointsBcs));
  console.log(points === "2600");
};

// receiveMsg()
const receiveMsg = async () => {
  // Mock solana send
  // Here we have hardcoded the payload to add 2600 points to the solana public key we have in constants.ts
  const result = await emit_sol_msg();
  if (result) updateSuiContract(result);
};

const sendMsg = async () => {
 const txDigest =  await sendSuiMsg();
 await readSuiMsg(txDigest);
};

// sendMsg()
