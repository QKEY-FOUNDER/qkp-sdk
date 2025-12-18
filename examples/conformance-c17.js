import { crypto, graph } from "../src/index.js";

const run = async () => {
  console.log("C17 — Hierarchical / Recursive Aggregation");

  const keys = await crypto.generateEd25519KeyPair();
  const keypair = { alg: "ED25519", privateKey: keys.privateKey, publicKey: keys.publicKey };

  // Create two simple base aggregates using chain heads (like C15)
  const dummyNode = await graph.makeNodeRef({
    kind: "ExecutionContract",
    id: "contract-hier",
    objectToHash: { version: "0.1", contractId: "contract-hier" },
  });

  const dummyNode2 = await graph.makeNodeRef({
    kind: "ExecutionReceipt",
    id: "receipt-hier",
    objectToHash: { version: "0.1", receiptId: "receipt-hier", status: "EXECUTED" },
  });

  const e = graph.createEdge({ type: "PRODUCES", from: dummyNode, to: dummyNode2 });

  const a1 = await graph.createChainLink({ linkId: "H-A-1", edges: [e] });
  const a2 = await graph.createChainLink({ linkId: "H-A-2", prevLinkHash: a1.linkHash, edges: [e] });

  const b1 = await graph.createChainLink({ linkId: "H-B-1", edges: [e] });
  const b2 = await graph.createChainLink({ linkId: "H-B-2", prevLinkHash: b1.linkHash, edges: [e] });

  const baseAgg1 = await graph.createChainAggregate({
    aggregateId: "base-agg-1",
    headHashes: [a2.linkHash],
  });

  const baseAgg2 = await graph.createChainAggregate({
    aggregateId: "base-agg-2",
    headHashes: [b2.linkHash],
  });

  // Hierarchical aggregate references child aggregate hashes (aggHash)
  const hier = await graph.createHierarchicalAggregate({
    aggregateId: "hier-agg-1",
    level: 1,
    childAggHashes: [baseAgg1.aggHash, baseAgg2.aggHash],
  });

  const signed = await graph.signHierarchicalAggregate(hier.aggregate, keypair);
  const ok = await graph.verifySignedHierarchicalAggregate(signed);

  console.log("C17 verify signed hierarchical aggregate (should be true):", ok);
  if (!ok) throw new Error("C17 failed: valid hierarchical aggregate did not verify");

  // Tamper by reordering children => must fail verification
  const tampered = {
    ...signed,
    aggregate: { ...signed.aggregate, childAggHashes: [baseAgg2.aggHash, baseAgg1.aggHash] },
  };

  const ok2 = await graph.verifySignedHierarchicalAggregate(tampered);
  console.log("C17 verify after reorder (should be false):", ok2);
  if (ok2) throw new Error("C17 failed: tampered hierarchical aggregate verified");

  // Invalid level MUST be rejected at creation
  let rejected = false;
  try {
    await graph.createHierarchicalAggregate({
      aggregateId: "hier-agg-bad",
      level: -1,
      childAggHashes: [baseAgg1.aggHash],
    });
  } catch (e) {
    rejected = true;
  }

  console.log("C17 invalid level rejected (should be true):", rejected);
  if (!rejected) throw new Error("C17 failed: invalid level was not rejected");

  process.exit(0);
};

run().catch((e) => {
  console.error(e);
  process.exit(1);
});
