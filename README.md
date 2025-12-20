✅ QKP-SDK — QuantumKey Protocol Software Development Kit

# QuantumKey Protocol (QKP)

**QKP is a protocol for verifiable accountability across autonomous and federated systems.**

If you are an engineer, QKP gives you a deterministic and verifiable way to reason about intent, execution, and accountability in autonomous and federated systems.

QKP does not rely on trusted logs, implicit permissions, or post-hoc explanations.  
Every action is bound to declared intent, causally linked to execution, and verifiable end-to-end.

The fastest way to understand QKP is to run the executable reference flow:

node examples/reference-flow.js

This reference flow demonstrates, in a single execution:

- How intent is declared and signed  
- How authorization is evaluated  
- How execution produces verifiable receipts  
- How accountability chains are constructed  
- How aggregation preserves meaning  
- How trust policies are applied  
- How acceptance or rejection is attested  

The reference flow is a **living, executable specification** of the protocol.

If you can run this flow and understand its output, you understand the core of QKP.


---

**QuantumKey Protocol provides a cryptographically verifiable structure for intent, execution, governance, and trust evaluation — without requiring centralized control.

QKP is designed for:
- Autonomous agents
- Federated systems
- Cross-organization execution
- AI-driven decision-making
- Auditable governance

---

## What QKP does

QKP enables systems to:
- Declare intent
- Authorize actions
- Execute contracts
- Record accountability
- Aggregate execution evidence
- Evaluate trust policies
- Produce signed third-party acceptance receipts

All steps are **cryptographically verifiable** and **independently auditable**.

---

## What QKP is not

- Not a blockchain
- Not a financial network
- Not a consensus protocol
- Not an AI model

QKP can integrate with those systems, but does not replace them.

---

## Quick start

Run the reference flow to see the full protocol lifecycle:

```bash
node examples/reference-flow.js
```

Requirements

Node.js 18+ (Node 20 recommended)

No external dependencies

No network access



---

Where to start reading

👉 START HERE: docs/START_HERE.md

📘 Reference Flow: examples/REFERENCE_FLOW.md

📐 Protocol Specification: docs/protocol-spec.md

🧪 Conformance Tests: docs/conformance.md

📄 Whitepaper: docs/WHITEPAPER.md



---

Design principles

Verifiability over trust

Cryptography before policy

Structure over interpretation

Federation without centralization

Accountability without surveillance



---

Status

Core protocol features (C1–C20) are implemented and validated through executable conformance tests.


---

Authorship

Author: Mihail Chiosa
Collaborative Intelligence: Quantum Hammer
Year: 2025

---


