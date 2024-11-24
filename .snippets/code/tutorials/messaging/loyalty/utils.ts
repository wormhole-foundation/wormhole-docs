import { Ed25519Keypair } from "@mysten/sui/keypairs/ed25519";
import { decodeSuiPrivateKey } from "@mysten/sui/cryptography";
import * as dotenv from "dotenv";
import { getFullnodeUrl, SuiClient } from "@mysten/sui/client";
dotenv.config();

export const getSigner = () => {
  const { schema, secretKey } = decodeSuiPrivateKey(process.env.SUI_SK!);
  if (schema !== "ED25519") {
    throw `Expected ED25119 type, but got ${schema}. Remember that Sui allows for 3 types of keys`;
  }
  let signer = Ed25519Keypair.fromSecretKey(secretKey);
  return signer;
};

export const client = new SuiClient({
    url: getFullnodeUrl("testnet")
});
