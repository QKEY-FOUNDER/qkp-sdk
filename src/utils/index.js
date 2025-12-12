export function nowISO() {
  return new Date().toISOString();
}

export function assert(condition, message) {
  if (!condition) throw new Error(message || "Assertion failed");
}

export function utf8ToBytes(str) {
  return new TextEncoder().encode(str);
}

export function bytesToHex(bytes) {
  let out = "0x";
  for (const b of bytes) out += b.toString(16).padStart(2, "0");
  return out;
}
