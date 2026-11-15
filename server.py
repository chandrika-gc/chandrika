import http.server
import socketserver
import json
import os
import sys
from urllib.parse import urlparse, parse_qs
from datetime import datetime

PORT = 8000
DIRECTORY = os.path.dirname(os.path.abspath(__file__))
MESSAGES_FILE = os.path.join(DIRECTORY, "data", "messages.json")

class PortfolioHTTPRequestHandler(http.server.SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=DIRECTORY, **kwargs)

    def end_headers(self):
        # Disable caching for development
        self.send_header('Cache-Control', 'no-cache, no-store, must-revalidate')
        self.send_header('Pragma', 'no-cache')
        self.send_header('Expires', '0')
        super().end_headers()

    def do_GET(self):
        parsed = urlparse(self.path)
        if parsed.path == '/api/messages':
            self.send_response(200)
            self.send_header('Content-Type', 'application/json')
            self.send_header('Access-Control-Allow-Origin', '*')
            self.end_headers()
            if os.path.exists(MESSAGES_FILE):
                with open(MESSAGES_FILE, 'r', encoding='utf-8') as f:
                    content = f.read()
            else:
                content = "[]"
            self.wfile.write(content.encode('utf-8'))
            return
        elif parsed.path == '/health':
            self.send_response(200)
            self.send_header('Content-Type', 'application/json')
            self.send_header('Access-Control-Allow-Origin', '*')
            self.end_headers()
            self.wfile.write(b'{"status": "ok", "portfolio": "G. Chandrika"}')
            return

        return super().do_GET()

    def do_POST(self):
        parsed = urlparse(self.path)
        if parsed.path == '/api/contact':
            content_length = int(self.headers.get('Content-Length', 0))
            post_data = self.rfile.read(content_length)
            
            try:
                content_type = self.headers.get('Content-Type', '')
                if 'application/json' in content_type:
                    data = json.loads(post_data.decode('utf-8'))
                else:
                    form = parse_qs(post_data.decode('utf-8'))
                    data = {k: v[0] for k, v in form.items()}
                
                name = data.get('name', '').strip()
                email = data.get('email', '').strip()
                subject = data.get('subject', '').strip()
                message = data.get('message', '').strip()

                if not name or not email or not message:
                    self.send_response(400)
                    self.send_header('Content-Type', 'application/json')
                    self.send_header('Access-Control-Allow-Origin', '*')
                    self.end_headers()
                    self.wfile.write(json.dumps({
                        "success": False,
                        "error": "Name, email, and message are required fields."
                    }).encode('utf-8'))
                    return

                new_entry = {
                    "id": int(datetime.now().timestamp() * 1000),
                    "timestamp": datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
                    "name": name,
                    "email": email,
                    "subject": subject if subject else "General Inquiry",
                    "message": message,
                    "client_ip": self.client_address[0]
                }

                messages = []
                if os.path.exists(MESSAGES_FILE):
                    try:
                        with open(MESSAGES_FILE, 'r', encoding='utf-8') as f:
                            messages = json.load(f)
                    except Exception:
                        messages = []

                messages.append(new_entry)

                os.makedirs(os.path.dirname(MESSAGES_FILE), exist_ok=True)
                with open(MESSAGES_FILE, 'w', encoding='utf-8') as f:
                    json.dump(messages, f, indent=2, ensure_ascii=False)

                self.send_response(200)
                self.send_header('Content-Type', 'application/json')
                self.send_header('Access-Control-Allow-Origin', '*')
                self.end_headers()
                response = {
                    "success": True,
                    "message": f"Thank you, {name}! Your message has been received. Chandrika will review it and reply to {email} shortly.",
                    "entry_id": new_entry["id"]
                }
                self.wfile.write(json.dumps(response).encode('utf-8'))
                print(f"[CONTACT FORM] Stored message from {name} <{email}>: {subject}")
                return

            except Exception as e:
                self.send_response(500)
                self.send_header('Content-Type', 'application/json')
                self.send_header('Access-Control-Allow-Origin', '*')
                self.end_headers()
                self.wfile.write(json.dumps({
                    "success": False,
                    "error": str(e)
                }).encode('utf-8'))
                return

        self.send_response(404)
        self.end_headers()

    def do_OPTIONS(self):
        self.send_response(200)
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type')
        self.end_headers()

class ThreadedHTTPServer(socketserver.ThreadingMixIn, socketserver.TCPServer):
    allow_reuse_address = True

if __name__ == '__main__':
    port = int(sys.argv[1]) if len(sys.argv) > 1 else PORT
    with ThreadedHTTPServer(('0.0.0.0', port), PortfolioHTTPRequestHandler) as httpd:
        print(f"==================================================")
        print(f" Portfolio Server Running Locally")
        print(f" URL: http://localhost:{port}")
        print(f" Serving Directory: {DIRECTORY}")
        print(f" Contact endpoint: http://localhost:{port}/api/contact")
        print(f" View messages: http://localhost:{port}/api/messages")
        print(f"==================================================")
        try:
            httpd.serve_forever()
        except KeyboardInterrupt:
            print("\nShutting down server...")
            httpd.server_close()
