import { sha256Hex } from "../crypto/sha256.js";
import { canonicalize } from "../crypto/canonical.js";
import { utf8ToBytes } from "../utils/index.js";

export async function executeContractStub(contract) {
  // Not actually executing side effects; produces an execution receipt.
  const canon = canonicalize(contract);
  const contractHash = await sha256Hex(utf8ToBytes(canon));

  return {
    version: "0.1",
    contractId: contract.contractId,
    contractHash,
    executedAt: new Date().toISOString(),
    status: "EXECUTED",
    output: { ok: true },
  };
}
