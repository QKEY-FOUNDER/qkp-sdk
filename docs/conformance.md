# QKP Conformance Suite (v0)

This document defines minimal conformance cases for QKP-compatible implementations.

A system is **QKP-compatible** if it can produce the objects defined in `docs/protocol-spec.md`
with the required fields and semantics.

## How to Use
For each case below:
1. Create the required objects
2. Verify required fields and meanings
3. Compare to expected output shape

---

## Case C1 — Identity Object (v0.1)

### Input
- `id = "did:qkp:alice"`
- `publicKey = "pk_demo_001"`

### Required Output Shape
- `id` is a non-empty string
- `createdAt` is ISO-8601 string
- `publicKey` may be present
- `metadata` defaults to object (optional)

### Notes
Implementations may add extra fields, but MUST NOT change meanings of required fields.

---

## Case C2 — Intent Object (v0.1)

### Input
- `issuer = "did:qkp:alice"`
- `purpose = "authorize_data_access"`
- `scope = "local"`
- `constraints = { "ttlSeconds": 300 }`

### Required Output Shape
- `issuer` is a non-empty string
- `purpose` is a non-empty string
- `issuedAt` is ISO-8601 string
- `constraints` is an object (optional)

### Semantics Check
`purpose` must remain stable through serialization/deserialization.

---

## Case C3 — QIE Encoding Container (v0.1)

### Input
- An Intent object from Case C2

### Required Output Shape
- `qieVersion` equals `"0.1"`
- `hash` is a non-empty string identifier
- `intent` is the original intent object

### Semantics Check
If `intent.purpose` changes, `hash` MUST change.

---

## Case C4 — Alignment Check (v0.1)

### Input
- Intent from Case C2
- Action object:
  - `purpose = "authorize_data_access"`

### Required Output Shape
- `aligned` is boolean
- `checkedAt` is ISO-8601 string

### Semantics Check
If `action.purpose !== intent.purpose`, then `aligned` MUST be `false`.
