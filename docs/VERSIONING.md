# QuantumKey Protocol — Versioning & Evolution Rules

**Status:** Active  
**Initial Version:** v1.0  
**Repository:** qkp-sdk  
**Date:** 2025

---

## Purpose

This document defines how the QuantumKey Protocol evolves over time while preserving
verifiability, auditability, and long-term protocol integrity.

Versioning in QKP is not cosmetic.
It is a structural guarantee.

---

## Versioning Model

QKP follows a strict semantic versioning model:

- **Major:** vX.0
- **Minor:** vX.Y
- **Patch:** vX.Y.Z

Each level has explicit rules and boundaries.

---

## Patch Versions (v1.0.x)

Patch versions are reserved for:

- Documentation clarifications
- Editorial improvements
- Tooling enhancements
- Non-semantic refactoring
- Performance improvements without behavioral change

Patch versions MUST NOT:
- Change protocol semantics
- Modify canonical data structures
- Alter conformance expectations

Patch updates preserve full backward compatibility.

---

## Minor Versions (v1.x)

Minor versions may introduce **additive, optional extensions**.

Examples include:
- New conformance cases
- New aggregation patterns (opt-in)
- Additional tooling or helper modules
- New reference flows

Minor versions MUST:
- Preserve all v1.0 semantics
- Keep C1–C20 fully valid
- Never invalidate existing evidence

Minor versions are backward compatible by definition.

---

## Major Versions (v2.0 and beyond)

Major versions may introduce:

- Changes to protocol semantics
- New canonical structures
- Modified invariants
- Breaking changes

Major version upgrades REQUIRE:
- A new protocol freeze declaration
- A new governance snapshot
- Explicit migration documentation
- Clear separation from prior versions

Major versions do not overwrite history.
They coexist with prior protocol versions.

---

## Backward Verifiability

One of QKP’s core guarantees is **backward verifiability**.

Evidence generated under v1.0 MUST remain:
- Verifiable
- Interpretable
- Auditable

Future versions may extend interpretation,
but MUST NOT invalidate historical truth.

---

## Deprecation Policy

Deprecation in QKP is explicit and documented.

A deprecated feature:
- Remains verifiable
- Remains interpretable
- Is clearly marked
- Is never silently removed

Silent deprecation is not allowed.

---

## Relationship to Governance

Versioning rules override governance preferences.

No governance process may:
- Force a breaking change into a minor or patch version
- Redefine version boundaries
- Alter frozen semantics without a major release

Protocol evolution is governed by structure, not urgency.

---

## Final Statement

QuantumKey Protocol evolves deliberately.

Time is treated as a first-class dimension of accountability.

Versions do not erase meaning.
They preserve it.

---
