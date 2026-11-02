# Model validation boundary

No model is enabled or hosted by this directory. GitHub Pages serves static files only; it cannot execute Python inference. The existing lexical tools remain explicitly non-ML.

Candidates inspected on 2026-11-02 using the upstream Hugging Face model metadata API:

| Candidate | Pinned revision | Upstream license label | Safe-format observation |
| --- | --- | --- | --- |
| HooshvareLab/bert-fa-base-uncased-sentiment-deepsentipers-binary | 5f8fd46cd438d48ce4ff9fb9a01024b857f6204c | apache-2.0 | No safetensors file listed |
| HooshvareLab/gpt2-fa-poetry | 35d19a3dba707d9d1ca075e35340f0477c8d9e0b | apache-2.0 | No safetensors file listed |
| bolbolzaban/gpt2-persian | 1c965e289795e1b24301cd3f4ee48e73519ac8ee | apache-2.0 | No safetensors file listed |

License labels are evidence from model cards, not a blanket approval of training data, generated output rights, or private research assets. Resolve exact model files, provenance and safe loading before activation. No training_args.bin, private pickle model, arbitrary remote code or legacy deserialization fallback is permitted.

Release blockers remain: independent held-out sentiment evaluation; licensed POS assets and labeled he-kasreh evaluation; authoritative medicine data provenance and ambiguity policy; real poetry generation and evaluation; separately validated conditioning/style transfer; consented local/private inference integration and browser acceptance. No mock output may satisfy these gates.

Do not retire the private research repository: necessary assets and unresolved rights remain there. Do not copy its notebooks, model binaries, datasets or Git history into this public repository.
