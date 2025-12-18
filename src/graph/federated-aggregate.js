---

import { canonicalize } from "../crypto/canonical.js"; import { sha256Hex } from "../crypto/sha256.js"; import { utf8ToBytes } from "../utils/index.js"; import { sign, verify } from "../crypto/index.js";

/**

Create a Federated / Cross-domain Aggregate */ export async function createFederatedAggregate({ aggregateId, level, headHashes, childAggHashes, prevAggHash, createdAt = new Date().toISOString(), }) { if (!aggregateId) throw new Error("aggregateId is required"); if (typeof level !== "number" || level < 0) { throw new Error("level MUST be a number >= 0"); }


const hasHeads = Array.isArray(headHashes) && headHashes.length > 0; const hasChildren = Array.isArray(childAggHashes) && childAggHashes.length > 0;

if (!hasHeads && !hasChildren) { throw new Error("FederatedAggregate MUST include headHashes or childAggHashes"); }

const aggregate = { version: "0.1", aggregateId, level, ...(prevAggHash ? { prevAggHash } : {}), ...(hasHeads ? { headHashes } : {}), ...(hasChildren ? { childAggHashes } : {}), createdAt, };

const aggregateHash = await sha256Hex( utf8ToBytes(canonicalize(aggregate)) );

return { aggregate, aggregateHash }; }

/**

Add a signature from one issuer to a federated aggregate */ export async function addFederatedSignature(signedFederated, keypair) { if (!signedFederated?.aggregate) { throw new Error("signedFederated.aggregate is required"); }


const signed = await sign(signedFederated.aggregate, keypair);

const multiSig = { signature: signed.signature, publicKey: signed.publicKey, alg: signed.alg, signedAt: signed.createdAt, };

return { version: "0.1", aggregate: signedFederated.aggregate, signatures: [...(signedFederated.signatures || []), multiSig], createdAt: signedFederated.createdAt || new Date().toISOString(), }; }

/**

Verify a federated aggregate with multiple signatures */ export async function verifySignedFederatedAggregate(signedFederated) { if (!signedFederated?.aggregate) return false; if (!Array.isArray(signedFederated.signatures)) return false; if (signedFederated.signatures.length === 0) return false;


for (const s of signedFederated.signatures) { const ok = await verify({ payload: signedFederated.aggregate, signature: s.signature, publicKey: s.publicKey, alg: s.alg, }); if (!ok) return false; }

return true; }


---
