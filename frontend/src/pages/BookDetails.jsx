import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import axiosInstance from '../api/axiosInstance';
import { useAuth } from '../context/AuthContext';
import { useLoading } from '../context/LoadingContext';
import { 
  FaArrowLeft, 
  FaEdit, 
  FaTrash, 
  FaCheck, 
  FaInfoCircle, 
  FaBookmark,
  FaCalendarAlt,
  FaLanguage,
  FaBarcode,
  FaMapMarkerAlt
} from 'react-icons/fa';

const BookDetails = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const { setIsLoading } = useLoading();
  const navigate = useNavigate();

  const [book, setBook] = useState(null);
  const [borrowUsername, setBorrowUsername] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showBorrowForm, setShowBorrowForm] = useState(false);

  useEffect(() => {
    const fetchBookDetails = async () => {
      setIsLoading(true);
      setError('');
      try {
        const res = await axiosInstance.get(`/books/${id}`);
        setBook(res.data.data);
      } catch (err) {
        setError('Failed to fetch book details');
      } finally {
        setIsLoading(false);
      }
    };
    fetchBookDetails();
  }, [id]);

  const handleSelfBorrow = async () => {
    setError('');
    setSuccess('');
    setIsLoading(true);
    try {
      const res = await axiosInstance.post('/borrows', { bookId: book.id });
      setSuccess('Book borrowed successfully! Due in 14 days.');
      
      // Update local copies state
      setBook(prev => ({
        ...prev,
        availableCopies: prev.availableCopies - 1
      }));
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to borrow book');
    } finally {
      setIsLoading(false);
    }
  };

  const handleLibrarianBorrow = async (e) => {
    e.preventDefault();
    if (!borrowUsername.trim()) {
      setError('Please enter a username');
      return;
    }
    setError('');
    setSuccess('');
    setIsLoading(true);
    try {
      await axiosInstance.post('/borrows', { 
        bookId: book.id, 
        username: borrowUsername.trim() 
      });
      setSuccess(`Book successfully logged as borrowed by user "${borrowUsername}"!`);
      setBorrowUsername('');
      setShowBorrowForm(false);
      
      // Update local copies state
      setBook(prev => ({
        ...prev,
        availableCopies: prev.availableCopies - 1
      }));
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to register borrow');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteBook = async () => {
    if (!window.confirm('Are you absolutely sure you want to delete this book? This action cannot be undone.')) {
      return;
    }
    setError('');
    setIsLoading(true);
    try {
      await axiosInstance.delete(`/books/${id}`);
      navigate('/books');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete book');
    } finally {
      setIsLoading(false);
    }
  };

  if (!book) return null;

  const isAvailable = book.availableCopies > 0;

  return (
    <div>
      {/* Back Button */}
      <div className="mb-4">
        <Link to="/books" className="btn btn-light d-inline-flex align-items-center gap-2 border shadow-sm" style={{ borderRadius: '8px' }}>
          <FaArrowLeft /> Back to Catalog
        </Link>
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

      <div className="row g-4">
        {/* Left Column: Book Graphic/Metadata Cover */}
        <div className="col-12 col-md-4">
          <div 
            className="card border-0 shadow text-white d-flex flex-column justify-content-between p-4" 
            style={{ 
              height: '420px', 
              background: 'var(--sidebar-gradient)',
              borderRadius: '16px',
              borderLeft: '12px solid var(--primary-creative)',
              boxShadow: '0 10px 25px rgba(0,0,0,0.15)'
            }}
          >
            <div>
              <span className="badge px-3 py-1.5 mb-3" style={{ background: 'var(--secondary-gradient)' }}>{book.categoryName}</span>
              <h3 className="fw-bold tracking-tight mb-2">{book.title}</h3>
              <p className="text-white-50 fs-6">by {book.author}</p>
            </div>
            
            <div className="border-top border-secondary border-opacity-25 pt-3">
              <div className="text-white-50" style={{ fontSize: '13px' }}>ISBN</div>
              <span className="fw-mono fs-6">{book.isbn}</span>
            </div>
          </div>
        </div>

        {/* Right Column: Detailed Info Table & Operations */}
        <div className="col-12 col-md-8">
          <div className="card border-0 shadow-sm" style={{ borderRadius: '16px' }}>
            <div className="card-body p-5">
              <div className="d-flex justify-content-between align-items-start mb-4">
                <div>
                  <h3 className="fw-bold text-dark mb-1">{book.title}</h3>
                  <p className="text-muted fs-5">by {book.author}</p>
                </div>
                
                {/* Available Badge */}
                <span className={`badge px-3 py-2 fs-6 ${isAvailable ? 'bg-success-subtle text-success border border-success' : 'bg-danger-subtle text-danger border border-danger'} border-opacity-25`}>
                  {isAvailable ? 'Available' : 'Out of Stock'}
                </span>
              </div>

              {/* Book Description */}
              <h5 className="fw-bold mb-2 text-dark">Synopsis</h5>
              <p className="text-secondary mb-4 leading-relaxed" style={{ fontSize: '15px' }}>
                {book.description || 'No summary or synopsis has been provided for this book catalog entry.'}
              </p>

              {/* Specifications Table */}
              <h5 className="fw-bold mb-3 text-dark">Specifications</h5>
              <div className="row g-3 mb-5">
                <div className="col-6 col-sm-4">
                  <div className="p-3 bg-light rounded d-flex align-items-center gap-3">
                    <FaCalendarAlt style={{ color: 'var(--primary-creative)' }} className="fs-4" />
                    <div>
                      <div className="text-muted" style={{ fontSize: '12px' }}>Published</div>
                      <span className="fw-semibold text-dark">{book.publishedYear}</span>
                    </div>
                  </div>
                </div>

                <div className="col-6 col-sm-4">
                  <div className="p-3 bg-light rounded d-flex align-items-center gap-3">
                    <FaLanguage style={{ color: 'var(--primary-creative)' }} className="fs-4" />
                    <div>
                      <div className="text-muted" style={{ fontSize: '12px' }}>Language</div>
                      <span className="fw-semibold text-dark">{book.language}</span>
                    </div>
                  </div>
                </div>

                <div className="col-6 col-sm-4">
                  <div className="p-3 bg-light rounded d-flex align-items-center gap-3">
                    <FaMapMarkerAlt style={{ color: 'var(--primary-creative)' }} className="fs-4" />
                    <div>
                      <div className="text-muted" style={{ fontSize: '12px' }}>Location</div>
                      <span className="fw-semibold text-dark">{book.shelfLocation || 'N/A'}</span>
                    </div>
                  </div>
                </div>

                <div className="col-6 col-sm-4">
                  <div className="p-3 bg-light rounded d-flex align-items-center gap-3">
                    <FaBarcode style={{ color: 'var(--primary-creative)' }} className="fs-4" />
                    <div>
                      <div className="text-muted" style={{ fontSize: '12px' }}>ISBN-13</div>
                      <span className="fw-semibold text-dark">{book.isbn}</span>
                    </div>
                  </div>
                </div>

                <div className="col-6 col-sm-4">
                  <div className="p-3 bg-light rounded d-flex align-items-center gap-3">
                    <FaBookmark style={{ color: 'var(--primary-creative)' }} className="fs-4" />
                    <div>
                      <div className="text-muted" style={{ fontSize: '12px' }}>Category</div>
                      <span className="fw-semibold text-dark">{book.categoryName}</span>
                    </div>
                  </div>
                </div>

                <div className="col-6 col-sm-4">
                  <div className="p-3 bg-light rounded d-flex align-items-center gap-3">
                    <FaInfoCircle style={{ color: 'var(--primary-creative)' }} className="fs-4" />
                    <div>
                      <div className="text-muted" style={{ fontSize: '12px' }}>Inventory</div>
                      <span className="fw-semibold text-dark">{book.availableCopies} / {book.quantity} copies</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Buttons Panel */}
              <div className="border-top border-light pt-4 d-flex flex-wrap gap-3 align-items-center">
                {/* User borrowing */}
                {user?.role === 'USER' && (
                  <button 
                    onClick={handleSelfBorrow}
                    disabled={!isAvailable}
                    className="btn btn-primary btn-lg px-5 border-0 shadow-sm"
                    style={{ borderRadius: '8px' }}
                  >
                    Borrow This Book
                  </button>
                )}

                {/* Librarian borrowing to someone */}
                {(user?.role === 'ADMIN' || user?.role === 'LIBRARIAN') && (
                  <>
                    <button 
                      onClick={() => setShowBorrowForm(!showBorrowForm)}
                      disabled={!isAvailable}
                      className="btn btn-success btn-lg px-4 border-0 shadow-sm"
                      style={{ borderRadius: '8px' }}
                    >
                      Issue Loan
                    </button>

                    <Link 
                      to={`/books/${book.id}/edit`}
                      className="btn btn-outline-warning btn-lg px-4 d-flex align-items-center gap-2"
                      style={{ borderRadius: '8px' }}
                    >
                      <FaEdit /> Edit Entry
                    </Link>

                    {user?.role === 'ADMIN' && (
                      <button 
                        onClick={handleDeleteBook}
                        className="btn btn-outline-danger btn-lg px-4 d-flex align-items-center gap-2"
                        style={{ borderRadius: '8px' }}
                      >
                        <FaTrash /> Delete Book
                      </button>
                    )}
                  </>
                )}
              </div>

              {/* Issue Loan Form (Collapsible/Hidden by default) */}
              {showBorrowForm && (
                <div className="card mt-4 border bg-light shadow-sm" style={{ borderRadius: '10px' }}>
                  <div className="card-body p-4">
                    <h5 className="fw-bold text-dark mb-3">Issue Loan to Reader</h5>
                    <form onSubmit={handleLibrarianBorrow} className="d-flex gap-3">
                      <div className="flex-grow-1">
                        <input
                          type="text"
                          className="form-control"
                          placeholder="Enter reader username..."
                          value={borrowUsername}
                          onChange={(e) => setBorrowUsername(e.target.value)}
                          style={{ borderRadius: '6px' }}
                        />
                      </div>
                      <button type="submit" className="btn btn-success border-0 shadow-sm px-4" style={{ borderRadius: '6px' }}>
                        Register checkout
                      </button>
                    </form>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookDetails;
