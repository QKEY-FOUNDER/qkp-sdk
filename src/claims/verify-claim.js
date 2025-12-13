import { verifySignedClaim } from "./signed-claim.js";
import { verifySignedRevocation } from "./signed-revocation.js";
import { defaultTrustPolicy } from "../trust/policy.js";
import { isExpired } from "./claim.js";

export async function verifyClaimWithPolicy({
  signedClaim,
  signedRevocations = [],
  trustPolicy = defaultTrustPolicy,
  policyOptions = {},
}) {
  const cryptographicOk = await verifySignedClaim(signedClaim, {
    allowExpired: true,
  });
  if (!cryptographicOk) return false;

  const revoked = signedRevocations.some((sr) =>
    verifySignedRevocation(sr, signedClaim.claim)
  );

  return trustPolicy({
    signedClaim: {
      ...signedClaim,
      isExpired: isExpired(signedClaim.claim),
    },
    isRevoked: revoked,
    ...policyOptions,
  });
}
