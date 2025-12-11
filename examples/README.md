examples/README.md

# QKP-SDK — Examples

This folder contains **small, conceptual examples** demonstrating how the
core primitives of the **QuantumKey Protocol SDK (QKP-SDK)** are intended
to be used together.

> ⚠️ Important  
> These examples are **not production-ready**.  
> They describe the *grammar* and *flow* of the protocol, not a finalized implementation.

---

## Example 1 — Identity + Intent (Minimal Flow)

This first example shows how an identity and an intent can be created and
validated within the protocol.

```js
import { createIdentityKeyPair } from "../src/identity/index.js";
import { validateIntent } from "../src/intent/index.js";

const identity = createIdentityKeyPair();

const intent = validateIntent({
  action: "hello",
  context: "example"
});

console.log(identity, intent);

What this illustrates

Identity exists before action.

Intent is explicit, structured, and verifiable.

No AI, no agent — only protocol primitives.



---

Example 2 — Conceptual Agent Interaction (No AI Yet)

This example illustrates how identity and intent will be composed inside an agent abstraction.

import { identity } from "qkp-sdk";
import { intent } from "qkp-sdk";

const agent = identity.createAgent({
  name: "Alice",
  publicKey: "example-public-key"
});

const goal = intent.define({
  purpose: "cooperate",
  domain: "knowledge-sharing"
});

agent.setIntent(goal);

console.log(agent);

What this illustrates

An agent is an identity with continuity.

Intent is attached, not inferred.

Alignment is explicit, not emergent by accident.



---

Example 3 — Message Grammar (QIE — Quantum Intent Envelope)

This example shows the conceptual shape of a QIE message, the basic communication unit of the QuantumKey Protocol.

const qieMessage = {
  from: "agent:alice",
  to: "agent:bob",
  intent: {
    action: "share",
    object: "document",
    alignment: "cooperative"
  },
  timestamp: Date.now(),
  signature: "<cryptographic-signature>"
};

console.log(qieMessage);

What this illustrates

Messages carry intent + context, not just data.

Cryptographic identity anchors meaning.

Alignment becomes a first-class field.



---

Design Philosophy Behind These Examples

These examples intentionally:

Avoid frameworks

Avoid AI abstractions

Avoid network assumptions


They focus on clarity of protocol grammar, not implementation detail.

> The QuantumKey Protocol is built so that:

Meaning precedes computation

Intent precedes execution

Alignment precedes scale





---

Next Steps (Planned)

Future examples will include:

Alignment scoring

DAO-based intent validation

Multi-agent negotiation

Semantic audit trails


Until then, these examples serve as conceptual scaffolding for contributors, researchers, and builders.


---

© QuantumKey Protocol — Consciousness-aligned digital infrastructure.

---
