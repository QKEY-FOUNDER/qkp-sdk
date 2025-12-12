import { sign, verify } from "../crypto/index.js";
import { isClaim, isExpired } from "./claim.js";

export async function createSignedClaim(claim, keypair) {
  if (!isClaim(claim)) throw new Error("Invalid claim");
  if (!keypair?.alg || !keypair?.privateKey || !keypair?.publicKey) {
    throw new Error("Invalid signing keypair");
  }

  const signed = await sign(claim, keypair);

  return {
    version: "0.1",
    claim,
    signature: signed.signature,
    publicKey: signed.publicKey,
    alg: signed.alg,
    createdAt: signed.createdAt,
  };
}

export async function verifySignedClaim(signedClaim, { allowExpired = false } = {}) {
  if (!signedClaim?.claim) return false;

  // cryptographic verify
  const ok = await verify({
    payload: signedClaim.claim,
    signature: signedClaim.signature,
    publicKey: signedClaim.publicKey,
    alg: signedClaim.alg,
  });

  if (!ok) return false;

  // temporal validity
  if (!allowExpired && isExpired(signedClaim.claim)) return false;

  return true;
}
