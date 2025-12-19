# QuantumKey Protocol (QKP) — Specification (Draft)

> **Protocol Version:** v0.1.0  
> This specification defines the frozen core primitives of the QuantumKey Protocol.
> Any backward-incompatible change requires a new major version.

Status: Draft (Frozen Core v0.1.0)
SDK: QKP-SDK  
Scope: Defines the minimal interoperable primitives for Identity, Intent, QIE and Alignment.

## 0. Design Principles
- Spec-first: implementations follow the spec, not the other way around.
- Minimal primitives: small, composable building blocks.
- Versioned objects: every core structure must be versioned.
- Auditability: intents and actions should be inspectable and verifiable.

## 1. Core Concepts
### 1.1 Identity
An Identity is a verifiable subject (human, AI agent, org).

**Identity object (v0.1)**
- `id` (string, required)
- `publicKey` (string, optional)
- `metadata` (object, optional)
- `createdAt` (ISO-8601 string, required)

### 1.2 Intent
An Intent is an explicit declaration of purpose and constraints.

**Intent object (v0.1)**
- `issuer` (string, required)
- `purpose` (string, required)
- `scope` (string, optional, default: "local")
- `constraints` (object, optional)
- `issuedAt` (ISO-8601 string, required)

### 1.3 QIE (Quantum Intent Encoding)
QIE is an encoding container for an Intent that enables portability, hashing, and future cryptographic upgrades.

**QIE object (v0.1)**
- `qieVersion` (string, required)
- `hash` (string, required)
- `intent` (Intent object, required)

### 1.4 Alignment
Alignment is a consistency check between an Intent and an Action.

**AlignmentResult (v0.1)**
- `aligned` (boolean, required)
- `checkedAt` (ISO-8601 string, required)

## 2. Conformance Requirements
An implementation is QKP-compatible if it:
- Produces objects that match the structures above.
- Preserves required fields and their meaning.
- Does not change semantics without bumping the version.

## 3. Versioning
- Patch: non-breaking clarifications or docs.
- Minor: additive fields that do not change meaning.
- Major: breaking changes.

## 4. Non-Goals (for now)
- Full DID method standardization
- On-chain governance execution
- Cryptographic signature suites
These may be added in later versions.

Conformance cases are defined in `docs/conformance.md`.

## 1.5 Deterministic Hashing (v0.2)
- QIE hashing MUST be computed from a canonicalized JSON representation of the Intent.
- Hash algorithm: SHA-256.
- Any change to Intent fields MUST change the resulting hash.

## Signed Container (v0.1)

A signed container wraps any payload:

- `version` (string)
- `payload` (object)
- `signature` (string, base64url)
- `publicKey` (string, base64url)
- `createdAt` (ISO-8601 string)
- `alg` (string)

### Algorithms
- `alg: "ED25519"` indicates an Ed25519 signature over `SHA-256(canonical(payload))`.
- `publicKey` is the base64url-encoded raw Ed25519 public key.
- `signature` is the base64url-encoded Ed25519 signature bytes.

- `alg: "DEMO-SHA256"` is a non-secure demonstration mode intended only for
  development, testing, and conformance examples.
  It MUST NOT be used for production security.

### Canonicalization and Hashing
Implementations MUST:
1. Canonicalize the payload (deterministic JSON)
2. Compute SHA-256 over UTF-8 bytes of the canonical string
3. Sign/verify the resulting digest using Ed25519

## Signed Intent (v0.1)

A Signed Intent is a cryptographically authenticated Intent.

### Properties
- `intent` (Intent)
- `signature` (string)
- `publicKey` (string)
- `alg` (string)
- `createdAt` (ISO-8601)

### Rules
- Verification MUST fail if any Intent field changes
- Signed Intents MAY be used as inputs to governance, claims, or agent execution


## Claim (v0.1)

A Claim is a statement issued by an issuer about a subject.

