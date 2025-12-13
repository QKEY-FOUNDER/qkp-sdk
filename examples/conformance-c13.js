---

## Case C13 — Accountability Graph (NodeRef + Edge validation)

### Steps
1. Create a SignedIntent and an ExecutionContract and an ExecutionReceipt
2. Create NodeRefs for each using deterministic hashes
3. Create edges: SignedIntent AUTHORIZES ExecutionContract; ExecutionContract PRODUCES ExecutionReceipt
4. Validate edges by recomputing hashes from the referenced objects => MUST be true
5. Tamper a referenced object => validation MUST be false
