import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axiosInstance from '../api/axiosInstance';
import { useAuth } from '../context/AuthContext';
import { useLoading } from '../context/LoadingContext';
import { 
  FaBook, 
  FaUsers, 
  FaBookReader, 
  FaExclamationCircle, 
  FaPlus, 
  FaFolderPlus, 
  FaExchangeAlt 
} from 'react-icons/fa';
import { Bar, Pie } from 'react-chartjs-2';
import { 
  Chart as ChartJS, 
  CategoryScale, 
  LinearScale, 
  BarElement, 
  Title, 
  Tooltip, 
  Legend, 
  ArcElement 
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

const Dashboard = () => {
  const { user } = useAuth();
  const { setIsLoading } = useLoading();
  const [stats, setStats] = useState(null);
  const [chartDataMap, setChartDataMap] = useState({});
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchDashboardData = async () => {
      setIsLoading(true);
      setError('');
      try {
        const statsRes = await axiosInstance.get('/dashboard/stats');
        setStats(statsRes.data.data);

        // Fetch chart data if allowed
        if (user?.role === 'ADMIN' || user?.role === 'LIBRARIAN') {
          const chartRes = await axiosInstance.get('/dashboard/chart-data');
          setChartDataMap(chartRes.data.data || {});
        }
      } catch (err) {
        setError('Failed to fetch dashboard data');
      } finally {
        setIsLoading(false);
      }
    };
    fetchDashboardData();
  }, [user]);

  // ChartJS data configuration
  const categoryLabels = Object.keys(chartDataMap);
  const categoryCounts = Object.values(chartDataMap);

  const barChartData = {
    labels: categoryLabels,
    datasets: [
      {
        label: 'Books per Category',
        data: categoryCounts,
        backgroundColor: [
          'rgba(200, 90, 23, 0.75)',  // terracotta
          'rgba(92, 120, 102, 0.75)', // sage
          'rgba(229, 169, 59, 0.75)', // ochre
          'rgba(214, 74, 74, 0.75)',  // warm red
          'rgba(162, 62, 43, 0.75)',  // brick red
          'rgba(62, 82, 69, 0.75)',   // forest green
        ],
        borderColor: [
          '#c85a17',
          '#5c7866',
          '#e5a93b',
          '#d64a4a',
          '#a23e2b',
          '#3e5245',
        ],
        borderWidth: 1,
        borderRadius: 6,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        display: false,
      },
      title: {
        display: true,
        text: 'Books Distribution by Category',
        font: {
          size: 16,
          weight: 'bold',
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          stepSize: 1,
        },
      },
    },
  };

  return (
    <div>
      {/* Welcome Message */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 className="fw-bold text-dark mb-1">Hello, {user?.firstName || user?.username}!</h2>
          <p className="text-muted mb-0">Here is your digital library overview for today.</p>
        </div>
        <span className="text-muted d-none d-md-block fw-semibold" style={{ fontSize: '14px' }}>
          {new Date().toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
        </span>
      </div>

      {error && (
        <div className="alert alert-danger border-0 shadow-sm rounded mb-4" role="alert">
          {error}
        </div>
      )}

      {/* Stats Cards Section */}
      <div className="row g-4 mb-4">
        {/* Total Books */}
        <div className="col-12 col-sm-6 col-lg-3">
          <div className="card h-100 transition-all card-hover" style={{ borderRadius: '16px' }}>
            <div className="card-body p-4 d-flex align-items-center justify-content-between">
              <div>
                <span className="text-muted fw-semibold text-uppercase tracking-wider" style={{ fontSize: '11.5px', letterSpacing: '0.5px' }}>Total Books</span>
                <h2 className="fw-bold mb-0 mt-1 text-dark" style={{ fontSize: '28px' }}>{stats?.totalBooks ?? 0}</h2>
              </div>
              <div className="d-flex align-items-center justify-content-center" style={{ width: '48px', height: '48px', borderRadius: '12px', backgroundColor: '#f3e8ff' }}>
                <FaBook style={{ color: '#6d28d9', fontSize: '20px' }} />
              </div>
            </div>
          </div>
        </div>

        {/* Borrowed Books */}
        <div className="col-12 col-sm-6 col-lg-3">
          <div className="card h-100 transition-all card-hover" style={{ borderRadius: '16px' }}>
            <div className="card-body p-4 d-flex align-items-center justify-content-between">
              <div>
                <span className="text-muted fw-semibold text-uppercase tracking-wider" style={{ fontSize: '11.5px', letterSpacing: '0.5px' }}>Active Borrows</span>
                <h2 className="fw-bold mb-0 mt-1 text-dark" style={{ fontSize: '28px' }}>{stats?.totalBorrowedBooks ?? 0}</h2>
              </div>
              <div className="d-flex align-items-center justify-content-center" style={{ width: '48px', height: '48px', borderRadius: '12px', backgroundColor: '#d1fae5' }}>
                <FaBookReader style={{ color: '#059669', fontSize: '20px' }} />
              </div>
            </div>
          </div>
        </div>

        {/* Users */}
        <div className="col-12 col-sm-6 col-lg-3">
          <div className="card h-100 transition-all card-hover" style={{ borderRadius: '16px' }}>
            <div className="card-body p-4 d-flex align-items-center justify-content-between">
              <div>
                <span className="text-muted fw-semibold text-uppercase tracking-wider" style={{ fontSize: '11.5px', letterSpacing: '0.5px' }}>Active Readers</span>
                <h2 className="fw-bold mb-0 mt-1 text-dark" style={{ fontSize: '28px' }}>{stats?.totalUsers ?? 0}</h2>
              </div>
              <div className="d-flex align-items-center justify-content-center" style={{ width: '48px', height: '48px', borderRadius: '12px', backgroundColor: '#fef3c7' }}>
                <FaUsers style={{ color: '#d97706', fontSize: '20px' }} />
              </div>
            </div>
          </div>
        </div>

        {/* Overdue Loans */}
        <div className="col-12 col-sm-6 col-lg-3">
          <div className="card h-100 transition-all card-hover" style={{ borderRadius: '16px' }}>
            <div className="card-body p-4 d-flex align-items-center justify-content-between">
              <div>
                <span className="text-muted fw-semibold text-uppercase tracking-wider" style={{ fontSize: '11.5px', letterSpacing: '0.5px' }}>Overdue Loans</span>
                <h2 className="fw-bold mb-0 mt-1 text-dark" style={{ fontSize: '28px' }}>{stats?.totalOverdueBooks ?? 0}</h2>
              </div>
              <div className="d-flex align-items-center justify-content-center" style={{ width: '48px', height: '48px', borderRadius: '12px', backgroundColor: '#ffe4e6' }}>
                <FaExclamationCircle style={{ color: '#dc2626', fontSize: '20px' }} />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions Panel */}
      <div className="card border-0 shadow-sm mb-4" style={{ borderRadius: '12px' }}>
        <div className="card-header bg-white py-3 border-bottom border-light">
          <h5 className="mb-0 fw-bold text-dark">Quick Actions</h5>
        </div>
        <div className="card-body p-4">
          <div className="d-flex flex-wrap gap-3">
            {/* Common User Actions */}
            <Link to="/books" className="btn btn-primary px-4 py-3 d-flex align-items-center gap-2 border-0 shadow-sm hover-grow" style={{ borderRadius: '8px' }}>
              <FaBook /> Browse Books Catalog
            </Link>
            <Link to="/borrows" className="btn btn-success px-4 py-3 d-flex align-items-center gap-2 border-0 shadow-sm hover-grow" style={{ borderRadius: '8px' }}>
              <FaBookReader /> View Borrow logs
            </Link>

            {/* Admin / Librarian Actions */}
            {(user?.role === 'ADMIN' || user?.role === 'LIBRARIAN') && (
              <>
                <Link to="/books?action=new" className="btn btn-warning text-white px-4 py-3 d-flex align-items-center gap-2 border-0 shadow-sm hover-grow" style={{ borderRadius: '8px' }}>
                  <FaPlus /> Add New Book
                </Link>
                <Link to="/categories" className="btn btn-outline-primary px-4 py-3 d-flex align-items-center gap-2 border-2 shadow-sm hover-grow" style={{ borderRadius: '8px', borderWidth: '2px' }}>
                  <FaFolderPlus /> Manage Categories
                </Link>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Visual Charts and Recent Activity */}
      <div className="row g-4">
        {/* Left Column: Recent Activity list */}
        <div className="col-12 col-xl-7">
          <div className="card border-0 shadow-sm h-100" style={{ borderRadius: '12px' }}>
            <div className="card-header bg-white py-3 border-bottom border-light">
              <h5 className="mb-0 fw-bold text-dark">Recent Activity</h5>
            </div>
            <div className="card-body p-0 overflow-auto">
              {stats?.recentActivity && stats.recentActivity.length > 0 ? (
                <div className="table-responsive">
                  <table className="table table-hover align-middle mb-0" style={{ fontSize: '14.5px' }}>
                    <thead className="table-light">
                      <tr>
                        <th className="px-4 py-3 border-0">Reader</th>
                        <th className="py-3 border-0">Book Title</th>
                        <th className="py-3 border-0">Borrow Date</th>
                        <th className="py-3 border-0">Due Date</th>
                        <th className="px-4 py-3 border-0 text-end">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {stats.recentActivity.map((borrow) => {
                        let statusColor = 'secondary';
                        if (borrow.status === 'BORROWED') statusColor = 'primary';
                        else if (borrow.status === 'RETURNED') statusColor = 'success';
                        else if (borrow.status === 'OVERDUE') statusColor = 'danger';

                        return (
                          <tr key={borrow.id}>
                            <td className="px-4 py-3 fw-semibold text-dark">{borrow.username}</td>
                            <td className="py-3 text-secondary">{borrow.bookTitle}</td>
                            <td className="py-3 text-muted">{borrow.borrowDate}</td>
                            <td className="py-3 text-muted">{borrow.dueDate}</td>
                            <td className="px-4 py-3 text-end">
                              <span className={`badge bg-${statusColor}-subtle text-${statusColor} border border-${statusColor} border-opacity-25 px-2.5 py-1.5`} style={{ fontSize: '12px' }}>
                                {borrow.status}
                              </span>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="text-center p-5 text-muted">
                  No recent borrowing records found.
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Column: Chart (If Admin/Librarian) */}
        {(user?.role === 'ADMIN' || user?.role === 'LIBRARIAN') && (
          <div className="col-12 col-xl-5">
            <div className="card border-0 shadow-sm h-100" style={{ borderRadius: '12px' }}>
              <div className="card-body p-4 d-flex align-items-center justify-content-center">
                {categoryLabels.length > 0 ? (
                  <div className="w-100" style={{ minHeight: '300px' }}>
                    <Bar data={barChartData} options={chartOptions} />
                  </div>
                ) : (
                  <div className="text-center p-5 text-muted">
                    No category data available to display chart. Add books with categories first.
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      <style>{`
        .card-hover:hover {
          transform: translateY(-4px);
          box-shadow: 0 10px 20px rgba(0, 0, 0, 0.08) !important;
        }
        .hover-grow:hover {
          transform: scale(1.02);
          opacity: 0.95;
        }
      `}</style>
    </div>
  );
};

export default Dashboard;
