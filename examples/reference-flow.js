// QKP Reference Flow — Living Specification
// This file demonstrates the canonical end-to-end flow of the QuantumKey Protocol.
// It is normative: changes here imply protocol-level changes.

import {
  crypto,
  graph,
  policy
} from "../src/index.js";

async function run() {
  console.log("=== QKP Reference Flow ===");

  // ---------------------------------------------------------------------------
  // 1. Key generation
  // ---------------------------------------------------------------------------

  const agentKeys = await crypto.generateEd25519KeyPair();
  const issuerKeys = await crypto.generateEd25519KeyPair();
  const auditorKeys = await crypto.generateEd25519KeyPair();

  console.log("Keys generated");

  // ---------------------------------------------------------------------------
  // 2. Intent creation
  // ---------------------------------------------------------------------------

  const intent = {
    version: "0.1",
    intentId: "intent-001",
    action: "EXECUTE_CONTRACT",
    target: "contract-xyz",
    createdAt: new Date().toISOString()
  };

  const signedIntent = await crypto.signObject(intent, agentKeys);

  console.log("SignedIntent created");

  // ---------------------------------------------------------------------------
  // 3. Claim issuance
  // ---------------------------------------------------------------------------

  const claim = {
    version: "0.1",
    claimId: "claim-001",
    subject: signedIntent.publicKey,
    type: "AUTHORIZATION",
    issuer: issuerKeys.publicKey,
    createdAt: new Date().toISOString()
  };

  const signedClaim = await crypto.signObject(claim, issuerKeys);

  console.log("SignedClaim created");

  // ---------------------------------------------------------------------------
  // 4. Execution contract
  // ---------------------------------------------------------------------------

  const contractNode = await graph.makeNodeRef({
    kind: "ExecutionContract",
    id: "contract-xyz",
    objectToHash: { intent, claim }
  });

  const receiptNode = await graph.makeNodeRef({
    kind: "ExecutionReceipt",
    id: "receipt-001",
    objectToHash: { status: "EXECUTED" }
  });

  const edge = graph.createEdge({
    type: "PRODUCES",
    from: contractNode,
    to: receiptNode
  });

  const link = await graph.createChainLink({
    linkId: "link-001",
    edges: [edge]
  });

  console.log("ExecutionChainLink created");

  // ---------------------------------------------------------------------------
  // 5. Aggregation
  // ---------------------------------------------------------------------------

  const aggregate = await graph.createChainAggregate({
    aggregateId: "agg-001",
    headHashes: [link.linkHash]
  });

  const signedAggregate = await graph.signChainAggregate(
    aggregate.aggregate,
    auditorKeys
  );

  console.log("SignedChainAggregate created");

  // ---------------------------------------------------------------------------
  // 6. Trust evaluation
  // ---------------------------------------------------------------------------

  const policyResult = policy.evaluateFederatedAggregatePolicy(
    signedAggregate,
    {
      allowIssuers: [issuerKeys.publicKey],
      requireSignature: true
    }
  );

  console.log("Policy evaluation:", policyResult.accepted);

  // ---------------------------------------------------------------------------
  // 7. Attestation
  // ---------------------------------------------------------------------------

  const receipt = await policy.createAcceptanceReceipt({
    target: signedAggregate,
    policyName: "default",
    decision: policyResult.accepted ? "ACCEPT" : "REJECT",
    reasons: policyResult.reasons || []
  }, auditorKeys);

  console.log("AcceptanceReceipt created");

  console.log("=== Reference Flow completed successfully ===");
}

run().catch(err => {
  console.error("Reference Flow failed:", err);
  process.exit(1);
});
