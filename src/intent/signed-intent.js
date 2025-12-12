import { sign, verify } from "../crypto/index.js";

export async function createSignedIntent(intent, keypair) {
  if (!intent || !intent.purpose) {
    throw new Error("Invalid intent");
  }

  if (!keypair?.alg || !keypair?.privateKey || !keypair?.publicKey) {
    throw new Error("Invalid signing keypair");
  }

  const signed = await sign(intent, keypair);

  return {
    version: "0.1",
    intent,
    signature: signed.signature,
    publicKey: signed.publicKey,
    alg: signed.alg,
    createdAt: signed.createdAt,
  };
}

export async function verifySignedIntent(signedIntent) {
  if (!signedIntent?.intent) return false;

  return await verify({
    payload: signedIntent.intent,
    signature: signedIntent.signature,
    publicKey: signedIntent.publicKey,
    alg: signedIntent.alg,
  });
}
