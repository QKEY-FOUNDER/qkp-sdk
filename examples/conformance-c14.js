// Conformance C14 — Accountability Chain Tamper Detection

import {
  canonicalize,
  sha256,
  sign,
  verify,
} from "../src/crypto/index.js";

import {
  createNodeRef,
  createEdge,
} from "../src/accountability/index.js";

// Helper: create canonical hash
function hash(obj) {
  return sha256(canonicalize(obj));
}

// Helper: create signed ChainLink
async function createSignedLink(link, keyPair) {
  const signature = await sign(canonicalize(link), keyPair.privateKey);
  return {
    version: "0.1",
    link,
    signature,
    publicKey: keyPair.publicKey,
    alg: "ED25519",
    createdAt: new Date().toISOString(),
  };
}

(async () => {
  console.log("C14 — Accountability Chain Integrity");

  // Key pair
  const keyPair = await crypto.subtle.generateKey(
    { name: "Ed25519" },
    true,
    ["sign", "verify"]
  );

  // === Genesis link ===
  const genesisEdge = createEdge(
    "PRODUCES",
    createNodeRef("SignedIntent", "intent-1", "hash-intent"),
    createNodeRef("ExecutionContract", "contract-1", "hash-contract")
  );

  const genesisLink = {
    version: "0.1",
    linkId: "link-1",
    edges: [genesisEdge],
    createdAt: new Date().toISOString(),
  };

  const genesisHash = hash(genesisLink);
  const signedGenesis = await createSignedLink(genesisLink, keyPair);

  // === Second link ===
  const followupEdge = createEdge(
    "PRODUCES",
    createNodeRef("ExecutionContract", "contract-1", "hash-contract"),
    createNodeRef("ExecutionReceipt", "receipt-1", "hash-receipt")
  );

  const secondLink = {
    version: "0.1",
    linkId: "link-2",
    prevLinkHash: genesisHash,
    edges: [followupEdge],
    createdAt: new Date().toISOString(),
  };

  const signedSecond = await createSignedLink(secondLink, keyPair);

  // === VALIDATION (should pass) ===
  const ok1 = await verify(
    canonicalize(signedGenesis.link),
    signedGenesis.signature,
    signedGenesis.publicKey
  );

  const ok2 = await verify(
    canonicalize(signedSecond.link),
    signedSecond.signature,
    signedSecond.publicKey
  );

  if (!ok1 || !ok2) {
    console.error("❌ Valid chain failed verification");
    process.exit(1);
  }

  // === TAMPER: modify genesis ===
  signedGenesis.link.edges[0].type = "DERIVES";

  const tamperedHash = hash(signedGenesis.link);

  if (tamperedHash === genesisHash) {
    console.error("❌ Tampering did not change hash");
    process.exit(1);
  }

  // === Chain must now be invalid ===
  if (signedSecond.link.prevLinkHash === tamperedHash) {
    console.error("❌ Chain incorrectly still valid after tampering");
    process.exit(1);
  }

  console.log("✅ C14 passed — chain breaks on tampering");
  process.exit(0);
})();
