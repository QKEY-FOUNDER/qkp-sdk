// Conformance C14 — Accountability Chain (linked hashes + signed links)

import { graph, crypto } from "../src/index.js";

const run = async () => {
  console.log("C14 — Accountability Chain Integrity");

  // Key pair (ED25519) from SDK
  const keys = await crypto.generateEd25519KeyPair();
  const keypair = {
    alg: "ED25519",
    privateKey: keys.privateKey,
    publicKey: keys.publicKey,
  };

  // Minimal objects to hash (deterministic)
  const signedIntentObj = { version: "0.1", intent: { issuer: "did:qkp:alice", purpose: "demo" } };
  const contractObj = { version: "0.1", contractId: "contract-1", agentId: "did:qkp:agent" };
  const receiptObj = { version: "0.1", receiptId: "receipt-1", status: "EXECUTED" };

  // NodeRefs (deterministic hashes)
  const nIntent = await graph.makeNodeRef({
    kind: "SignedIntent",
    id: "intent-1",
    objectToHash: signedIntentObj,
  });

  const nContract = await graph.makeNodeRef({
    kind: "ExecutionContract",
    id: "contract-1",
    objectToHash: contractObj,
  });

  const nReceipt = await graph.makeNodeRef({
    kind: "ExecutionReceipt",
    id: "receipt-1",
    objectToHash: receiptObj,
  });

  // Edges (causal links)
  const e1 = graph.createEdge({ type: "PRODUCES", from: nIntent, to: nContract });
  const e2 = graph.createEdge({ type: "PRODUCES", from: nContract, to: nReceipt });

  // === Genesis link (L1) ===
  const l1 = await graph.createChainLink({
    linkId: "link-1",
    edges: [e1],
  });

  const signedL1 = await graph.signChainLink(l1.link, keypair);

  const okSig1 = await graph.verifySignedChainLink(signedL1);
  if (!okSig1) throw new Error("C14 failed: L1 signature did not verify");

  // === Second link (L2 references L1 hash) ===
  const l2 = await graph.createChainLink({
    linkId: "link-2",
    prevLinkHash: l1.linkHash,
    edges: [e2],
  });

  const signedL2 = await graph.signChainLink(l2.link, keypair);

  const okSig2 = await graph.verifySignedChainLink(signedL2);
  if (!okSig2) throw new Error("C14 failed: L2 signature did not verify");

  // === Tamper L1 edges => L2 prevLinkHash must no longer match ===
  const tamperedL1 = {
    ...l1.link,
    edges: [{ ...l1.link.edges[0], type: "DERIVES" }],
  };

  const tamperedL1Hash = await crypto.sha256Hex(
    crypto.utf8ToBytes(crypto.canonicalize(tamperedL1))
  );

  if (tamperedL1Hash === l1.linkHash) {
    throw new Error("C14 failed: tampering did not change L1 hash");
  }

  // L2 still points to original L1 hash -> mismatch MUST be detected
  const chainIsBroken = signedL2.link.prevLinkHash !== tamperedL1Hash;
  if (!chainIsBroken) {
    throw new Error("C14 failed: chain did not break after tampering");
  }

  console.log("✅ C14 passed — chain breaks on tampering");
  process.exit(0);
};

run().catch((e) => {
  console.error(e);
  process.exit(1);
});