[![QKP Conformance](https://github.com/QKEY-FOUNDER/qkp-sdk/actions/workflows/conformance.yml/badge.svg)](https://github.com/QKEY-FOUNDER/qkp-sdk/actions/workflows/conformance.yml)

> **Status:** Stable Protocol — v0.1.0  
> This release freezes all core primitives and semantics defined in the QuantumKey Protocol.

**Latest release:** [v0.1.0](https://github.com/QKEY-FOUNDER/qkp-sdk/releases/tag/v0.1.0)

A foundational toolkit for building with Intent, Identity, Semantic Agents and Alignment Primitives.


---

🌐 Overview

The QuantumKey Protocol (QKP) provides a unified digital architecture where:

Intent becomes a verifiable digital primitive

Identity is modeled as continuity rather than merely cryptographic keys

Agents (human or machine) operate through structured semantic exchanges

Alignment is not an afterthought — it’s built into the messaging fabric

Information flows through purpose-driven structures instead of raw data


The QKP-SDK is the first implementation scaffold — a developer-ready skeleton containing:
✔ Reference modules
✔ Message formats
✔ Identity primitives
✔ Intent validation
✔ Alignment placeholders
✔ QIE (QuantumKey Interchange Envelope) examples

This SDK does not yet implement the full cryptographic engine — it provides the conceptual runtime and development interface.


---

📘 Canonical terminology is defined in [docs/VOCABULARY.md](docs/VOCABULARY.md).

---

📦 Installation

Option A — Browser / CDN (experimental)

<script src="https://unpkg.com/qkp-sdk"></script>

Option B — Node / npm

npm install qkp-sdk

Option C — Manual import

Clone the repo and import modules locally.

---

## SDK Structure (Canonical)

The QKP SDK is organized around **explicit accountability primitives**, grouped by semantic responsibility rather than technical convenience.

This structure is designed to be:
- Navigable by intent
- Auditable by construction
- Extensible without central coordination

### High-level layout

qkp-sdk/ ├── src/ │   ├── graph/                     # Accountability graphs, chains, aggregation │   │   ├── node.js │   │   ├── edge.js │   │   ├── chain.js │   │   ├── signed-chain.js │   │   ├── aggregate.js │   │   ├── windowed-aggregate.js │   │   ├── hier-aggregate.js │   │   ├── federated-aggregate.js │   │   ├── validate.js │   │   └── index.js │   │ │   ├── identity/                  # Identity primitives (HID, AID, CID, SID) │   │   └── index.js │   │ │   ├── intent/                    # Intent declaration and signing │   │   ├── signed-intent.js │   │   └── index.js │   │ │   ├── claims/                    # Claims, revocations, verification │   │   ├── claim.js │   │   ├── signed-claim.js │   │   ├── revocation.js │   │   ├── signed-revocation.js │   │   ├── verify-claim.js │   │   └── index.js │   │ │   ├── execution/                 # Execution contracts and receipts │   │   ├── contract.js │   │   ├── execute.js │   │   ├── receipt.js │   │   ├── signed-receipt.js │   │   ├── replay.js │   │   ├── verify.js │   │   └── index.js │   │ │   ├── policy/                    # Trust evaluation and attestation │   │   ├── evaluate.js │   │   ├── attestation.js │   │   └── index.js │   │ │   ├── governance/                # Proposals, votes, tallies │   │   ├── proposal.js │   │   ├── signed-proposal.js │   │   ├── vote.js │   │   ├── signed-vote.js │   │   ├── tally.js │   │   └── index.js │   │ │   ├── alignment/                 # Alignment & semantic scoring (extensible) │   │   └── index.js │   │ │   ├── crypto/                    # Canonicalization, hashing, signatures │   │   ├── canonical.js │   │   ├── sha256.js │   │   ├── ed25519.js │   │   ├── signed.js │   │   ├── signed-ed25519.js │   │   └── index.js │   │ │   ├── utils/                     # Shared helpers │   │   └── index.js │   │ │   └── index.js                   # SDK entry point │ ├── examples/ │   ├── reference-flow.js          # Executable end-to-end protocol flow │   ├── REFERENCE_FLOW.md          # Annotated walkthrough │   ├── conformance-c*.js          # Conformance tests (C1–C20) │   └── README.md │ ├── docs/ │   ├── START_HERE.md │   ├── CANONICAL_STATEMENT.md │   ├── PROTOCOL_FREEZE_v1.0.md │   ├── GOVERNANCE_SNAPSHOT_v1.0.md │   ├── LAUNCH_READINESS.md │   ├── VERSIONING.md │   └── CONTRIBUTING.md │ ├── package.json ├── LICENSE └── README.md


### Design note

The SDK mirrors the protocol’s core principle:

> **Nothing is implicit. Everything is attributable, verifiable, and composable.**

If you can navigate this structure, you can reason about QKP.


---

🔑 Core Modules

1. Identity (src/identity/)

Implements symbolic and cryptographic identity primitives.
Models “self” as a continuum, not a pair of keys.

Includes:

createIdentity()

deriveSymbolicHash()

exportIdentity()



---

2. Intent (src/intent/)

The heart of the QuantumKey Protocol.
Allows applications to encode and validate user or agent intent.

Includes:

normalizeIntent()

validateIntentShape()

signIntent() (stub)



---

3. QIE — QuantumKey Interchange Envelope (src/qie/)

A universal container for transmitting meaning-aligned messages.

Includes:

createEnvelope()

verifyEnvelope()

attachIntent()



---

4. Alignment Engine (src/alignment/)

A placeholder for future development of alignment scoring and consensus.

Includes:

evaluateAlignment()

alignmentVector()



---

🧪 Quick Usage Example

import { createIdentity } from "qkp-sdk/identity";
import { createEnvelope } from "qkp-sdk/qie";
import { normalizeIntent } from "qkp-sdk/intent";

const id = createIdentity("Mihail Chiosa");

const intent = normalizeIntent({
  goal: "Access QKP whitepaper",
  context: "documentation portal"
});

const envelope = createEnvelope({
  sender: id,
  intent
});

console.log(envelope);


---

📘 Documentation

Official documentation is available at:

🔗 https://qkey-founder.github.io/quantumkey-protocol/

This includes:

Whitepaper

Tokenomics

Protocol Core

Message Format Specs

DAO Constitution

Identity Specification



---

🧭 Roadmap (Alpha → v1)

α — Current Phase (Skeleton SDK)

Basic identity primitives

Intent normalization & validation

QIE envelope structure

Alignment placeholder engine


β — Phase 2

Cryptographic identity engine

Multi-agent semantic alignment

QIE signing & verification

Alignment economy interfaces


v1.0

Production SDK

Full cryptographic layer

Network messaging

Wallet & agent integrations



---

🤝 Contributing

Everything in this repository is open for public contribution.
Discussion threads will be opened for:

Identity model evolution

Intent standardization

Agent-to-agent semantics

Alignment metrics


To contribute:

1. Fork the repo


2. Create a branch


3. Submit a Pull Request




---

📜 License

QKP-SDK is released under the MIT License.


---

⭐ Vision

The QuantumKey Protocol is not simply a technology – it is the foundation of a harmonic digital ecosystem where:

Where:
- Identity is presence
- Information is meaning
- Intelligence is alignment
- Intent is the fabric between agents

This SDK is the first step in manifesting that architecture,
providing interoperable primitives for identity, intent, and alignment.


---

## Documentation
See `docs/index.md` and `docs/protocol-spec.md`.
