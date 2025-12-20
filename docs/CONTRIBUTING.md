# CONTRIBUTING — QuantumKey Protocol (QKP)

This document defines how individuals and organizations can contribute to the QuantumKey Protocol in a structured, accountable, and verifiable way.

Contribution to QKP is not only about code.
It is about **intent, responsibility, and traceable impact**.

---

## Purpose

QuantumKey Protocol is designed to be extended by humans and intelligent systems without compromising semantic integrity, accountability, or trust separation.

This contributor model exists to ensure that:

- Contributions are intentional and traceable
- Responsibility is explicit
- Quality is enforced structurally, not socially
- Governance can emerge without centralization

---

## Contribution Principles

All contributions to QKP MUST respect the following principles:

- **Verifiability over authority**
- **Structure over interpretation**
- **Cryptography before policy**
- **Explicit intent over implicit behavior**
- **Accountability without gatekeeping**

If a contribution cannot be verified, reviewed, or attributed, it does not belong in QKP.

---

## Governance & Maintainer Model (Minimal, Non-Centralized)

QuantumKey Protocol does not rely on a fixed core team or permanent authorities.

Governance in QKP is **process-based, evidence-driven, and non-centralized**.

This repository follows a minimal governance model designed to preserve protocol integrity without introducing hierarchy, capture, or informal power structures.

### Maintainers

Maintainers are contributors who have demonstrated sustained, high-quality participation over time.

They are not appointed.
They **emerge** through consistent, verifiable contributions.

A maintainer is expected to:

- Review pull requests for structural correctness
- Ensure changes align with protocol invariants
- Protect semantic and cryptographic consistency
- Enforce contribution and conformance requirements
- Act transparently and document decisions

Maintainers do not have unilateral authority.
Their role is custodial, not political.

### Decision-Making

Decisions in this repository are guided by the following principles:

- **Evidence over opinion**
- **Conformance over preference**
- **Structure over authority**
- **Documentation over memory**

When disagreement occurs:

- Arguments must reference code, specification, or conformance behavior
- Decisions must be justified in writing
- Rejection is acceptable; silent overrides are not

If consensus cannot be reached, the default action is **to defer**, not to force a decision.

### Protocol Integrity

The QuantumKey Protocol is defined by:

- Canonical data structures
- Cryptographic validity
- Explicit causality
- Separation of verification and acceptance

Any change that alters protocol semantics, invariants, or trust separation MUST:

- Be accompanied by updated documentation
- Be reflected in conformance tests
- Preserve backward verifiability or explicitly document breaking changes

No individual or group may redefine protocol meaning unilaterally.

### Governance Scope

This governance model applies to:

- This repository
- Reference implementations
- Specifications and documentation

It does not claim authority over:

- External deployments
- Independent forks
- Downstream governance systems

Forking is not failure.
Forking is an explicit governance outcome.

### Evolution

This governance model is intentionally minimal.

As the ecosystem evolves, governance MAY evolve — but only through:

- Explicit proposals
- Documented rationale
- Verifiable agreement
- Transparent revision history

Governance changes must themselves be accountable.

---

## Contributor Roles

QKP defines contribution roles by **type of intent**, not status.

### 1. Reader

Anyone who explores, studies, or evaluates QKP.

Readers may:
- Run reference flows
- Review specifications
- Open discussions or questions
- Suggest clarifications

No approval required.

---

### 2. Contributor

Contributors propose changes or additions.

This includes:
- Code (protocol, SDK, examples)
- Specifications
- Documentation
- Tests and conformance cases
- Tooling or integrations

Contributors MUST:
- Open a pull request
- Clearly describe intent and scope
- Reference affected files or concepts
- Accept that contributions are reviewed, modified, or rejected

---

### 3. Maintainer

Maintainers are trusted to merge contributions.

Their responsibility is to:
- Preserve protocol integrity
- Enforce canonical definitions
- Ensure conformance coverage
- Reject changes that weaken accountability or semantics

Maintainers do not own the protocol.
They steward its structure.

---

### 4. Steward (Future Role)

Stewards are long-term custodians of the protocol’s direction.

This role is expected to emerge through:
- Proven contributions
- Community trust
- Transparent governance processes

Stewardship is not assigned.
It is earned and recorded.

---

## Contribution Lifecycle (PR → Review → Evidence → Merge)

QKP contributions follow a verifiable lifecycle that prioritizes evidence, intent, and accountability over authority or status.

This lifecycle ensures that every accepted change can be audited, reproduced, and justified independently.

### 1. Proposal (Pull Request)

Every contribution begins with a Pull Request (PR).

A valid PR MUST:
- Clearly state the **intent** of the change
- Reference the affected specification, code, or documentation
- Be atomic and reviewable

The PR description SHOULD answer:
- What is being changed?
- Why is this change necessary?
- Which protocol invariant or design principle it preserves or improves?

No contribution is accepted without an explicit intent declaration.

---

### 2. Review (Structural & Semantic)

Reviews focus on **structure and evidence**, not authority or personal preference.

Reviewers evaluate:
- Canonical correctness
- Structural consistency with existing primitives
- Preservation of accountability and verifiability
- Alignment with protocol design goals

A reviewer MAY request:
- Clarification of intent
- Additional test cases
- Reference to conformance coverage
- Explicit trade-off documentation

Approval is based on **what can be verified**, not who proposes the change.

---

### 3. Evidence (Executable or Referential)

Before merging, contributions SHOULD provide evidence.

Acceptable forms of evidence include:
- Executable examples
- Conformance tests
- Deterministic reference flows
- Explicit mapping to specification sections

