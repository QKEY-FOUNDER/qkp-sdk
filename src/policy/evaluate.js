// C16–C19 — Trust Policy Evaluation (Acceptance Layer)

// ---------- helpers ----------

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

// ---------- C16 — Windowed Aggregation Policy ----------

export function evaluateWindowedAggregatePolicy(windowed, policy = {}) {
  const reasons = [];

  if (!windowed || !windowed.window) {
    return { accepted: false, reasons: ["missing windowed aggregate"] };
  }

  const { window } = windowed;
  const from = parseISO(window.from);
  const to = parseISO(window.to);

  if (from === null || to === null) {
    reasons.push("invalid window timestamps");
  }

  if (from !== null && to !== null && from > to) {
    reasons.push("window.from must be <= window.to");
  }

  if (policy.maxWindowMs != null && from !== null && to !== null) {
    if (to - from > policy.maxWindowMs) {
      reasons.push("window exceeds maximum duration");
    }
  }

  return { accepted: reasons.length === 0, reasons };
}

// ---------- C18 — Federated Aggregation Policy ----------

export function evaluateFederatedAggregatePolicy(federated, policy = {}) {
  const reasons = [];

  if (!federated) {
    return { accepted: false, reasons: ["missing federated payload"] };
  }

  // Accept BOTH shapes:
  // - legacy: federated.signatures[]
  // - current: federated.aggregates[] (each signed)
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
    return {
      accepted: false,
      reasons: policyResult?.reasons || ["policy rejected"],
    };
  }

  return { accepted: true, reasons: [] };
}
