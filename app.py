from flask import Flask, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)  # This will allow all domains to access your Flask app

@app.route('/send-sms', methods=['POST'])
def send_sms():
    try:
        # Simulated SMS sending logic
        return jsonify(status='success', message='SMS sent successfully!')
    except Exception as e:
        return jsonify(status='error', message=str(e)), 500

if __name__ == '__main__':
    app.run(port=5000)
