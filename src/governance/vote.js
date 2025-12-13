export function createVote({
  proposalId,
  voter,
  choice,
  weight = 1,
  castAt = new Date().toISOString(),
}) {
  if (!proposalId) throw new Error("proposalId is required");
  if (!voter) throw new Error("voter is required");
  if (!choice) throw new Error("choice is required");
  if (!["YES", "NO", "ABSTAIN"].includes(choice)) {
    throw new Error("choice must be YES, NO, or ABSTAIN");
  }

  return {
    proposalId,
    voter,
    choice,
    weight,
    castAt,
  };
}

export function isVote(obj) {
  return (
    obj &&
    typeof obj.proposalId === "string" &&
    typeof obj.voter === "string" &&
    typeof obj.choice === "string" &&
    typeof obj.weight === "number" &&
    typeof obj.castAt === "string"
  );
}
