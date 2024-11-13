import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './Login';
import Register from './Register';
import Donation from './Donation';
import Profile from './Profile';
import Layout from './Layout';
import Payment from './Payment';
import AdminDashboard from './AdminDashboard';
import OrganizationRegistration from './OrganizationRegistration';
import PaymentSuccess from './PaymentSuccess';  // Import the PaymentSuccess component

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/donation" element={<Layout><Donation /></Layout>} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/payment" element={<Payment />} />
        <Route path="/payment-success" element={<PaymentSuccess />} /> {/* PaymentSuccess route */}
        <Route path="/organization-registration" element={<OrganizationRegistration />} />
        <Route path="/admin-dashboard" element={<AdminDashboard />} />
      </Routes>
    </Router>
  );
}

export default App;
