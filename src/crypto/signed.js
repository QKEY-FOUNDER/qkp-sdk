import { canonicalize, sha256Hex } from "./index.js";
import { utf8ToBytes } from "../utils/index.js";

/**
 * Signed container (v0.1)
 * signature is a hex string. In v0.1 we provide "demo" signing.
 */
export async function createSigningPayload(obj) {
  const canon = canonicalize(obj);
  const digest = await sha256Hex(utf8ToBytes(canon));
  return { canon, digest };
}

/**
 * Demo signer: NOT cryptographically secure.
 * Purpose: deterministic integration & conformance; replace in v0.3 with real signatures.
 */
export async function signDemo(payload, secret = "demo_secret") {
  const { digest } = await createSigningPayload(payload);
  // "signature" = sha256(digest + secret)
  const sig = await sha256Hex(utf8ToBytes(`${digest}:${secret}`));

  return {
    version: "0.1",
    payload,
    signature: sig,
    publicKey: "demo_public_key",
    createdAt: new Date().toISOString(),
    alg: "DEMO-SHA256",
  };
}

export async function verifyDemo(signed, secret = "demo_secret") {
  if (!signed?.payload || !signed?.signature) return false;
  const { digest } = await createSigningPayload(signed.payload);
  const expected = await sha256Hex(utf8ToBytes(`${digest}:${secret}`));
  return expected === signed.signature;
}
