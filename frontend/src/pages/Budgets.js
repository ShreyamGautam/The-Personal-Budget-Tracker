import React from 'react';
import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import './Budgets.css';
import { FaTrashAlt } from 'react-icons/fa';

const Budgets = () => {
  const [category, setCategory] = useState('');
  const [limit, setLimit] = useState('');
  const [budgets, setBudgets] = useState([]);

  const fetchBudgets = useCallback(async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/v1/get-budgets');
      setBudgets(response.data);
    } catch (error) {
      console.error("Could not fetch budgets:", error);
    }
  }, []);

  useEffect(() => {
    fetchBudgets();
  }, [fetchBudgets]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5000/api/v1/set-budget', { category, limit: Number(limit) });
      fetchBudgets();
      setCategory('');
      setLimit('');
    } catch (error) {
      console.error("Failed to set budget:", error);
    }
  };

  const handleDeleteBudget = async (id) => {
    try {
        await axios.delete(`http://localhost:5000/api/v1/delete-budget/${id}`);
        fetchBudgets();
    } catch (error) {
        console.error("Failed to delete budget:", error);
    }
  };

  return (
    <div className="budget-container">
      <h1>Manage Budgets</h1>
      <div className="budget-content">
        <div className="budget-form-card">
          <h2>Set a New Budget</h2>
          <form onSubmit={handleSubmit}>
            <input 
              type="text" 
              placeholder="Category (e.g., Food)" 
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              required 
            />
            <input 
              type="number" 
              placeholder="Limit (e.g., 15000)" 
              value={limit}
              onChange={(e) => setLimit(e.target.value)}
              required 
            />
            <button type="submit">Set Budget</button>
          </form>
        </div>
        <div className="budget-list-card">
          <h2>Existing Budgets</h2>
          <ul className="budget-list">
            {budgets.map(budget => {
              const percentage = (budget.spent / budget.limit) * 100;
              return (
                <li key={budget._id}>
                  <div className="budget-details">
                    <div className="budget-info">
                      <span>{budget.category}</span>
                      { }
                      <span>₹{(budget.spent || 0).toLocaleString('en-IN')} / ₹{budget.limit.toLocaleString('en-IN')}</span>
                    </div>
                    <div className="progress-bar-container">
                      <div 
                        className={`progress-bar ${percentage > 100 ? 'overspent' : ''}`}
                        style={{ width: `${Math.min(percentage, 100)}%` }}
                      ></div>
                    </div>
                  </div>
                  <button onClick={() => handleDeleteBudget(budget._id)} className="delete-btn">
                    <FaTrashAlt />
                  </button>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Budgets;