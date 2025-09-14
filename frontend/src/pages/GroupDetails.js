import React, { useState, useEffect, useCallback } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';
import Modal from 'react-modal';
import './GroupDetails.css'; 
import userIcon from '../components/user.png';
import { FaEdit, FaTrashAlt, FaUserMinus, FaPlus, FaMoneyBillWave } from 'react-icons/fa';

Modal.setAppElement('#root');

const GroupDetails = () => {
  const { groupId } = useParams();
  const navigate = useNavigate();
  const [group, setGroup] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  
  // States for modals
  const [isEditGroupModalOpen, setIsEditGroupModalOpen] = useState(false);
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
  const [isExpenseModalOpen, setIsExpenseModalOpen] = useState(false);

  // States for forms
  const [memberEmail, setMemberEmail] = useState('');
  const [groupName, setGroupName] = useState('');
  const [groupDescription, setGroupDescription] = useState('');

  // --- NEW: States for Expenses ---
  const [expenses, setExpenses] = useState([]);
  const [editingExpense, setEditingExpense] = useState(null); // To track if we are editing or adding
  const [expenseDescription, setExpenseDescription] = useState('');
  const [expenseAmount, setExpenseAmount] = useState('');
  const [paidBy, setPaidBy] = useState('');

  const fetchDetails = useCallback(async () => {
    try {
      setLoading(true);
      const [groupRes, userRes, expensesRes] = await Promise.all([
        axios.get(`http://localhost:5000/api/v1/groups/${groupId}`),
        axios.get('http://localhost:5000/api/v1/user'),
        // Assuming an endpoint to get expenses for a group
        axios.get(`http://localhost:5000/api/v1/groups/${groupId}/expenses`) 
      ]);
      
      setGroup(groupRes.data);
      setCurrentUser(userRes.data);
      setExpenses(expensesRes.data); // Set expenses from API

      setGroupName(groupRes.data.name);
      setGroupDescription(groupRes.data.description);

      // Set the default payer for new expenses as the current user
      if (userRes.data) {
        setPaidBy(userRes.data._id);
      }
      
      setLoading(false);
    } catch (error) {
      toast.error("Could not fetch group details.");
      setLoading(false);
    }
  }, [groupId]);

  useEffect(() => {
    fetchDetails();
  }, [fetchDetails]);

  // --- Modal Handlers ---
  const openAddExpenseModal = () => {
    setEditingExpense(null);
    setExpenseDescription('');
    setExpenseAmount('');
    if (currentUser) setPaidBy(currentUser._id); // Reset payer to current user
    setIsExpenseModalOpen(true);
  };

  const openEditExpenseModal = (expense) => {
    setEditingExpense(expense);
    setExpenseDescription(expense.description);
    setExpenseAmount(expense.amount);
    setPaidBy(expense.paidBy._id); // Assuming paidBy is populated with user object
    setIsExpenseModalOpen(true);
  };

  // --- CRUD Handlers ---
  const handleAddMember = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.put(`http://localhost:5000/api/v1/groups/${groupId}/members`, { email: memberEmail });
      setGroup(response.data);
      toast.success('Member added!');
      setMemberEmail('');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to add member.');
    }
  };

  const handleEditGroup = async (e) => {
    e.preventDefault();
    try {
        const response = await axios.put(`http://localhost:5000/api/v1/groups/${groupId}`, { name: groupName, description: groupDescription });
        setGroup(response.data);
        toast.success('Group updated!');
        setIsEditGroupModalOpen(false);
    } catch (error) {
        toast.error('Failed to update group.');
    }
  };

  const handleDeleteGroup = async () => {
    try {
        await axios.delete(`http://localhost:5000/api/v1/groups/${groupId}`);
        toast.success('Group deleted successfully.');
        navigate('/groups');
    } catch (error) {
        toast.error('Failed to delete group.');
    }
  };

  const handleRemoveMember = async (memberId) => {
    if (window.confirm('Are you sure you want to remove this member?')) {
        try {
            const response = await axios.delete(`http://localhost:5000/api/v1/groups/${groupId}/members/${memberId}`);
            setGroup(response.data);
            toast.success('Member removed.');
        } catch (error) {
            toast.error('Failed to remove member.');
        }
    }
  };

  // --- NEW: Expense CRUD Handlers ---
  const handleExpenseSubmit = async (e) => {
    e.preventDefault();
    const expenseData = {
        description: expenseDescription,
        amount: parseFloat(expenseAmount),
        paidBy: paidBy
    };

    try {
        if (editingExpense) {
            // Update existing expense
            const response = await axios.put(`http://localhost:5000/api/v1/groups/${groupId}/expenses/${editingExpense._id}`, expenseData);
            setExpenses(expenses.map(exp => exp._id === editingExpense._id ? response.data : exp));
            toast.success('Expense updated!');
        } else {
            // Add new expense
            const response = await axios.post(`http://localhost:5000/api/v1/groups/${groupId}/expenses`, expenseData);
            setExpenses([...expenses, response.data]);
            toast.success('Expense added!');
        }
        setIsExpenseModalOpen(false);
    } catch (error) {
        toast.error(error.response?.data?.message || 'Failed to save expense.');
    }
  };

  const handleDeleteExpense = async (expenseId) => {
    if(window.confirm('Are you sure you want to delete this expense?')) {
        try {
            await axios.delete(`http://localhost:5000/api/v1/groups/${groupId}/expenses/${expenseId}`);
            setExpenses(expenses.filter(exp => exp._id !== expenseId));
            toast.success('Expense deleted.');
        } catch (error) {
            toast.error('Failed to delete expense.');
        }
    }
  };


  if (loading) return <div className="loading">Loading...</div>;
  if (!group) return <div className="error">Group not found. <Link to="/groups">Go Back</Link></div>;

  const isCreator = currentUser && group.createdBy === currentUser._id;
  const modalStyles = {
    content: { top: '50%', left: '50%', right: 'auto', bottom: 'auto', marginRight: '-50%', transform: 'translate(-50%, -50%)', width: '450px', borderRadius: '12px', padding: '25px' }
  };

  return (
    <div className="group-details-container">
      {/* Edit Group Modal */}
      <Modal isOpen={isEditGroupModalOpen} onRequestClose={() => setIsEditGroupModalOpen(false)} style={modalStyles}>
        <form onSubmit={handleEditGroup} className="modal-form">
          <h2>Edit Group</h2>
          <input type="text" value={groupName} onChange={(e) => setGroupName(e.target.value)} placeholder="Group Name" required />
          <textarea value={groupDescription} onChange={(e) => setGroupDescription(e.target.value)} placeholder="Group Description"/>
          <button type="submit" className="form-btn">Update Group</button>
        </form>
      </Modal>

      {/* Delete Group Confirmation Modal */}
      <Modal isOpen={isDeleteConfirmOpen} onRequestClose={() => setIsDeleteConfirmOpen(false)} style={modalStyles}>
          <div className="confirmation-dialog">
            <h2>Are you sure?</h2>
            <p>Do you really want to delete this group? This process cannot be undone.</p>
            <div className="confirmation-buttons">
                <button onClick={() => setIsDeleteConfirmOpen(false)} className="cancel-btn">Cancel</button>
                <button onClick={handleDeleteGroup} className="confirm-delete-btn">Delete</button>
            </div>
          </div>
      </Modal>

      {/* --- NEW: Add/Edit Expense Modal --- */}
      <Modal isOpen={isExpenseModalOpen} onRequestClose={() => setIsExpenseModalOpen(false)} style={modalStyles}>
        <form onSubmit={handleExpenseSubmit} className="modal-form">
            <h2>{editingExpense ? 'Edit Expense' : 'Add New Expense'}</h2>
            <label>Description</label>
            <input type="text" value={expenseDescription} onChange={(e) => setExpenseDescription(e.target.value)} placeholder="e.g., Lunch at Taj Hotel" required />
            
            <label>Amount (₹)</label>
            <input type="number" value={expenseAmount} onChange={(e) => setExpenseAmount(e.target.value)} placeholder="e.g., 1500" required />

            <label>Paid by</label>
            <select value={paidBy} onChange={(e) => setPaidBy(e.target.value)} required>
                {group.members.map(member => (
                    <option key={member._id} value={member._id}>
                        {member.name}
                    </option>
                ))}
            </select>
            <button type="submit" className="form-btn">{editingExpense ? 'Update Expense' : 'Add Expense'}</button>
        </form>
      </Modal>


      <div className="group-details-header">
        <h1>{group.name}</h1>
        <p>{group.description}</p>
        {isCreator && (
            <div className="group-actions">
                <button onClick={() => setIsEditGroupModalOpen(true)} className="action-btn edit-btn"><FaEdit /> Edit Group</button>
                <button onClick={() => setIsDeleteConfirmOpen(true)} className="action-btn delete-btn"><FaTrashAlt /> Delete Group</button>
            </div>
        )}
      </div>

      <div className="group-details-content">
        <div className="members-section card">
          <h2>Members ({group.members.length})</h2>
          <form onSubmit={handleAddMember} className="add-member-form">
            <input type="email" placeholder="Add member by email" value={memberEmail} onChange={(e) => setMemberEmail(e.target.value)} required />
            <button type="submit">Add</button>
          </form>
          <ul className="members-list">
            {group.members.map(member => (
              <li key={member._id}>
                <img src={member.profilePicture ? `http://localhost:5000/${member.profilePicture.replace(/\\/g, '/')}` : userIcon} alt={member.name} className="member-avatar"/>
                <div className="member-info">
                  <span className="member-name">{member.name}</span>
                  <span className="member-email">{member.email}</span>
                </div>
                {isCreator && member._id !== currentUser._id && (
                    <button onClick={() => handleRemoveMember(member._id)} className="remove-member-btn"><FaUserMinus /></button>
                )}
              </li>
            ))}
          </ul>
        </div>
        
        {/* --- MODIFIED: Expenses Section --- */}
        <div className="expenses-section card">
            <div className="card-header">
                <h2>Group Expenses</h2>
                <button onClick={openAddExpenseModal} className="add-expense-btn"><FaPlus /> Add Expense</button>
            </div>
            <div className="expense-list">
                {expenses.length === 0 ? (
                    <p className="no-expenses">No expenses added yet. Click 'Add Expense' to get started!</p>
                ) : (
                    expenses.map(expense => (
                        <div key={expense._id} className="expense-item">
                            <div className="expense-icon"><FaMoneyBillWave /></div>
                            <div className="expense-details">
                                <span className="expense-description">{expense.description}</span>
                                <br></br>
                                <span className="expense-paid-by">Paid by {expense.paidBy.name}</span>
                            </div>
                            <div className="expense-amount">₹{expense.amount.toFixed(2)}</div>
                            <div className="expense-actions">
                                <button onClick={() => openEditExpenseModal(expense)} className="icon-btn"><FaEdit /></button>
                                <button onClick={() => handleDeleteExpense(expense._id)} className="icon-btn delete"><FaTrashAlt /></button>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>

      </div>
    </div>
  );
};

export default GroupDetails;