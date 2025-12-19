# QKP Reference Flow

This document describes the canonical, executable reference flow of the
QuantumKey Protocol.

The Reference Flow is a **living specification**:
- It demonstrates the intended behavior of the protocol
- It is executable
- It is used for onboarding, audits, and regression testing

---

## 1. Purpose

The Reference Flow shows how:

- Intent is declared and signed
- Claims are issued
- Execution is authorized and recorded
- Accountability is chained
- Aggregation is performed
- Trust is evaluated
- Acceptance is attested

---

## 2. How to Run

From the root of the repository:

```bash
node examples/reference-flow.js
```

Requirements:

Node.js 18+ (Node 20 recommended)

No external dependencies

No network access



---

3. What You Will See

The script prints a structured log showing:

Key generation for agent, issuer, and auditor

SignedIntent creation and verification

SignedClaim creation and verification

ExecutionChainLink creation

Aggregation and signing

Trust policy evaluation

AcceptanceReceipt issuance



---

4. Normative Status

This flow is normative.

If behavior here changes, at least one of the following MUST be updated:

protocol-spec.md

conformance tests

Whitepaper Appendix B



---

5. Relation to Conformance

This flow exercises concepts validated by:

C1–C7 (Intent, Claim, Execution)

C13–C14 (Graphs and Chains)

C15–C18 (Aggregation)

C19–C20 (Trust and Attestation)


---
