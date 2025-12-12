export function createIntent({ issuer, purpose, scope = "local", constraints = {} }) {
  if (!issuer || !purpose) {
    throw new Error("Intent requires issuer and purpose");
  }

  return {
    issuer,
    purpose,
    scope,
    constraints,
    issuedAt: new Date().toISOString(),
  };
}

export function isIntent(obj) {
  return obj && typeof obj.issuer === "string" && typeof obj.purpose === "string";
}

export { createSignedIntent, verifySignedIntent } from "./signed-intent.js";
