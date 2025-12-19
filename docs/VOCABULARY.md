# QuantumKey Protocol — Canonical Vocabulary

This document defines the canonical vocabulary of the QuantumKey Protocol (QKP).
All terms listed here MUST be used consistently across specifications, code, examples, and documentation.

---

## Core Objects

**Intent**  
A declared purpose authored by a human or agent, prior to execution.

**SignedIntent**  
A cryptographically signed Intent.

---

**Claim**  
An assertion derived from an Intent or execution result.

**SignedClaim**  
A cryptographically signed Claim.

---

**ExecutionContract**  
A set of constraints and permissions governing execution.

---

**ExecutionReceipt**  
A verifiable record of an execution outcome.

---

## Accountability Structures

**AccountabilityGraph**  
A directed graph of NodeRefs and Edges describing causal relationships.

---

**AccountabilityChain**  
An ordered sequence of signed chain links forming a tamper-evident history.

---

**ChainLink**  
A single link in an AccountabilityChain, referencing prior state via hash.

---

## Aggregation Layers

**ChainAggregate**  
An object that references multiple AccountabilityChain head hashes.

---

**SignedChainAggregate**  
A signed ChainAggregate.

---

**WindowedChainAggregate**  
A ChainAggregate constrained to a defined time window.

---

**HierarchicalAggregate**  
An aggregate composed of lower-level aggregates (recursive aggregation).

---

**FederatedAggregate**  
An aggregate produced across trust domains.

---

## Trust & Policy

**TrustPolicy**  
A set of acceptance rules applied after cryptographic verification.

---

**AcceptanceReceipt**  
A signed attestation recording an ACCEPT or REJECT decision.

---

**AttestedTrust**  
Trust established via third-party AcceptanceReceipts.

---

## Cryptographic Concepts

**Canonical Form**  
A deterministic serialization used for hashing and signing.

---

**Semantic Drift**  
Deviation between declared intent and observed execution or meaning.

---

## Status Keywords

The following keywords are reserved and MUST be used verbatim:

- `ACCEPT`
- `REJECT`

---

This vocabulary is normative.
Any deviation MUST be treated as a breaking semantic change.
