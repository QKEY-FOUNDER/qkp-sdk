import { canonicalize } from "../crypto/canonical.js";
import { sha256Hex } from "../crypto/sha256.js";
import { utf8ToBytes } from "../utils/index.js";
import { sign, verify } from "../crypto/index.js";

/**
 * C18 — Federated / Multi-Issuer Aggregate
 *
 * Canonical aggregate of multiple signed aggregates
 */

export async function createFederatedAggregate({
  federatedId,
  aggregates,
  createdAt = new Date().toISOString(),
}) {
  if (!federatedId) {
    throw new Error("federatedId is required");
  }

  if (!Array.isArray(aggregates) || aggregates.length === 0) {
    throw new Error("aggregates must be a non-empty array");
  }

  // Each aggregate MUST already be signed
  for (const agg of aggregates) {
    if (!agg.aggregate || !agg.signature || !agg.publicKey) {
      throw new Error("each entry must be a SignedAggregate");
    }
  }

  const canonicalAggregates = aggregates.map((a) => ({
    aggregate: a.aggregate,
    signature: a.signature,
    publicKey: a.publicKey,
    alg: a.alg,
  }));

  const federated = {
    version: "0.1",
    federatedId,
    aggregates: canonicalAggregates,
    createdAt,
  };

  const federatedHash = await sha256Hex(
    utf8ToBytes(canonicalize(federated))
  );

  return { federated, federatedHash };
}

export async function signFederatedAggregate(federated, keypair) {
  const signed = await sign(federated, keypair);

  return {
    version: "0.1",
    federated,
    signature: signed.signature,
    publicKey: signed.publicKey,
    alg: signed.alg,
    createdAt: signed.createdAt,
  };
}

export async function verifySignedFederatedAggregate(signedFederated) {
  // 1. Verify outer signature
  const outerValid = await verify({
    payload: signedFederated.federated,
    signature: signedFederated.signature,
    publicKey: signedFederated.publicKey,
    alg: signedFederated.alg,
  });

  if (!outerValid) return false;

  // 2. Verify every inner aggregate signature
  for (const entry of signedFederated.federated.aggregates) {
    const ok = await verify({
      payload: entry.aggregate,
      signature: entry.signature,
      publicKey: entry.publicKey,
      alg: entry.alg,
    });

    if (!ok) return false;
  }

  return true;
}
