import os
if os.environ.get("NLP_ALLOW_MODEL_DOWNLOAD") != "1":
    raise SystemExit("Set NLP_ALLOW_MODEL_DOWNLOAD=1 to permit public model artifact downloads")
import torch,json
from transformers import AutoTokenizer,AutoModelForCausalLM
m='HooshvareLab/gpt2-fa-poetry';r='35d19a3dba707d9d1ca075e35340f0477c8d9e0b'
torch.set_num_threads(2)
t=AutoTokenizer.from_pretrained(m,revision=r,trust_remote_code=False)
model=AutoModelForCausalLM.from_pretrained(m,revision=r,trust_remote_code=False,weights_only=True).eval()
x=t('<s>خیام<|startoftext|>',return_tensors='pt')
with torch.inference_mode(): y=model.generate(**x,max_new_tokens=32,do_sample=False,pad_token_id=t.eos_token_id)
print(json.dumps({'model':m,'revision':r,'kind':'smoke-not-style-transfer-evaluation','generated':t.decode(y[0],skip_special_tokens=True)},ensure_ascii=False))
