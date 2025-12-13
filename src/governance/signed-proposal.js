import { sign, verify } from "../crypto/index.js";
import { isProposal } from "./proposal.js";

export async function createSignedProposal(proposal, keypair) {
  if (!isProposal(proposal)) throw new Error("Invalid proposal");
  if (!keypair?.alg || !keypair?.privateKey || !keypair?.publicKey) {
    throw new Error("Invalid signing keypair");
  }

  const signed = await sign(proposal, keypair);

  return {
    version: "0.1",
    proposal,
    signature: signed.signature,
    publicKey: signed.publicKey,
    alg: signed.alg,
    createdAt: signed.createdAt,
  };
}

export async function verifySignedProposal(signedProposal) {
  if (!signedProposal?.proposal) return false;

  return await verify({
    payload: signedProposal.proposal,
    signature: signedProposal.signature,
    publicKey: signedProposal.publicKey,
    alg: signedProposal.alg,
  });
}
