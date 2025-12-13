import { verifySignedIntent } from "../intent/signed-intent.js";
import { verifyClaimWithPolicy } from "../claims/verify-claim.js";

export async function verifyExecutionContract({
  contract,
  signedClaims = [],
  signedRevocations = [],
  trustPolicy,
  policyOptions = {},
}) {
  // 1) SignedIntent must verify
  const intentOk = await verifySignedIntent(contract.signedIntent);
  if (!intentOk) return { allowed: false, reason: "INVALID_SIGNED_INTENT" };

  // 2) Required claims must be present and accepted by policy
  for (const claimType of contract.requiredClaims || []) {
    const matching = signedClaims.filter((sc) => sc?.claim?.type === claimType);

    if (matching.length === 0) {
      return { allowed: false, reason: "MISSING_REQUIRED_CLAIM", details: { claimType } };
    }

    // at least one acceptable claim of that type
    let accepted = false;
    for (const sc of matching) {
      const ok = await verifyClaimWithPolicy({
        signedClaim: sc,
        signedRevocations,
        trustPolicy,
        policyOptions,
      });
      if (ok) {
        accepted = true;
        break;
      }
    }

    if (!accepted) {
      return { allowed: false, reason: "CLAIM_NOT_TRUSTED", details: { claimType } };
    }
  }

  // 3) Minimal constraint check: if intent has constraints.maxCost, action.params.cost must comply
  const maxCost = contract.signedIntent.intent?.constraints?.maxCost;
  const cost = contract.action?.params?.cost;

  if (typeof maxCost === "number" && typeof cost === "number" && cost > maxCost) {
    return { allowed: false, reason: "CONSTRAINT_VIOLATION", details: { maxCost, cost } };
  }

  return { allowed: true };
}
