import { signEd25519, verifyEd25519 } from "./ed25519.js";

export async function sign(payload, { alg, privateKey, publicKey }) {
  if (alg !== "ED25519") throw new Error(`Unsupported alg in sign(): ${alg}`);

  const signature = await signEd25519(payload, privateKey);

  return {
    version: "0.1",
    payload,
    signature,
    publicKey,
    createdAt: new Date().toISOString(),
    alg: "ED25519",
  };
}

export async function verify(signed) {
  if (!signed?.payload || !signed?.signature || !signed?.publicKey) return false;
  if (signed.alg !== "ED25519") return false;

  return await verifyEd25519(signed.payload, signed.signature, signed.publicKey);
}
