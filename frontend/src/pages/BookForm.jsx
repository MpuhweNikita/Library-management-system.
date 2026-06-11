import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import axiosInstance from '../api/axiosInstance';
import { useLoading } from '../context/LoadingContext';
import { FaSave, FaArrowLeft } from 'react-icons/fa';

const schema = yup.object().shape({
  title: yup.string().required('Title is required').max(150, 'Max 150 characters'),
  author: yup.string().required('Author is required').max(100, 'Max 100 characters'),
  isbn: yup.string().required('ISBN is required').max(20, 'Max 20 characters'),
  categoryId: yup.string().required('Category is required'),
  quantity: yup.number()
    .typeError('Quantity must be a number')
    .required('Quantity is required')
    .min(0, 'Quantity cannot be negative'),
  publishedYear: yup.number()
    .typeError('Published year must be a number')
    .required('Published year is required')
    .min(1000, 'Published year must be at least 1000')
    .max(new Date().getFullYear() + 4, 'Published year cannot be too far in future'),
  language: yup.string().required('Language is required').max(30, 'Max 30 characters'),
  shelfLocation: yup.string().max(50, 'Max 50 characters').nullable(),
});

const BookForm = () => {
  const { id } = useParams();
  const isEditMode = !!id;
  const { setIsLoading } = useLoading();
  const navigate = useNavigate();

  const [categories, setCategories] = useState([]);
  const [error, setError] = useState('');

  const { register, handleSubmit, setValue, formState: { errors } } = useForm({
    resolver: yupResolver(schema)
  });

  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      setError('');
      try {
        // Fetch categories list
        const catRes = await axiosInstance.get('/categories');
        setCategories(catRes.data.data || []);

        if (isEditMode) {
          // Fetch existing book details
          const bookRes = await axiosInstance.get(`/books/${id}`);
          const bookData = bookRes.data.data;
          
          // Populate form fields
          setValue('title', bookData.title);
          setValue('author', bookData.author);
          setValue('isbn', bookData.isbn);
          setValue('categoryId', bookData.categoryId);
          setValue('quantity', bookData.quantity);
          setValue('publishedYear', bookData.publishedYear);
          setValue('language', bookData.language);
          setValue('shelfLocation', bookData.shelfLocation || '');
        }
      } catch (err) {
        setError('Failed to load form data');
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, [id, isEditMode, setValue]);

  const onSubmit = async (data) => {
    setError('');
    setIsLoading(true);
    try {
      if (isEditMode) {
        await axiosInstance.put(`/books/${id}`, data);
      } else {
        await axiosInstance.post('/books', data);
      }
      navigate('/books');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save book');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      {/* Back Button */}
      <div className="mb-4">
        <Link to={isEditMode ? `/books/${id}` : '/books'} className="btn btn-light d-inline-flex align-items-center gap-2 border shadow-sm" style={{ borderRadius: '8px' }}>
          <FaArrowLeft /> Cancel
        </Link>
      </div>

      {error && (
        <div className="alert alert-danger border-0 shadow-sm rounded mb-4" role="alert">
          {error}
        </div>
      )}

      <div className="card border-0 shadow-sm" style={{ borderRadius: '16px', maxWidth: '800px' }}>
        <div className="card-header bg-white py-4 border-bottom border-light px-5">
          <h4 className="fw-bold text-dark mb-0">{isEditMode ? 'Edit Book Details' : 'Add New Book to Catalog'}</h4>
        </div>
        
        <div className="card-body p-5">
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="row g-4">
              {/* Title */}
              <div className="col-12">
                <label className="form-label fw-semibold text-secondary" style={{ fontSize: '13px' }}>BOOK TITLE</label>
                <input
                  type="text"
                  className={`form-control bg-light border-0 ${errors.title ? 'is-invalid' : ''}`}
                  placeholder="e.g. The Lord of the Rings"
                  style={{ borderRadius: '8px', padding: '10px 14px' }}
                  {...register('title')}
                />
                {errors.title && <div className="invalid-feedback">{errors.title.message}</div>}
              </div>

              {/* Author */}
              <div className="col-md-6">
                <label className="form-label fw-semibold text-secondary" style={{ fontSize: '13px' }}>AUTHOR</label>
                <input
                  type="text"
                  className={`form-control bg-light border-0 ${errors.author ? 'is-invalid' : ''}`}
                  placeholder="e.g. J.R.R. Tolkien"
                  style={{ borderRadius: '8px', padding: '10px 14px' }}
                  {...register('author')}
                />
                {errors.author && <div className="invalid-feedback">{errors.author.message}</div>}
              </div>

              {/* ISBN */}
              <div className="col-md-6">
                <label className="form-label fw-semibold text-secondary" style={{ fontSize: '13px' }}>ISBN</label>
                <input
                  type="text"
                  className={`form-control bg-light border-0 ${errors.isbn ? 'is-invalid' : ''}`}
                  placeholder="e.g. 978-0618640157"
                  style={{ borderRadius: '8px', padding: '10px 14px' }}
                  {...register('isbn')}
                />
                {errors.isbn && <div className="invalid-feedback">{errors.isbn.message}</div>}
              </div>

              {/* Category */}
              <div className="col-md-6">
                <label className="form-label fw-semibold text-secondary" style={{ fontSize: '13px' }}>CATEGORY</label>
                <select
                  className={`form-select bg-light border-0 ${errors.categoryId ? 'is-invalid' : ''}`}
                  style={{ borderRadius: '8px', padding: '10px 14px' }}
                  {...register('categoryId')}
                >
                  <option value="">Select a category</option>
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                  ))}
                </select>
                {errors.categoryId && <div className="invalid-feedback">{errors.categoryId.message}</div>}
              </div>

              {/* Language */}
              <div className="col-md-6">
                <label className="form-label fw-semibold text-secondary" style={{ fontSize: '13px' }}>LANGUAGE</label>
                <input
                  type="text"
                  className={`form-control bg-light border-0 ${errors.language ? 'is-invalid' : ''}`}
                  placeholder="e.g. English"
                  style={{ borderRadius: '8px', padding: '10px 14px' }}
                  {...register('language')}
                />
                {errors.language && <div className="invalid-feedback">{errors.language.message}</div>}
              </div>

              {/* Total Copies */}
              <div className="col-md-6">
                <label className="form-label fw-semibold text-secondary" style={{ fontSize: '13px' }}>TOTAL COPIES IN STOCK</label>
                <input
                  type="number"
                  className={`form-control bg-light border-0 ${errors.quantity ? 'is-invalid' : ''}`}
                  placeholder="e.g. 5"
                  style={{ borderRadius: '8px', padding: '10px 14px' }}
                  {...register('quantity')}
                />
                {errors.quantity && <div className="invalid-feedback">{errors.quantity.message}</div>}
              </div>

              {/* Published Year */}
              <div className="col-md-6">
                <label className="form-label fw-semibold text-secondary" style={{ fontSize: '13px' }}>PUBLISHED YEAR</label>
                <input
                  type="number"
                  className={`form-control bg-light border-0 ${errors.publishedYear ? 'is-invalid' : ''}`}
                  placeholder="e.g. 1954"
                  style={{ borderRadius: '8px', padding: '10px 14px' }}
                  {...register('publishedYear')}
                />
                {errors.publishedYear && <div className="invalid-feedback">{errors.publishedYear.message}</div>}
              </div>

              {/* Shelf Location */}
              <div className="col-12">
                <label className="form-label fw-semibold text-secondary" style={{ fontSize: '13px' }}>SHELF LOCATION</label>
                <input
                  type="text"
                  className={`form-control bg-light border-0 ${errors.shelfLocation ? 'is-invalid' : ''}`}
                  placeholder="e.g. Row 3, Shelf B"
                  style={{ borderRadius: '8px', padding: '10px 14px' }}
                  {...register('shelfLocation')}
                />
                {errors.shelfLocation && <div className="invalid-feedback">{errors.shelfLocation.message}</div>}
              </div>
            </div>

            <div className="border-top border-light mt-5 pt-4 text-end">
              <button 
                type="submit" 
                className="btn btn-primary px-5 py-3 fw-bold border-0 shadow-sm d-inline-flex align-items-center gap-2" 
                style={{ borderRadius: '8px' }}
              >
                <FaSave /> {isEditMode ? 'Save Changes' : 'Register Book'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default BookForm;
