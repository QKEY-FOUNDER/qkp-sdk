import { canonicalize } from "../crypto/canonical.js";
import { sha256Hex } from "../crypto/sha256.js";
import { utf8ToBytes } from "../utils/index.js";

export async function validateNodeRef(nodeRef, objectToHash) {
  const canon = canonicalize(objectToHash);
  const hash = await sha256Hex(utf8ToBytes(canon));
  return hash === nodeRef.hash;
}

export async function validateEdge(edge, objectsByRefKey) {
  // objectsByRefKey: Map("kind:id" => object)
  const fromKey = `${edge.from.kind}:${edge.from.id}`;
  const toKey = `${edge.to.kind}:${edge.to.id}`;

  const fromObj = objectsByRefKey.get(fromKey);
  const toObj = objectsByRefKey.get(toKey);

  if (!fromObj || !toObj) return false;

  const fromOk = await validateNodeRef(edge.from, fromObj);
  const toOk = await validateNodeRef(edge.to, toObj);

  return fromOk && toOk;
}
