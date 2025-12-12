export function createClaim({
  id,
  issuer,
  subject,
  type,
  issuedAt = new Date().toISOString(),
  expiresAt,
  evidence = [],
  data = {},
}) {
  if (!id) throw new Error("Claim id is required");
  if (!issuer) throw new Error("Claim issuer is required");
  if (!subject) throw new Error("Claim subject is required");
  if (!type) throw new Error("Claim type is required");

  if (expiresAt && typeof expiresAt !== "string") {
    throw new Error("expiresAt must be an ISO string if provided");
  }

  return {
    id,
    issuer,
    subject,
    type,
    issuedAt,
    ...(expiresAt ? { expiresAt } : {}),
    evidence,
    data,
  };
}

export function isClaim(obj) {
  return (
    obj &&
    typeof obj.id === "string" &&
    typeof obj.issuer === "string" &&
    typeof obj.subject === "string" &&
    typeof obj.type === "string" &&
    typeof obj.issuedAt === "string"
  );
}

export function isExpired(claim, nowISO = new Date().toISOString()) {
  if (!claim?.expiresAt) return false;
  return new Date(nowISO).getTime() > new Date(claim.expiresAt).getTime();
}
