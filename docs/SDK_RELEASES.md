# SDK_RELEASES — QKP-SDK

Status: Active  
Repository: qkp-sdk  
Protocol Authority: quantumkey-protocol  
Author: Mihail Chiosa  
Collaborative Intelligence: Quantum Hammer  

## 0. Purpose

This document defines the release history and versioning rules of the **QKP-SDK**.

It explicitly separates:
- **Protocol Baseline versions** (normative, frozen)
- **SDK versions** (implementation, evolvable)

The SDK MUST track protocol baselines, but MUST NOT redefine them.

---

## 1. Versioning Model (SDK)

The SDK follows **semantic versioning**:

vMAJOR.MINOR.PATCH

Where:
- **MAJOR** = breaking changes in the SDK implementation
- **MINOR** = backward-compatible feature additions
- **PATCH** = fixes and internal improvements

SDK versions are **independent** from protocol baseline versions.

---

## 2. Protocol Baseline Targeting

Each SDK release MUST explicitly declare:

- which **Protocol Baseline** it implements
- whether coverage is **complete** or **partial**

Example:

> QKP-SDK v0.1.0 implements Protocol Baseline v0.1 (partial)

---

## 3. SDK Release History

### QKP-SDK v0.1.0

- **Release date:** 2026-01-01  
- **Target protocol baseline:** v0.1  
- **Coverage:** Partial (reference flow + conformance examples)

Implemented:
- Executable reference flow
- Conformance tests (C1–C20)
- Canonical artifact shapes (QIE, Semantic Signature, Acceptance Receipt)

Notes:
- This release serves as the initial executable reference for Protocol Baseline v0.1.
- Normative authority remains exclusively in the protocol repository.

---

## 4. Compatibility Guarantees

For SDK releases targeting the same protocol baseline:

- SDK updates MUST NOT reinterpret protocol semantics
- SDK updates MUST preserve auditability
- SDK updates MUST remain compatible with baseline artifacts

Breaking SDK changes:
- REQUIRE MAJOR version bump
- MUST NOT imply protocol changes

---

## 5. Relationship to Protocol Freeze

Protocol freezes are declared **only** in the protocol repository:

- `docs/PROTOCOL_FREEZE_v0.1.md`

The SDK MUST reference these freezes but MUST NOT duplicate or override them.

---

## 6. Mapping and Conformance

Conformance between SDK and protocol baseline is documented in:

- `docs/MAPPING_TO_PROTOCOL_BASELINE_V0.1.md`

An SDK release MAY claim baseline compliance only if:
- all MUST requirements are satisfied
- security invariants are preserved
- example parity is complete

---

## 7. Invalid Practices

The following are forbidden:

- Declaring a protocol freeze inside the SDK
- Using SDK version numbers as protocol versions
- Modifying protocol semantics via SDK updates
- Claiming compliance without explicit baseline reference

---

## 8. Final Statement

The protocol defines truth.  
The SDK demonstrates truth.

They evolve at different speeds — by design.
