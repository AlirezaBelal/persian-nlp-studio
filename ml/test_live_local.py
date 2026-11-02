"""Opt-in integration test using the actual pinned cached model, never mocks."""
import json
import threading
import urllib.request
import urllib.error
from http.server import HTTPServer
from local_server import Handler, Inference

def main():
    Handler.inference = Inference()
    server = HTTPServer(('127.0.0.1', 0), Handler)
    thread = threading.Thread(target=server.serve_forever, daemon=True)
    thread.start()
    results = []
    try:
        url = f'http://127.0.0.1:{server.server_port}/sentiment'
        for data, origin, expected in [({'text': 'این فیلم را دوست داشتم.', 'consent_local_processing': True}, None, 200),
                                      ({'text': 'متن'}, None, 400),
                                      ({'text': 'متن', 'consent_local_processing': True}, 'https://external.invalid', 403)]:
            headers = {'Content-Type': 'application/json'}
            if origin: headers['Origin'] = origin
            try:
                with urllib.request.urlopen(urllib.request.Request(url, data=json.dumps(data).encode(), headers=headers), timeout=30) as response:
                    status, body = response.status, json.load(response)
            except urllib.error.HTTPError as error:
                status, body = error.code, json.load(error)
            assert status == expected, (status, expected)
            if status == 200:
                assert body['scores']['positive'] > body['scores']['negative']
                assert abs(sum(body['scores'].values()) - 1) < 0.0001
            results.append({'expected': expected, 'actual': status})
        print(json.dumps({'kind': 'actual-model-http-integration-not-accuracy-evaluation', 'results': results}))
    finally:
        server.shutdown()
        server.server_close()
        thread.join()

if __name__ == '__main__': main()
