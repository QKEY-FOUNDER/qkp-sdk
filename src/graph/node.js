import { canonicalize } from "../crypto/canonical.js";
import { sha256Hex } from "../crypto/sha256.js";
import { utf8ToBytes } from "../utils/index.js";

export async function makeNodeRef({ kind, id, objectToHash }) {
  if (!kind) throw new Error("kind is required");
  if (!id) throw new Error("id is required");
  if (!objectToHash) throw new Error("objectToHash is required");

  const canon = canonicalize(objectToHash);
  const hash = await sha256Hex(utf8ToBytes(canon));

  return { kind, id, hash };
}