### Properties
- `id` (string)
- `issuer` (string)
- `subject` (string)
- `type` (string)
- `issuedAt` (ISO-8601)
- `expiresAt` (ISO-8601, optional)
- `evidence` (array, optional)
- `data` (object, optional)

## Signed Claim (v0.1)

A Signed Claim is a cryptographically authenticated Claim.

### Rules
- Verification MUST fail if any Claim field changes
- If `expiresAt` is present, verification MUST fail after expiry (unless explicitly allowed by the verifier)
- `issuer` SHOULD correspond to the signing key owner (policy-layer decision)

## Revocation and Trust Policy (v0.1)
Revocation {
  version: "0.1",
  targetClaimId: string,
  issuer: string,
  reason?: string,
  revokedAt: ISODateTime
}
Revocation allows issuers to invalidate previously issued claims.

Trust Policies define local acceptance rules and are NOT part of cryptographic verification.

## Governance (v0.1)

### Proposal
A proposal defines a change request in the protocol ecosystem.

### Vote
A vote records a choice (YES/NO/ABSTAIN) and weight for a proposal.

### Signed Proposal / Signed Vote
- MUST fail verification if any field changes
- Tally MUST ignore invalid signatures and mismatched proposalId

## Execution Contract (v0.1)
ExecutionContract {
  version: "0.1",
  contractId: string,
  agentId: string,
  action: {
    type: string,
    params: object
  },
  signedIntent: SignedIntent,
  requiredClaims?: string[],     // types of claims required
  policy?: object,               // local policy hints
  createdAt: ISODateTime
}

Execution contracts describe an action that an agent may execute under a SignedIntent and accepted Claims.

Verification MUST:
- verify SignedIntent cryptographically
- ensure required claims are trusted and not revoked
- enforce declared intent constraints (minimal v0.1)
ExecutionReceipt {
  version: "0.1",
  receiptId: string,
  contractId: string,
  contractHash: string,
  status: "EXECUTED" | "FAILED",
  output?: object,
  executedAt: ISODateTime
}
Execution receipts provide verifiable proof of execution.
Replay protection MUST prevent unintended re-execution of the same contract.

## Accountability Graphs (v0.1.x)

NodeRef {
  kind: "SignedIntent" | "SignedClaim" | "SignedProposal" | "SignedVote" | "ExecutionContract" | "ExecutionReceipt" | "SignedRevocation",
  id: string,        // natural id (contractId, claim.id, proposal.id, receiptId, etc.)
  hash: string       // sha256(canonical(payload-or-object))
}

Edge {
  type: "AUTHORIZES" | "REQUIRES" | "PRODUCES" | "REVOKES" | "VOTES_ON" | "DERIVES",
  from: NodeRef,
  to: NodeRef,
  createdAt: ISODateTime
}

## Accountability Chains (v0.1.x)

Accountability chains provide ordered, tamper-evident sequences of causal edges.
Each link references the previous link hash (optional for genesis).

### ChainLink (Canonical Form)

```ts
ChainLink {
  version: "0.1",
  linkId: string,
  prevLinkHash?: string,   // optional for genesis
  edges: Edge[],           // causal edges included in this link
  createdAt: ISODateTime
}
```
### 15.2 Semantics & Validation

Accountability Chains define an ordered sequence of causal evidence.
They are designed to be independently verifiable and tamper-evident.

#### 15.2.1 Canonical Hashing
- Each `ChainLink` MUST have a canonical hash computed as:
  `linkHash = sha256(canonical(ChainLink))`
- The canonical form MUST use deterministic key ordering (as defined by the SDK canonicalization rules).

#### 15.2.2 Genesis Link
- A chain MAY start with a genesis link.
- A genesis link MUST omit `prevLinkHash`.

#### 15.2.3 Linking Rule (Integrity)
- If `prevLinkHash` is present, it MUST equal the `linkHash` of the immediately previous `ChainLink`.
- If any previous link is modified, the chain MUST be considered invalid from that point onward.

