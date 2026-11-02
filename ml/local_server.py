"""Loopback-only, opt-in sentiment inference; cached pinned weights, no telemetry."""
import json
from http.server import BaseHTTPRequestHandler, HTTPServer
from pathlib import Path
from smoke_inference import MODEL, REVISION

class Inference:
    def __init__(self):
        import torch
        from transformers import AutoTokenizer, AutoModelForSequenceClassification
        torch.set_num_threads(2)
        self.torch = torch
        self.tokenizer = AutoTokenizer.from_pretrained(MODEL, revision=REVISION, trust_remote_code=False, local_files_only=True)
        self.model = AutoModelForSequenceClassification.from_pretrained(MODEL, revision=REVISION, trust_remote_code=False,
                                                                       local_files_only=True, weights_only=True).eval()

    def predict(self, text):
        batch = self.tokenizer(text, truncation=False, return_tensors='pt')
        if batch['input_ids'].shape[1] > 256:
            raise ValueError('Text exceeds 256 model tokens; split the input.')
        with self.torch.inference_mode():
            scores = self.model(**batch).logits.softmax(dim=-1)[0].tolist()
        return {'model': MODEL, 'revision': REVISION, 'scope': 'document sentiment; not aspect sentiment',
                'scores': {self.model.config.id2label[i]: score for i, score in enumerate(scores)}}

class Handler(BaseHTTPRequestHandler):
    inference = None
    def log_message(self, *args):
        pass  # Do not log user input or request metadata.
    def setup(self):
        super().setup()
        self.connection.settimeout(10)
    def respond(self, status, data):
        body = json.dumps(data, ensure_ascii=False).encode()
        self.send_response(status)
        self.send_header('Content-Type', 'application/json; charset=utf-8')
        self.send_header('Content-Length', str(len(body)))
        self.send_header('Cache-Control', 'no-store')
        self.send_header('X-Content-Type-Options', 'nosniff')
        self.end_headers()
        self.wfile.write(body)
    def do_GET(self):
        if self.path == '/health': self.respond(200, {'status': 'local-only', 'revision': REVISION})
        else: self.respond(404, {'error': 'not found'})
    def do_POST(self):
        if self.path != '/sentiment': return self.respond(404, {'error': 'not found'})
        # No CORS and no cross-site browser requests; Host checked against bound port.
        expected = f'127.0.0.1:{self.server.server_port}'
        if self.headers.get('Host') != expected or self.headers.get('Origin', 'http://'+expected) != 'http://'+expected:
            return self.respond(403, {'error': 'loopback same-origin requests only'})
        if self.headers.get('Sec-Fetch-Site') == 'cross-site': return self.respond(403, {'error': 'cross-site request denied'})
        if self.headers.get('Content-Type', '').split(';')[0] != 'application/json': return self.respond(415, {'error': 'JSON required'})
        try:
            length = int(self.headers.get('Content-Length', '0'))
            if not 1 <= length <= 8192: raise ValueError('Request must be 1–8192 bytes.')
            body = json.loads(self.rfile.read(length))
            if not isinstance(body, dict) or body.get('consent_local_processing') is not True:
                raise ValueError('Explicit local-processing consent is required.')
            text = body.get('text')
            if not isinstance(text, str) or not text.strip() or len(text) > 2000: raise ValueError('Text must be 1–2000 characters.')
            result = self.inference.predict(text)
        except (ValueError, UnicodeDecodeError): return self.respond(400, {'error': 'Invalid input, consent or token limit.'})
        except Exception: return self.respond(503, {'error': 'Inference unavailable; no heuristic fallback.'})
        self.respond(200, result)

if __name__ == '__main__':
    Handler.inference = Inference()
    print('Local inference: http://127.0.0.1:8766; no text storage or external inference.', flush=True)
    HTTPServer(('127.0.0.1', 8766), Handler).serve_forever()
