export function defaultTrustPolicy({
  signedClaim,
  isRevoked,
  allowExpired = false,
  trustedIssuers = [],
}) {
  if (isRevoked) return false;

  if (!allowExpired && signedClaim.isExpired) return false;

  if (
    trustedIssuers.length > 0 &&
    !trustedIssuers.includes(signedClaim.claim.issuer)
  ) {
    return false;
  }

  return true;
}
