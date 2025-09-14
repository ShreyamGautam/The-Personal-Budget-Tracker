import React from 'react';
import './SummaryCard.css';

const SummaryCard = ({ icon, title, value, bgColor, iconColor }) => {
  return (
    <div className='summary-card'>
      <div className="icon-container" style={{ backgroundColor: bgColor, color: iconColor }}>
        {icon}
      </div>
      <div className="card-content">
        <h3>{title}</h3>
        <h2>{value}</h2>
      </div>
    </div>
  );
};

export default SummaryCard;