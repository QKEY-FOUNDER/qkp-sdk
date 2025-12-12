import { canonicalize } from "./canonical.js";
import { sha256Bytes } from "./sha256.js";
import { utf8ToBytes, bytesToBase64url, base64urlToBytes } from "../utils/index.js";

async function getSubtle() {
  if (globalThis.crypto?.subtle) return globalThis.crypto.subtle;
  const { webcrypto } = await import("node:crypto");
  return webcrypto.subtle;
}

export async function generateEd25519KeyPair() {
  const subtle = await getSubtle();

  const keyPair = await subtle.generateKey(
    { name: "Ed25519" },
    true,
    ["sign", "verify"]
  );

  const publicRaw = new Uint8Array(await subtle.exportKey("raw", keyPair.publicKey));
  const privatePkcs8 = new Uint8Array(await subtle.exportKey("pkcs8", keyPair.privateKey));

  return {
    alg: "ED25519",
    publicKey: bytesToBase64url(publicRaw),
    privateKey: bytesToBase64url(privatePkcs8),
  };
}

export async function signEd25519(payload, privateKeyB64url) {
  const subtle = await getSubtle();

  const canon = canonicalize(payload);
  const digestBytes = await sha256Bytes(utf8ToBytes(canon));

  const privateKey = await subtle.importKey(
    "pkcs8",
    base64urlToBytes(privateKeyB64url),
    { name: "Ed25519" },
    false,
    ["sign"]
  );

  const sigBytes = new Uint8Array(await subtle.sign("Ed25519", privateKey, digestBytes));
  return bytesToBase64url(sigBytes);
}

export async function verifyEd25519(payload, signatureB64url, publicKeyB64url) {
  const subtle = await getSubtle();

  const canon = canonicalize(payload);
  const digestBytes = await sha256Bytes(utf8ToBytes(canon));

  const publicKey = await subtle.importKey(
    "raw",
    base64urlToBytes(publicKeyB64url),
    { name: "Ed25519" },
    false,
    ["verify"]
  );

  return await subtle.verify(
    "Ed25519",
    publicKey,
    base64urlToBytes(signatureB64url),
    digestBytes
  );
}