#### 15.2.4 Signature Rule (Accountability)
- A `SignedChainLink` MUST be a valid signature over the `ChainLink` object.
- Verification MUST fail if any field inside `ChainLink` changes.
- The `alg` MUST be explicit (e.g. `ED25519`). Non-secure demo algorithms MUST NOT be used for production security.

#### 15.2.5 Edge Validity Requirement
- Each `Edge` included in a `ChainLink` MUST be valid under Accountability Graph rules:
  - NodeRef hashes MUST match canonical hashing of referenced objects.
- Chains MAY include edges that reference objects not embedded in the chain; verifiers MUST have access to those referenced objects to validate the edges.

#### 15.2.6 Ordering Semantics (No Reordering)
- The order of `edges` inside a `ChainLink` MUST be preserved.
- Reordering edges changes the canonical hash and MUST invalidate the link (and therefore the chain).

#### 15.2.7 Minimal Verification Algorithm (Normative)
A verifier MUST:
1. Verify each `SignedChainLink` signature.
2. Recompute each `linkHash = sha256(canonical(ChainLink))`.
3. Ensure `prevLinkHash` matches the previous `linkHash` for all non-genesis links.
4. Validate all `Edge` objects (by validating referenced NodeRefs against their objects).
If any step fails, the chain MUST be rejected as invalid.

#### 15.2.8 Scope of Trust
- Chain validity is cryptographic + structural.
- Whether a verifier ACCEPTS a chain as trustworthy is a policy decision (Trust Policy layer).

### 15.4 — Subgraph Extraction (Audit Views)

Subgraph extraction allows deriving verifiable audit views from an Accountability Graph
by selecting a subset of nodes and edges while preserving causal integrity.

A subgraph MUST:
- Include all referenced nodes for any included edge
- Preserve original hashes (`hash`, `prevLinkHash`)
- Remain independently verifiable against the full graph

Subgraph extraction MUST NOT:
- Reorder causal links
- Omit dependencies required to validate an edge
- Modify node or edge payloads

Typical audit views include:
- All actions authorized by a given SignedIntent
- All executions derived from a specific ExecutionContract
- All claims issued or revoked by a given issuer
- All graph activity within a given time window

### 15.5 — Temporal / Windowed Audits

Temporal audits allow verifying Accountability Graph activity within a defined
time window while preserving causal integrity.

A temporal audit window is defined by:
- startTime (inclusive)
- endTime (inclusive)

A windowed audit MUST:
- Include only nodes and edges with `createdAt` within the time window
- Include any required ancestor links necessary to validate `prevLinkHash`
- Preserve original hashes and signatures

A windowed audit MUST NOT:
- Truncate causal history required to validate included links
- Modify timestamps, hashes, or signatures
- Reorder links across time boundaries

If a required ancestor link falls outside the time window, it MUST be included
as a dependency but MAY be marked as out-of-window context.

### 15.6 — Threat Model (Accountability Graph)

This section defines the threat assumptions and guarantees provided by the
Accountability Graph and Accountability Chain mechanisms.

#### 15.6.1 Threats Addressed

The Accountability Graph MUST detect or prevent the following threats:

- Retroactive modification of signed objects
- Reordering or deletion of causal links
- Forged edges referencing tampered objects
- Replay of previously executed contracts without detection
- Partial disclosure intended to hide causality

#### 15.6.2 Threats Not Addressed

The Accountability Graph does NOT protect against:

- Compromise of private signing keys
- Malicious issuers producing valid but harmful actions
- Social engineering or policy-layer misconfiguration
- Collusion between trusted issuers

These threats MUST be handled by operational security, governance, or trust
policy layers.

#### 15.6.3 Security Guarantees

Given uncompromised keys and correct verification, the system guarantees:

