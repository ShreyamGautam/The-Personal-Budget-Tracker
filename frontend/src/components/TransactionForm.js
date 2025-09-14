import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Picker from 'emoji-picker-react';
import './TransactionForm.css';

// The form now accepts a 'currentItem' prop, which will be the transaction we are editing
const TransactionForm = ({ type, closeModal, onSuccess, currentItem }) => {
  const [title, setTitle] = useState('');
  const [amount, setAmount] = useState('');
  const [date, setDate] = useState('');
  const [category, setCategory] = useState('');
  const [chosenEmoji, setChosenEmoji] = useState(null);
  const [showPicker, setShowPicker] = useState(false);

  // This useEffect hook fills the form with existing data when in "edit" mode
  useEffect(() => {
    if (currentItem) {
      setTitle(currentItem.title);
      setAmount(currentItem.amount);
      // Format the date correctly for the input field (YYYY-MM-DD)
      setDate(new Date(currentItem.date).toISOString().split('T')[0]);
      setCategory(currentItem.category);
      setChosenEmoji(currentItem.icon);
    }
  }, [currentItem]);

  const onEmojiClick = (emojiObject) => {
    setChosenEmoji(emojiObject.emoji);
    setShowPicker(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const transactionData = { title, amount: Number(amount), date, category, type, icon: chosenEmoji };

    try {
      if (currentItem) {
        // If we are editing, send a PUT request
        await axios.put(`http://localhost:5000/api/v1/update-transaction/${currentItem._id}`, transactionData);
      } else {
        // If we are adding, send a POST request
        await axios.post('http://localhost:5000/api/v1/add-transaction', transactionData);
      }
      onSuccess();
      closeModal();
    } catch (error) {
      console.error('Error submitting transaction:', error);
      alert('Failed to submit transaction.');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="transaction-form">
      {/* The title changes based on whether we are adding or editing */}
      <h2>{currentItem ? 'Edit' : 'Add New'} {type === 'income' ? 'Income' : 'Expense'}</h2>
      
      {/* ... The rest of the form is the same ... */}
      <div className="icon-title-group">
        <input type="text" placeholder={type === 'income' ? "Income Source" : "Expense Item"} value={title} onChange={(e) => setTitle(e.target.value)} required />
        <button type="button" className="icon-picker-btn" onClick={() => setShowPicker(val => !val)}>
          {chosenEmoji ? chosenEmoji : '🖼️'}
        </button>
      </div>
      {showPicker && <div className="picker-container"><Picker onEmojiClick={onEmojiClick} /></div>}
      <div className="form-group"><input type="number" placeholder="Amount" value={amount} onChange={(e) => setAmount(e.target.value)} required /></div>
      <div className="form-group"><input type="date" value={date} onChange={(e) => setDate(e.target.value)} required /></div>
      <div className="form-group"><input type="text" placeholder="Category" value={category} onChange={(e) => setCategory(e.target.value)} required /></div>
      <button type="submit">{currentItem ? 'Update' : 'Add'} Transaction</button>
    </form>
  );
};

export default TransactionForm;