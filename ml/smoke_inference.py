"""Explicit local research smoke test; not a published inference service."""
import json
import os
import sys

MODEL = 'HooshvareLab/bert-fa-base-uncased-sentiment-deepsentipers-binary'
REVISION = '5f8fd46cd438d48ce4ff9fb9a01024b857f6204c'

def main():
    if os.environ.get('NLP_ALLOW_MODEL_DOWNLOAD') != '1':
        raise SystemExit('Explicit model-download consent required: NLP_ALLOW_MODEL_DOWNLOAD=1')
    # No user text is sent to the model hub. Only public model artifacts are fetched.
    import torch
    from transformers import AutoTokenizer, AutoModelForSequenceClassification
    torch.set_num_threads(2)
    tokenizer = AutoTokenizer.from_pretrained(MODEL, revision=REVISION, trust_remote_code=False)
    model = AutoModelForSequenceClassification.from_pretrained(
        MODEL, revision=REVISION, trust_remote_code=False, weights_only=True)
    model.eval()
    examples = ['این فیلم را دوست داشتم.', 'این فیلم بسیار بد بود.']
    with torch.inference_mode():
        batch = tokenizer(examples, padding=True, truncation=True, max_length=128, return_tensors='pt')
        probabilities = model(**batch).logits.softmax(dim=-1)
    print(json.dumps({'model': MODEL, 'revision': REVISION, 'kind': 'synthetic-smoke-not-independent-evaluation',
                      'labels': model.config.id2label, 'probabilities': probabilities.tolist()}, ensure_ascii=False))

if __name__ == '__main__':
    main()
