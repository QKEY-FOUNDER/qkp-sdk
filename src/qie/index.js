import { canonicalize, sha256Hex } from "../crypto/index.js";
import { utf8ToBytes } from "../utils/index.js";

export async function encodeIntent(intent) {
  if (!intent || !intent.purpose) {
    throw new Error("Invalid intent");
  }

  const canon = canonicalize(intent);
  const hash = await sha256Hex(utf8ToBytes(canon));

  return {
    qieVersion: "0.2", // bumped because hashing semantics changed
    hash,
    intent,
  };
}
