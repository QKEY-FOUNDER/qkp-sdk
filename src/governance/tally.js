import { verifySignedVote } from "./signed-vote.js";

export async function tallyVotes({
  proposalId,
  signedVotes = [],
  dedupeByVoter = true,
}) {
  const totals = { YES: 0, NO: 0, ABSTAIN: 0, totalWeight: 0 };
  const seenVoters = new Set();

  for (const sv of signedVotes) {
    const ok = await verifySignedVote(sv);
    if (!ok) continue;

    const v = sv.vote;
    if (v.proposalId !== proposalId) continue;

    if (dedupeByVoter) {
      if (seenVoters.has(v.voter)) continue;
      seenVoters.add(v.voter);
    }

    totals[v.choice] += v.weight;
    totals.totalWeight += v.weight;
  }

  return {
    proposalId,
    ...totals,
  };
}
