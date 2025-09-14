import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import Modal from 'react-modal';
import toast from 'react-hot-toast';
import { Link } from 'react-router-dom';
import './Groups.css';
import { FaPlus, FaUserFriends } from 'react-icons/fa';

Modal.setAppElement('#root');

const Groups = () => {
  const [groups, setGroups] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [groupName, setGroupName] = useState('');
  const [groupDescription, setGroupDescription] = useState('');

  const fetchGroups = useCallback(async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/v1/groups');
      setGroups(response.data);
    } catch (error) {
      console.error("Failed to fetch groups:", error);
      toast.error("Could not fetch your groups.");
    }
  }, []);

  useEffect(() => {
    fetchGroups();
  }, [fetchGroups]);

  const handleCreateGroup = async (e) => {
    e.preventDefault();
    const loadingToast = toast.loading('Creating group...');
    try {
      await axios.post('http://localhost:5000/api/v1/groups', {
        name: groupName,
        description: groupDescription
      });
      toast.dismiss(loadingToast);
      toast.success('Group created successfully!');
      setIsModalOpen(false);
      setGroupName('');
      setGroupDescription('');
      fetchGroups();
    } catch (error) {
      toast.dismiss(loadingToast);
      toast.error('Failed to create group.');
    }
  };

  return (
    <div className="groups-container">
      <Modal
        isOpen={isModalOpen}
        onRequestClose={() => setIsModalOpen(false)}
        style={{ content: { top: '50%', left: '50%', right: 'auto', bottom: 'auto', marginRight: '-50%', transform: 'translate(-50%, -50%)', width: '400px', borderRadius: '12px' } }}
      >
        <form onSubmit={handleCreateGroup} className="group-form">
          <h2>Create a New Group</h2>
          <input
            type="text"
            placeholder="Group Name (e.g., Goa Trip)"
            value={groupName}
            onChange={(e) => setGroupName(e.target.value)}
            required
          />
          <textarea
            placeholder="Description (optional)"
            value={groupDescription}
            onChange={(e) => setGroupDescription(e.target.value)}
          />
          <button type="submit">Create Group</button>
        </form>
      </Modal>

      <div className="groups-header">
        <h1>Your Groups</h1>
        <button onClick={() => setIsModalOpen(true)} className="create-group-btn">
          <FaPlus /> Create Group
        </button>
      </div>

      <div className="groups-grid">
        {groups.map(group => (
          <Link to={`/groups/${group._id}`} key={group._id} className="group-card-link">
            <div className="group-card">
              <FaUserFriends className="group-icon" />
              <h3>{group.name}</h3>
              <p>{group.description || 'No description'}</p>
              <div className="member-count">{group.members.length} Members</div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default Groups;