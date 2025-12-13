export function createRevocation({
  targetClaimId,
  issuer,
  reason,
  revokedAt = new Date().toISOString(),
}) {
  if (!targetClaimId) throw new Error("targetClaimId is required");
  if (!issuer) throw new Error("issuer is required");

  return {
    version: "0.1",
    targetClaimId,
    issuer,
    ...(reason ? { reason } : {}),
    revokedAt,
  };
}

export function matchesClaim(revocation, claim) {
  return (
    revocation.targetClaimId === claim.id &&
    revocation.issuer === claim.issuer
  );
}
