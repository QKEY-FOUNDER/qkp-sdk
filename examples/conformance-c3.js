import { intent, qie } from "../src/index.js";

const run = async () => {
  const i = intent.createIntent({
    issuer: "did:qkp:alice",
    purpose: "authorize_data_access",
    scope: "local",
    constraints: { ttlSeconds: 300 },
  });

  const encoded = await qie.encodeIntent(i);
  console.log("C3 QIE:", encoded);

  // Semantics check: purpose change => hash change
  const i2 = { ...i, purpose: "different_purpose" };
  const encoded2 = await qie.encodeIntent(i2);

  console.log("C3 Hash changed:", encoded.hash !== encoded2.hash);
  process.exit(0);
};

run().catch((e) => {
  console.error(e);
  process.exit(1);
});
