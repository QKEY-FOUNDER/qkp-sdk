# START HERE — QuantumKey Protocol (QKP)

**QKP is a protocol for verifiable accountability across autonomous and federated systems.**

This repository contains the reference implementation, specifications, and executable conformance flows of the QuantumKey Protocol.

If this is your first contact with QKP, start here.

---

## Why QKP exists

Modern digital systems increasingly rely on:

- Autonomous and semi-autonomous agents  
- Cross-organization execution  
- Federated coordination  
- AI-driven actions with real-world impact  

Yet accountability does **not** scale in these environments.

Most systems still depend on:
- Implicit trust  
- Mutable logs  
- Centralized auditors  
- Post-hoc explanations  

These approaches fail under automation, delegation, federation, and adversarial conditions.

**QKP replaces trust assumptions with cryptographic evidence.**

---

## What problem QKP solves

QKP introduces a verifiable structure for:

- Intent declaration  
- Authorization  
- Execution  
- Causality  
- Aggregation  
- Trust evaluation  
- Third-party attestation  

All without requiring:
- A blockchain  
- A central authority  
- A consensus network  
- A global trust model  

Trust is no longer assumed.  
It is demonstrated.

---

## What QKP is (and is not)

### QKP is:
- A protocol for **verifiable accountability**
- Cryptographically auditable by construction
- Designed for autonomous, federated, and multi-agent systems
- Policy-agnostic (acceptance is always a local decision)

### QKP is not:
- A blockchain
- A financial network
- A DAO framework
- A consensus mechanism
- An AI model

QKP can integrate *with* those systems — it does not replace them.

---

## Repository structure (how to navigate)

The QKP repository is intentionally structured to reflect the protocol’s separation of concerns.
Each directory corresponds to a distinct layer of accountability.

### Core protocol primitives

The heart of QKP lives in the `src/` directory.

- `src/graph/`  
  Canonical accountability structures: causal graphs, chains, and aggregation layers  
  (temporal, hierarchical, federated).

- `src/crypto/`  
  Canonicalization, hashing, and signature utilities.  
  Everything that defines cryptographic truth lives here.

- `src/policy/`  
  Trust evaluation and attestation logic.  
  This layer decides *whether* verified structures are accepted — never *what* is true.

These directories define the **normative behavior** of the protocol.

---

### Executable reference flows

QKP is designed to be understood by running it.

- `examples/reference-flow.js`  
  A complete, executable end-to-end protocol flow.  
  This is the fastest way to understand how all primitives compose.

- `examples/REFERENCE_FLOW.md`  
  A human-readable, annotated walkthrough of the reference flow.  
  Explains *why* each step exists, not just *what* happens.

Together, these form a **living specification**.

---

### Conformance and correctness

Protocol correctness is enforced through executable tests.

- `examples/conformance-c*.js`  
  Conformance cases C1–C20, covering every core protocol invariant.

- `docs/conformance.md`  
  The conformance matrix mapping protocol concepts to tests and reference code.

Nothing in QKP is “assumed correct” — it is proven by execution.

---

### Formal documentation

For deeper study and external reference:

- `docs/protocol-spec.md`  
  Normative protocol specification.

- `docs/WHITEPAPER.md`  
  Conceptual, architectural, and philosophical vision of QKP.

These documents explain *what the protocol is* and *why it exists*.

---

In short:

- **Want to see QKP work?** Run the reference flow.  
- **Want to verify correctness?** Inspect conformance tests.  
- **Want to understand design intent?** Read the whitepaper and spec.


---

## Quick start (recommended)

Run the executable reference flow to see the protocol end-to-end:

```bash
node examples/reference-flow.js
```
This script demonstrates:

- Key generation  
- SignedIntent creation  
- Claims and authorization  
- Execution contracts and receipts  
- Accountability chains  
- Aggregation (temporal, hierarchical, federated)  
- Trust policy evaluation  
- Third-party acceptance receipts  

Requirements:

- Node.js 18+ (Node 20 recommended)  
- No external dependencies  
- No network access  

---

## Canonical entry points (choose your path)

### 👩‍💻 Engineers

If you want to understand **how QKP works in practice**:

**Run the executable reference flow**
```bash
node examples/reference-flow.js
```

---

## Annotated walkthrough & core primitives

Read the annotated walkthrough  
examples/REFERENCE_FLOW.md

Explore the core primitives  
src/graph/  
src/identity/  
src/policy/

The reference flow is a **living, executable specification** of the protocol.

---

## 🧠 Researchers & Architects

If you want to understand **why QKP exists and how it is designed**:

Read the whitepaper  
docs/WHITEPAPER.md

Study the protocol specification  
docs/protocol-spec.md

Review the technical cross-reference map  
Appendix B (WHITEPAPER.md)

---

## 🛡️ Auditors & Governance Designers

If you want to understand **verifiability and trust separation**:

Review conformance coverage  
docs/conformance.md

Inspect the acceptance and attestation layer  
src/policy/  
examples/conformance-c19.js  
examples/conformance-c20.js

---

## Design principles

Verifiability over trust  
Structure over interpretation  
Cryptography before policy  
Auditability without surveillance  
Federation without centralization  

QKP does not decide what should be trusted.  
It provides the evidence required to decide whether something can be trusted.

---

## Status

Core protocol primitives (C1–C20): implemented and validated  
Conformance: passing  
Specification: stable (v0.1.0)

Current focus:

Tooling  
Integrations  
Governance experiments  
Ecosystem adoption  

---

## Authorship

Author: Mihail Chiosa  
Collaborative Intelligence: Quantum Hammer  
Year: 2025  

If you are evaluating QKP for integration, research, or governance design, this repository is intentionally designed to be **readable, testable, and forkable**.
