export function evaluateFederatedAggregatePolicy(federated, policy = {}) {
  const reasons = [];

  if (!federated) {
    return { accepted: false, reasons: ["missing federated payload"] };
  }

  // Support BOTH shapes:
  // 1) federated.signatures[] (older)
  // 2) federated.aggregates[] (current C18: each entry has signature/publicKey/alg)
  let entries = [];

  if (Array.isArray(federated.signatures)) {
    entries = federated.signatures;
  } else if (Array.isArray(federated.aggregates)) {
    entries = federated.aggregates;
  } else {
    return { accepted: false, reasons: ["missing federated signatures/aggregates"] };
  }

  const minSignatures = policy.minSignatures ?? 1;
  if (entries.length < minSignatures) {
    reasons.push(`insufficient signatures: have ${entries.length}, need ${minSignatures}`);
  }

  // Algorithm allowlist
  if (policy.allowAlgorithms && policy.allowAlgorithms.length > 0) {
    const badAlg = entries.find((s) => !policy.allowAlgorithms.includes(s.alg));
    if (badAlg) reasons.push(`disallowed algorithm: ${badAlg.alg}`);
  }

  // Public key allowlist
  if (policy.allowPublicKeys && policy.allowPublicKeys.length > 0) {
    const keys = entries.map((s) => s.publicKey);
    if (!allInAllowList(keys, policy.allowPublicKeys)) {
      reasons.push("publicKey not in allowlist");
    }
  }

  return { accepted: reasons.length === 0, reasons };
}
