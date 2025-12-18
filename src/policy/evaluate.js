// C16–C19 — Trust Policy Evaluation (Acceptance Layer)

// ---------- helpers ----------

function parseISO(iso) {
  const t = Date.parse(iso);
  if (Number.isNaN(t)) return null;
  return t;
}

function allInAllowList(values, allowList) {
  if (!allowList || allowList.length === 0) return true;
  return values.every((v) => allowList.includes(v));
}

// ---------- C16 — Windowed Aggregation Policy ----------
// Works with the protocol shape: windowStart / windowEnd (ISODateTime)

export function evaluateWindowedAggregatePolicy(windowedAggregate, policy = {}) {
  const reasons = [];

  if (!windowedAggregate) {
    return { accepted: false, reasons: ["missing windowed aggregate"] };
  }

  const from = parseISO(windowedAggregate.windowStart);
  const to = parseISO(windowedAggregate.windowEnd);

  if (from === null || to === null) {
    reasons.push("invalid window timestamps");
  } else if (from > to) {
    reasons.push("windowStart MUST be <= windowEnd");
  }

  if (policy.requireWindowStartAfter) {
    const min = parseISO(policy.requireWindowStartAfter);
    if (min === null || from === null || from < min) {
      reasons.push("windowStart is before policy minimum");
    }
  }

  if (policy.requireWindowEndBefore) {
    const max = parseISO(policy.requireWindowEndBefore);
    if (max === null || to === null || to > max) {
      reasons.push("windowEnd is after policy maximum");
    }
  }

  return { accepted: reasons.length === 0, reasons };
}

// ---------- C17 — Hierarchical Aggregation Policy ----------

export function evaluateHierarchicalAggregatePolicy(hierAggregate, policy = {}) {
  const reasons = [];

  if (!hierAggregate) {
    return { accepted: false, reasons: ["missing hierarchical aggregate"] };
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

// ---------- C18 — Federated Aggregation Policy ----------
// Supports BOTH shapes:
// - legacy: federated.signatures[]
// - current: federated.aggregates[] (each signed)

export function evaluateFederatedAggregatePolicy(federated, policy = {}) {
  const reasons = [];

  if (!federated) {
    return { accepted: false, reasons: ["missing federated payload"] };
  }

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

  if (policy.allowAlgorithms && policy.allowAlgorithms.length > 0) {
    const bad = entries.find((s) => !policy.allowAlgorithms.includes(s.alg));
    if (bad) reasons.push(`disallowed algorithm: ${bad.alg}`);
  }

  if (policy.allowPublicKeys && policy.allowPublicKeys.length > 0) {
    const keys = entries.map((s) => s.publicKey);
    if (!allInAllowList(keys, policy.allowPublicKeys)) {
      reasons.push("publicKey not in allowlist");
    }
  }

  return { accepted: reasons.length === 0, reasons };
}

// ---------- C19 — Generic Trust Evaluation ----------

export function evaluateTrustPolicy({ cryptoValid, policyResult }) {
  if (!cryptoValid) {
    return { accepted: false, reasons: ["cryptographic verification failed"] };
  }

  if (!policyResult || !policyResult.accepted) {
    return { accepted: false, reasons: policyResult?.reasons || ["policy rejected"] };
  }

  return { accepted: true, reasons: [] };
}
