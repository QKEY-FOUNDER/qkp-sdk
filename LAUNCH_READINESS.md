# LAUNCH_READINESS — QuantumKey Protocol (QKP)

Status: Checklist  
Target: Public, Academic, and Partner Launch  
Author: Mihail Chiosa  
Collaborative Intelligence: Quantum Hammer  

## 0. Purpose

This document defines the launch readiness checklist for the QuantumKey Protocol (QKP)
and its reference SDK (QKP-SDK).

Its purpose is to ensure that:
- protocol authority is unambiguous
- documentation is coherent and complete
- implementation claims are auditable
- no semantic or versioning ambiguity remains

This is a **verification checklist**, not a marketing document.

---

## 1. Protocol Authority (Normative)

- [ ] Protocol authority repository is public and accessible  
- [ ] Baseline v0.1 is defined in `docs/BASELINE_V0.1.md`  
- [ ] Protocol freeze is declared in `docs/PROTOCOL_FREEZE_v0.1.md`  
- [ ] Freeze date is explicit and immutable  
- [ ] Versioning rules exist in `docs/VERSIONING.md`  
- [ ] Change history exists in `CHANGELOG.md`  

---

## 2. Normative Specification Completeness

- [ ] Threat model documented (`THREAT_MODEL_v0.1.md`)  
- [ ] QIE minimal profile defined (`QIE_MINIMAL_PROFILE_v0.1.md`)  
- [ ] Semantic Signature defined (`SEMANTIC_SIGNATURE_v0.1.md`)  
- [ ] Acceptance Receipt defined (`ACCEPTANCE_RECEIPT_v0.1.md`)  
- [ ] Reference flow defined (`REFERENCE_FLOW_v0.1.md`)  
- [ ] Security invariants defined (`SECURITY_INVARIANTS_v0.1.md`)  
- [ ] Conformance matrix defined (`CONFORMANCE_MATRIX_v0.1.md`)  
- [ ] Canonical glossary present (`GLOSSARY.md`)  

---

## 3. Examples and Auditability

- [ ] Normative examples exist for all core artifacts  
  - QIE  
  - Semantic Signature  
  - Acceptance Receipt  
  - End-to-end flow  

- [ ] Examples are internally consistent  
- [ ] Examples are copy-paste safe  
- [ ] Examples do not include enforcement or execution  

---

## 4. SDK Authority and Separation

- [ ] SDK lives in a separate repository  
- [ ] SDK README declares protocol authority explicitly  
- [ ] SDK does NOT redefine protocol semantics  
- [ ] SDK does NOT declare protocol freeze  

---

## 5. SDK ↔ Protocol Mapping

- [ ] Mapping document exists  
  (`qkp-sdk/docs/MAPPING_TO_PROTOCOL_BASELINE_V0.1.md`)  

- [ ] Mapping lists implemented, partial, and missing components  
- [ ] Mapping references real SDK paths and tests  
- [ ] Terminology alignment is resolved (QIE naming)  

---

## 6. SDK Conformance Declaration

- [ ] `SDK_CONFORMANCE.md` exists  
- [ ] Conformance claim is conditional and auditable  
- [ ] Evidence paths are explicitly listed  
- [ ] Partial conformance (if any) is declared honestly  

---

## 7. Versioning and Release Hygiene

- [ ] Protocol versioning is independent from SDK versioning  
- [ ] SDK releases are tracked in `SDK_RELEASES.md`  
- [ ] No SDK file claims protocol authority  
- [ ] No duplicated “freeze” declarations exist  

---

## 8. Public Communication Safety

- [ ] README does not overclaim version maturity  
- [ ] No mention of future baselines as current  
- [ ] No ambiguous use of “v1.0” for protocol  
- [ ] Claims are aligned with frozen Baseline v0.1  

---

## 9. External Audit Readiness

An external reviewer can:

- [ ] Identify the authoritative protocol source  
- [ ] Verify baseline freeze and scope  
- [ ] Trace SDK implementation to protocol requirements  
- [ ] Reproduce example flows  
- [ ] Understand non-goals and limitations  

---

## 10. Launch Decision

Launch readiness is achieved when:

- All applicable checklist items above are checked  
- No unresolved authority or versioning conflicts remain  

---

## 11. Final Statement

This checklist exists to prevent premature or misleading launches.

When this document is satisfied:
- the protocol is stable
- the implementation is honest
- adoption is safe

Launch follows truth — not hype.
