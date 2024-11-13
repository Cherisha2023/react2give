const express = require('express');
const Razorpay = require('razorpay');
const bodyParser = require('body-parser');
const crypto = require('crypto');
const cors = require('cors');
const twilio = require('twilio');
const xlsx = require('xlsx');
const path = require('path');
require('dotenv').config(); // For using environment variables

const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Razorpay setup with environment variables
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// Twilio setup with environment variables
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const twilioClient = new twilio(accountSid, authToken);
const twilioPhoneNumber = process.env.TWILIO_PHONE_NUMBER; // Ensure this is in E.164 format, e.g., +91XXXXXXXXXX

// Razorpay routes
app.post('/api/createOrder', async (req, res) => {
  const { amount } = req.body;

  // Validate amount
  if (!amount || amount <= 0) {
    return res.status(400).json({ error: 'Invalid amount' });
  }

  const options = {
    amount: amount * 100, // amount in smallest currency unit (paise for INR)
    currency: 'INR',
    receipt: 'receipt_order_74394',
  };

  try {
    const order = await razorpay.orders.create(options);
    res.json(order);
  } catch (error) {
    console.error('Error creating order:', error);
    res.status(500).json({ error: 'Failed to create order' });
  }
});

app.post('/api/verifyPayment', (req, res) => {
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

  // Validate input
  if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
    return res.status(400).json({ error: 'Missing required parameters' });
  }

  const hmac = crypto.createHmac('sha256', process.env.RAZORPAY_KEY_SECRET);
  hmac.update(razorpay_order_id + '|' + razorpay_payment_id);
  const generated_signature = hmac.digest('hex');

  if (generated_signature === razorpay_signature) {
    res.status(200).json({ status: 'success' });
  } else {
    res.status(400).json({ status: 'failure', error: 'Invalid signature' });
  }
});

// SMS route with async/await handling
app.post('/send-sms', async (req, res) => {

  const filePath = path.join(__dirname, 'data', 'alumni.xlsx'); // Updated path if file is in 'data' folder
    // Adjust the path to your Excel file
  let contacts;
  
  // Read Excel file and handle errors
  try {
    const workbook = xlsx.readFile(filePath);
    const sheetName = workbook.SheetNames[0];
    contacts = xlsx.utils.sheet_to_json(workbook.Sheets[sheetName]);
  } catch (error) {
    console.error('Error reading Excel file:', error);
    return res.status(500).json({ error: 'Error reading Excel file' });
  }

  // Validate contacts data
  if (!contacts || contacts.length === 0) {
    return res.status(400).json({ error: 'No contacts found' });
  }

  try {
    const sendMessages = contacts.map(contact => {
      const phoneNumber = contact['Phone Number']; // Adjust according to your column name
      const name = contact['Name']; // Adjust according to your column name
      const message = `Dear ${name}, please consider donating!`;

      // Validate phone number
      if (!phoneNumber) {
        console.warn(`Skipping contact without phone number: ${name}`);
        return Promise.resolve(); // Skip this contact
      }

      // Return the Twilio SMS promise
      return twilioClient.messages.create({
        body: message,
        to: phoneNumber,
        from: twilioPhoneNumber,
      });
    });

    await Promise.all(sendMessages); // Wait for all messages to be sent
    res.send('SMS sent successfully!');
  } catch (error) {
    console.error('Failed to send SMS:', error);
    res.status(500).json({ error: 'Failed to send some SMS messages' });
  }
});

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});
