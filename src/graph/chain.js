import { canonicalize } from "../crypto/canonical.js";
import { sha256Hex } from "../crypto/sha256.js";
import { utf8ToBytes } from "../utils/index.js";

export async function createChainLink({ linkId, prevLinkHash, edges, createdAt = new Date().toISOString() }) {
  if (!linkId) throw new Error("linkId is required");
  if (!edges || !Array.isArray(edges)) throw new Error("edges array is required");

  const link = {
    version: "0.1",
    linkId,
    ...(prevLinkHash ? { prevLinkHash } : {}),
    edges,
    createdAt,
  };

  const canon = canonicalize(link);
  const linkHash = await sha256Hex(utf8ToBytes(canon));

  return { link, linkHash };
}
