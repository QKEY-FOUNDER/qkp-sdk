---

## 2) SDK — `src/graph/aggregate.js` (SUBSTITUIR pelo código abaixo)
**Este ficheiro é o coração do bug que viste.** Substitui o conteúdo todo por isto:

```js
import { canonicalize } from "../crypto/canonical.js";
import { sha256Hex } from "../crypto/sha256.js";
import { utf8ToBytes } from "../utils/index.js";
import { sign, verify } from "../crypto/index.js";

export async function createChainAggregate({
  aggregateId,
  headHashes,
  prevAggHash,
  createdAt = new Date().toISOString(),
}) {
  if (!aggregateId) throw new Error("aggregateId is required");
  if (!Array.isArray(headHashes) || headHashes.length === 0) {
    throw new Error("headHashes must be a non-empty array");
  }

  const aggregate = {
    version: "0.1",
    aggregateId,
    ...(prevAggHash ? { prevAggHash } : {}),
    headHashes,
    createdAt,
  };

  const aggHash = await sha256Hex(utf8ToBytes(canonicalize(aggregate)));
  return { aggregate, aggHash };
}

export async function signChainAggregate(aggregate, keypair) {
  // expects keypair = { alg, privateKey, publicKey }
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

export async function verifySignedChainAggregate(signedAgg) {
  return await verify({
    payload: signedAgg.aggregate,
    signature: signedAgg.signature,
    publicKey: signedAgg.publicKey,
    alg: signedAgg.alg,
  });
}
