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

### Canonicalization and Hashing
Implementations MUST:
1. Canonicalize the payload (deterministic JSON)
2. Compute SHA-256 over UTF-8 bytes of the canonical string
3. Sign/verify the resulting digest using Ed25519
