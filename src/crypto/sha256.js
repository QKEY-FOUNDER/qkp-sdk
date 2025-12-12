// SHA-256 with WebCrypto if available, otherwise Node's crypto.
// Works in GitHub Actions (Node 20) and modern browsers.

import { bytesToHex } from "../utils/index.js";

async function getSubtle() {
  if (globalThis.crypto?.subtle) return globalThis.crypto.subtle;

  // Node fallback
  const { webcrypto } = await import("node:crypto");
  return webcrypto.subtle;
}

export async function sha256Bytes(inputBytes) {
  const subtle = await getSubtle();
  const digest = await subtle.digest("SHA-256", inputBytes);
  return new Uint8Array(digest);
}

export async function sha256Hex(inputBytes) {
  const digestBytes = await sha256Bytes(inputBytes);
  return bytesToHex(digestBytes);
}
