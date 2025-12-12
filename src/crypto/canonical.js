// Canonical JSON (deterministic) — stable key ordering, no whitespace surprises.
// This is NOT full RFC 8785 JCS, but it's deterministic and sufficient for v0.1 hardening.

export function canonicalize(value) {
  if (value === null) return "null";

  const t = typeof value;

  if (t === "number") {
    if (!Number.isFinite(value)) throw new Error("Non-finite numbers not allowed in canonical JSON");
    return String(value);
  }

  if (t === "boolean") return value ? "true" : "false";
  if (t === "string") return JSON.stringify(value);

  if (Array.isArray(value)) {
    return "[" + value.map(canonicalize).join(",") + "]";
  }

  if (t === "object") {
    const keys = Object.keys(value).sort();
    return "{" + keys.map((k) => JSON.stringify(k) + ":" + canonicalize(value[k])).join(",") + "}";
  }

  throw new Error(`Unsupported type in canonicalize: ${t}`);
}
