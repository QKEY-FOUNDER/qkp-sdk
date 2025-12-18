import { crypto, graph } from "../src/index.js";

const run = async () => {
  console.log("C18 — Federated / Cross-domain Aggregation");

  const k1 = await crypto.generateEd25519KeyPair();
  const k2 = await crypto.generateEd25519KeyPair();

  const keypair1 = { alg: "ED25519", privateKey: k1.privateKey, publicKey: k1.publicKey };
  const keypair2 = { alg: "ED25519", privateKey: k2.privateKey, publicKey: k2.publicKey };

  // Build two base aggregates (SignedChainAggregate) from two different issuers
  const dummyNode = await graph.makeNodeRef({
    kind: "ExecutionContract",
    id: "contract-fed",
    objectToHash: { version: "0.1", contractId: "contract-fed" },
  });

  const dummyNode2 = await graph.makeNodeRef({
    kind: "ExecutionReceipt",
    id: "receipt-fed",
    objectToHash: { version: "0.1", receiptId: "receipt-fed", status: "EXECUTED" },
  });

  const e = graph.createEdge({ type: "PRODUCES", from: dummyNode, to: dummyNode2 });
  const l1 = await graph.createChainLink({ linkId: "F-1", edges: [e] });
  const l2 = await graph.createChainLink({ linkId: "F-2", prevLinkHash: l1.linkHash, edges: [e] });

  const baseAgg = await graph.createChainAggregate({
    aggregateId: "base-agg-issuer-1",
    headHashes: [l2.linkHash],
  });

  const baseAgg2 = await graph.createChainAggregate({
    aggregateId: "base-agg-issuer-2",
    headHashes: [l2.linkHash],
  });

  const signedAgg1 = await graph.signChainAggregate(baseAgg.aggregate, keypair1);
  const signedAgg2 = await graph.signChainAggregate(baseAgg2.aggregate, keypair2);

  // Create federated aggregate
  const fed = await graph.createFederatedAggregate({
    federatedId: "fed-agg-001",
    aggregates: [signedAgg1, signedAgg2],
  });

  const signedFed = await graph.signFederatedAggregate(fed.federated, keypair1);

  const ok = await graph.verifySignedFederatedAggregate(signedFed);
  console.log("C18 verify federated aggregate (should be true):", ok);
  if (!ok) throw new Error("C18 failed: federated aggregate did not verify");

  // Tamper federated content -> must fail
  const tampered = {
    ...signedFed,
    federated: { ...signedFed.federated, federatedId: "fed-agg-TAMPER" },
  };

  const ok2 = await graph.verifySignedFederatedAggregate(tampered);
  console.log("C18 verify after tamper (should be false):", ok2);
  if (ok2) throw new Error("C18 failed: tampered federated aggregate verified");

  process.exit(0);
};

run().catch((e) => {
  console.error(e);
  process.exit(1);
});
