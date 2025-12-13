export function createReplayGuard() {
  const seen = new Set();

  return {
    hasSeen(contractHash) {
      return seen.has(contractHash);
    },
    markSeen(contractHash) {
      seen.add(contractHash);
    },
  };
}
