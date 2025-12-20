# QuantumKey Protocol — v1.0 Protocol Freeze Declaration

**Status:** Active  
**Version:** v1.0  
**Date:** 2025  
**Repository:** qkp-sdk  
**Author:** Mihail Chiosa  
**Collaborative Intelligence:** Quantum Hammer

---

## Purpose

This document formally declares the **QuantumKey Protocol v1.0** as **frozen**.

“Frozen” means that the core protocol primitives, semantics, and invariants defined and validated in this release are **normative** and **must not change** outside an explicit major version upgrade.

This declaration exists to preserve protocol integrity, auditability, and long-term trust.

---

## Scope of the Freeze

The following components are considered **final and immutable** in v1.0:

- Canonical data structures and hashes
- Causal graph primitives (nodes, edges, chains)
- Accountability chains and aggregation semantics
- Windowed, hierarchical, and federated aggregation models
- Trust policy evaluation model
- Acceptance and attestation primitives
- Separation between:
  - Cryptographic validity
  - Policy evaluation
  - Trust attestation

These elements are defined by:

- `docs/protocol-spec.md`
- Executable conformance cases **C1–C20**
- Reference implementations under `src/`
- The executable reference flow `examples/reference-flow.js`

---

## Normative Conformance

Protocol correctness for v1.0 is defined by:

- All conformance cases **C1 through C20**
- Deterministic verification of canonical hashes
- Signature validation
- Tamper detection across chains and aggregates

Any implementation claiming compatibility with **QKP v1.0** MUST:

- Pass all conformance cases C1–C20
- Preserve canonical forms and ordering
- Respect aggregation and causality invariants

---

## What May Still Change

The following are **explicitly not frozen**:

- Documentation improvements
- Tooling and developer experience
- Indexing, storage, or visualization layers
- External integrations
- Governance processes and contributor workflows

These may evolve **without** affecting protocol validity.

---

## Versioning Rule

- **Patch versions (v1.0.x):**  
  Clarifications, documentation, tooling.  
  No semantic or structural changes.

- **Minor versions (v1.x):**  
  Additive features only, strictly non-breaking, opt-in.

- **Major versions (v2.0+):**  
  May modify protocol semantics, structures, or invariants.  
  Require explicit new freeze declaration.

---

## Governance Implication

No individual, maintainer, or organization may unilaterally modify frozen protocol semantics.

Protocol evolution is governed by:

- Explicit proposals
- Verifiable review
- Transparent discussion
- Versioned acceptance

Authority derives from **evidence**, not position.

---

## Statement

With this declaration, **QuantumKey Protocol v1.0** is formally frozen.

From this point forward, QKP is a **stable, auditable, and referenceable protocol** suitable for long-term use, independent verification, and external adoption.

---

**Trust is no longer implicit.  
It is preserved through structure.**
