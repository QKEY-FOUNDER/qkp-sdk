import { qie } from "../src/index.js";

const run = async () => {
  const a = {
    issuer: "did:qkp:alice",
    purpose: "authorize_data_access",
    scope: "local",
    constraints: { ttlSeconds: 300 },
    issuedAt: "2025-01-01T00:00:00.000Z",
  };

  // Same content, different key order
  const b = {
    purpose: "authorize_data_access",
    issuer: "did:qkp:alice",
    issuedAt: "2025-01-01T00:00:00.000Z",
    constraints: { ttlSeconds: 300 },
    scope: "local",
  };

  const ha = (await qie.encodeIntent(a)).hash;
  const hb = (await qie.encodeIntent(b)).hash;

  console.log("C5 Hash equal for canonical intents:", ha === hb);
  if (ha !== hb) throw new Error("C5 failed: hashes differ for equivalent objects");

  const c = { ...a, constraints: { ttlSeconds: 301 } };
  const hc = (await qie.encodeIntent(c)).hash;

  console.log("C5 Hash changes on value change:", ha !== hc);
  if (ha === hc) throw new Error("C5 failed: hash did not change when intent changed");

  process.exit(0);
};

run().catch((e) => {
  console.error(e);
  process.exit(1);
});
