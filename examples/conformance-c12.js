import { crypto, intent, claims, agents } from "../src/index.js";

const run = async () => {
  const agentKeys = await crypto.generateEd25519KeyPair();
  const issuerKeys = await crypto.generateEd25519KeyPair();
  const replayGuard = agents.createReplayGuard();

  // intent
  const i = intent.createIntent({
    issuer: "did:qkp:alice",
    purpose: "audited_action",
    scope: "local",
    constraints: { maxCost: 5 },
  });

  const signedIntent = await intent.createSignedIntent(i, {
    alg: "ED25519",
    privateKey: agentKeys.privateKey,
    publicKey: agentKeys.publicKey,
  });

  // claim
  const c = claims.createClaim({
    id: "claim_audit",
    issuer: "did:qkp:issuer",
    subject: "did:qkp:alice",
    type: "AgentAccess",
    data: {},
  });

  const signedClaim = await claims.createSignedClaim(c, {
    alg: "ED25519",
    privateKey: issuerKeys.privateKey,
    publicKey: issuerKeys.publicKey,
  });

  // contract
  const contract = agents.createExecutionContract({
    contractId: "ctr_audit_001",
    agentId: "did:qkp:agent",
    action: { type: "compute", params: { cost: 3 } },
    signedIntent,
    requiredClaims: ["AgentAccess"],
  });

  // first execution
  const res1 = await agents.auditedExecute({
    contract,
    signedClaims: [signedClaim],
    replayGuard,
  });

  console.log("C12 first execution allowed:", res1.allowed);
  if (!res1.allowed) throw new Error("C12 failed: first execution denied");

  // replay attempt
  const res2 = await agents.auditedExecute({
    contract,
    signedClaims: [signedClaim],
    replayGuard,
  });

  console.log("C12 replay denied (should be false):", res2.allowed);
  if (res2.allowed) throw new Error("C12 failed: replay not blocked");

  process.exit(0);
};

run().catch((e) => {
  console.error(e);
  process.exit(1);
});
