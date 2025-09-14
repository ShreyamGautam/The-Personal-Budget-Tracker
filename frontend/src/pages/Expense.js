import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import Modal from 'react-modal';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import './Expense.css';
import { Chart as ChartJs, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';
import { Line } from 'react-chartjs-2';
import TransactionItem from '../components/TransactionItem';
import TransactionForm from '../components/TransactionForm';
import { FaDownload } from 'react-icons/fa';

Modal.setAppElement('#root');
ChartJs.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const Expense = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [expenses, setExpenses] = useState([]);
  const [currentItem, setCurrentItem] = useState(null);
  const [chartApiData, setChartApiData] = useState({
    labels: [],
    datasets: [{
      label: 'Expense',
      data: [],
      borderColor: '#FF5A5A',
      backgroundColor: 'rgba(255, 90, 90, 0.1)',
      tension: 0.4,
      fill: true,
    }]
  });
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [dateRangeFilter, setDateRangeFilter] = useState('all');
  const [uniqueCategories, setUniqueCategories] = useState([]);

  const fetchExpenses = useCallback(async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/v1/get-transactions', {
        params: {
          type: 'expense',
          category: categoryFilter,
          dateRange: dateRangeFilter
        }
      });
      setExpenses(response.data);
      const categories = [...new Set(response.data.map(item => item.category))];
      setUniqueCategories(categories);
    } catch (error) {
      console.error("Could not fetch expenses:", error);
    }
  }, [categoryFilter, dateRangeFilter]);

  const fetchChartData = useCallback(async () => {
    try {
        const response = await axios.get('http://localhost:5000/api/v1/thirty-day-expenses');
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
    fetchExpenses();
    fetchChartData();
  }, [fetchExpenses, fetchChartData]);
  
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

const handleDownloadPDF = () => {
    const doc = new jsPDF();
    
    // Set a standard font
    doc.setFont('Helvetica');

    doc.text("Expense Report", 14, 15);

    const tableColumns = ["Date", "Title", "Category", "Amount"];
    const tableRows = [];

    expenses.forEach(expense => {
      const formattedAmount = `Rs. ${expense.amount}`;

      const expenseData = [
        new Date(expense.date).toLocaleDateString(),
        expense.title,
        expense.category,
        formattedAmount
      ];
      tableRows.push(expenseData);
    });

    autoTable(doc, { startY: 20, head: [tableColumns], body: tableRows });
    doc.save('expenses-report.pdf');
};
  const chartOptions = {
    responsive: true,
    plugins: {
      legend: { position: 'top' },
      title: { display: true, text: 'Monthly Expense Overview' },
    },
  };

  return (
    <div className='expense-container'>
      <Modal isOpen={isModalOpen} onRequestClose={closeModal} style={{ content: { top: '50%', left: '50%', right: 'auto', bottom: 'auto', marginRight: '-50%', transform: 'translate(-50%, -50%)', width: '400px', borderRadius: '12px' } }}>
        <TransactionForm type="expense" closeModal={closeModal} onSuccess={refreshData} currentItem={currentItem} />
      </Modal>
      <div className="expense-header">
        <h1>Expenses</h1>
        <button onClick={() => setIsModalOpen(true)} className='add-expense-btn'>+ Add Expense</button>
      </div>
      <div className="expense-content">
        <div className="chart-section">
          <Line options={chartOptions} data={chartApiData} />
        </div>
        <div className="list-section">
          <div className="list-header">
            <h2>Expense History</h2>
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
          <ul className='expense-list'>
            {(expenses || []).filter(item => item.title.toLowerCase().includes(searchQuery.toLowerCase())).map((item) => (
              <TransactionItem key={item._id} id={item._id} onDelete={handleDelete} onEdit={() => handleEdit(item)} icon={item.icon} title={item.title} date={new Date(item.date).toLocaleDateString()} amount={item.amount} type={item.type} />
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Expense;
