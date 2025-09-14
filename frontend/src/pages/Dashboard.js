import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import Modal from 'react-modal';
import './Dashboard.css';
import SummaryCard from '../components/SummaryCard';
import TransactionItem from '../components/TransactionItem';
import TransactionForm from '../components/TransactionForm';
import { FaWallet, FaRegArrowAltCircleUp, FaRegArrowAltCircleDown } from 'react-icons/fa';
import { Chart as ChartJs, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement } from 'chart.js';
import { Doughnut, Bar } from 'react-chartjs-2';

ChartJs.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement);
Modal.setAppElement('#root');

const Dashboard = () => {
    const [summary, setSummary] = useState({ totalIncome: 0, totalExpenses: 0, totalBalance: 0 });
    const [recentTransactions, setRecentTransactions] = useState([]);
    const [thirtyDayExpenses, setThirtyDayExpenses] = useState({ labels: [], data: [] });
    const [sixtyDayIncome, setSixtyDayIncome] = useState({ labels: [], data: [] });
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentItem, setCurrentItem] = useState(null);

    const fetchData = useCallback(async () => {
        try {
            const [summaryRes, transactionsRes, expensesRes, incomeRes] = await Promise.all([
                axios.get('http://localhost:5000/api/v1/dashboard-summary'),
                axios.get('http://localhost:5000/api/v1/get-transactions'),
                axios.get('http://localhost:5000/api/v1/thirty-day-expenses'),
                axios.get('http://localhost:5000/api/v1/sixty-day-income')
            ]);
            
            setSummary(summaryRes.data);
            setRecentTransactions(transactionsRes.data);

            const expenseData = expensesRes.data;
            setThirtyDayExpenses({
                labels: expenseData.map(item => new Date(item._id).toLocaleDateString('en-US', { day: 'numeric', month: 'short' })),
                data: expenseData.map(item => item.total)
            });

            const incomeData = incomeRes.data;
            setSixtyDayIncome({
                labels: incomeData.map(item => item._id),
                data: incomeData.map(item => item.total)
            });

        } catch (error) {
            console.error("Failed to fetch dashboard data:", error);
        }
    }, []);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    const handleDelete = async (id) => {
        try {
            await axios.delete(`http://localhost:5000/api/v1/delete-transaction/${id}`);
            fetchData();
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
    
    const overviewChartData = {
        labels: ['Total Income', 'Total Expenses'],
        datasets: [{
            data: [summary.totalIncome, summary.totalExpenses],
            backgroundColor: ['#32C48D', '#FF5A5A'],
            borderColor: ['#ffffff'],
            borderWidth: 2,
        }]
    };
    const expenseChartData = {
        labels: thirtyDayExpenses.labels,
        datasets: [{
            label: 'Expense',
            data: thirtyDayExpenses.data,
            backgroundColor: 'rgba(90, 79, 207, 0.8)',
            borderRadius: 5,
        }]
    };
    const incomeChartData = {
        labels: sixtyDayIncome.labels,
        datasets: [{ 
            data: sixtyDayIncome.data, 
            backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF'] 
        }]
    };

    return (
        <div className="dashboard">
            <Modal 
                isOpen={isModalOpen} 
                onRequestClose={closeModal}
                style={{ content: { top: '50%', left: '50%', right: 'auto', bottom: 'auto', marginRight: '-50%', transform: 'translate(-50%, -50%)', width: '400px', borderRadius: '12px' } }}
            >
                <TransactionForm type={currentItem?.type} closeModal={closeModal} onSuccess={fetchData} currentItem={currentItem} />
            </Modal>

            <h1>Dashboard</h1>
            <div className="summary-cards-container">
                {/* --- CHANGES ARE HERE --- */}
                <SummaryCard icon={<FaWallet />} title="Total Balance" value={`₹${summary.totalBalance.toLocaleString('en-IN')}`} bgColor="#E0DFFF" iconColor="#5A4FCF"/>
                <SummaryCard icon={<FaRegArrowAltCircleUp />} title="Total Income" value={`₹${summary.totalIncome.toLocaleString('en-IN')}`} bgColor="#D4F4E2" iconColor="#32C48D"/>
                <SummaryCard icon={<FaRegArrowAltCircleDown />} title="Total Expenses" value={`₹${summary.totalExpenses.toLocaleString('en-IN')}`} bgColor="#FFE0E0" iconColor="#FF5A5A"/>
            </div>

            <div className="dashboard-grid">
                <div className="grid-item card">
                    <h3>Recent Transactions</h3>
                    {(recentTransactions || []).slice(0, 5).map(item => (
                        <TransactionItem key={item._id} id={item._id} onDelete={handleDelete} onEdit={() => handleEdit(item)} {...item} date={new Date(item.date).toLocaleDateString()} />
                    ))}
                </div>
                 <div className="grid-item card">
                    <h3>Financial Overview</h3>
                    <div className="chart-wrapper">
                        <Doughnut data={overviewChartData} options={{ responsive: true, cutout: '60%', plugins: { legend: { display: false } } }} />
                    </div>
                </div>
                <div className="grid-item card">
                    <h3>Expenses</h3>
                    {/* --- CHANGES ARE HERE --- */}
                    {(recentTransactions || []).filter(t => t.type === 'expense').slice(0,4).map(item => (
                        <div key={item._id} className="mini-transaction">{item.title}<span>-₹{item.amount.toLocaleString('en-IN')}</span></div>
                    ))}
                </div>
                <div className="grid-item card">
                    <h3>Last 30 Days Expenses</h3>
                    <Bar data={expenseChartData} options={{ responsive: true }} />
                </div>
                <div className="grid-item card">
                    <h3>Last 60 Days Income</h3>
                    <div className="chart-wrapper">
                        <Doughnut data={incomeChartData} options={{ responsive: true, cutout: '60%', plugins: { legend: { position: 'bottom' } } }} />
                    </div>
                </div>
                <div className="grid-item card">
                    <h3>Income</h3>
                    {/* --- CHANGES ARE HERE --- */}
                    {(recentTransactions || []).filter(t => t.type === 'income').slice(0,4).map(item => (
                        <div key={item._id} className="mini-transaction">{item.title}<span>+₹{item.amount.toLocaleString('en-IN')}</span></div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Dashboard;