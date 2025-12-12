import { identity, intent } from "../src/index.js";

const alice = identity.createIdentity({
  id: "did:qkp:alice",
  publicKey: "pk_demo_001",
});

const i = intent.createIntent({
  issuer: alice.id,
  purpose: "authorize_data_access",
  scope: "local",
  constraints: { ttlSeconds: 300 },
});

console.log("C1 Identity:", alice);
console.log("C2 Intent:", i);

process.exit(0);
