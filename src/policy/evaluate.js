// C19 — Trust Policy Evaluation (Acceptance Layer)

// Helpers
function parseISO(iso) {
  const t = Date.parse(iso);
  if (Number.isNaN(t)) return null;
  return t;
}

function inAllowList(value, allowList) {
  if (!allowList || allowList.length === 0) return true;
  return allowList.includes(value);
}

function allInAllowList(values, allowList) {
  if (!allowList || allowList.length === 0) return true;
  return values.every((v) => allowList.includes(v));
}

// Federated / Cross-domain policy
export function evaluateFederatedAggregatePolicy(signedFederated, policy = {}) {
  const reasons = [];

  if (!signedFederated || !signedFederated.signatures) {
    return { accepted: false, reasons: ["missing federated signatures"] };
  }

  const signatures = signedFederated.signatures;
  const minSignatures = policy.minSignatures ?? 1;

  if (signatures.length < minSignatures) {
    reasons.push(
      `insufficient signatures: have ${signatures.length}, need ${minSignatures}`
    );
  }

  // Algorithm allowlist
  if (policy.allowAlgorithms && policy.allowAlgorithms.length > 0) {
    const badAlg = signatures.find(
      (s) => !policy.allowAlgorithms.includes(s.alg)
    );
    if (badAlg) reasons.push(`disallowed algorithm: ${badAlg.alg}`);
  }

  // Public key allowlist
  if (policy.allowPublicKeys && policy.allowPublicKeys.length > 0) {
    const keys = signatures.map((s) => s.publicKey);
    if (!allInAllowList(keys, policy.allowPublicKeys)) {
      reasons.push("publicKey not in allowlist");
    }
  }

  return { accepted: reasons.length === 0, reasons };
}

// Windowed aggregation policy
export function evaluateWindowedAggregatePolicy(windowedAggregate, policy = {}) {
  const reasons = [];

  if (!windowedAggregate) {
    return { accepted: false, reasons: ["missing aggregate"] };
  }

  if (policy.requireWindowStartAfter) {
    const w = parseISO(windowedAggregate.windowStart);
    const p = parseISO(policy.requireWindowStartAfter);
    if (w === null || p === null || w < p) {
      reasons.push("windowStart is before policy minimum");
    }
  }

  if (policy.requireWindowEndBefore) {
    const w = parseISO(windowedAggregate.windowEnd);
    const p = parseISO(policy.requireWindowEndBefore);
    if (w === null || p === null || w > p) {
      reasons.push("windowEnd is after policy maximum");
    }
  }

  return { accepted: reasons.length === 0, reasons };
}

// Hierarchical aggregation policy
export function evaluateHierarchicalAggregatePolicy(hierAggregate, policy = {}) {
  const reasons = [];

  if (!hierAggregate) {
    return { accepted: false, reasons: ["missing aggregate"] };
  }

  if (typeof policy.requireLevel === "number") {
    if (hierAggregate.level !== policy.requireLevel) {
      reasons.push(
        `level mismatch: expected ${policy.requireLevel}, got ${hierAggregate.level}`
      );
    }
  }

  return { accepted: reasons.length === 0, reasons };
}
