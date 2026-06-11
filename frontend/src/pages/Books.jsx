import React, { useEffect, useState } from 'react';
import { Link, useSearchParams, useNavigate } from 'react-router-dom';
import axiosInstance from '../api/axiosInstance';
import { useAuth } from '../context/AuthContext';
import { useLoading } from '../context/LoadingContext';
import { FaSearch, FaFilter, FaPlus, FaBookOpen, FaTimes } from 'react-icons/fa';

const Books = () => {
  const { user } = useAuth();
  const { setIsLoading } = useLoading();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  const [books, setBooks] = useState([]);
  const [categories, setCategories] = useState([]);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  const [error, setError] = useState('');

  // Form states matching URL params or defaults
  const search = searchParams.get('search') || '';
  const category = searchParams.get('category') || '';
  const available = searchParams.get('available') === 'true';
  const page = parseInt(searchParams.get('page') || '0', 10);
  const sortBy = searchParams.get('sortBy') || 'title';
  const sortDir = searchParams.get('sortDir') || 'asc';

  // Search input state
  const [searchInput, setSearchInput] = useState(search);
  const [categoryInput, setCategoryInput] = useState(category);
  const [availInput, setAvailInput] = useState(available);

  useEffect(() => {
    const fetchFiltersAndBooks = async () => {
      setIsLoading(true);
      setError('');
      try {
        // Fetch categories list
        const catRes = await axiosInstance.get('/categories');
        setCategories(catRes.data.data || []);

        // Fetch books with current parameters
        const params = {
          page,
          size: 9,
          sortBy,
          sortDir,
        };

        if (search) params.search = search;
        if (category) params.category = category;
        if (available) params.available = true;

        const booksRes = await axiosInstance.get('/books', { params });
        const pageData = booksRes.data.data;
        setBooks(pageData.content || []);
        setTotalPages(pageData.totalPages || 0);
        setTotalElements(pageData.totalElements || 0);
      } catch (err) {
        setError('Failed to fetch book catalog');
      } finally {
        setIsLoading(false);
      }
    };

    fetchFiltersAndBooks();
  }, [search, category, available, page, sortBy, sortDir]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    updateParams({ search: searchInput, page: 0 });
  };

  const handleCategoryChange = (e) => {
    const val = e.target.value;
    setCategoryInput(val);
    updateParams({ category: val, page: 0 });
  };

  const handleAvailChange = (e) => {
    const val = e.target.checked;
    setAvailInput(val);
    updateParams({ available: val ? 'true' : '', page: 0 });
  };

  const updateParams = (newParams) => {
    const current = {};
    searchParams.forEach((val, key) => {
      current[key] = val;
    });

    const combined = { ...current, ...newParams };
    
    // Clean up empty params
    Object.keys(combined).forEach(key => {
      if (combined[key] === '' || combined[key] === null || combined[key] === undefined) {
        delete combined[key];
      }
    });

    setSearchParams(combined);
  };

  const handlePageChange = (newPage) => {
    if (newPage >= 0 && newPage < totalPages) {
      updateParams({ page: newPage });
    }
  };

  const handleSortChange = (e) => {
    const [field, dir] = e.target.value.split('-');
    updateParams({ sortBy: field, sortDir: dir, page: 0 });
  };

  const clearFilters = () => {
    setSearchInput('');
    setCategoryInput('');
    setAvailInput(false);
    setSearchParams({});
  };

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 className="fw-bold text-dark mb-1">Books Catalog</h2>
          <p className="text-muted mb-0">Browse and manage the library's physical catalog.</p>
        </div>
        {(user?.role === 'ADMIN' || user?.role === 'LIBRARIAN') && (
          <Link to="/books/new" className="btn btn-primary px-4 py-2.5 d-flex align-items-center gap-2 border-0 shadow-sm" style={{ borderRadius: '8px' }}>
            <FaPlus /> Add New Book
          </Link>
        )}
      </div>

      {error && (
        <div className="alert alert-danger border-0 shadow-sm rounded mb-4" role="alert">
          {error}
        </div>
      )}

      {/* Filter and Search Panel */}
      <div className="card border-0 shadow-sm mb-4" style={{ borderRadius: '12px' }}>
        <div className="card-body p-4">
          <form onSubmit={handleSearchSubmit} className="row g-3 align-items-center">
            {/* Search Input */}
            <div className="col-12 col-md-4">
              <div className="input-group">
                <span className="input-group-text bg-light border-0"><FaSearch className="text-muted" /></span>
                <input
                  type="text"
                  className="form-control bg-light border-0"
                  placeholder="Search title, author, or ISBN..."
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  style={{ fontSize: '14.5px' }}
                />
              </div>
            </div>

            {/* Category Filter */}
            <div className="col-12 col-sm-6 col-md-3">
              <select 
                className="form-select bg-light border-0" 
                value={categoryInput}
                onChange={handleCategoryChange}
                style={{ fontSize: '14.5px' }}
              >
                <option value="">All Categories</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.name}>{cat.name}</option>
                ))}
              </select>
            </div>

            {/* Sort Select */}
            <div className="col-12 col-sm-6 col-md-3">
              <select 
                className="form-select bg-light border-0" 
                onChange={handleSortChange}
                value={`${sortBy}-${sortDir}`}
                style={{ fontSize: '14.5px' }}
              >
                <option value="title-asc">Title (A-Z)</option>
                <option value="title-desc">Title (Z-A)</option>
                <option value="author-asc">Author (A-Z)</option>
                <option value="author-desc">Author (Z-A)</option>
                <option value="publishedYear-desc">Newest First</option>
                <option value="publishedYear-asc">Oldest First</option>
              </select>
            </div>

            {/* Submit & Reset Buttons */}
            <div className="col-12 col-md-2 d-flex gap-2">
              <button type="submit" className="btn btn-primary flex-grow-1 border-0 shadow-sm">
                Search
              </button>
              {(search || category || available) && (
                <button 
                  type="button" 
                  className="btn btn-outline-secondary d-flex align-items-center justify-content-center" 
                  onClick={clearFilters}
                  title="Clear Filters"
                >
                  <FaTimes />
                </button>
              )}
            </div>

            {/* Availability Checkbox */}
            <div className="col-12 mt-2">
              <div className="form-check form-switch">
                <input 
                  className="form-check-input" 
                  type="checkbox" 
                  id="availCheck"
                  checked={availInput}
                  onChange={handleAvailChange} 
                />
                <label className="form-check-label text-muted" htmlFor="availCheck" style={{ fontSize: '13.5px' }}>
                  Show available books only
                </label>
              </div>
            </div>
          </form>
        </div>
      </div>

      {/* Books Grid */}
      {books.length > 0 ? (
        <>
          <div className="row g-4 mb-4">
            {books.map((book) => {
              const isOut = book.availableCopies === 0;
              return (
                <div key={book.id} className="col-12 col-md-6 col-lg-4">
                  <div className="card border-0 shadow-sm h-100 transition-all card-hover" style={{ borderRadius: '12px' }}>
                    <div className="card-body p-4 d-flex flex-column h-100">
                      {/* Category Badge */}
                      <div className="mb-2">
                        <span className="badge bg-primary-subtle text-primary border border-primary border-opacity-10 px-2.5 py-1" style={{ fontSize: '11px' }}>
                          {book.categoryName}
                        </span>
                      </div>

                      {/* Title & Author */}
                      <h5 className="card-title fw-bold text-dark mb-1 text-truncate" title={book.title}>{book.title}</h5>
                      <p className="card-subtitle text-muted mb-3 text-truncate" style={{ fontSize: '14px' }}>by {book.author}</p>

                      {/* Description Snippet */}
                      <p className="card-text text-secondary mb-4 flex-grow-1 flex-shrink-0" style={{ fontSize: '13.5px', height: '60px', overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical' }}>
                        {book.description || 'No description available for this book.'}
                      </p>

                      {/* Info and Status */}
                      <div className="d-flex align-items-center justify-content-between border-top border-light pt-3 mt-auto">
                        <div style={{ fontSize: '13px' }}>
                          <div className="text-muted">Copies Available</div>
                          <span className={`fw-bold ${isOut ? 'text-danger' : 'text-success'}`}>
                            {book.availableCopies} / {book.quantity}
                          </span>
                        </div>
                        <Link to={`/books/${book.id}`} className="btn btn-outline-primary px-3 py-1.5 fw-semibold" style={{ borderRadius: '6px', fontSize: '13px' }}>
                          View Details
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="d-flex justify-content-between align-items-center mt-5">
              <span className="text-muted" style={{ fontSize: '14.5px' }}>
                Showing Page {page + 1} of {totalPages} ({totalElements} books)
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
        </>
      ) : (
        <div className="card border-0 shadow-sm text-center p-5" style={{ borderRadius: '12px' }}>
          <div className="p-4">
            <FaBookOpen className="fs-1 text-muted opacity-25 mb-3" />
            <h4 className="fw-bold">No Books Found</h4>
            <p className="text-muted mb-0">Try clearing filters or checking your search query.</p>
          </div>
        </div>
      )}

      <style>{`
        .card-hover:hover {
          transform: translateY(-4px);
          box-shadow: 0 10px 20px rgba(0, 0, 0, 0.08) !important;
        }
      `}</style>
    </div>
  );
};

export default Books;
