import React, { useEffect, useState } from 'react';
import axiosInstance from '../api/axiosInstance';
import { useAuth } from '../context/AuthContext';
import { useLoading } from '../context/LoadingContext';
import { FaEdit, FaTrash, FaPlus, FaSave, FaTimes } from 'react-icons/fa';

const Categories = () => {
  const { user } = useAuth();
  const { setIsLoading } = useLoading();

  const [categories, setCategories] = useState([]);
  const [newCatName, setNewCatName] = useState('');
  const [newCatDesc, setNewCatDesc] = useState('');
  
  // Edit mode states
  const [editingId, setEditingId] = useState(null);
  const [editCatName, setEditCatName] = useState('');
  const [editCatDesc, setEditCatDesc] = useState('');

  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const loadCategories = async () => {
    setIsLoading(true);
    setError('');
    try {
      const res = await axiosInstance.get('/categories');
      setCategories(res.data.data || []);
    } catch (err) {
      setError('Failed to fetch categories list');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadCategories();
  }, []);

  const handleAddCategory = async (e) => {
    e.preventDefault();
    if (!newCatName.trim()) {
      setError('Category name is required');
      return;
    }
    setError('');
    setSuccess('');
    setIsLoading(true);
    try {
      await axiosInstance.post('/categories', {
        name: newCatName.trim(),
        description: newCatDesc.trim()
      });
      setSuccess('Category registered successfully!');
      setNewCatName('');
      setNewCatDesc('');
      loadCategories();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create category');
    } finally {
      setIsLoading(false);
    }
  };

  const handleStartEdit = (cat) => {
    setEditingId(cat.id);
    setEditCatName(cat.name);
    setEditCatDesc(cat.description || '');
  };

  const handleCancelEdit = () => {
    setEditingId(null);
  };

  const handleUpdateCategory = async (id) => {
    if (!editCatName.trim()) {
      setError('Category name is required');
      return;
    }
    setError('');
    setSuccess('');
    setIsLoading(true);
    try {
      await axiosInstance.put(`/categories/${id}`, {
        name: editCatName.trim(),
        description: editCatDesc.trim()
      });
      setSuccess('Category updated successfully!');
      setEditingId(null);
      loadCategories();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update category');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteCategory = async (id) => {
    if (!window.confirm('Are you sure you want to delete this category?')) {
      return;
    }
    setError('');
    setSuccess('');
    setIsLoading(true);
    try {
      await axiosInstance.delete(`/categories/${id}`);
      setSuccess('Category deleted successfully!');
      loadCategories();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete category');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <div className="mb-4">
        <h2 className="fw-bold text-dark mb-1">Categories Directory</h2>
        <p className="text-muted mb-0">Organize and group book catalog listings.</p>
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
        {/* Left column: categories list */}
        <div className="col-12 col-lg-8">
          <div className="card border-0 shadow-sm" style={{ borderRadius: '12px' }}>
            <div className="card-body p-0">
              <div className="table-responsive">
                <table className="table table-hover align-middle mb-0" style={{ fontSize: '14.5px' }}>
                  <thead className="table-light">
                    <tr>
                      <th className="px-4 py-3 border-0" style={{ width: '80px' }}>ID</th>
                      <th className="py-3 border-0" style={{ width: '220px' }}>Category Name</th>
                      <th className="py-3 border-0">Description</th>
                      <th className="px-4 py-3 border-0 text-end" style={{ width: '150px' }}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {categories.map((cat) => (
                      <tr key={cat.id}>
                        <td className="px-4 py-3 text-muted">{cat.id}</td>
                        <td className="py-3 font-semibold text-dark">
                          {editingId === cat.id ? (
                            <input
                              type="text"
                              className="form-control form-control-sm"
                              value={editCatName}
                              onChange={(e) => setEditCatName(e.target.value)}
                            />
                          ) : (
                            cat.name
                          )}
                        </td>
                        <td className="py-3 text-secondary text-truncate" style={{ maxWidth: '300px' }}>
                          {editingId === cat.id ? (
                            <input
                              type="text"
                              className="form-control form-control-sm"
                              value={editCatDesc}
                              onChange={(e) => setEditCatDesc(e.target.value)}
                            />
                          ) : (
                            cat.description || <span className="text-muted italic">No description</span>
                          )}
                        </td>
                        <td className="px-4 py-3 text-end">
                          {editingId === cat.id ? (
                            <div className="d-flex justify-content-end gap-2">
                              <button 
                                onClick={() => handleUpdateCategory(cat.id)}
                                className="btn btn-sm btn-success d-flex align-items-center justify-content-center p-2"
                                title="Save"
                              >
                                <FaSave />
                              </button>
                              <button 
                                onClick={handleCancelEdit}
                                className="btn btn-sm btn-outline-secondary d-flex align-items-center justify-content-center p-2"
                                title="Cancel"
                              >
                                <FaTimes />
                              </button>
                            </div>
                          ) : (
                            <div className="d-flex justify-content-end gap-2">
                              <button 
                                onClick={() => handleStartEdit(cat)}
                                className="btn btn-sm btn-light border d-flex align-items-center justify-content-center p-2"
                                title="Edit"
                              >
                                <FaEdit className="text-secondary" />
                              </button>
                              <button 
                                onClick={() => handleDeleteCategory(cat.id)}
                                className="btn btn-sm btn-light border d-flex align-items-center justify-content-center p-2"
                                title="Delete"
                              >
                                <FaTrash className="text-danger" />
                              </button>
                            </div>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>

        {/* Right column: Add new category form */}
        <div className="col-12 col-lg-4">
          <div className="card border-0 shadow-sm" style={{ borderRadius: '12px' }}>
            <div className="card-header bg-white py-3 border-bottom border-light">
              <h5 className="mb-0 fw-bold text-dark">Register Category</h5>
            </div>
            <div className="card-body p-4">
              <form onSubmit={handleAddCategory}>
                <div className="mb-3">
                  <label className="form-label fw-semibold text-secondary" style={{ fontSize: '13px' }}>CATEGORY NAME</label>
                  <input
                    type="text"
                    className="form-control bg-light border-0"
                    placeholder="e.g. Science Fiction"
                    value={newCatName}
                    onChange={(e) => setNewCatName(e.target.value)}
                    style={{ borderRadius: '8px', padding: '10px 12px', fontSize: '14px' }}
                  />
                </div>
                <div className="mb-4">
                  <label className="form-label fw-semibold text-secondary" style={{ fontSize: '13px' }}>DESCRIPTION</label>
                  <textarea
                    className="form-control bg-light border-0"
                    placeholder="Brief description of category..."
                    rows="4"
                    value={newCatDesc}
                    onChange={(e) => setNewCatDesc(e.target.value)}
                    style={{ borderRadius: '8px', padding: '10px 12px', fontSize: '14px' }}
                  ></textarea>
                </div>
                <button 
                  type="submit" 
                  className="btn btn-primary w-100 fw-bold border-0 shadow-sm py-2.5 d-flex align-items-center justify-content-center gap-2"
                  style={{ borderRadius: '8px' }}
                >
                  <FaPlus /> Add Category
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Categories;
