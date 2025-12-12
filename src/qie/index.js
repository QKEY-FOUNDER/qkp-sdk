export function encodeIntent(intent) {
  if (!intent || !intent.purpose) {
    throw new Error("Invalid intent");
  }

  return {
    qieVersion: "0.1",
    hash: simpleHash(JSON.stringify(intent)),
    intent,
  };
}

function simpleHash(str) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = (hash << 5) - hash + str.charCodeAt(i);
    hash |= 0;
  }
  return `qie_${Math.abs(hash)}`;
}
