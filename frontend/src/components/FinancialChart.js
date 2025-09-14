import React from 'react';
import { Chart as ChartJs, ArcElement, Tooltip, Legend } from 'chart.js';
import { Doughnut } from 'react-chartjs-2';
import './FinancialChart.css';


ChartJs.register(ArcElement, Tooltip, Legend);

const FinancialChart = () => {
  // Chart Data)
  const data = {
    labels: ['Total Income', 'Total Expenses'],
    datasets: [{
      data: [86200, 7100],
      backgroundColor: ['#5A4FCF', '#FF5A5A'],
      borderColor: ['#ffffff'],
      borderWidth: 2,
    }]
  };

  // Chart ke options (styling etc.)
  const options = {
    cutout: '70%', // Donut chart Hole
    plugins: {
      legend: {
        display: false
      }
    }
  };

  return (
    <div className='chart-container'>
      <h2>Financial Overview</h2>
      <div className="chart-wrapper">
        <Doughnut data={data} options={options} />
        <div className="chart-center-text">
          <h4>Total Balance</h4>
          <p>Rs.79,100</p>
        </div>
      </div>
    </div>
  );
};

export default FinancialChart;