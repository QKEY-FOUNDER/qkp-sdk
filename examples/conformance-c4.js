import { intent, alignment } from "../src/index.js";

const i = intent.createIntent({
  issuer: "did:qkp:alice",
  purpose: "authorize_data_access",
});

const actionOk = { purpose: "authorize_data_access" };
const actionBad = { purpose: "something_else" };

console.log("C4 aligned (should be true):", alignment.checkAlignment({ intent: i, action: actionOk }));
console.log("C4 aligned (should be false):", alignment.checkAlignment({ intent: i, action: actionBad }));

process.exit(0);
