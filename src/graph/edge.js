export function createEdge({ type, from, to, createdAt = new Date().toISOString() }) {
  if (!type) throw new Error("type is required");
  if (!from?.kind || !from?.id || !from?.hash) throw new Error("from NodeRef invalid");
  if (!to?.kind || !to?.id || !to?.hash) throw new Error("to NodeRef invalid");

  return { type, from, to, createdAt };
}
