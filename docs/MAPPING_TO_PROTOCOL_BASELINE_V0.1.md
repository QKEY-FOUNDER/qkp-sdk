# MAPPING_TO_PROTOCOL_BASELINE_V0.1 — QKP-SDK

Status: Active  
Target Protocol Baseline: v0.1 (Frozen)  
SDK Repository: qkp-sdk  
Protocol Authority Repository: quantumkey-protocol  
Author: Mihail Chiosa  
Collaborative Intelligence: Quantum Hammer  

## 0. Purpose

This document maps the QKP-SDK implementation to the **authoritative** protocol definition:
QuantumKey Protocol (QKP) **Baseline v0.1**.

It proves:
- what is implemented
- where it is implemented
- how it is verified
- what remains missing or partial

This is the canonical bridge between:
- protocol truth (normative documents)
- executable proof (SDK)

---

## 1. Authority and Non-Duplication Rule

The protocol’s normative authority for Baseline v0.1 is defined in the protocol repository:

- docs/BASELINE_V0.1.md  
- docs/PROTOCOL_FREEZE_v0.1.md  
- docs/VERSIONING.md  
- CHANGELOG.md  

The SDK MUST NOT redefine protocol truth.
The SDK MUST implement and demonstrate it.

---

## 2. Terminology Alignment (QIE)

QIE in Baseline v0.1 means:

- QIE = Quantum Intent Envelope

If the SDK historically uses “Interchange Envelope”, it MUST be treated as an alias
for the same baseline artifact, not a different concept.

---

## 3. Normative Documents → SDK Mapping

### 3.1 THREAT_MODEL_v0.1.md → SDK Coverage

Document:
- docs/THREAT_MODEL_v0.1.md

SDK Implementation Targets:
- (fill) src/…/validate.ts (replay protection, TTL checks)
- (fill) src/…/canonicalize.ts (canonicalization determinism)
- (fill) src/…/crypto/verify.ts (signature verification)
- (fill) src/…/audit/verifyFlow.ts (end-to-end verification)

SDK Proof:
- (fill) tests/… or examples/conformance-c*.js references

Status:
- [ ] Implemented
- [ ] Partial
- [ ] Missing

Notes:
- (fill)

---

### 3.2 QIE_MINIMAL_PROFILE_v0.1.md → SDK Coverage

Document:
- docs/QIE_MINIMAL_PROFILE_v0.1.md

Mandatory Fields MUST exist in SDK QIE object:
- qie_version
- intent_id
- created_at
- expires_at
- nonce
- issuer_did
- issuer_type
- intent_type
- intent_payload
- semantic_hash
- execution_mode
- context_id
- signature
- signature_scheme
- public_key_reference

SDK Implementation Targets:
- (fill) src/…/QIE.ts or equivalent
- (fill) src/…/canonicalize.ts
- (fill) src/…/validate.ts
- (fill) src/…/crypto/sign.ts
- (fill) src/…/crypto/verify.ts
- (fill) src/…/crypto/hash.ts

SDK Proof:
- (fill) examples/reference-flow.js
- (fill) conformance tests: conformance-c?.js

Status:
- [ ] Implemented
- [ ] Partial
- [ ] Missing

Notes:
- (fill)

---

### 3.3 SEMANTIC_SIGNATURE_v0.1.md → SDK Coverage

Document:
- docs/SEMANTIC_SIGNATURE_v0.1.md

Semantic Signature MUST include:
- semantic_signature_id
- intent_id
- semantic_hash
- validator_id
- validator_version
- policy_id
- evaluation_result
- confidence_score
- evidence_bundle
- issued_at
- expires_at
- signature
- signature_scheme

SDK Implementation Targets:
- (fill) src/…/SemanticSignature.ts
- (fill) src/…/semantic/evaluate.ts
- (fill) src/…/policy/load.ts
- (fill) src/…/crypto/sign.ts
- (fill) src/…/crypto/verify.ts

SDK Proof:
- (fill) examples/semantic.example.ts or conformance-c?.js

Status:
- [ ] Implemented
- [ ] Partial
- [ ] Missing

Notes:
- (fill)

---

### 3.4 ACCEPTANCE_RECEIPT_v0.1.md → SDK Coverage

