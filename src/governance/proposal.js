export function createProposal({
  id,
  creator,
  title,
  description,
  createdAt = new Date().toISOString(),
  status = "ACTIVE",
  tags = [],
  metadata = {},
}) {
  if (!id) throw new Error("Proposal id is required");
  if (!creator) throw new Error("Proposal creator is required");
  if (!title) throw new Error("Proposal title is required");
  if (!description) throw new Error("Proposal description is required");

  return {
    id,
    creator,
    title,
    description,
    createdAt,
    status, // DRAFT | ACTIVE | PASSED | REJECTED | EXECUTED | CANCELLED
    tags,
    metadata,
  };
}

export function isProposal(obj) {
  return (
    obj &&
    typeof obj.id === "string" &&
    typeof obj.creator === "string" &&
    typeof obj.title === "string" &&
    typeof obj.description === "string" &&
    typeof obj.createdAt === "string"
  );
}
