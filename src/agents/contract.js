export function createExecutionContract({
  contractId,
  agentId,
  action,
  signedIntent,
  requiredClaims = [],
  policy = {},
  createdAt = new Date().toISOString(),
}) {
  if (!contractId) throw new Error("contractId is required");
  if (!agentId) throw new Error("agentId is required");
  if (!action?.type) throw new Error("action.type is required");
  if (!signedIntent?.intent) throw new Error("signedIntent is required");

  return {
    version: "0.1",
    contractId,
    agentId,
    action,
    signedIntent,
    requiredClaims,
    policy,
    createdAt,
  };
}
