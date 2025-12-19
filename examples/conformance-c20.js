import { crypto, graph, policy } from "../src/index.js";

const run = async () => {
  console.log("C20 — Attested Trust (AcceptanceReceipt)");

  // issuer keys (two domains)
  const k1 = await crypto.generateEd25519KeyPair();
  const k2 = await crypto.generateEd25519KeyPair();
  const issuer1 = { alg: "ED25519", privateKey: k1.privateKey, publicKey: k1.publicKey };
  const issuer2 = { alg: "ED25519", privateKey: k2.privateKey, publicKey: k2.publicKey };

  // auditor key (third party)
  const ka = await crypto.generateEd25519KeyPair();
  const auditor = { alg: "ED25519", privateKey: ka.privateKey, publicKey: ka.publicKey };

  // Build minimal chain head
  const n1 = await graph.makeNodeRef({
    kind: "ExecutionContract",
    id: "contract-a20",
    objectToHash: { version: "0.1", contractId: "contract-a20" },
  });

  const n2 = await graph.makeNodeRef({
    kind: "ExecutionReceipt",
    id: "receipt-a20",
    objectToHash: { version: "0.1", receiptId: "receipt-a20", status: "EXECUTED" },
  });

  const e = graph.createEdge({ type: "PRODUCES", from: n1, to: n2 });
  const l1 = await graph.createChainLink({ linkId: "A20-1", edges: [e] });
  const l2 = await graph.createChainLink({ linkId: "A20-2", prevLinkHash: l1.linkHash, edges: [e] });

  // Two signed aggregates (evidence)
  const a = await graph.createChainAggregate({ aggregateId: "agg-a20-1", headHashes: [l2.linkHash] });
  const b = await graph.createChainAggregate({ aggregateId: "agg-a20-2", headHashes: [l2.linkHash] });

  const signedAgg1 = await graph.signChainAggregate(a.aggregate, issuer1);
  const signedAgg2 = await graph.signChainAggregate(b.aggregate, issuer2);

  // Federated aggregate (C18)
  const fed = await graph.createFederatedAggregate({
    federatedId: "fed-a20-001",
    aggregates: [signedAgg1, signedAgg2],
  });

  const signedFed = await graph.signFederatedAggregate(fed.federated, issuer1);

  // Step 2: crypto verify MUST be true
  const cryptoOk = await graph.verifySignedFederatedAggregate(signedFed);
  console.log("C20 crypto verify (should be true):", cryptoOk);
  if (!cryptoOk) throw new Error("C20 failed: crypto verification failed");

  // Step 3: policy evaluate MUST accept
  const trustPolicy = {
    version: "0.1",
    name: "accept-2-of-2",
    allowAlgorithms: ["ED25519"],
    allowPublicKeys: [issuer1.publicKey, issuer2.publicKey],
    minSignatures: 2,
  };

  const p = policy.evaluateFederatedAggregatePolicy(signedFed.federated, trustPolicy);
  console.log("C20 policy accept (should be true):", p.accepted, p.reasons);
  if (!p.accepted) throw new Error("C20 failed: policy rejected unexpectedly");

  // Step 4: create receipt (targetHash + policyHash + decision)
  const { receipt } = await policy.createAcceptanceReceipt({
    receiptId: "rcpt-a20-001",
    targetKind: "SignedFederatedAggregate",
    targetObject: signedFed,          // receipt hashes the full signed target
    policyName: trustPolicy.name,
    policyObject: trustPolicy,
    decision: "ACCEPT",
    reasons: [],
  });

  // Step 5: sign + verify receipt
  const signedReceipt = await policy.signAcceptanceReceipt(receipt, auditor);
  const okR = await policy.verifySignedAcceptanceReceipt(signedReceipt);
  console.log("C20 verify signed receipt (should be true):", okR);
  if (!okR) throw new Error("C20 failed: signed receipt did not verify");

  // Step 6: tamper receipt decision => verify must fail
  const tampered = {
    ...signedReceipt,
    receipt: { ...signedReceipt.receipt, decision: "REJECT" },
  };

  const okT = await policy.verifySignedAcceptanceReceipt(tampered);
  console.log("C20 verify after tamper (should be false):", okT);
  if (okT) throw new Error("C20 failed: tampered receipt verified");

  process.exit(0);
};

run().catch((e) => {
  console.error(e);
  process.exit(1);
});
