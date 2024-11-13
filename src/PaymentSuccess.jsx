import React from 'react';
import styled from 'styled-components';
import { FaCheckCircle, FaHome, FaCreditCard } from 'react-icons/fa';
import { useLocation, useNavigate } from 'react-router-dom';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
  text-align: center;
  background: #f9f9f9;
  padding: 2rem;
`;

const SuccessIcon = styled(FaCheckCircle)`
  color: #4CAF50;
  font-size: 5rem; /* Increased font size */
  margin-bottom: 1rem;
`;

const SuccessMessage = styled.h2`
  color: #4CAF50;
  margin: 0.5rem 0;
  font-size: 2rem; /* Increased font size */
`;

const Details = styled.p`
  margin: 0.5rem 0;
  font-size: 1.5rem; /* Increased font size */
`;

const Button = styled.button`
  padding: 1rem 2rem; /* Increased padding */
  margin-top: 1rem;
  border: none;
  border-radius: 5px;
  background: #ff7e5f;
  color: white;
  font-size: 1.2rem; /* Increased font size */
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background 0.3s ease;
  &:hover {
    background: #feb47b;
  }
`;

const ButtonIcon = styled(FaHome)`
  margin-right: 0.5rem;
  font-size: 1.2rem; /* Increased icon size */
`;

const PaymentModeIcon = styled(FaCreditCard)`
  color: #4CAF50;
  font-size: 2rem; /* Increased icon size */
  vertical-align: middle;
`;

const PaymentSuccess = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { amount, paymentMode } = location.state || {};

  return (
    <Container>
      <SuccessIcon />
      <SuccessMessage>Payment Successful!</SuccessMessage>
      <Details>
        <PaymentModeIcon /> Amount: ₹{amount}
      </Details>
      <Details>Payment Mode: {paymentMode}</Details>
      <Button onClick={() => navigate('/')}>
        <ButtonIcon /> Go to Home
      </Button>
    </Container>
  );
};

export default PaymentSuccess;
