# SDK_CONFORMANCE — QKP-SDK

Status: Declarative  
SDK Repository: qkp-sdk  
Target Protocol Baseline: v0.1 (Frozen)  
Protocol Authority: quantumkey-protocol  
Author: Mihail Chiosa  
Collaborative Intelligence: Quantum Hammer  

## 0. Purpose

This document declares the conformance status of the **QKP-SDK** with respect to the
authoritative **QuantumKey Protocol (QKP) Baseline v0.1**.

It provides a clear, auditable statement of:
- what the SDK claims to implement
- under which conditions the claim is valid
- where verification evidence can be found

This document does not redefine protocol semantics.

---

## 1. Protocol Authority

The normative authority for Protocol Baseline v0.1 is defined exclusively in the
protocol repository:

- `qkey-founder/quantumkey-protocol`

Specifically:
- `docs/BASELINE_V0.1.md`
- `docs/PROTOCOL_FREEZE_v0.1.md`
- `docs/VERSIONING.md`
- `CHANGELOG.md`

The SDK implements and demonstrates this authority.

---

## 2. Conformance Claim

The QKP-SDK MAY declare:

> “QKP-SDK implements QuantumKey Protocol Baseline v0.1”

only if all conditions in this document are satisfied.

This claim applies to:
- SDK versions explicitly targeting Baseline v0.1
- No other protocol baselines

---

## 3. Scope of Conformance

The conformance claim covers:

- Quantum Intent Envelope (QIE)
- Semantic Signature
- Acceptance Receipt
- Reference Flow
- Security invariants enforcement
- Audit replay capability

The claim does NOT cover:
- execution or enforcement
- governance or consensus
- legal or ethical authority
- human uniqueness

---

## 4. Evidence of Conformance

Evidence for conformance is provided by:

- Mapping document  
  `docs/MAPPING_TO_PROTOCOL_BASELINE_V0.1.md`

- Executable reference flow  
  `examples/reference-flow.js`

- Conformance tests  
  `examples/conformance-c1.js` … `examples/conformance-c20.js`

- Normative example parity  
  - `QIE_EXAMPLE.md`
  - `SEMANTIC_SIGNATURE_EXAMPLE.md`
  - `ACCEPTANCE_RECEIPT_EXAMPLE.md`
  - `END_TO_END_FLOW_EXAMPLE.md`

All evidence MUST be inspectable without privileged access.

---

## 5. Conditions for Valid Claim

The conformance claim is valid only if:

- All MUST requirements from `CONFORMANCE_MATRIX_v0.1.md` are satisfied  
- All SECURITY_INVARIANTS_v0.1 are enforced or tested  
- Example parity checks are complete  
- No protocol semantics are reinterpreted in the SDK  

If any condition is violated, the claim MUST be withdrawn or updated.

---

## 6. Partial or Conditional Conformance

If the SDK implements only part of Baseline v0.1:

- The claim MUST explicitly state **partial conformance**
- Missing components MUST be listed
- No implicit completeness claim is allowed

---

## 7. Version Relationship

SDK version numbers:
- follow semantic versioning
- are independent from protocol baseline versions

Each SDK release MUST declare:
- the protocol baseline it targets
- whether coverage is complete or partial

---

## 8. Change Control

Changes to SDK implementation:
- MUST NOT modify protocol semantics
- MUST be reflected in the mapping document
- MAY require updating this conformance declaration

Protocol baseline changes are controlled only by the protocol repository.

---

## 9. Final Statement

This document exists to prevent ambiguity.

The protocol defines truth.  
The SDK demonstrates truth.  
Conformance makes the relationship explicit.
