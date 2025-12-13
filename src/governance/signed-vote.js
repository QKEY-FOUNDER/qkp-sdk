import { sign, verify } from "../crypto/index.js";
import { isVote } from "./vote.js";

export async function createSignedVote(vote, keypair) {
  if (!isVote(vote)) throw new Error("Invalid vote");
  if (!keypair?.alg || !keypair?.privateKey || !keypair?.publicKey) {
    throw new Error("Invalid signing keypair");
  }

  const signed = await sign(vote, keypair);

  return {
    version: "0.1",
    vote,
    signature: signed.signature,
    publicKey: signed.publicKey,
    alg: signed.alg,
    createdAt: signed.createdAt,
  };
}

export async function verifySignedVote(signedVote) {
  if (!signedVote?.vote) return false;

  return await verify({
    payload: signedVote.vote,
    signature: signedVote.signature,
    publicKey: signedVote.publicKey,
    alg: signedVote.alg,
  });
}
