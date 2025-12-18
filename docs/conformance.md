# QKP Conformance Suite (v0)

This document defines minimal conformance cases for QKP-compatible implementations.

A system is **QKP-compatible** if it can produce the objects defined in `docs/protocol-spec.md`
with the required fields and semantics.

## How to Use
For each case below:
1. Create the required objects
2. Verify required fields and meanings
3. Compare to expected output shape

---

## Case C1 — Identity Object (v0.1)

### Input
- `id = "did:qkp:alice"`
- `publicKey = "pk_demo_001"`

### Required Output Shape
- `id` is a non-empty string
- `createdAt` is ISO-8601 string
- `publicKey` may be present
- `metadata` defaults to object (optional)

### Notes
Implementations may add extra fields, but MUST NOT change meanings of required fields.

---

## Case C2 — Intent Object (v0.1)

### Input
- `issuer = "did:qkp:alice"`
- `purpose = "authorize_data_access"`
- `scope = "local"`
- `constraints = { "ttlSeconds": 300 }`

### Required Output Shape
- `issuer` is a non-empty string
- `purpose` is a non-empty string
- `issuedAt` is ISO-8601 string
- `constraints` is an object (optional)

### Semantics Check
`purpose` must remain stable through serialization/deserialization.

---

## Case C3 — QIE Encoding Container (v0.1)

### Input
- An Intent object from Case C2

### Required Output Shape
- `qieVersion` equals `"0.1"`
- `hash` is a non-empty string identifier
- `intent` is the original intent object

### Semantics Check
If `intent.purpose` changes, `hash` MUST change.

---

## Case C4 — Alignment Check (v0.1)

### Input
- Intent from Case C2
- Action object:
  - `purpose = "authorize_data_access"`

### Required Output Shape
- `aligned` is boolean
- `checkedAt` is ISO-8601 string

### Semantics Check
If `action.purpose !== intent.purpose`, then `aligned` MUST be `false`.

---

## Case C5 — Deterministic QIE Hash (v0.2)

### Input
Two intents with the same semantic content but different key order.

### Requirement
- Hash MUST be identical for both (canonical JSON).
- If any value changes, hash MUST change.

---

## Case C6 — Ed25519 Signature Validity

### Steps
1. Generate an Ed25519 keypair
2. Sign a payload
3. Verify signature => MUST be true
4. Modify payload
5. Verify signature => MUST be false

---

## Case C7 — Signed Intent Validity

### Steps
1. Create an Intent
2. Sign it as a SignedIntent
3. Verify signature => MUST be true
4. Modify intent content
5. Verify signature => MUST be false

---

## Case C8 — Signed Claim Validity (incl. expiry)

### Steps
1. Create a Claim with issuer, subject, type
2. Sign it as a SignedClaim (ED25519)
3. Verify => MUST be true
4. Modify claim data => Verify MUST be false
5. Create an expired claim => Verify MUST be false (unless allowExpired=true)

---

## Case C9 — Claim Revocation and Trust Policy

### Steps
1. Create and sign a Claim
2. Verify claim => MUST be true
3. Create and sign a Revocation for the claim
4. Verify claim with revocation => MUST be false
5. Apply a trust policy that only accepts trusted issuers

---

## Case C10 — Governance (Signed Proposal + Signed Votes + Tally)

### Steps
1. Create a Proposal and sign it
2. Verify SignedProposal => MUST be true
3. Create multiple SignedVotes for the proposal
4. Verify votes and tally => totals MUST match expected
5. Tamper a vote => it MUST be ignored by tally

---

## Case C11 — Execution Contract (SignedIntent + Claims + Policy)

### Steps
1. Create a SignedIntent
2. Create a SignedClaim required for execution
3. Build an ExecutionContract requiring that claim type
4. Verify contract => MUST be allowed
5. Revoke the claim => verify MUST be denied
6. Violate intent constraints => verify MUST be denied

---

## Case C12 — Audited Execution & Replay Protection

### Steps
1. Execute a valid ExecutionContract
2. Receive a Signed Execution Receipt
3. Verify receipt => MUST be valid
4. Re-execute same contract => MUST be denied

---

## Case C13 — Accountability Graph (NodeRef + Edge validation)

### Steps
1. Create a SignedIntent and an ExecutionContract and an ExecutionReceipt
2. Create NodeRefs for each using deterministic hashes
3. Create edges: SignedIntent AUTHORIZES ExecutionContract; ExecutionContract PRODUCES ExecutionReceipt
4. Validate edges by recomputing hashes from the referenced objects => MUST be true
5. Tamper a referenced object => validation MUST be false

---

## Case C14 — Accountability Chain (linked hashes + signed links)

### Steps
1. Build two chain links: L1 (genesis) and L2 (references L1 hash)
2. Sign both links
3. Verify signatures => MUST be true
4. Tamper L1 edges => L2 prevLinkHash no longer matches => MUST be detected
5. ### Expected Properties
- Verifies chained causal links via `prevLinkHash`
- Any retroactive modification MUST invalidate the chain
- Demonstrates tamper-evident accountability

---

## Case C15 — Chain-of-Chains / Aggregation

### Steps
1. Build two independent chains and obtain their head hashes
2. Create a ChainAggregate referencing both head hashes (ordered list)
3. Sign the aggregate and verify signature => MUST be true
4. Reorder headHashes => signature MUST fail or hash MUST change (tamper detected)

---

## Case C16 — Temporal / Windowed Aggregation

### Steps
1. Create two chain heads (head hashes)
2. Create a WindowedChainAggregate with windowStart <= windowEnd
3. Sign and verify => MUST be true
4. Tamper by swapping windowStart/windowEnd (start > end) => MUST be rejected
5. Tamper by reordering headHashes => verification MUST fail
