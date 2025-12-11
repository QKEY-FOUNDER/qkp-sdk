// Identity Primitive — QuantumKey Protocol
// Placeholder implementation for now.

export function createIdentity(seed = "qkp") {
  return {
    id: "id_" + btoa(seed).slice(0, 12),
    createdAt: new Date().toISOString(),
    type: "QKP.Identity"
  };
}

export function verifyIdentity(identity) {
  return (
    typeof identity === "object" &&
    identity?.id &&
    identity?.createdAt &&
    identity?.type === "QKP.Identity"
  );
}
