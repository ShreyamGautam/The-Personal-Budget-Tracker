import React from 'react';
import './TransactionItem.css';
import { FaTrashAlt, FaEdit, FaRegMoneyBillAlt, FaShoppingBag } from 'react-icons/fa';

const DefaultIcon = ({ type }) => {
    return type === 'income' ? <FaRegMoneyBillAlt /> : <FaShoppingBag />;
};

const TransactionItem = ({ icon, title, date, amount, type, id, onDelete, onEdit }) => {
  return (
    <li className='transaction-item'>
      <div className="item-details">
        <div className="item-icon" style={{ background: type === 'expense' ? '#FFE0E0' : '#D4F4E2', fontSize: icon ? '1.5rem' : 'inherit' }}>
          {icon ? icon : <DefaultIcon type={type} />}
        </div>
        <div className="item-info">
            <h4>{title}</h4>
            <p>{date}</p>
        </div>
      </div>
      <div className="item-amount-delete">
        <span style={{ color: type === 'expense' ? '#FF5A5A' : '#32C48D' }}>
          {/* --- CHANGE IS HERE --- */}
          {type === 'expense' ? '- ' : '+ '}₹{amount.toLocaleString('en-IN')}
        </span>
        <button onClick={() => onEdit()} className="edit-btn">
          <FaEdit />
        </button>
        <button onClick={() => onDelete(id)} className="delete-btn">
          <FaTrashAlt />
        </button>
      </div>
    </li>
  );
};

export default TransactionItem;