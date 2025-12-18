import { crypto, graph } from "../src/index.js";

const run = async () => {
  console.log("C18 — Federated / Cross-domain Aggregation");

  const k1 = await crypto.generateEd25519KeyPair();
  const k2 = await crypto.generateEd25519KeyPair();

  const keypair1 = { alg: "ED25519", privateKey: k1.privateKey, publicKey: k1.publicKey };
  const keypair2 = { alg: "ED25519", privateKey: k2.privateKey, publicKey: k2.publicKey };

  // minimal chain head
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

  const fa = await graph.createFederatedAggregate({
    aggregateId: "fed-agg-001",
    level: 1,
    headHashes: [l2.linkHash],
  });

  // Start signed container (no signatures yet)
  let signedFed = {
    version: "0.1",
    aggregate: fa.aggregate,
    signatures: [],
    createdAt: new Date().toISOString(),
  };

  signedFed = await graph.addFederatedSignature(signedFed, keypair1);
  signedFed = await graph.addFederatedSignature(signedFed, keypair2);

  const ok = await graph.verifySignedFederatedAggregate(signedFed);
  console.log("C18 verify federated signatures (should be true):", ok);
  if (!ok) throw new Error("C18 failed: federated aggregate did not verify");

  // Tamper aggregate -> must fail
  const tampered = {
    ...signedFed,
    aggregate: { ...signedFed.aggregate, aggregateId: "fed-agg-TAMPER" },
  };

  const ok2 = await graph.verifySignedFederatedAggregate(tampered);
  console.log("C18 verify after tamper (should be false):", ok2);
  if (ok2) throw new Error("C18 failed: tampered aggregate verified");

  // No signatures -> must fail
  const emptySigs = { ...signedFed, signatures: [] };
  const ok3 = await graph.verifySignedFederatedAggregate(emptySigs);
  console.log("C18 verify with no signatures (should be false):", ok3);
  if (ok3) throw new Error("C18 failed: empty signatures verified");

  process.exit(0);
};

run().catch((e) => {
  console.error(e);
  process.exit(1);
});
