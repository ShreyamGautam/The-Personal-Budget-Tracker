import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import Modal from 'react-modal';
import TransactionForm from '../components/TransactionForm';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import './Income.css';
import { Chart as ChartJs, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import { Bar } from 'react-chartjs-2';
import TransactionItem from '../components/TransactionItem';
import { FaDownload } from 'react-icons/fa';

Modal.setAppElement('#root');
ChartJs.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const Income = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [incomes, setIncomes] = useState([]);
  const [currentItem, setCurrentItem] = useState(null);
  const [chartApiData, setChartApiData] = useState({
    labels: [],
    datasets: [{
      label: 'Income',
      data: [],
      backgroundColor: 'rgba(90, 79, 207, 0.8)',
      borderRadius: 5,
    }]
  });
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [dateRangeFilter, setDateRangeFilter] = useState('all');
  const [uniqueCategories, setUniqueCategories] = useState([]);

  const fetchIncomes = useCallback(async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/v1/get-transactions', {
        params: {
          type: 'income',
          category: categoryFilter,
          dateRange: dateRangeFilter
        }
      });
      setIncomes(response.data);
      const categories = [...new Set(response.data.map(item => item.category))];
      setUniqueCategories(categories);
    } catch (error) {
      console.error("Could not fetch incomes:", error);
    }
  }, [categoryFilter, dateRangeFilter]);

  const fetchChartData = useCallback(async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/v1/thirty-day-income');
      const summary = response.data;
      const labels = summary.map(item => new Date(item._id).toLocaleDateString('en-US', { day: 'numeric', month: 'short' }));
      const data = summary.map(item => item.total);
      setChartApiData({
        labels: labels,
        datasets: [{ ...chartApiData.datasets[0], data: data }]
      });
    } catch (error) {
      console.error("Could not fetch chart data:", error);
    }
  }, [chartApiData.datasets]);
  
  const refreshData = useCallback(() => {
    fetchIncomes();
    fetchChartData();
  }, [fetchIncomes, fetchChartData]);

  useEffect(() => {
    refreshData();
  }, [refreshData]);

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/v1/delete-transaction/${id}`);
      refreshData();
    } catch (error) {
      console.error("Failed to delete transaction:", error);
    }
  };

  const handleEdit = (item) => {
    setCurrentItem(item);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setCurrentItem(null);
  };

  // Income.js ke andar
const handleDownloadPDF = () => {
    const doc = new jsPDF();
    
    doc.setFont('Helvetica');

    doc.text("Income Report", 14, 15);

    const tableColumns = ["Date", "Title", "Category", "Amount"];
    const tableRows = [];

    incomes.forEach(income => {
      
      const formattedAmount = `Rs. ${income.amount}`;
      
      const incomeData = [
        new Date(income.date).toLocaleDateString(),
        income.title,
        income.category,
        formattedAmount
      ];
      tableRows.push(incomeData);
    });

    autoTable(doc, { startY: 20, head: [tableColumns], body: tableRows });
    doc.save('incomes-report.pdf');
};
  const chartOptions = {
    responsive: true,
    plugins: {
      legend: { position: 'top' },
      title: { display: true, text: 'Monthly Income Overview' },
    },
  };

  return (
    <div className='income-container'>
      <Modal isOpen={isModalOpen} onRequestClose={closeModal} style={{ content: { top: '50%', left: '50%', right: 'auto', bottom: 'auto', marginRight: '-50%', transform: 'translate(-50%, -50%)', width: '400px', borderRadius: '12px' } }}>
        <TransactionForm type="income" closeModal={closeModal} onSuccess={refreshData} currentItem={currentItem} />
      </Modal>
      <div className="income-header">
        <h1>Incomes</h1>
        <button onClick={() => setIsModalOpen(true)} className='add-income-btn'>+ Add Income</button>
      </div>
      <div className="income-content">
        <div className="chart-section">
          <Bar options={chartOptions} data={chartApiData} />
        </div>
        <div className="list-section">
          <div className="list-header">
            <h2>Income Sources</h2>
            <button onClick={handleDownloadPDF} className="download-btn"><FaDownload /> Download</button>
          </div>
          <div className="filters-container">
            <select value={categoryFilter} onChange={(e) => setCategoryFilter(e.target.value)}>
              <option value="all">All Categories</option>
              {uniqueCategories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
            </select>
            <div className="date-filters">
              <button onClick={() => setDateRangeFilter('all')} className={dateRangeFilter === 'all' ? 'active' : ''}>All Time</button>
              <button onClick={() => setDateRangeFilter('month')} className={dateRangeFilter === 'month' ? 'active' : ''}>This Month</button>
              <button onClick={() => setDateRangeFilter('6months')} className={dateRangeFilter === '6months' ? 'active' : ''}>Last 6 Months</button>
            </div>
          </div>
          <div className="search-bar-container">
            <input type="text" placeholder="Search by title..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
          </div>
          <ul className='income-list'>
            {(incomes || []).filter(item => item.title.toLowerCase().includes(searchQuery.toLowerCase())).map((item) => (
              <TransactionItem key={item._id} id={item._id} onDelete={handleDelete} onEdit={() => handleEdit(item)} icon={item.icon} title={item.title} date={new Date(item.date).toLocaleDateString()} amount={item.amount} type={item.type} />
            ))}
          </ul>
        </div>
      </div>
    </div>
  ); 
};

export default Income;
