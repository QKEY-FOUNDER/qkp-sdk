export function nowISO() {
  return new Date().toISOString();
}

export function assert(condition, message) {
  if (!condition) throw new Error(message || "Assertion failed");
}
