import { verifyExecutionContract } from "./verify.js";
import { executeContractStub } from "./execute.js";
import { createExecutionReceipt } from "./receipt.js";

export async function auditedExecute({
  contract,
  signedClaims = [],
  signedRevocations = [],
  replayGuard,
  trustPolicy,
  policyOptions = {},
}) {
  // replay protection
  if (replayGuard?.hasSeen(contract.contractId)) {
    return { allowed: false, reason: "REPLAY_DETECTED" };
  }

  // verify contract
  const verdict = await verifyExecutionContract({
    contract,
    signedClaims,
    signedRevocations,
    trustPolicy,
    policyOptions,
  });

  if (!verdict.allowed) return verdict;

  // execute (stub)
  const exec = await executeContractStub(contract);

  // mark as seen
  replayGuard?.markSeen(contract.contractId);

  // produce receipt
  const receipt = createExecutionReceipt({
    receiptId: `rcpt_${Date.now()}`,
    contractId: contract.contractId,
    contractHash: exec.contractHash,
    status: "EXECUTED",
    output: exec.output,
  });

  return {
    allowed: true,
    receipt,
  };
}
