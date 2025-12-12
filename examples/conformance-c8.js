import { crypto, claims } from "../src/index.js";

const run = async () => {
  const keys = await crypto.generateEd25519KeyPair();

  const c = claims.createClaim({
    id: "claim_001",
    issuer: "did:qkp:issuer",
    subject: "did:qkp:alice",
    type: "Membership",
    data: { org: "QuantumKey", level: "founder" },
  });

  const signed = await claims.createSignedClaim(c, {
    alg: "ED25519",
    privateKey: keys.privateKey,
    publicKey: keys.publicKey,
  });

  const ok = await claims.verifySignedClaim(signed);
  console.log("C8 verify signed claim (should be true):", ok);
  if (!ok) throw new Error("C8 failed: valid signed claim did not verify");

  const tampered = {
    ...signed,
    claim: { ...signed.claim, data: { ...signed.claim.data, level: "hacker" } },
  };

  const bad = await claims.verifySignedClaim(tampered);
  console.log("C8 verify tampered (should be false):", bad);
  if (bad) throw new Error("C8 failed: tampered claim verified");

  // expired claim
  const expiredClaim = claims.createClaim({
    id: "claim_002",
    issuer: "did:qkp:issuer",
    subject: "did:qkp:alice",
    type: "KYC",
    issuedAt: "2025-01-01T00:00:00.000Z",
    expiresAt: "2025-01-01T00:00:01.000Z",
    data: { level: "basic" },
  });

  const signedExpired = await claims.createSignedClaim(expiredClaim, {
    alg: "ED25519",
    privateKey: keys.privateKey,
    publicKey: keys.publicKey,
  });

  const expiredOk = await claims.verifySignedClaim(signedExpired);
  console.log("C8 verify expired (should be false):", expiredOk);
  if (expiredOk) throw new Error("C8 failed: expired claim verified when allowExpired=false");

  const expiredAllowed = await claims.verifySignedClaim(signedExpired, { allowExpired: true });
  console.log("C8 verify expired with allowExpired (should be true):", expiredAllowed);
  if (!expiredAllowed) throw new Error("C8 failed: expired claim did not verify with allowExpired=true");

  process.exit(0);
};

run().catch((e) => {
  console.error(e);
  process.exit(1);
});
