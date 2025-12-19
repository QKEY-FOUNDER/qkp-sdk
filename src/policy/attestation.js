import { canonicalize } from "../crypto/canonical.js";
import { sha256Hex } from "../crypto/sha256.js";
import { utf8ToBytes } from "../utils/index.js";
import { sign, verify } from "../crypto/index.js";

function hashObject(obj) {
  return sha256Hex(utf8ToBytes(canonicalize(obj)));
}

export async function createAcceptanceReceipt({
  receiptId,
  targetKind,
  targetObject,     // full object to hash
  policyName,
  policyObject,     // full policy to hash
  decision,         // "ACCEPT" | "REJECT"
  reasons = [],
  createdAt = new Date().toISOString(),
}) {
  if (!receiptId) throw new Error("receiptId is required");
  if (!targetKind) throw new Error("targetKind is required");
  if (!targetObject) throw new Error("targetObject is required");
  if (!policyName) throw new Error("policyName is required");
  if (!policyObject) throw new Error("policyObject is required");
  if (decision !== "ACCEPT" && decision !== "REJECT") throw new Error("decision must be ACCEPT or REJECT");

  const targetHash = await hashObject(targetObject);
  const policyHash = await hashObject(policyObject);

  const receipt = {
    version: "0.1",
    receiptId,
    targetKind,
    targetHash,
    policyName,
    policyHash,
    decision,
    ...(reasons && reasons.length ? { reasons } : {}),
    createdAt,
  };

  return { receipt };
}

export async function signAcceptanceReceipt(receipt, keypair) {
  const signed = await sign(receipt, keypair);
  return {
    version: "0.1",
    receipt,
    signature: signed.signature,
    publicKey: signed.publicKey,
    alg: signed.alg,
    createdAt: signed.createdAt,
  };
}

export async function verifySignedAcceptanceReceipt(signedReceipt) {
  return await verify({
    payload: signedReceipt.receipt,
    signature: signedReceipt.signature,
    publicKey: signedReceipt.publicKey,
    alg: signedReceipt.alg,
  });
}
