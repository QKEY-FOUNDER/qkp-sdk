export function createExecutionReceipt({
  receiptId,
  contractId,
  contractHash,
  status,
  output = {},
  executedAt = new Date().toISOString(),
}) {
  if (!receiptId) throw new Error("receiptId is required");
  if (!contractId) throw new Error("contractId is required");
  if (!contractHash) throw new Error("contractHash is required");
  if (!status) throw new Error("status is required");

  return {
    version: "0.1",
    receiptId,
    contractId,
    contractHash,
    status,
    output,
    executedAt,
  };
}
