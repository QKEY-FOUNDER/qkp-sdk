import { crypto, graph } from "../src/index.js";

const run = async () => {
  console.log("C15 — Chain-of-Chains / Aggregation");

  // keys
  const keys = await crypto.generateEd25519KeyPair();
  const keypair = {
    alg: "ED25519",
    privateKey: keys.privateKey,
    publicKey: keys.publicKey,
  };

  // Build deterministic NodeRefs
  const contractRef = await graph.makeNodeRef({
    kind: "ExecutionContract",
    id: "contract-x",
    objectToHash: { version: "0.1", contractId: "contract-x" },
  });

  const receiptRef = await graph.makeNodeRef({
    kind: "ExecutionReceipt",
    id: "receipt-x",
    objectToHash: { version: "0.1", receiptId: "receipt-x", status: "EXECUTED" },
  });

  const edge = graph.createEdge({
    type: "PRODUCES",
    from: contractRef,
    to: receiptRef,
  });

  // Chain A (L1 -> L2)
  const a1 = await graph.createChainLink({ linkId: "A-1", edges: [edge] });
  const a2 = await graph.createChainLink({
    linkId: "A-2",
    prevLinkHash: a1.linkHash,
    edges: [edge],
  });
  const headA = a2.linkHash;

  // Chain B (L1 -> L2)
  const b1 = await graph.createChainLink({ linkId: "B-1", edges: [edge] });
  const b2 = await graph.createChainLink({
    linkId: "B-2",
    prevLinkHash: b1.linkHash,
    edges: [edge],
  });
  const headB = b2.linkHash;

  // Aggregate (ORDER MATTERS)
  const agg = await graph.createChainAggregate({
    aggregateId: "agg-001",
    headHashes: [headA, headB],
  });

  const signedAgg = await graph.signChainAggregate(agg.aggregate, keypair);
  const ok = await graph.verifySignedChainAggregate(signedAgg);

  console.log("C15 verify signed aggregate (should be true):", ok);
  if (!ok) throw new Error("C15 failed: signed aggregate did not verify");

  // Tamper by reordering head hashes (must invalidate signature)
  const tampered = {
    ...signedAgg,
    aggregate: { ...signedAgg.aggregate, headHashes: [headB, headA] },
  };

  const ok2 = await graph.verifySignedChainAggregate(tampered);
  console.log("C15 verify after reorder (should be false):", ok2);

  if (ok2) throw new Error("C15 failed: tampered aggregate verified");

  process.exit(0);
};

run().catch((e) => {
  console.error(e);
  process.exit(1);
});
