import React, { useEffect, useState } from 'react';
import axiosInstance from '../api/axiosInstance';
import { useAuth } from '../context/AuthContext';
import { useLoading } from '../context/LoadingContext';
import { FaUndo, FaSearch, FaCheckCircle, FaExclamationTriangle } from 'react-icons/fa';

const Borrows = () => {
  const { user } = useAuth();
  const { setIsLoading } = useLoading();
  const isAdminOrLibrarian = user?.role === 'ADMIN' || user?.role === 'LIBRARIAN';

  const [borrows, setBorrows] = useState([]);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  const [page, setPage] = useState(0);

  // Admin filter states
  const [statusFilter, setStatusFilter] = useState('');
  const [overdueFilter, setOverdueFilter] = useState(false);
  const [searchUsername, setSearchUsername] = useState('');

  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const loadBorrowsData = async () => {
    setIsLoading(true);
    setError('');
    try {
      let res;
      if (isAdminOrLibrarian) {
        // Fetch global records with filters
        const params = {
          page,
          size: 10,
        };
        if (statusFilter) params.status = statusFilter;
        if (overdueFilter) params.overdue = true;
        if (searchUsername.trim()) params.username = searchUsername.trim();

        res = await axiosInstance.get('/borrows', { params });
      } else {
        // Fetch personal borrow logs
        res = await axiosInstance.get('/borrows/history', {
          params: { page, size: 10 }
        });
      }

      const pageData = res.data.data;
      setBorrows(pageData.content || []);
      setTotalPages(pageData.totalPages || 0);
      setTotalElements(pageData.totalElements || 0);
    } catch (err) {
      setError('Failed to load borrowing records');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadBorrowsData();
  }, [page, statusFilter, overdueFilter, isAdminOrLibrarian]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setPage(0);
    loadBorrowsData();
  };

  const handleReturnBook = async (id) => {
    if (!window.confirm('Confirm returning this book to stock?')) {
      return;
    }
    setError('');
    setSuccess('');
    setIsLoading(true);
    try {
      await axiosInstance.put(`/borrows/return/${id}`);
      setSuccess('Book return registered successfully!');
      loadBorrowsData();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to return book');
    } finally {
      setIsLoading(false);
    }
  };

  const handlePageChange = (newPage) => {
    if (newPage >= 0 && newPage < totalPages) {
      setPage(newPage);
    }
  };

  return (
    <div>
      <div className="mb-4">
        <h2 className="fw-bold text-dark mb-1">
          {isAdminOrLibrarian ? 'Borrowings Logs' : 'My Checkout History'}
        </h2>
        <p className="text-muted mb-0">
          {isAdminOrLibrarian 
            ? 'Monitor books checkout states, locate overdue loans, and register returns.'
            : 'Track your personal borrowings history and active checkouts.'}
        </p>
      </div>

      {success && (
        <div className="alert alert-success border-0 shadow-sm rounded mb-4" role="alert">
          {success}
        </div>
      )}

      {error && (
        <div className="alert alert-danger border-0 shadow-sm rounded mb-4" role="alert">
          {error}
        </div>
      )}

      {/* Admin Filters Header */}
      {isAdminOrLibrarian && (
        <div className="card border-0 shadow-sm mb-4" style={{ borderRadius: '12px' }}>
          <div className="card-body p-4">
            <form onSubmit={handleSearchSubmit} className="row g-3 align-items-center">
              {/* Search Reader username */}
              <div className="col-12 col-md-4">
                <div className="input-group">
                  <span className="input-group-text bg-light border-0"><FaSearch className="text-muted" /></span>
                  <input
                    type="text"
                    className="form-control bg-light border-0"
                    placeholder="Search by reader username..."
                    value={searchUsername}
                    onChange={(e) => setSearchUsername(e.target.value)}
                    style={{ fontSize: '14px' }}
                  />
                </div>
              </div>

              {/* Status Filter */}
              <div className="col-12 col-sm-6 col-md-3">
                <select 
                  className="form-select bg-light border-0" 
                  value={statusFilter}
                  onChange={(e) => { setStatusFilter(e.target.value); setPage(0); }}
                  style={{ fontSize: '14.5px' }}
                >
                  <option value="">All Statuses</option>
                  <option value="BORROWED">Borrowed</option>
                  <option value="RETURNED">Returned</option>
                  <option value="OVERDUE">Overdue</option>
                </select>
              </div>

              {/* Overdue Switch */}
              <div className="col-12 col-sm-6 col-md-3">
                <div className="form-check form-switch pt-1">
                  <input 
                    className="form-check-input" 
                    type="checkbox" 
                    id="overdueCheck"
                    checked={overdueFilter}
                    onChange={(e) => { setOverdueFilter(e.target.checked); setPage(0); }}
                  />
                  <label className="form-check-label text-muted" htmlFor="overdueCheck" style={{ fontSize: '14.5px' }}>
                    Show Overdue Only
                  </label>
                </div>
              </div>

              {/* Search Trigger */}
              <div className="col-12 col-md-2">
                <button type="submit" className="btn btn-primary w-100 border-0 shadow-sm">
                  Search
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Logs Table */}
      <div className="card border-0 shadow-sm mb-4" style={{ borderRadius: '12px' }}>
        <div className="card-body p-0">
          {borrows.length > 0 ? (
            <div className="table-responsive">
              <table className="table table-hover align-middle mb-0" style={{ fontSize: '14.5px' }}>
                <thead className="table-light">
                  <tr>
                    {isAdminOrLibrarian && <th className="px-4 py-3 border-0">Reader</th>}
                    <th className={`${!isAdminOrLibrarian ? 'px-4' : ''} py-3 border-0`}>Book Title</th>
                    <th className="py-3 border-0">ISBN</th>
                    <th className="py-3 border-0">Borrow Date</th>
                    <th className="py-3 border-0">Due Date</th>
                    <th className="py-3 border-0">Return Date</th>
                    <th className="py-3 border-0">Status</th>
                    {isAdminOrLibrarian && <th className="px-4 py-3 border-0 text-end">Action</th>}
                  </tr>
                </thead>
                <tbody>
                  {borrows.map((loan) => {
                    let statusColor = 'secondary';
                    if (loan.status === 'BORROWED') statusColor = 'primary';
                    else if (loan.status === 'RETURNED') statusColor = 'success';
                    else if (loan.status === 'OVERDUE') statusColor = 'danger';

                    const isOverdue = loan.status === 'OVERDUE';
                    const activeLoan = loan.status === 'BORROWED' || loan.status === 'OVERDUE';

                    return (
                      <tr key={loan.id}>
                        {isAdminOrLibrarian && <td className="px-4 py-3 fw-semibold text-dark">{loan.username}</td>}
                        <td className={`${!isAdminOrLibrarian ? 'px-4' : ''} py-3 text-secondary fw-semibold`}>{loan.bookTitle}</td>
                        <td className="py-3 text-muted">{loan.isbn}</td>
                        <td className="py-3 text-muted">{loan.borrowDate}</td>
                        <td className="py-3 text-muted">
                          {loan.dueDate} 
                          {isOverdue && <FaExclamationTriangle className="text-danger ms-1.5" title="Overdue!" />}
                        </td>
                        <td className="py-3 text-muted">{loan.returnDate || <span className="text-muted opacity-50">-</span>}</td>
                        <td className="py-3">
                          <span className={`badge bg-${statusColor}-subtle text-${statusColor} border border-${statusColor} border-opacity-10 px-2.5 py-1.5`} style={{ fontSize: '12px' }}>
                            {loan.status}
                          </span>
                        </td>
                        {isAdminOrLibrarian && (
                          <td className="px-4 py-3 text-end">
                            {activeLoan ? (
                              <button 
                                onClick={() => handleReturnBook(loan.id)}
                                className="btn btn-sm btn-success d-inline-flex align-items-center gap-1.5 px-3 py-1.5"
                                style={{ borderRadius: '6px', fontSize: '13px' }}
                              >
                                <FaUndo /> Return Book
                              </button>
                            ) : (
                              <span className="text-success d-inline-flex align-items-center gap-1" style={{ fontSize: '13.5px' }}>
                                <FaCheckCircle /> Settled
                              </span>
                            )}
                          </td>
                        )}
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center p-5 text-muted">
              No borrowing logs or history found.
            </div>
          )}
        </div>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="d-flex justify-content-between align-items-center mt-4">
          <span className="text-muted" style={{ fontSize: '14.5px' }}>
            Showing Page {page + 1} of {totalPages} ({totalElements} logs)
          </span>
          <nav>
            <ul className="pagination mb-0 gap-1">
              <li className={`page-item ${page === 0 ? 'disabled' : ''}`}>
                <button className="page-item page-link border-0 shadow-sm rounded px-3 py-2" onClick={() => handlePageChange(page - 1)}>
                  Previous
                </button>
              </li>
              {[...Array(totalPages)].map((_, i) => (
                <li key={i} className={`page-item ${page === i ? 'active' : ''}`}>
                  <button className="page-item page-link border-0 shadow-sm rounded px-3 py-2" onClick={() => handlePageChange(i)}>
                    {i + 1}
                  </button>
                </li>
              ))}
              <li className={`page-item ${page === totalPages - 1 ? 'disabled' : ''}`}>
                <button className="page-item page-link border-0 shadow-sm rounded px-3 py-2" onClick={() => handlePageChange(page + 1)}>
                  Next
                </button>
              </li>
            </ul>
          </nav>
        </div>
      )}
    </div>
  );
};

export default Borrows;
