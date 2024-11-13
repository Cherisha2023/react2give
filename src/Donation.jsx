import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { getFirestore, collection, addDoc } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCreditCard, faBank, faMobileAlt } from '@fortawesome/free-solid-svg-icons';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 2rem;
`;

const Header = styled.div`
  display: flex;
  justify-content: flex-end;
  width: 100%;
  padding: 1rem;
  background-color: #f7f7f7;
  position: absolute;
  top: 0;
  right: 0;
`;

const LogoutButton = styled.button`
  background: none;
  border: none;
  color: #ff7e5f;
  font-weight: bold;
  cursor: pointer;
  &:hover {
    color: #feb47b;
  }
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  align-items: center;
  background: white;
  padding: 2rem;
  border-radius: 10px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
  width: 90%;
  max-width: 500px;
  margin-top: 3rem;
`;

const Input = styled.input`
  width: 100%;
  padding: 1rem;
  margin: 0.5rem 0;
  border: 1px solid #ddd;
  border-radius: 5px;
  font-size: 1rem;
  box-sizing: border-box;
`;

const Button = styled.button`
  width: 100%;
  padding: 1rem;
  margin: 1rem 0;
  border: none;
  border-radius: 5px;
  background: #ff7e5f;
  color: white;
  font-size: 1rem;
  cursor: pointer;
  &:hover {
    background: #feb47b;
  }
`;

const PaymentModes = styled.div`
  display: flex;
  justify-content: space-around;
  width: 100%;
  margin: 1rem 0;
`;

const PaymentOption = styled.div`
  text-align: center;
  cursor: pointer;
  padding: 1rem;
  border: 1px solid #ddd;
  border-radius: 5px;
  width: 30%;
  background: ${({ selected }) => (selected ? '#feb47b' : 'white')};
  color: ${({ selected }) => (selected ? 'white' : 'black')};
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const RazorpayImage = styled.img`
  margin: 1rem 0;
  max-width: 100%;
  height: auto;
`;

const Icon = styled(FontAwesomeIcon)`
  font-size: 2rem;
  margin-bottom: 0.5rem;
`;

const Donation = () => {
  const [amount, setAmount] = useState('');
  const [paymentMode, setPaymentMode] = useState('');
  const navigate = useNavigate();

  const auth = getAuth();
  const user = auth.currentUser;

  if (!user) {
    navigate('/login'); // Redirect to login if not authenticated
  }

  const selectPaymentMode = (mode) => {
    setPaymentMode(mode);
  };

  const handleLogout = () => {
    // Perform logout logic
    auth.signOut().then(() => {
      alert('You have been logged out.');
      navigate('/'); // Redirect to login page
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (amount === "") {
      alert("Please enter the amount");
      return;
    }

    if (paymentMode === "") {
      alert("Please select a payment mode");
      return;
    }

    const options = {
      key: "rzp_test_XdJ18xJhFvpuOD",
      key_secret: "J1ctt40eectgAs5COl5baMcX",
      amount: amount * 100, // Amount in paise
      currency: "INR",
      name: "non-profit",
      description: "for testing purpose",
      handler: async (response) => {
        alert(`Payment Successful! Payment ID: ${response.razorpay_payment_id}`);
        try {
          const db = getFirestore();
          await addDoc(collection(db, 'donations'), {
            donorName: user.displayName || "Anonymous",
            amount: parseInt(amount, 10),
            paymentMode,
            date: new Date(),
            paymentId: response.razorpay_payment_id,
          });
          navigate('/payment-success', { state: { amount, paymentMode } });
        } catch (error) {
          console.error("Error adding donation: ", error);
          alert("Error saving donation. Please try again.");
        }
      },
      prefill: {
        name: user.displayName || "Anonymous",
        email: user.email || "",
        contact: user.phoneNumber || "1234567890"
      },
      notes: {
        address: "Razorpay Corporate office"
      },
      theme: {
        color: "#ff7e5f"
      },
      modal: {
        ondismiss: function () {
          alert('Payment window closed by user');
        }
      }
    };
    const pay = new window.Razorpay(options);
    pay.open();
  };

  return (
    <Container>
      <Header>
        <LogoutButton onClick={handleLogout}>Logout</LogoutButton>
      </Header>
      <Form onSubmit={handleSubmit}>
        <h1>Donate</h1>
        <label htmlFor="amount">Select Amount:</label>
        <Input
          type="number"
          id="amount"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          min="1"
        />
        <PaymentModes>
          <PaymentOption
            selected={paymentMode === 'netbanking'}
            onClick={() => selectPaymentMode('netbanking')}
          >
            <Icon icon={faBank} />
            Netbanking
          </PaymentOption>
          <PaymentOption
            selected={paymentMode === 'upi'}
            onClick={() => selectPaymentMode('upi')}
          >
            <Icon icon={faMobileAlt} />
            UPI
          </PaymentOption>
          <PaymentOption
            selected={paymentMode === 'card'}
            onClick={() => selectPaymentMode('card')}
          >
            <Icon icon={faCreditCard} />
            Card
          </PaymentOption>
        </PaymentModes>
        <RazorpayImage src="src/razor2.png" alt="Razorpay" />
        <Button type="submit">Donate</Button>
      </Form>
    </Container>
  );
};

export default Donation;
