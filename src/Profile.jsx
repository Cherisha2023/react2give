import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { auth, firestore } from './firebase';
import { doc, getDoc, updateDoc } from 'firebase/firestore';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  background: linear-gradient(135deg, #ff7e5f, #feb47b);
  padding: 2rem;
`;

const Form = styled.form`
  background: white;
  padding: 4rem;
  border-radius: 10px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
  width: 100%;
  max-width: 500px;
`;

const Input = styled.input`
  width: 100%;
  padding: 1rem;
  margin: 0.5rem 0;
  border: 1px solid #ddd;
  border-radius: 5px;
  font-size: 1rem;
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

const Title = styled.h1`
  margin-bottom: 1rem;
  color: white;
`;

const ProfileImage = styled.div`
  width: 150px;
  height: 150px;
  border-radius: 50%;
  background-size: cover;
  background-position: center;
  background-color: ${(props) => props.backgroundColor};
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 3rem;
  color: white;
  margin-bottom: 1rem;
`;

const Profile = () => {
  const [formData, setFormData] = useState({
    name: '',
    dateOfBirth: '',
    mobileNumber: '',
    gender: '',
    ageGroup: '',
    maritalStatus: '',
    email: '',
    address: '',
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserData = async () => {
      const user = auth.currentUser;
      if (user) {
        console.log("User is authenticated:", user);
        const docRef = doc(firestore, `users/${user.uid}`);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const data = docSnap.data();
          console.log("Data fetched from Firestore:", data);
          setFormData(data);
        } else {
          console.log("No such document in Firestore!");
        }
      } else {
        console.log("No user is authenticated.");
      }
      setLoading(false);
    };
    fetchUserData();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const user = auth.currentUser;
    if (user) {
      const docRef = doc(firestore, `users/${user.uid}`);
      await updateDoc(docRef, formData);
      alert('Profile updated successfully!');
    }
  };

  const getInitials = (name) => {
    return name ? name.charAt(0).toUpperCase() : 'U';
  };

  const generateRandomColor = () => {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <Container>
      <Title>Profile</Title>
      <ProfileImage backgroundColor={generateRandomColor()}>
        {getInitials(formData.name)}
      </ProfileImage>
      <Form onSubmit={handleSubmit}>
        <Input
          type="text"
          name="name"
          placeholder="Name"
          value={formData.name}
          onChange={handleChange}
        />
        <Input
          type="date"
          name="dateOfBirth"
          placeholder="Date of Birth"
          value={formData.dateOfBirth}
          onChange={handleChange}
        />
        <Input
          type="tel"
          name="mobileNumber"
          placeholder="Mobile Number"
          value={formData.mobileNumber}
          onChange={handleChange}
        />
        <Input
          type="text"
          name="gender"
          placeholder="Gender"
          value={formData.gender}
          onChange={handleChange}
        />
        <Input
          type="text"
          name="ageGroup"
          placeholder="Age Group"
          value={formData.ageGroup}
          onChange={handleChange}
        />
        <Input
          type="text"
          name="maritalStatus"
          placeholder="Marital Status"
          value={formData.maritalStatus}
          onChange={handleChange}
        />
        <Input
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email}
          disabled
        />
        <Input
          type="text"
          name="address"
          placeholder="Address"
          value={formData.address}
          onChange={handleChange}
        />
        <Button type="submit">Update Profile</Button>
      </Form>
    </Container>
  );
};

export default Profile;
