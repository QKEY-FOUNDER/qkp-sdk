# QKP-SDK Examples

Small snippets showing how to use the SDK primitives.

```js
import { createIdentityKeyPair } from "../src/identity/index.js";
import { validateIntent } from "../src/intent/index.js";

const id = createIdentityKeyPair();
const intent = validateIntent({ action: "hello" });

console.log(id, intent);
## First Conceptual Example (No AI yet)

This example illustrates the *grammar* of the QuantumKey Protocol.
Even though these functions are not fully implemented yet, they define
how intent, identity, and agents will interact within the system.

```js
import { identity, intent } from 'qkp-sdk'

const agent = identity.createAgent({ name: 'Alice' })
const goal = intent.define({ purpose: 'cooperate' })
