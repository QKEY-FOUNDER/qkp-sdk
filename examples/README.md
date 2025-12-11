# QKP-SDK Examples

Small snippets showing how to use the SDK primitives.

```js
import { createIdentityKeyPair } from "../src/identity/index.js";
import { validateIntent } from "../src/intent/index.js";

const id = createIdentityKeyPair();
const intent = validateIntent({ action: "hello" });

console.log(id, intent);
