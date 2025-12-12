// Node polyfill for atob/btoa (needed for base64url helpers)
if (typeof globalThis.atob !== "function" || typeof globalThis.btoa !== "function") {
  const { Buffer } = await import("node:buffer");
  globalThis.btoa = (bin) => Buffer.from(bin, "binary").toString("base64");
  globalThis.atob = (b64) => Buffer.from(b64, "base64").toString("binary");
}
export function nowISO() {
  return new Date().toISOString();
}

export function assert(condition, message) {
  if (!condition) throw new Error(message || "Assertion failed");
}

export function utf8ToBytes(str) {
  return new TextEncoder().encode(str);
}

export function bytesToHex(bytes) {
  let out = "0x";
  for (const b of bytes) out += b.toString(16).padStart(2, "0");
  return out;
}

export function bytesToBase64url(bytes) {
  // Browser + Node compatible
  let binary = "";
  for (const b of bytes) binary += String.fromCharCode(b);
  const base64 = btoa(binary);
  return base64.replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/g, "");
}

export function base64urlToBytes(b64url) {
  const base64 = b64url.replace(/-/g, "+").replace(/_/g, "/");
  const pad = base64.length % 4 === 0 ? "" : "=".repeat(4 - (base64.length % 4));
  const str = atob(base64 + pad);
  const out = new Uint8Array(str.length);
  for (let i = 0; i < str.length; i++) out[i] = str.charCodeAt(i);
  return out;
}
