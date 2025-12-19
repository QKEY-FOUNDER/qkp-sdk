# QKP Reference Flow — End-to-End Demonstration

This document explains how to run and understand the **QuantumKey Protocol (QKP) Reference Flow**.

The reference flow demonstrates, in a single execution, how QKP handles:
- Explicit intent
- Cryptographic execution
- Accountability chains
- Aggregation
- Trust policy evaluation
- Third-party attestation

No prior knowledge of the protocol is required.

---

## 1. What This Demonstrates

The reference flow executes the following lifecycle:
Intent → Execution Contract → Execution Receipt → Accountability Graph → Accountability Chain → Aggregation → Trust Policy Evaluation → Acceptance Receipt
Each step produces **verifiable artifacts** that are:
- Canonically serialized
- Cryptographically signed
- Tamper-evident
- Independently verifiable

---

## 2. How to Run

From the root of the repository, run:

```bash
node examples/reference-flow.js
```
This requires:

Node.js 18+ (Node 20 recommended)

No external dependencies

No network access



---

3. What You Will See

The script prints a structured log showing:

Key generation for agent, issuer, and auditor

SignedIntent creation and verification

SignedClaim creation and verification

ExecutionContract authorization

ExecutionReceipt creation

Accountability Graph edges

ChainLink hashing and signature

Chain aggregation and verification

Trust policy evaluation (accept / reject)

AcceptanceReceipt creation and verification


Each step explicitly reports whether cryptographic verification succeeded.


---

4. How to Read the Output

Key indicators to observe:

signature verifies: true
→ The object is cryptographically valid.

allowed: true
→ Execution passed authorization and policy checks.

accepted: true
→ A trust policy explicitly accepted the result.

AcceptanceReceipt verified: true
→ A third party attested the decision.


If any step fails, the script terminates with a clear error.


---

5. Why This Matters

Most systems rely on implicit trust:

Trusted logs

Trusted operators

Trusted auditors


QKP replaces this with explicit, verifiable accountability.

This reference flow shows that:

Trust is not assumed

Decisions are not hidden

Acceptance is recorded and attestable

History cannot be silently rewritten



---

6. Relationship to the Whitepaper

This reference flow corresponds directly to:

Whitepaper Section 4–9 (Core Architecture)

Appendix B — Technical Foundations

Conformance Cases C1–C20


The flow is intentionally minimal, but complete.


---

7. Next Steps

After running the reference flow, you may explore:

examples/conformance-* for automated verification

docs/WHITEPAPER.md for architectural rationale

docs/protocol-spec.md for normative definitions



---

Summary

The QKP Reference Flow demonstrates that:

> Trust is not a belief.
It is a verifiable process.



This script exists to make the protocol understandable in one afternoon.

---
