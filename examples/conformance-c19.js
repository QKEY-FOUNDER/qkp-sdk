import { crypto, graph, policy } from "../src/index.js";

const run = async () => {
  console.log("C19 — Trust Policy Evaluation (Acceptance Layer)");

  const k1 = await crypto.generateEd25519KeyPair();
  const k2 = await crypto.generateEd25519KeyPair();

  const keypair1 = { alg: "ED25519", privateKey: k1.privateKey, publicKey: k1.publicKey };
  const keypair2 = { alg: "ED25519", privateKey: k2.privateKey, publicKey: k2.publicKey };

  // Build a minimal chain head
  const n1 = await graph.makeNodeRef({
    kind: "ExecutionContract",
    id: "contract-pol",
    objectToHash: { version: "0.1", contractId: "contract-pol" },
  });

  const n2 = await graph.makeNodeRef({
    kind: "ExecutionReceipt",
    id: "receipt-pol",
    objectToHash: { version: "0.1", receiptId: "receipt-pol", status: "EXECUTED" },
  });

  const e = graph.createEdge({ type: "PRODUCES", from: n1, to: n2 });
  const l1 = await graph.createChainLink({ linkId: "P-1", edges: [e] });
  const l2 = await graph.createChainLink({ linkId: "P-2", prevLinkHash: l1.linkHash, edges: [e] });

  // Make two SignedChainAggregates (as “evidence”)
  const baseA = await graph.createChainAggregate({
    aggregateId: "base-A",
    headHashes: [l2.linkHash],
  });

  const baseB = await graph.createChainAggregate({
    aggregateId: "base-B",
    headHashes: [l2.linkHash],
  });

  const signedAgg1 = await graph.signChainAggregate(baseA.aggregate, keypair1);
  const signedAgg2 = await graph.signChainAggregate(baseB.aggregate, keypair2);

  // Build federated aggregate (C18 structure)
  const fed = await graph.createFederatedAggregate({
    federatedId: "fed-pol-001",
    aggregates: [signedAgg1, signedAgg2],
  });

  // Sign outer federated envelope (issuer 1)
  const signedFed = await graph.signFederatedAggregate(fed.federated, keypair1);

  // 1) Crypto MUST be true
  const cryptoOk = await graph.verifySignedFederatedAggregate(signedFed);
  console.log("C19 crypto verify federated (should be true):", cryptoOk);
  if (!cryptoOk) throw new Error("C19 failed: federated crypto verification failed");

  // 2) Policy accept (min 2 sigs, allow both public keys)
  const acceptPolicy = {
    version: "0.1",
    name: "accept-2-of-2",
    allowAlgorithms: ["ED25519"],
    allowPublicKeys: [keypair1.publicKey, keypair2.publicKey],
    minSignatures: 2,
  };

  const p1 = policy.evaluateFederatedAggregatePolicy(signedFed.federated, acceptPolicy);
  console.log("C19 policy accept (should be true):", p1.accepted, p1.reasons);
  if (!p1.accepted) throw new Error("C19 failed: policy should accept but rejected");

  // 3) Policy reject (min 3 sigs)
  const rejectPolicyMin = {
    version: "0.1",
    name: "reject-min-3",
    allowAlgorithms: ["ED25519"],
    allowPublicKeys: [keypair1.publicKey, keypair2.publicKey],
    minSignatures: 3,
  };

  const p2 = policy.evaluateFederatedAggregatePolicy(signedFed.federated, rejectPolicyMin);
  console.log("C19 policy reject min signatures (should be false):", p2.accepted, p2.reasons);
  if (p2.accepted) throw new Error("C19 failed: policy should reject (min signatures)");

  // 4) Policy reject (allowlist missing one key)
  const rejectPolicyAllow = {
    version: "0.1",
    name: "reject-allowlist",
    allowAlgorithms: ["ED25519"],
    allowPublicKeys: [keypair1.publicKey], // missing keypair2
    minSignatures: 2,
  };

  const p3 = policy.evaluateFederatedAggregatePolicy(signedFed.federated, rejectPolicyAllow);
  console.log("C19 policy reject allowlist (should be false):", p3.accepted, p3.reasons);
  if (p3.accepted) throw new Error("C19 failed: policy should reject (allowlist)");

  process.exit(0);
};

run().catch((e) => {
  console.error(e);
  process.exit(1);
});
