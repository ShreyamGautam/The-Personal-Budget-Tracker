import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';
import './Signup.css';
import userIcon from '../components/user.png';

const Signup = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [profilePicture, setProfilePicture] = useState(null);
  const [previewSource, setPreviewSource] = useState('');

  const navigate = useNavigate();

  const handleFileInputChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfilePicture(file);
      previewFile(file);
    }
  };

  const previewFile = (file) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onloadend = () => {
      setPreviewSource(reader.result);
    };
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const loadingToast = toast.loading('Creating your account...');

    const formData = new FormData();
    formData.append('name', name);
    formData.append('email', email);
    formData.append('password', password);
    if (profilePicture) {
      formData.append('profilePicture', profilePicture);
    }

    try {
      await axios.post('http://localhost:5000/api/v1/register', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      toast.dismiss(loadingToast);
      toast.success('Account created! Please log in.');
      
      setTimeout(() => {
        navigate('/login');
      }, 1500);

    } catch (error) {
      toast.dismiss(loadingToast);
      toast.error(error.response?.data?.message || 'Registration failed!');
      console.error('Registration failed:', error);
    }
  };

  return (
    <div className="signup-container">
      <div className="signup-form-wrapper">
        <h2>Create an Account</h2>
        <p>Join us by entering your details below</p>
        <form onSubmit={handleSubmit}>
            
          <div className="image-upload-container">
            <label htmlFor="file-input">
              <img 
                src={previewSource || userIcon} 
                alt="Profile Preview" 
                className="profile-pic-preview"
              />
            </label>
            <input 
                id="file-input"
                type="file" 
                name="profilePicture"
                onChange={handleFileInputChange} 
                style={{ display: 'none' }}
            />
          </div>

          <div className="form-group">
            <label htmlFor="name">Full Name</label>
            <input type="text" id="name" value={name} onChange={(e) => setName(e.target.value)} required />
          </div>
          <div className="form-group">
            <label htmlFor="email">Email Address</label>
            <input type="email" id="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
          </div>
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input type="password" id="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
          </div>
          <button type="submit" className="signup-btn">SIGN UP</button>
        </form>
        <p className="login-link">
          Already have an account? <Link to="/login">Login</Link>
        </p>
      </div>
    </div>
  );
};

export default Signup;