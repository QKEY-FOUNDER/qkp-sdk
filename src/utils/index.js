// QuantumKey SDK — Utility helpers

export function deepClone(obj) {
  return JSON.parse(JSON.stringify(obj));
}

export function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}
