import { sign, verify } from "../crypto/index.js";
import { matchesClaim } from "./revocation.js";

export async function createSignedRevocation(revocation, keypair) {
  if (!keypair?.alg || !keypair?.privateKey || !keypair?.publicKey) {
    throw new Error("Invalid signing keypair");
  }

  const signed = await sign(revocation, keypair);

  return {
    version: "0.1",
    revocation,
    signature: signed.signature,
    publicKey: signed.publicKey,
    alg: signed.alg,
    createdAt: signed.createdAt,
  };
}

export async function verifySignedRevocation(signedRevocation, claim) {
  const ok = await verify({
    payload: signedRevocation.revocation,
    signature: signedRevocation.signature,
    publicKey: signedRevocation.publicKey,
    alg: signedRevocation.alg,
  });

  if (!ok) return false;

  // semantic check: issuer must match claim issuer
  return matchesClaim(signedRevocation.revocation, claim);
}
