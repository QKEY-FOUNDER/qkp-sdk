import { crypto, intent, claims, agents, graph } from "../src/index.js";

const run = async () => {
  const agentKeys = await crypto.generateEd25519KeyPair();
  const issuerKeys = await crypto.generateEd25519KeyPair();

  // SignedIntent
  const i = intent.createIntent({
    issuer: "did:qkp:alice",
    purpose: "graph_action",
    scope: "local",
    constraints: { maxCost: 10 },
  });

  const signedIntent = await intent.createSignedIntent(i, {
    alg: "ED25519",
    privateKey: agentKeys.privateKey,
    publicKey: agentKeys.publicKey,
  });

  // Claim required
  const c = claims.createClaim({
    id: "claim_graph",
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

  // Contract
  const contract = agents.createExecutionContract({
    contractId: "ctr_graph_001",
    agentId: "did:qkp:agent",
    action: { type: "compute", params: { cost: 3 } },
    signedIntent,
    requiredClaims: ["AgentAccess"],
  });

  // Audited execute -> receipt
  const replayGuard = agents.createReplayGuard();
  const res = await agents.auditedExecute({
    contract,
    signedClaims: [signedClaim],
    replayGuard,
  });
  if (!res.allowed) throw new Error("C13 setup failed: execution denied");
  const receipt = res.receipt;

  // NodeRefs
  const nIntent = await graph.makeNodeRef({
    kind: "SignedIntent",
    id: "signed_intent_001",
    objectToHash: signedIntent,
  });

  const nContract = await graph.makeNodeRef({
    kind: "ExecutionContract",
    id: contract.contractId,
    objectToHash: contract,
  });

  const nReceipt = await graph.makeNodeRef({
    kind: "ExecutionReceipt",
    id: receipt.receiptId,
    objectToHash: receipt,
  });

  // Edges
  const e1 = graph.createEdge({ type: "AUTHORIZES", from: nIntent, to: nContract });
  const e2 = graph.createEdge({ type: "PRODUCES", from: nContract, to: nReceipt });

  // Validate edges
  const objects = new Map();
  objects.set(`${nIntent.kind}:${nIntent.id}`, signedIntent);
  objects.set(`${nContract.kind}:${nContract.id}`, contract);
  objects.set(`${nReceipt.kind}:${nReceipt.id}`, receipt);

  const ok1 = await graph.validateEdge(e1, objects);
  const ok2 = await graph.validateEdge(e2, objects);

  console.log("C13 edge AUTHORIZES valid (should be true):", ok1);
  console.log("C13 edge PRODUCES valid (should be true):", ok2);

  if (!ok1 || !ok2) throw new Error("C13 failed: edge validation failed");

  // Tamper: change receipt output -> should fail
  const tamperedReceipt = { ...receipt, output: { ok: false } };
  objects.set(`${nReceipt.kind}:${nReceipt.id}`, tamperedReceipt);

  const ok3 = await graph.validateEdge(e2, objects);
  console.log("C13 edge validation after tamper (should be false):", ok3);
  if (ok3) throw new Error("C13 failed: tampered object still validated");

  process.exit(0);
};

run().catch((e) => {
  console.error(e);
  process.exit(1);
});
