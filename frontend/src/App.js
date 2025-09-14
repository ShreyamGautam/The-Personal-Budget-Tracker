import React, { useState, useEffect, useCallback } from 'react'; 
import axios from 'axios';
import './App.css';
import { Routes, Route, useNavigate } from 'react-router-dom';
import { Toaster, toast } from 'react-hot-toast';
import ProtectedRoute from './components/ProtectedRoute';
import Sidebar from './components/Sidebar';
import Dashboard from './pages/Dashboard';
import Income from './pages/Income';
import Expense from './pages/Expense';
import Budgets from './pages/Budgets';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Groups from './pages/Groups';
import GroupDetails from './pages/GroupDetails';

// --- Axios Global Setup ---
const token = localStorage.getItem('token');
if (token) {
  axios.defaults.headers.common['x-auth-token'] = token;
}

const MainLayout = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  const fetchUser = useCallback(async () => {
      try {
        if (localStorage.getItem('token')) {
          const response = await axios.get('http://localhost:5000/api/v1/user');
          setUser(response.data);
        }
      } catch (error) {
        console.error("Failed to fetch user, logging out:", error);
        localStorage.removeItem('token');
        delete axios.defaults.headers.common['x-auth-token'];
        navigate('/login');
      }
  }, [navigate]);

  useEffect(() => {
    fetchUser();
  }, [fetchUser]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    delete axios.defaults.headers.common['x-auth-token'];
    toast.success('Logged out successfully!');
    navigate('/login');
  };

  const handleProfilePictureUpdate = async (file) => {
    const formData = new FormData();
    formData.append('profilePicture', file);
    const loadingToast = toast.loading('Uploading picture...');

    try {
        const response = await axios.put('http://localhost:5000/api/v1/user/picture', formData, {
            headers: { 'Content-Type': 'multipart/form-data' }
        });
        
        setUser(response.data.user);
        toast.dismiss(loadingToast);
        toast.success('Profile picture updated!');
    } catch (error) {
        toast.dismiss(loadingToast);
        toast.error('Upload failed. Please try again.');
        console.error("Profile picture update failed:", error);
    }
  };

  return (
    <div className="App">
      <Sidebar 
        onLogout={handleLogout} 
        user={user} 
        onUpdatePicture={handleProfilePictureUpdate}
      />
      <main className="main-content">
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/income" element={<Income />} />
          <Route path="/expenses" element={<Expense />} />
          <Route path="/budgets" element={<Budgets />} />
          <Route path="/groups" element={<Groups />} />
          <Route path="/groups/:groupId" element={<GroupDetails />} />
        </Routes>
      </main>
    </div>
  );
};

function App() {
  return (
    <>
      <Toaster position="top-center" />
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route 
          path="/*" 
          element={
            <ProtectedRoute>
              <MainLayout />
            </ProtectedRoute>
          } 
        />
      </Routes>
    </>
  );
}

export default App;