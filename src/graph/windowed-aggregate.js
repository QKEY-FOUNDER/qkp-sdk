import { canonicalize } from "../crypto/canonical.js";
import { sha256Hex } from "../crypto/sha256.js";
import { utf8ToBytes } from "../utils/index.js";
import { sign, verify } from "../crypto/index.js";

function assertISO(iso) {
  const t = Date.parse(iso);
  if (Number.isNaN(t)) throw new Error("Invalid ISODateTime");
  return t;
}

export async function createWindowedChainAggregate({
  aggregateId,
  windowStart,
  windowEnd,
  headHashes,
  prevAggHash,
  createdAt = new Date().toISOString(),
}) {
  if (!aggregateId) throw new Error("aggregateId is required");
  if (!windowStart || !windowEnd) throw new Error("windowStart and windowEnd are required");

  const start = assertISO(windowStart);
  const end = assertISO(windowEnd);
  if (start > end) throw new Error("windowStart MUST be <= windowEnd");

  if (!Array.isArray(headHashes) || headHashes.length === 0) {
    throw new Error("headHashes must be a non-empty array");
  }

  const aggregate = {
    version: "0.1",
    aggregateId,
    windowStart,
    windowEnd,
    ...(prevAggHash ? { prevAggHash } : {}),
    headHashes,
    createdAt,
  };

  const aggHash = await sha256Hex(utf8ToBytes(canonicalize(aggregate)));
  return { aggregate, aggHash };
}

export async function signWindowedChainAggregate(aggregate, keypair) {
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

export async function verifySignedWindowedChainAggregate(signedAgg) {
  return await verify({
    payload: signedAgg.aggregate,
    signature: signedAgg.signature,
    publicKey: signedAgg.publicKey,
    alg: signedAgg.alg,
  });
}
