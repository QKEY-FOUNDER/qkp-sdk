import { intent, crypto } from "../src/index.js";
import { createSignedIntent, verifySignedIntent } from "../src/intent/signed-intent.js";

const run = async () => {
  const keys = await crypto.generateEd25519KeyPair();

  const i = intent.createIntent({
    issuer: "did:qkp:alice",
    purpose: "delegate_compute",
    scope: "local",
    constraints: { maxCost: 10 },
  });

  const signed = await createSignedIntent(i, {
    alg: "ED25519",
    privateKey: keys.privateKey,
    publicKey: keys.publicKey,
  });

  const ok = await verifySignedIntent(signed);
  console.log("C7 verify signed intent (should be true):", ok);
  if (!ok) throw new Error("C7 failed: valid signed intent did not verify");

  const tampered = {
    ...signed,
    intent: { ...signed.intent, purpose: "steal_compute" },
  };

  const bad = await verifySignedIntent(tampered);
  console.log("C7 verify tampered signed intent (should be false):", bad);
  if (bad) throw new Error("C7 failed: tampered signed intent verified");

  process.exit(0);
};

run().catch((e) => {
  console.error(e);
  process.exit(1);
});
