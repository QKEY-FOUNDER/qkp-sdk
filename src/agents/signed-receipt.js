import { sign, verify } from "../crypto/index.js";

export async function createSignedExecutionReceipt(receipt, keypair) {
  if (!keypair?.alg || !keypair?.privateKey || !keypair?.publicKey) {
    throw new Error("Invalid signing keypair");
  }

  const signed = await sign(receipt, keypair);

  return {
    version: "0.1",
    receipt,
    signature: signed.signature,
    publicKey: signed.publicKey,
    alg: signed.alg,
    createdAt: signed.createdAt,
  };
}

export async function verifySignedExecutionReceipt(signedReceipt) {
  return await verify({
    payload: signedReceipt.receipt,
    signature: signedReceipt.signature,
    publicKey: signedReceipt.publicKey,
    alg: signedReceipt.alg,
  });
}
