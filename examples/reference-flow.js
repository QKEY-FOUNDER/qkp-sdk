// examples/reference-flow.js
// QKP Reference Flow (End-to-End)
// Intent → ExecutionContract → Receipt → Aggregation → Policy → AcceptanceReceipt
//
// Run: node examples/reference-flow.js

import { crypto, intent, claims, agents, graph, policy } from "../src/index.js";

const hr = () => console.log("------------------------------------------------------------");

const run = async () => {
  console.log("QKP Reference Flow — End-to-End Demo");
  hr();

  // ---- 0) Keys (agent, claim issuer, auditor) ----
  const agentKeys = await crypto.generateEd25519KeyPair();
  const issuerKeys = await crypto.generateEd25519KeyPair();
  const auditorKeys = await crypto.generateEd25519KeyPair();

  const agent = { alg: "ED25519", privateKey: agentKeys.privateKey, publicKey: agentKeys.publicKey };
  const issuer = { alg: "ED25519", privateKey: issuerKeys.privateKey, publicKey: issuerKeys.publicKey };
  const auditor = { alg: "ED25519", privateKey: auditorKeys.privateKey, publicKey: auditorKeys.publicKey };

  console.log("Keys created:");
  console.log("- Agent publicKey:", agent.publicKey.slice(0, 18) + "…");
  console.log("- Issuer publicKey:", issuer.publicKey.slice(0, 18) + "…");
  console.log("- Auditor publicKey:", auditor.publicKey.slice(0, 18) + "…");
  hr();

  // ---- 1) SignedIntent ----
  const i = intent.createIntent({
    issuer: "did:qkp:alice",
    purpose: "run_reference_flow",
    scope: "local",
    constraints: { maxCost: 10 },
  });

  const signedIntent = await intent.createSignedIntent(i, agent);
  const intentOk = await intent.verifySignedIntent(signedIntent);

  console.log("1) SignedIntent");
  console.log("- purpose:", signedIntent.intent.purpose);
  console.log("- constraints:", signedIntent.intent.constraints);
  console.log("- signature verifies:", intentOk);
  if (!intentOk) throw new Error("Reference flow failed: SignedIntent did not verify");
  hr();

  // ---- 2) SignedClaim (required for execution) ----
  const c = claims.createClaim({
    id: "claim_ref_001",
    issuer: "did:qkp:issuer",
    subject: "did:qkp:alice",
    type: "AgentAccess",
    data: { level: "basic" },
  });

  const signedClaim = await claims.createSignedClaim(c, issuer);
  const claimOk = await claims.verifySignedClaim(signedClaim);

  console.log("2) SignedClaim");
  console.log("- type:", signedClaim.claim.type);
  console.log("- issuer:", signedClaim.claim.issuer);
  console.log("- signature verifies:", claimOk);
  if (!claimOk) throw new Error("Reference flow failed: SignedClaim did not verify");
  hr();

  // ---- 3) ExecutionContract ----
  const contract = agents.createExecutionContract({
    contractId: "ctr_ref_001",
    agentId: "did:qkp:agent",
    action: { type: "compute", params: { cost: 3 } },
    signedIntent,
    requiredClaims: ["AgentAccess"],
  });

  console.log("3) ExecutionContract");
  console.log("- contractId:", contract.contractId);
  console.log("- action:", contract.action);
  hr();

  // ---- 4) Verify + Audited Execute (Receipt + Replay Guard) ----
  const replayGuard = agents.createReplayGuard();
  const res = await agents.auditedExecute({
    contract,
    signedClaims: [signedClaim],
    signedRevocations: [],
    replayGuard,
  });

  console.log("4) Audited Execute");
  console.log("- allowed:", res.allowed);
  if (!res.allowed) throw new Error(`Reference flow failed: execution denied (${res.reason || "unknown"})`);

  const receipt = res.receipt;
  console.log("- receiptId:", receipt.receiptId);
  console.log("- contractHash:", receipt.contractHash);
  hr();

  // ---- 5) Accountability Graph Edges ----
  const nIntent = await graph.makeNodeRef({
    kind: "SignedIntent",
    id: "intent_ref_001",
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

  const e1 = graph.createEdge({ type: "AUTHORIZES", from: nIntent, to: nContract });
  const e2 = graph.createEdge({ type: "PRODUCES", from: nContract, to: nReceipt });

  console.log("5) Accountability Graph");
  console.log("- Edge 1:", e1.type, `${e1.from.kind} → ${e1.to.kind}`);
  console.log("- Edge 2:", e2.type, `${e2.from.kind} → ${e2.to.kind}`);
  hr();

  // ---- 6) ChainLink + SignedChainLink ----
  const link1 = await graph.createChainLink({ linkId: "ref-link-1", edges: [e1, e2] });
  const signedLink1 = await graph.signChainLink(link1.link, agent);
  const linkOk = await graph.verifySignedChainLink(signedLink1);

  console.log("6) Accountability Chain");
  console.log("- linkId:", signedLink1.link.linkId);
  console.log("- linkHash:", link1.linkHash);
  console.log("- signature verifies:", linkOk);
  if (!linkOk) throw new Error("Reference flow failed: SignedChainLink did not verify");
  hr();

  // ---- 7) Aggregation (Chain-of-Chains) ----
  const agg = await graph.createChainAggregate({
    aggregateId: "agg_ref_001",
    headHashes: [link1.linkHash],
  });

  const signedAgg = await graph.signChainAggregate(agg.aggregate, agent);
  const aggOk = await graph.verifySignedChainAggregate(signedAgg);

  console.log("7) Aggregation");
  console.log("- aggregateId:", signedAgg.aggregate.aggregateId);
  console.log("- aggHash:", agg.aggHash);
  console.log("- signature verifies:", aggOk);
  if (!aggOk) throw new Error("Reference flow failed: SignedChainAggregate did not verify");
  hr();

  // ---- 8) Policy Evaluation (C19 Acceptance Layer) ----
  // Here we apply a simple policy on a federated structure shape (C18),
  // using the "aggregates" shape that the policy supports.
  const federatedLike = {
    federatedId: "fed_ref_001",
    aggregates: [
      {
        aggregate: signedAgg.aggregate,
        signature: signedAgg.signature,
        publicKey: signedAgg.publicKey,
        alg: signedAgg.alg,
      },
    ],
  };

  const trustPolicy = {
    version: "0.1",
    name: "accept-1-of-1",
    allowAlgorithms: ["ED25519"],
    allowPublicKeys: [agent.publicKey],
    minSignatures: 1,
  };

  const p = policy.evaluateFederatedAggregatePolicy(federatedLike, trustPolicy);

  console.log("8) Policy Evaluation");
  console.log("- policy:", trustPolicy.name);
  console.log("- accepted:", p.accepted);
  console.log("- reasons:", p.reasons);
  if (!p.accepted) throw new Error("Reference flow failed: policy rejected unexpectedly");
  hr();

  // ---- 9) AcceptanceReceipt (C20 Attested Trust) ----
  const { receipt: acceptanceReceipt } = await policy.createAcceptanceReceipt({
    receiptId: "acc_ref_001",
    targetKind: "SignedChainAggregate",
    targetObject: signedAgg,
    policyName: trustPolicy.name,
    policyObject: trustPolicy,
    decision: "ACCEPT",
    reasons: [],
  });

  const signedAcceptance = await policy.signAcceptanceReceipt(acceptanceReceipt, auditor);
  const accOk = await policy.verifySignedAcceptanceReceipt(signedAcceptance);

  console.log("9) AcceptanceReceipt (Attested Trust)");
  console.log("- decision:", signedAcceptance.receipt.decision);
  console.log("- targetHash:", signedAcceptance.receipt.targetHash);
  console.log("- policyHash:", signedAcceptance.receipt.policyHash);
  console.log("- auditor signature verifies:", accOk);
  if (!accOk) throw new Error("Reference flow failed: AcceptanceReceipt did not verify");
  hr();

  console.log("✅ Reference Flow completed successfully.");
  console.log("Summary:");
  console.log("- SignedIntent verified:", intentOk);
  console.log("- SignedClaim verified:", claimOk);
  console.log("- Execution allowed:", res.allowed);
  console.log("- ChainLink signed & verified:", linkOk);
  console.log("- Aggregate signed & verified:", aggOk);
  console.log("- Policy accepted:", p.accepted);
  console.log("- AcceptanceReceipt verified:", accOk);
};

run().catch((e) => {
  console.error(e);
  process.exit(1);
});
