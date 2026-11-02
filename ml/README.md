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

## Actual sentiment smoke and local backend

The pinned sentiment model ran locally on CPU on two newly authored synthetic sentences; raw probabilities are recorded in `evidence/sentiment-smoke.json`. This establishes executable inference only, **not independent accuracy, precision, recall, calibration, or aspect accuracy**.

In an isolated Python environment, install the pinned requirements (CPU PyTorch wheel index recommended). Run the opt-in download/smoke once:

```
NLP_ALLOW_MODEL_DOWNLOAD=1 python ml/smoke_inference.py
python ml/local_server.py
```

The backend binds only 127.0.0.1:8766 and loads the pinned cached model without network downloads. POST `/sentiment` accepts JSON `{ "text": "متن آزمایشی", "consent_local_processing": true }`, with 8192-byte, 2000-character and 256-token limits. It rejects cross-origin browser requests, does not expose CORS, does not store text and has no heuristic fallback. This local API is not connected to the public website. A consent UI, independent evaluation, production security review and separate hosting authorization remain prerequisites for public activation.

The poetry model also executed on CPU at the pinned revision. `evidence/poetry-smoke.json` records a 32-new-token greedy output, including an imperfect/truncated ending. It is not evidence of usable poetic quality or authentic style transfer. Run `NLP_ALLOW_MODEL_DOWNLOAD=1 python ml/poetry_smoke.py` to reproduce the smoke, subject to pinned library/runtime differences.

Actual loopback HTTP integration ran with cached sentiment weights: valid consented synthetic input returned 200 with real probabilities; missing consent returned 400; an external Origin returned 403. Evidence: `evidence/local-http-integration.json`. Reproduce with `python ml/test_live_local.py`. This does not certify a production server, public deployment, independent accuracy or full privacy penetration testing.
