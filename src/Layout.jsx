
// Layout.js
import React from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';

const Navbar = styled.nav`
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: #ff7e5f;
  padding: 1rem;
`;

const NavLink = styled(Link)`
  color: white;
  text-decoration: none;
  font-size: 1rem;
  &:hover {
    text-decoration: underline;
  }
`;

const Layout = ({ children }) => {
  return (
    <>
      <Navbar>
        <h1 style={{ color: 'white' }}>To Donate please enter the Amount</h1>
        <NavLink to="/profile">Profile</NavLink>
      </Navbar>
      <main>{children}</main>
    </>
  );
};

export default Layout;
