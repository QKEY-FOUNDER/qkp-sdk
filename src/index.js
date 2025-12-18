// QuantumKey Protocol — SDK Entry Point
// Re-export modules with stable, lowercase names (public API)

export * as identity from "./identity/index.js";
export * as intent from "./intent/index.js";
export * as qie from "./qie/index.js";
export * as alignment from "./alignment/index.js";
export * as utils from "./utils/index.js";
export * as crypto from "./crypto/index.js";
export * as claims from "./claims/index.js";
export * as governance from "./governance/index.js";
export * as agents from "./agents/index.js";
export * as graph from "./graph/index.js";
export {
  createWindowedChainAggregate,
  signWindowedChainAggregate,
  verifySignedWindowedChainAggregate
} from "./windowed-aggregate.js";
