import { crypto, claims } from "../src/index.js";

const run = async () => {
  const keys = await crypto.generateEd25519KeyPair();

  const claim = claims.createClaim({
    id: "claim_revocable",
    issuer: "did:qkp:issuer",
    subject: "did:qkp:alice",
    type: "Access",
    data: { resource: "dataset-1" },
  });

  const signedClaim = await claims.createSignedClaim(claim, {
    alg: "ED25519",
    privateKey: keys.privateKey,
    publicKey: keys.publicKey,
  });

  const ok1 = await claims.verifyClaimWithPolicy({
    signedClaim,
  });
  console.log("C9 initial verify (should be true):", ok1);
  if (!ok1) throw new Error("C9 failed: initial verify");

  const revocation = claims.createRevocation({
    targetClaimId: claim.id,
    issuer: claim.issuer,
    reason: "Access revoked",
  });

  const signedRevocation = await claims.createSignedRevocation(revocation, {
    alg: "ED25519",
    privateKey: keys.privateKey,
    publicKey: keys.publicKey,
  });

  const ok2 = await claims.verifyClaimWithPolicy({
    signedClaim,
    signedRevocations: [signedRevocation],
  });
  console.log("C9 verify after revocation (should be false):", ok2);
  if (ok2) throw new Error("C9 failed: revoked claim verified");

  process.exit(0);
};

run().catch((e) => {
  console.error(e);
  process.exit(1);
});
