import { crypto, governance } from "../src/index.js";

const run = async () => {
  // keys
  const creatorKeys = await crypto.generateEd25519KeyPair();
  const voter1Keys = await crypto.generateEd25519KeyPair();
  const voter2Keys = await crypto.generateEd25519KeyPair();

  // proposal
  const p = governance.createProposal({
    id: "prop_001",
    creator: "did:qkp:alice",
    title: "Enable QKP Governance v0.1",
    description: "Activate proposal and voting primitives in the SDK.",
    tags: ["governance", "sdk"],
  });

  const sp = await governance.createSignedProposal(p, {
    alg: "ED25519",
    privateKey: creatorKeys.privateKey,
    publicKey: creatorKeys.publicKey,
  });

  const pOk = await governance.verifySignedProposal(sp);
  console.log("C10 verify signed proposal (should be true):", pOk);
  if (!pOk) throw new Error("C10 failed: signed proposal did not verify");

  // votes
  const v1 = governance.createVote({
    proposalId: p.id,
    voter: "did:qkp:voter1",
    choice: "YES",
    weight: 2,
  });

  const v2 = governance.createVote({
    proposalId: p.id,
    voter: "did:qkp:voter2",
    choice: "NO",
    weight: 1,
  });

  const sv1 = await governance.createSignedVote(v1, {
    alg: "ED25519",
    privateKey: voter1Keys.privateKey,
    publicKey: voter1Keys.publicKey,
  });

  const sv2 = await governance.createSignedVote(v2, {
    alg: "ED25519",
    privateKey: voter2Keys.privateKey,
    publicKey: voter2Keys.publicKey,
  });

  // tampered vote (should be ignored)
  const tampered = {
    ...sv2,
    vote: { ...sv2.vote, choice: "YES" },
  };

  const result = await governance.tallyVotes({
    proposalId: p.id,
    signedVotes: [sv1, sv2, tampered],
  });

  console.log("C10 tally:", result);

  // Expected:
  // YES = 2, NO = 1, ABSTAIN = 0
  if (result.YES !== 2 || result.NO !== 1 || result.ABSTAIN !== 0) {
    throw new Error("C10 failed: tally does not match expected totals");
  }

  process.exit(0);
};

run().catch((e) => {
  console.error(e);
  process.exit(1);
});