- Tamper-evident accountability
- Verifiable causal ordering
- Cryptographic non-repudiation
- Replay detection at the accountability layer

#### 15.6.4 Trust Boundary

The cryptographic validity of the Accountability Graph is objective and
verifiable.

Whether a valid graph is accepted as trustworthy remains a policy decision
outside the scope of this specification.

---

### C15 — Chain-of-Chains / Aggregation (v0.1.x)

Aggregation provides a tamper-evident way to reference multiple accountability chains using their head hashes, optionally forming higher-level aggregation chains.

#### ChainAggregate (Canonical Form)

```ts
ChainAggregate {
  version: "0.1",
  aggregateId: string,
  prevAggHash?: string,     // optional (genesis aggregate)
  headHashes: string[],     // ordered list of chain head hashes
  createdAt: ISODateTime
}
```
#### SignedChainAggregate (Canonical Form)

SignedChainAggregate {
  version: "0.1",
  aggregate: ChainAggregate,
  signature: string,
  publicKey: string,
  alg: string,
  createdAt: ISODateTime
}

### Rules

headHashes order MUST be preserved (reordering MUST change the aggregate hash).

If prevAggHash is present, it MUST match the canonical hash of the previous aggregate.

Signatures MUST fail if any field changes.

Aggregation is structural; acceptance/trust remains a policy decision.


---

### C16 — Temporal / Windowed Aggregation (v0.1.x)

Temporal aggregation defines a ChainAggregate where `headHashes` are grouped
according to a verifier-defined time window.

#### WindowedChainAggregate (Canonical Form)

```ts
WindowedChainAggregate {
  version: "0.1",
  aggregateId: string,
  windowStart: ISODateTime,   // inclusive
  windowEnd: ISODateTime,     // inclusive
  prevAggHash?: string,
  headHashes: string[],       // ordered list of chain head hashes in the window
  createdAt: ISODateTime
}
```
### SignedWindowedChainAggregate (Canonical Form)

SignedWindowedChainAggregate {
  version: "0.1",
  aggregate: WindowedChainAggregate,
  signature: string,
  publicKey: string,
  alg: string,
  createdAt: ISODateTime
}

### Rules

windowStart MUST be <= windowEnd.

headHashes order MUST be preserved (reordering MUST change the aggregate hash).

If prevAggHash is present, it MUST match the canonical hash of the previous aggregate.

Temporal membership ("which headHashes belong in the window") is derived from evidence outside this structure and is a verifier/policy decision.

Signatures MUST fail if any field changes.

---

### C17 — Hierarchical / Recursive Aggregation (v0.1.x)

Hierarchical aggregation allows aggregates to reference other aggregates,
forming recursive “aggregate-of-aggregates” structures. This enables
multi-level accountability summaries (e.g., per-agent → per-day → per-project).

#### HierarchicalAggregate (Canonical Form)

```ts
HierarchicalAggregate {
  version: "0.1",
  aggregateId: string,
  prevAggHash?: string,          // optional (genesis aggregate)
  level: number,                // 0 = base, 1 = aggregate-of-aggregates, ...
  headHashes?: string[],         // optional (chain heads)
  childAggHashes?: string[],     // optional (hashes of child aggregates)
  createdAt: ISODateTime
}
```

### SignedHierarchicalAggregate (Canonical Form)

SignedHierarchicalAggregate {
  version: "0.1",
  aggregate: HierarchicalAggregate,
  signature: string,
  publicKey: string,
  alg: string,
  createdAt: ISODateTime
}

### Rules

An aggregate MUST include at least one of: headHashes or childAggHashes.

headHashes order MUST be preserved.

childAggHashes order MUST be preserved.

If prevAggHash is present, it MUST match the canonical hash of the previous aggregate.

level MUST be >= 0.

Signatures MUST fail if any field changes.

Whether referenced hashes correspond to valid chains/aggregates is a verifier/policy decision unless the verifier has access to those objects.

