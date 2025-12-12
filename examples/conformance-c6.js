import { crypto, intent } from "../src/index.js";

const run = async () => {
  const keys = await crypto.generateEd25519KeyPair();

  const payload = intent.createIntent({
    issuer: "did:qkp:alice",
    purpose: "authorize_data_access",
    scope: "local",
    constraints: { ttlSeconds: 300 },
  });

  const signed = await crypto.sign(payload, {
    alg: "ED25519",
    privateKey: keys.privateKey,
    publicKey: keys.publicKey,
  });

  const ok = await crypto.verify(signed);
  console.log("C6 verify original (should be true):", ok);
  if (!ok) throw new Error("C6 failed: signature did not verify");

  const tampered = { ...signed, payload: { ...signed.payload, purpose: "different_purpose" } };
  const bad = await crypto.verify(tampered);
  console.log("C6 verify tampered (should be false):", bad);
  if (bad) throw new Error("C6 failed: tampered payload verified");

  process.exit(0);
};

run().catch((e) => {
  console.error(e);
  process.exit(1);
});
