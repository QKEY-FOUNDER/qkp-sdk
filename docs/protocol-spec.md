# QuantumKey Protocol (QKP) — Specification (Draft)

Status: Draft  
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

## Audit and Accountability (v0.1)
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
