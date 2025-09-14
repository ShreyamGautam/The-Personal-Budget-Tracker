import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './RecentTransactions.css';
import TransactionItem from './TransactionItem';

const RecentTransactions = () => {
  const [transactions, setTransactions] = useState([]);

  const fetchTransactions = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/v1/get-transactions');
      // Show latest 5 transactions
      setTransactions(response.data.slice(0, 5));
    } catch (error) {
      console.error("Could not fetch transactions:", error);
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, []);
  
  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/v1/delete-transaction/${id}`);
      fetchTransactions();
    } catch (error) {
      console.error("Failed to delete transaction:", error);
    }
  };

  return (
    <div className='transactions-container'>
      <div className="transactions-header">
        <h2>Recent Transactions</h2>
        <a href="#">See All</a>
      </div>
      <ul className='transactions-list'>
        {transactions.map((item) => (
          <TransactionItem
            key={item._id}
            id={item._id}
            onDelete={handleDelete}
            icon={item.icon} 
            title={item.title}
            date={new Date(item.date).toLocaleDateString()}
            amount={item.amount}
            type={item.type}
          />
        ))}
      </ul>
    </div>
  );
};

export default RecentTransactions;