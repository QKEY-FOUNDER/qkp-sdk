# QuantumKey Protocol — SDK Architecture

The QKP-SDK provides:

- Identity primitives  
- Intent validation  
- QIE encoding/decoding  
- Alignment scaffolding  
- Utility functions
## Spec Mapping

- `src/identity/` implements Identity primitives (Spec §1.1)
- `src/intent/` implements Intent primitives (Spec §1.2)
- `src/qie/` implements QIE container (Spec §1.3)
- `src/alignment/` implements alignment checks (Spec §1.4)
- `src/utils/` provides neutral helpers

The SDK is a reference implementation of the spec, not the spec itself.