Document:
- docs/ACCEPTANCE_RECEIPT_v0.1.md

Acceptance Receipt MUST include:
- receipt_id
- intent_id
- semantic_hash
- issuer_did
- issuer_role
- policy_id
- decision
- decision_reason
- referenced_semantic_signatures
- execution_mode
- issued_at
- expires_at
- signature
- signature_scheme

SDK Implementation Targets:
- (fill) src/…/AcceptanceReceipt.ts
- (fill) src/…/receipt/issue.ts
- (fill) src/…/policy/load.ts
- (fill) src/…/crypto/sign.ts
- (fill) src/…/crypto/verify.ts

SDK Proof:
- (fill) examples/receipt.example.ts or conformance-c?.js

Status:
- [ ] Implemented
- [ ] Partial
- [ ] Missing

Notes:
- (fill)

---

### 3.5 REFERENCE_FLOW_v0.1.md → SDK Coverage

Document:
- docs/REFERENCE_FLOW_v0.1.md

Reference Flow MUST include:
1. Create QIE
2. Semantic Evaluation
3. Acceptance Receipt
4. Execution gating by mode
5. Audit verification

SDK Implementation Targets:
- (fill) examples/reference-flow.js (or equivalent)
- (fill) src/…/audit/verifyFlow.ts

SDK Proof:
- (fill) tests/flow.test.ts or conformance-c?.js

Status:
- [ ] Implemented
- [ ] Partial
- [ ] Missing

Notes:
- (fill)

---

### 3.6 CONFORMANCE_MATRIX_v0.1.md → SDK Coverage

Document:
- docs/CONFORMANCE_MATRIX_v0.1.md

Mapping Rule:
Each MUST requirement MUST map to at least one:
- conformance test (C#)
- or explicit test in tests/

SDK Implementation Targets:
- (fill) examples/conformance-c1.js … examples/conformance-c20.js
- (fill) tests/*.test.ts

Status:
- [ ] Implemented
- [ ] Partial
- [ ] Missing

Notes:
- (fill)

---

### 3.7 SECURITY_INVARIANTS_v0.1.md → SDK Coverage

Document:
- docs/SECURITY_INVARIANTS_v0.1.md

Invariants MUST be enforced by validation + tests.

Minimum required enforcement points:
- INV-01 Intent immutability → semantic_hash + signature invalidation on change
- INV-03/04 Temporal + replay → TTL + nonce uniqueness
- INV-09 Mode integrity → forbid non-STRICT receipts authorizing STRICT execution
- INV-11 Causal chain integrity → parent references validated when present

SDK Implementation Targets:
- (fill) src/…/validate.ts
- (fill) src/…/audit/verifyFlow.ts
- (fill) conformance tests covering invariants

Status:
- [ ] Implemented
- [ ] Partial
- [ ] Missing

Notes:
- (fill)

---

## 4. Example Parity (Normative Examples vs SDK Output)

Normative examples in protocol repository:
- examples/QIE_EXAMPLE.md
- examples/SEMANTIC_SIGNATURE_EXAMPLE.md
- examples/ACCEPTANCE_RECEIPT_EXAMPLE.md
- examples/END_TO_END_FLOW_EXAMPLE.md

SDK MUST be able to generate artifacts that match these example shapes.

Parity Checklist:
- [ ] QIE output matches required fields and naming
- [ ] Semantic Signature output matches required fields and naming
- [ ] Acceptance Receipt output matches required fields and naming
- [ ] End-to-end audit replay passes

Notes:
- (fill)

---

## 5. Gaps and Planned Work

List any known gaps discovered during mapping:

- Gap:
  - Description:
  - Impact:
  - Planned fix:
  - Target SDK version:

(add more as needed)

---

## 6. Conformance Statement (SDK)

The SDK may declare:

"QKP-SDK implements Protocol Baseline v0.1"

only if:
- all MUST requirements from CONFORMANCE_MATRIX_v0.1.md are satisfied
- all SECURITY_INVARIANTS_v0.1 are preserved
- parity checklist (Section 4) is complete

---

## 7. Change Control

Changes to this mapping document MUST be tracked in qkp-sdk changes.

Protocol baseline changes are controlled only by the protocol repository (not this SDK).

History does not change.
Implementations evolve.

---
