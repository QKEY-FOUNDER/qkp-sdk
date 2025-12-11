// QuantumKey Protocol — SDK Entry Point
// This file re-exports all core modules in a unified interface.

export * as Identity from "./identity/index.js";
export * as Intent from "./intent/index.js";
export * as QIE from "./qie/index.js";
export * as Alignment from "./alignment/index.js";
export * as Utils from "./utils/index.js";

export default {
  Identity,
  Intent,
  QIE,
  Alignment,
  Utils
};
