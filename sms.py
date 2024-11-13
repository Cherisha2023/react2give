import pandas as pd
from twilio.rest import Client

from flask import Flask
from flask_cors import CORS

app = Flask(__name__)
CORS(app)  # This will enable CORS for all routes

@app.route('/send-sms', methods=['POST'])
def send_sms():
    # Your logic to send SMS
    return {'status': 'success', 'message': 'SMS sent!'}

# Twilio credentials
account_sid = 'AC639f1a69925241b85e72361eaeaffa77'
auth_token = 'f05440dbad07b0ebe0d7da96b8ee7bb0'
twilio_phone_number = '+19124000894'

# Initialize Twilio client
client = Client(account_sid, auth_token)

# Read the Excel sheet
file_path = "three.xlsx"  # Update with the correct path to your file
df = pd.read_excel(file_path)

# Extract phone numbers from the 'studentNumber' column and format them
phone_numbers = df['studentNumber'].tolist()
formatted_numbers = [f"+91{number}" for number in phone_numbers]  # Adding country code for India

# Message to be sent
message_body = "Hey MSEC Alumni! Please consider donating!."

# Loop through the phone numbers and send SMS
for number in formatted_numbers:
    try:
        message = client.messages.create(
            body=message_body,
            from_=twilio_phone_number,
            to=number
        )
        print(f"Message sent to {number}. SID: {message.sid}")
    except Exception as e:
        print(f"Failed to send message to {number}. Error: {e}")
