import React, { useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import './Sidebar.css';
import { FaTachometerAlt, FaSignOutAlt, FaMoneyBillWave, FaPencilAlt } from "react-icons/fa"; 
import { GiPayMoney, GiReceiveMoney } from "react-icons/gi";
import userImage from './user.png';
import { FaUserFriends } from "react-icons/fa";

const Sidebar = ({ onLogout, user, onUpdatePicture }) => { 
  const location = useLocation();
  const fileInputRef = useRef(null); 

  const handleImageClick = () => {
    fileInputRef.current.click();
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      onUpdatePicture(file);
    }
  };

  return (
    <nav className='sidebar'>
      <div className="user-profile">
        <input 
          type="file" 
          ref={fileInputRef} 
          onChange={handleFileChange}
          style={{ display: 'none' }} 
          accept="image/*"
        />
        <div className="profile-picture-container" onClick={handleImageClick}>
          <img 
            src={user && user.profilePicture ? `http://localhost:5000/${user.profilePicture.replace(/\\/g, '/')}` : userImage} 
            alt="User" 
            className="profile-picture"
          />
          <div className="edit-icon">
            <FaPencilAlt /> {/* Pencil Icon Import */}
          </div>
        </div>
        <h2>{user ? user.name : 'Loading...'}</h2>
      </div>

      <ul className="nav-menu">
        <Link to="/" className='link-style'><li className={`menu-item ${location.pathname === '/' ? 'active' : ''}`}><FaTachometerAlt /><span>Dashboard</span></li></Link>
        <Link to="/income" className='link-style'><li className={`menu-item ${location.pathname === '/income' ? 'active' : ''}`}><GiReceiveMoney /><span>Income</span></li></Link>
        <Link to="/expenses" className='link-style'><li className={`menu-item ${location.pathname === '/expenses' ? 'active' : ''}`}><GiPayMoney /><span>Expense</span></li></Link>
        <Link to="/budgets" className='link-style'><li className={`menu-item ${location.pathname === '/budgets' ? 'active' : ''}`}><FaMoneyBillWave /><span>Budgets</span></li></Link>
        <Link to="/groups" className='link-style'>
              <li className={`menu-item ${location.pathname === '/groups' ? 'active' : ''}`}>
                <FaUserFriends />
                <span>Groups</span>
              </li>
            </Link>
      </ul>

      <div className="logout-menu">
        <li className="menu-item" onClick={onLogout}>
          <FaSignOutAlt />
          <span>Logout</span>
        </li>
      </div>
    </nav>
  );
};

export default Sidebar;
