// QuantumKey Protocol — SDK Entry Point
// Re-export modules with stable, lowercase names (public API)

export * as identity from "./identity/index.js";
export * as intent from "./intent/index.js";
export * as qie from "./qie/index.js";
export * as alignment from "./alignment/index.js";
export * as utils from "./utils/index.js";

export default {
  Identity,
  Intent,
  QIE,
  Alignment,
  Utils
};
