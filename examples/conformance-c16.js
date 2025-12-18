import { crypto, graph } from "../src/index.js";

const run = async () => {
  console.log("C16 — Temporal / Windowed Aggregation");

  const keys = await crypto.generateEd25519KeyPair();
  const keypair = { alg: "ED25519", privateKey: keys.privateKey, publicKey: keys.publicKey };

  // build two chain heads quickly
  const dummyNode = await graph.makeNodeRef({
    kind: "ExecutionContract",
    id: "contract-window",
    objectToHash: { version: "0.1", contractId: "contract-window" },
  });

  const dummyNode2 = await graph.makeNodeRef({
    kind: "ExecutionReceipt",
    id: "receipt-window",
    objectToHash: { version: "0.1", receiptId: "receipt-window", status: "EXECUTED" },
  });

  const e = graph.createEdge({ type: "PRODUCES", from: dummyNode, to: dummyNode2 });

  const a1 = await graph.createChainLink({ linkId: "W-A-1", edges: [e] });
  const a2 = await graph.createChainLink({ linkId: "W-A-2", prevLinkHash: a1.linkHash, edges: [e] });
  const headA = a2.linkHash;

  const b1 = await graph.createChainLink({ linkId: "W-B-1", edges: [e] });
  const b2 = await graph.createChainLink({ linkId: "W-B-2", prevLinkHash: b1.linkHash, edges: [e] });
  const headB = b2.linkHash;

  const windowStart = "2025-01-01T00:00:00.000Z";
  const windowEnd = "2025-12-31T23:59:59.000Z";

  // valid aggregate
  const agg = await graph.createWindowedChainAggregate({
    aggregateId: "win-agg-001",
    windowStart,
    windowEnd,
    headHashes: [headA, headB],
  });

  const signed = await graph.signWindowedChainAggregate(agg.aggregate, keypair);
  const ok = await graph.verifySignedWindowedChainAggregate(signed);

  console.log("C16 verify signed windowed aggregate (should be true):", ok);
  if (!ok) throw new Error("C16 failed: valid signed windowed aggregate did not verify");

  // invalid window (start > end) MUST be rejected
  let rejected = false;
  try {
    await graph.createWindowedChainAggregate({
      aggregateId: "win-agg-002",
      windowStart: "2025-12-31T23:59:59.000Z",
      windowEnd: "2025-01-01T00:00:00.000Z",
      headHashes: [headA],
    });
  } catch (e) {
    rejected = true;
  }
  console.log("C16 invalid window rejected (should be true):", rejected);
  if (!rejected) throw new Error("C16 failed: invalid window was not rejected");

  // reorder headHashes => signature must fail
  const tampered = {
    ...signed,
    aggregate: { ...signed.aggregate, headHashes: [headB, headA] },
  };

  const ok2 = await graph.verifySignedWindowedChainAggregate(tampered);
  console.log("C16 verify after reorder (should be false):", ok2);
  if (ok2) throw new Error("C16 failed: tampered windowed aggregate verified");

  process.exit(0);
};

run().catch((e) => {
  console.error(e);
  process.exit(1);
});
