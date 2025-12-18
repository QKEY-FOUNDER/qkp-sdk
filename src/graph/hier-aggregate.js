import { canonicalize } from "../crypto/canonical.js";
import { sha256Hex } from "../crypto/sha256.js";
import { utf8ToBytes } from "../utils/index.js";
import { sign, verify } from "../crypto/index.js";

export async function createHierarchicalAggregate({
  aggregateId,
  level,
  headHashes,
  childAggHashes,
  prevAggHash,
  createdAt = new Date().toISOString(),
}) {
  if (!aggregateId) throw new Error("aggregateId is required");
  if (typeof level !== "number" || level < 0) {
    throw new Error("level MUST be >= 0");
  }

  const hasHeads = Array.isArray(headHashes) && headHashes.length > 0;
  const hasChildren = Array.isArray(childAggHashes) && childAggHashes.length > 0;

  if (!hasHeads && !hasChildren) {
    throw new Error("Aggregate MUST include headHashes or childAggHashes");
  }

  const aggregate = {
    version: "0.1",
    aggregateId,
    level,
    ...(prevAggHash ? { prevAggHash } : {}),
    ...(hasHeads ? { headHashes } : {}),
    ...(hasChildren ? { childAggHashes } : {}),
    createdAt,
  };

  const aggHash = await sha256Hex(
    utf8ToBytes(canonicalize(aggregate))
  );

  return { aggregate, aggHash };
}

export async function signHierarchicalAggregate(aggregate, keypair) {
  const signed = await sign(aggregate, keypair);
  return {
    version: "0.1",
    aggregate,
    signature: signed.signature,
    publicKey: signed.publicKey,
    alg: signed.alg,
    createdAt: signed.createdAt,
  };
}

export async function verifySignedHierarchicalAggregate(signedAgg) {
  return await verify({
    payload: signedAgg.aggregate,
    signature: signedAgg.signature,
    publicKey: signedAgg.publicKey,
    alg: signedAgg.alg,
  });
}
