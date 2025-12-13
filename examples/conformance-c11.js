import { crypto, intent, claims, agents } from "../src/index.js";

const run = async () => {
  // keys
  const agentKeys = await crypto.generateEd25519KeyPair();
  const issuerKeys = await crypto.generateEd25519KeyPair();

  // signed intent (includes maxCost constraint)
  const i = intent.createIntent({
    issuer: "did:qkp:alice",
    purpose: "run_agent_action",
    scope: "local",
    constraints: { maxCost: 10 },
  });

  const signedIntent = await intent.createSignedIntent(i, {
    alg: "ED25519",
    privateKey: agentKeys.privateKey,
    publicKey: agentKeys.publicKey,
  });

  // signed claim (required)
  const c = claims.createClaim({
    id: "claim_exec_001",
    issuer: "did:qkp:issuer",
    subject: "did:qkp:alice",
    type: "AgentAccess",
    data: { level: "basic" },
  });

  const signedClaim = await claims.createSignedClaim(c, {
    alg: "ED25519",
    privateKey: issuerKeys.privateKey,
    publicKey: issuerKeys.publicKey,
  });

  // contract requires AgentAccess
  const contract = agents.createExecutionContract({
    contractId: "ctr_001",
    agentId: "did:qkp:agent",
    action: { type: "compute", params: { cost: 5 } },
    signedIntent,
    requiredClaims: ["AgentAccess"],
  });

  const ok = await agents.verifyExecutionContract({
    contract,
    signedClaims: [signedClaim],
  });

  console.log("C11 verify allowed (should be true):", ok);
  if (!ok.allowed) throw new Error("C11 failed: contract should be allowed");

  // revoke claim and deny
  const rev = claims.createRevocation({
    targetClaimId: c.id,
    issuer: c.issuer,
    reason: "Access revoked",
  });

  const signedRev = await claims.createSignedRevocation(rev, {
    alg: "ED25519",
    privateKey: issuerKeys.privateKey,
    publicKey: issuerKeys.publicKey,
  });

  const denied = await agents.verifyExecutionContract({
    contract,
    signedClaims: [signedClaim],
    signedRevocations: [signedRev],
  });

  console.log("C11 verify denied by revocation (should be false):", denied);
  if (denied.allowed) throw new Error("C11 failed: revoked claim should deny contract");

  // violate constraint and deny
  const contractBad = {
    ...contract,
    action: { type: "compute", params: { cost: 50 } },
  };

  const denied2 = await agents.verifyExecutionContract({
    contract: contractBad,
    signedClaims: [signedClaim],
  });

  console.log("C11 verify denied by constraint (should be false):", denied2);
  if (denied2.allowed) throw new Error("C11 failed: constraint violation should deny contract");

  process.exit(0);
};

run().catch((e) => {
  console.error(e);
  process.exit(1);
});