---

### C18 — Federated / Cross-domain Aggregation (v0.1.x)

Federated aggregation allows multiple independent issuers to co-sign a shared
aggregate. This enables cross-domain accountability where several entities
attest to the same aggregate content.

#### FederatedAggregate (Canonical Form)

```ts
FederatedAggregate {
  version: "0.1",
  aggregateId: string,
  level: number,                 // hierarchical level (>= 0)
  prevAggHash?: string,
  headHashes?: string[],          // optional chain heads
  childAggHashes?: string[],      // optional child aggregates
  createdAt: ISODateTime
}
```

### MultiSignature (Canonical Form)

MultiSignature {
  signature: string,
  publicKey: string,
  alg: string,
  signedAt: ISODateTime
}

### SignedFederatedAggregate (Canonical Form)

SignedFederatedAggregate {
  version: "0.1",
  aggregate: FederatedAggregate,
  signatures: MultiSignature[],   // one or more signatures
  createdAt: ISODateTime
}

### Rules

A federated aggregate MUST include at least one of: headHashes or childAggHashes.

level MUST be >= 0.

signatures MUST contain at least 1 signature.

Each signature MUST verify against the same canonical FederatedAggregate.

Reordering signatures MUST NOT change verification outcome (signatures are a set).

Acceptance policy (how many signatures, which issuers) is a Trust Policy decision.

---

### C19 — Trust Policy Evaluation (Acceptance Layer) (v0.1.x)

Cryptographic validity proves integrity. Trust policy determines acceptance.

This layer defines local acceptance rules applied AFTER cryptographic verification,
such as issuer allowlists, signature thresholds, and optional constraints by level
or time windows. Policy evaluation does not change hashes or signatures.

#### TrustPolicy (Canonical Form)

```ts
TrustPolicy {
  version: "0.1",
  name: string,

  // Generic
  allowAlgorithms?: string[],           // e.g. ["ED25519"]
  allowPublicKeys?: string[],           // allowlist of issuer keys

  // Federated acceptance
  minSignatures?: number,               // minimum required signatures

  // Optional constraints (hierarchical/windowed)
  requireLevel?: number,                // required level for hierarchical aggregates
  requireWindowStartAfter?: ISODateTime, // for windowed aggregates
  requireWindowEndBefore?: ISODateTime   // for windowed aggregates
}
```

### Rules

Policy evaluation MUST NOT modify protocol objects.

Policy evaluation MUST reject objects that fail cryptographic verification.

Acceptance is local and subjective; different verifiers MAY accept/reject the same valid object.


---

### C20 — Attested Trust / Third-party Acceptance (v0.1.x)

A third party MAY attest that it verified cryptographic validity and evaluated a specific Trust Policy,
producing a signed AcceptanceReceipt. This records verifiable decisions (accept/reject) without changing
the underlying protocol objects.

#### AcceptanceReceipt (Canonical Form)

```ts
AcceptanceReceipt {
  version: "0.1",
  receiptId: string,
  targetKind: string,          // e.g. "FederatedAggregate" | "SignedFederatedAggregate"
  targetHash: string,          // sha256(canonical(target))
  policyName: string,
  policyHash: string,          // sha256(canonical(TrustPolicy))
  decision: "ACCEPT" | "REJECT",
  reasons?: string[],
  createdAt: ISODateTime
}
```
### SignedAcceptanceReceipt (Canonical Form)

SignedAcceptanceReceipt {
  version: "0.1",
  receipt: AcceptanceReceipt,
  signature: string,
  publicKey: string,
  alg: string,
  createdAt: ISODateTime
}

### Rules

Receipt signatures MUST fail if any receipt field changes.

policyHash MUST represent the canonical TrustPolicy used by the attester.

targetHash MUST represent the canonical hash of the referenced target object (verifier recomputation).

Acceptance is attestable; verification is cryptographic + optional local policy.


---
