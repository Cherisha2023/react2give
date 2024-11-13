// frontend/src/index.jsx
import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import { BrowserRouter as Router } from 'react-router-dom';
import './index.css'; // optional, if you have global styles

ReactDOM.render(
  <Router>
    <App />
  </Router>,
  document.getElementById('root')
);
