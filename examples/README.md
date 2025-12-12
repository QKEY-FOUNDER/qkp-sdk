---

# QKP-SDK — Examples

This folder contains **minimal, illustrative examples** showing how the QuantumKey Protocol SDK
is intended to be used.

These examples are **conceptual and non-final**.  
They exist to demonstrate *structure, flow and intent* — not production-ready logic.

---

## Purpose of the Examples

The QKP-SDK is not a traditional SDK focused only on execution.
It is an **alignment-first protocol**.

These examples aim to show:

- How **intent** is declared
- How **identity** is represented
- How **messages** are structured (QIE)
- How **alignment checks** could occur

Think of them as **reference rituals**, not finished spells.

---

## Example 1 — Identity Creation (Conceptual)

```js
import { createIdentity } from "../src/identity";

const identity = createIdentity({
  type: "human",
  intent: "collaborate",
  presence: "conscious"
});

console.log(identity);

What this demonstrates:

Identity is not just a keypair

It carries intent and context

Cryptography is secondary to alignment



---

Example 2 — Declaring Intent

import { declareIntent } from "../src/intent";

const intent = declareIntent({
  purpose: "knowledge-sharing",
  scope: "open",
  constraints: ["non-extractive", "consensual"]
});

console.log(intent);

Key idea: Intent is explicit, structured and verifiable — not implicit.


---

Example 3 — QIE Message Format

import { createMessage } from "../src/qie";

const message = createMessage({
  from: "identity:human",
  to: "identity:agent",
  intent: "explain-protocol",
  payload: {
    topic: "QuantumKey Protocol",
    level: "introductory"
  }
});

console.log(message);

QIE (Quantum Intent Envelope)
is the backbone of communication in QKP.


---

Example 4 — Alignment Check (Stub)

import { checkAlignment } from "../src/alignment";

const result = checkAlignment({
  intent: "collaborate",
  action: "extract-value"
});

console.log(result); // expected: false

Important:
This is a placeholder — alignment logic will evolve with the protocol.


---

Status

🧪 Experimental

🧱 Skeleton-level

🧭 Directional, not final


These examples will grow as:

the protocol matures

governance solidifies

real implementations emerge



---

Philosophy Reminder

> In QuantumKey, code is not neutral.
Every function encodes a choice.
Every message carries responsibility.



Use these examples as guides, not rules.


---

Next Steps

Add real cryptographic primitives

Add tests for intent validation

Connect examples to real agents

Evolve alignment from philosophy to mechanism



---

QuantumKey Protocol
A living architecture for aligned intelligence

---
