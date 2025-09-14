import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';
import './Login.css';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const loadingToast = toast.loading('Logging in...');

    try {
      const response = await axios.post('http://localhost:5000/api/v1/login', { email, password });
      
      localStorage.setItem('token', response.data.token);
      axios.defaults.headers.common['x-auth-token'] = response.data.token;

      toast.dismiss(loadingToast);
      toast.success('Logged in successfully!');

      setTimeout(() => {
        navigate('/');
      }, 1000);

    } catch (error) {
      toast.dismiss(loadingToast);
      toast.error(error.response?.data?.message || 'Login failed!');
      console.error('Login failed:', error);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-form-wrapper">
        <h2>Welcome Back</h2>
        <p>Please enter your details to log in</p>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="email">Email Address</label>
            <input 
              type="email" 
              id="email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required 
            />
          </div>
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input 
              type="password" 
              id="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required 
            />
          </div>
          <button type="submit" className="auth-btn">LOGIN</button>
        </form>
        <p className="redirect-link">
          Don't have an account? <Link to="/signup">SignUp</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;