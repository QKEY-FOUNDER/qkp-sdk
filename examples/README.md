# QKP-SDK — Conceptual Examples

This folder contains **conceptual, non-production examples** illustrating how the core primitives of the **QuantumKey Protocol SDK (QKP-SDK)** are intended to relate to each other.

These examples are **not runnable implementations**.  
They are **semantic flows**, designed to clarify *order*, *responsibility*, and *alignment* within the protocol.

---

## ⚠️ Important

- These examples are **illustrative only**
- They describe **protocol grammar**, not final APIs
- No cryptography, no networking, no agents are assumed
- Code snippets express *intentional structure*, not execution

Think of this folder as **protocol diagrams written in code form**.

---

## Core Principle Illustrated

> **Identity exists before action.  
> Intent exists before execution.  
> Alignment exists before automation.**

---

## Example 1 — Identity → Intent (Minimal Flow)

This example shows the **minimum valid sequence** in the protocol:
1. An identity is established
2. An intent is declared
3. The intent is validated in context

```js
import { createIdentity } from "@qkp/identity";
import { validateIntent } from "@qkp/intent";

const identity = createIdentity({
  subject: "human",
  continuity: "persistent"
});

const intent = validateIntent(identity, {
  action: "hello",
  context: "example"
});

console.log(identity, intent);

What this illustrates

Identity precedes any action

Intent is explicit and structured

No agents, no AI — only protocol primitives



---

Example 2 — Identity + Intent → Message (QIE)

This example introduces the Quantum Intent Envelope (QIE).

import { createIdentity } from "@qkp/identity";
import { declareIntent } from "@qkp/intent";
import { createMessage } from "@qkp/qie";

const identity = createIdentity({ subject: "agent" });

const intent = declareIntent(identity, {
  goal: "share-information",
  scope: "public"
});

const message = createMessage({
  identity,
  intent,
  payload: {
    text: "This message carries declared intent"
  }
});

What this illustrates

Messages are not neutral containers

Every message carries declared intent

Intent is bound to identity at creation time



---

Example 3 — Alignment Check (Pre-Agent)

This example shows how alignment is evaluated before autonomy.

import { checkAlignment } from "@qkp/alignment";

const alignment = checkAlignment({
  intent,
  context: "shared-space",
  policy: "non-exploitative"
});

if (!alignment.ok) {
  throw new Error("Intent not aligned with context");
}

What this illustrates

Alignment is a gate, not a reaction

Automation is conditional

Ethics are structural, not external



---

What Is Not Shown Here

These examples intentionally omit:

Cryptographic implementations

Networking or transport layers

AI or agent logic

Economic incentives

DAO mechanics


Each of those belongs to separate layers of the protocol.


---

Relationship to the Specifications

These examples are derived from:

Protocol Message Formats

Identity & Intent specifications

Alignment and governance primitives


They should be read together with the docs, not in isolation.


---

Final Note

If you can understand these examples,
you understand the spine of the QuantumKey Protocol.

Everything else is implementation.
