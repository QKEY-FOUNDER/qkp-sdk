export function createIdentity({ id, publicKey, metadata = {} }) {
  if (!id) throw new Error("Identity id is required");

  return {
    id,
    publicKey,
    metadata,
    createdAt: new Date().toISOString(),
  };
}

export function isIdentity(obj) {
  return obj && typeof obj.id === "string";
}
