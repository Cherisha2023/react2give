// Payment.js
import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const Payment = () => {
  const location = useLocation();
  const { amount } = location.state;

  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    document.body.appendChild(script);

    script.onload = async () => {
      try {
        const response = await fetch('/api/createOrder', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ amount }),
        });

        if (!response.ok) {
          throw new Error('Failed to create order');
        }

        const data = await response.json();

        const options = {
          key: 'rzp_test_XdJ18xJhFvpuOD', // Replace with your actual Razorpay Key ID
          amount: data.amount,
          currency: data.currency,
          name: 'Your Company Name',
          description: 'Test Transaction',
          order_id: data.id,
          handler: async (response) => {
            try {
              const verifyResponse = await fetch('/api/verifyPayment', {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify(response),
              });
              const verifyResult = await verifyResponse.json();
              if (verifyResult.status === 'success') {
                alert('Payment successful!');
              } else {
                alert('Payment verification failed!');
              }
            } catch (error) {
              console.error('Verification error:', error);
              alert('Payment verification failed!');
            }
          },
          prefill: {
            name: '',
            email: '',
            contact: '',
          },
          notes: {
            address: '',
          },
          theme: {
            color: '#3399cc',
          },
        };

        const rzp1 = new window.Razorpay(options);
        rzp1.on('payment.failed', function (response) {
          alert('Payment failed. Reason: ' + response.error.reason);
        });
        rzp1.open();
      } catch (error) {
        console.error('Payment error:', error);
        alert('Payment failed!');
      }
    };

    // Cleanup script
    return () => {
      document.body.removeChild(script);
    };
  }, [amount]);

  return (
    <div style={{ textAlign: 'center', marginTop: '2rem' }}>
      <h2>Processing Payment...</h2>
      <p>Amount: ₹{amount}</p>
    </div>
  );
};

export default Payment;