For protocol-affecting changes, at least one of the following is REQUIRED:
- A new or updated conformance case
- A reference flow demonstrating the change
- A clear proof that existing invariants remain intact

Evidence is treated as a first-class artifact.

---

### 4. Merge (Accountable Acceptance)

A merge represents an **explicit acceptance decision**, not implicit approval.

By merging a PR, maintainers attest that:
- The contribution was reviewed
- The intent is understood
- The evidence is sufficient
- The change preserves protocol integrity

Merge decisions are reversible only through new, explicit contributions.

There are no silent changes.

---

### 5. Post-Merge Accountability

After merging:
- The change becomes part of the verifiable history
- Future contributors can reference it as precedent
- Any disagreement must be expressed as a new proposal

QKP does not erase decisions.
It records them.

---

### Lifecycle Invariant

At every stage, the following invariant must hold:

> No contribution is accepted without explicit intent, reviewable structure, and verifiable evidence.

This lifecycle replaces trust in maintainers with trust in process.


---

## Maintainer Rotation & Stewardship

QuantumKey Protocol does not assign permanent maintainers.

Stewardship is **time-bound**, **evidence-based**, and **revocable**.

There are no lifetime roles, no implicit authority, and no centralized ownership of the protocol.

All stewardship exists to preserve protocol integrity — not control.

---

### Stewardship Principles

Maintainers are expected to act as **protocol stewards**, not gatekeepers.

Stewardship is governed by the following principles:

- Evidence over reputation  
- Process over personality  
- Rotation over permanence  
- Accountability over authority  
- Transparency over discretion  

A maintainer is trusted only insofar as their actions remain verifiable and aligned with protocol principles.

---

### Becoming a Maintainer

A contributor may become a maintainer by demonstrating **sustained, verifiable contribution**, including:

- Multiple accepted contributions over time
- Consistent adherence to canonical structures
- Active participation in reviews and discussions
- Respect for protocol scope and non-goals
- Clear attribution of intent in all proposals

There is no automatic promotion.

Stewardship is **recognized**, not granted.

---

### Time-Bound Stewardship

Maintainer roles are **explicitly time-scoped**.

A maintainer serves for a defined period, after which stewardship must be reaffirmed or rotated.

This ensures:

- Fresh review perspectives
- Reduced concentration of influence
- Continuous protocol alignment
- Resistance to social capture

Rotation is considered a **healthy protocol behavior**, not a failure.

---

### Stewardship Responsibilities

Maintainers are responsible for:

- Reviewing pull requests for structural correctness
- Ensuring conformance tests remain valid
- Preserving canonical definitions and invariants
- Rejecting changes that introduce implicit behavior
- Documenting decisions with explicit reasoning

Maintainers MUST NOT:

- Introduce hidden state or discretionary rules
- Merge unverifiable or ambiguous changes
- Override process based on authority
- Act outside documented protocol scope

---

### Revocation & Rotation

Stewardship may be rotated or revoked if:

- Contributions repeatedly violate protocol principles
- Decisions lack verifiable justification
- Canonical invariants are weakened
- Process transparency is compromised
- Community trust is lost based on evidence

Revocation is a **procedural outcome**, not a punishment.

All decisions SHOULD be explainable, reviewable, and attributable.

---

### Final Note on Governance

QuantumKey Protocol governance is not hierarchical.

It is **procedural**.

Authority does not persist — **evidence does**.

Stewardship exists to protect the protocol, not to own it.

---

## Contribution Types

### Code Contributions

All code contributions MUST:
- Be deterministic
- Avoid hidden state
- Follow existing canonical patterns
- Include or update conformance tests when applicable

Breaking changes are not accepted outside explicit version upgrades.

---

### Specification Contributions

Specification changes MUST:
- Be explicit and minimal
- Preserve backward compatibility where possible
- Be reflected in conformance tests
- Avoid ambiguity or informal language

If a rule matters, it must be specifiable.

---

### Documentation Contributions

Documentation should:
- Explain intent, not just usage
- Reflect actual behavior
- Avoid marketing language
- Remain consistent with protocol reality

---

## Review Process

Every contribution follows the same process:

1. Proposal via pull request
2. Technical and semantic review
3. Conformance impact assessment
4. Merge, request changes, or rejection

Decisions are based on:
- Structural correctness
- Verifiability
- Alignment with protocol principles

Not on popularity or authority.

---

## What QKP Does Not Accept

The following are explicitly rejected:

- Undocumented behavior
- Implicit trust assumptions
- Centralized control mechanisms
- Hidden permissions or shortcuts
- Non-deterministic logic
- Speculative or financial hype

QKP is infrastructure, not narrative.

---

## Responsibility and Attribution

All contributions are attributable via Git history.

There is:
- No anonymous merge
- No silent modification
- No retroactive rewriting

Accountability applies to contributors and maintainers alike.

---

## Code of Conduct

QKP enforces a simple rule:

> Disagree structurally, not personally.

Critique ideas.
Challenge assumptions.
Respect contributors.

Abuse, coercion, or manipulation are incompatible with this project.

---

## Getting Started

If this is your first contribution:

1. Read `docs/START_HERE.md`
2. Run `examples/reference-flow.js`
3. Review `docs/protocol-spec.md`
4. Inspect `docs/conformance.md`
5. Open a small, focused pull request

Start with clarity.
Scale with evidence.

---

## Final Note

QuantumKey Protocol is not owned by any individual.
It is shaped by accountable contributions.

If you contribute, you become part of the protocol’s history — verifiably.

Welcome.
