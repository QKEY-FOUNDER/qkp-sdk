import { sign, verify } from "../crypto/index.js";

export async function signChainLink(link, keypair) {
  const signed = await sign(link, keypair);

  return {
    version: "0.1",
    link,
    signature: signed.signature,
    publicKey: signed.publicKey,
    alg: signed.alg,
    createdAt: signed.createdAt,
  };
}

export async function verifySignedChainLink(signedLink) {
  return await verify({
    payload: signedLink.link,
    signature: signedLink.signature,
    publicKey: signedLink.publicKey,
    alg: signedLink.alg,
  });
}
