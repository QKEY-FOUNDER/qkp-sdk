import fs from "fs";
import path from "path";
import crypto from "crypto";
import { generateEvidence } from "./generateEvidence.js";

const SNAPSHOT_DIR = "./src/evidence/snapshots";

function sha256(data) {
  return crypto.createHash("sha256").update(data).digest("hex");
}

function buildMerkleRoot(items) {
  if (items.length === 0) return null;
  let level = items.map(i => sha256(JSON.stringify(i)));

  while (level.length > 1) {
    const next = [];
    for (let i = 0; i < level.length; i += 2) {
      if (i + 1 < level.length) {
        next.push(sha256(level[i] + level[i + 1]));
      } else {
        next.push(level[i]);
      }
    }
    level = next;
  }
  return level[0];
}

function nowISO() {
  return new Date().toISOString();
}

export async function createSnapshot() {
  console.log("⏳ Collecting live evidence…");

  const evidence = await generateEvidence();

  const identityRoot   = buildMerkleRoot(evidence.identities);
  const intentionRoot  = buildMerkleRoot(evidence.intentions);
  const stateRoot      = buildMerkleRoot(evidence.states);
  const disputeRoot    = buildMerkleRoot(evidence.disputes);
  const reputationRoot = buildMerkleRoot(evidence.reputations);

  const snapshot = {
    snapshot_id: "EVIDENCE_" + Date.now(),
    timestamp: nowISO(),
    roots: {
      identity: identityRoot,
      intention: intentionRoot,
      state: stateRoot,
      dispute: disputeRoot,
      reputation: reputationRoot
    }
  };

  snapshot.combined_snapshot_hash = sha256(JSON.stringify(snapshot.roots));

  if (!fs.existsSync(SNAPSHOT_DIR)) {
    fs.mkdirSync(SNAPSHOT_DIR, { recursive: true });
  }

  const filename = `${SNAPSHOT_DIR}/${snapshot.snapshot_id}.json`;
  fs.writeFileSync(filename, JSON.stringify(snapshot, null, 2));

  console.log("🪐 Snapshot created:", filename);
  console.log("🔗 Combined Hash:", snapshot.combined_snapshot_hash);

  return snapshot;
}

if (process.argv[1].includes("snapshotEngine")) {
  createSnapshot().catch(err => {
    console.error("Snapshot failed:", err);
    process.exit(1);
  });
}
