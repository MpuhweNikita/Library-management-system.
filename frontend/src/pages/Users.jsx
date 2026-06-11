import React, { useEffect, useState } from 'react';
import axiosInstance from '../api/axiosInstance';
import { useAuth } from '../context/AuthContext';
import { useLoading } from '../context/LoadingContext';
import { FaTrash, FaUserTag, FaSave, FaTimes } from 'react-icons/fa';

const Users = () => {
  const { user: currentUser } = useAuth();
  const { setIsLoading } = useLoading();

  const [users, setUsers] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [selectedRole, setSelectedRole] = useState('');

  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const loadUsers = async () => {
    setIsLoading(true);
    setError('');
    try {
      const res = await axiosInstance.get('/users');
      setUsers(res.data.data || []);
    } catch (err) {
      setError('Failed to fetch users catalog');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const handleStartEdit = (user) => {
    setEditingId(user.id);
    setSelectedRole(user.role);
  };

  const handleCancelEdit = () => {
    setEditingId(null);
  };

  const handleUpdateRole = async (id) => {
    setError('');
    setSuccess('');
    setIsLoading(true);
    try {
      // Find user data to retain other values
      const targetUser = users.find(u => u.id === id);
      const payload = {
        firstName: targetUser.firstName,
        lastName: targetUser.lastName,
        username: targetUser.username,
        email: targetUser.email,
        phoneNumber: targetUser.phoneNumber,
        role: selectedRole
      };
      
      await axiosInstance.put(`/users/${id}`, payload);
      setSuccess('User role updated successfully!');
      setEditingId(null);
      loadUsers();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update user role');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteUser = async (id) => {
    if (!window.confirm('Are you sure you want to remove this user account? All corresponding borrow records will be affected.')) {
      return;
    }
    setError('');
    setSuccess('');
    setIsLoading(true);
    try {
      await axiosInstance.delete(`/users/${id}`);
      setSuccess('User removed successfully!');
      loadUsers();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete user');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <div className="mb-4">
        <h2 className="fw-bold text-dark mb-1">User Management</h2>
        <p className="text-muted mb-0">View system readers, assign roles, and handle accounts.</p>
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

      <div className="card border-0 shadow-sm" style={{ borderRadius: '12px' }}>
        <div className="card-body p-0">
          <div className="table-responsive">
            <table className="table table-hover align-middle mb-0" style={{ fontSize: '14.5px' }}>
              <thead className="table-light">
                <tr>
                  <th className="px-4 py-3 border-0">Full Name</th>
                  <th className="py-3 border-0">Username</th>
                  <th className="py-3 border-0">Email</th>
                  <th className="py-3 border-0">Phone</th>
                  <th className="py-3 border-0">Role</th>
                  <th className="px-4 py-3 border-0 text-end" style={{ width: '160px' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map((u) => {
                  const isSelf = currentUser?.username === u.username;
                  
                  let badgeColor = 'secondary';
                  if (u.role === 'ADMIN') badgeColor = 'danger';
                  else if (u.role === 'LIBRARIAN') badgeColor = 'warning';
                  else if (u.role === 'USER') badgeColor = 'info';

                  return (
                    <tr key={u.id}>
                      <td className="px-4 py-3 font-semibold text-dark">
                        {u.firstName} {u.lastName} {isSelf && <span className="text-primary fw-normal">(You)</span>}
                      </td>
                      <td className="py-3 text-secondary">{u.username}</td>
                      <td className="py-3 text-secondary">{u.email}</td>
                      <td className="py-3 text-secondary">{u.phoneNumber || <span className="text-muted opacity-50">-</span>}</td>
                      <td className="py-3">
                        {editingId === u.id ? (
                          <select 
                            className="form-select form-select-sm bg-light"
                            value={selectedRole}
                            onChange={(e) => setSelectedRole(e.target.value)}
                          >
                            <option value="USER">USER</option>
                            <option value="LIBRARIAN">LIBRARIAN</option>
                            <option value="ADMIN">ADMIN</option>
                          </select>
                        ) : (
                          <span className={`badge bg-${badgeColor}-subtle text-${badgeColor} border border-${badgeColor} border-opacity-10 px-2.5 py-1`} style={{ fontSize: '11px' }}>
                            {u.role}
                          </span>
                        )}
                      </td>
                      <td className="px-4 py-3 text-end">
                        {editingId === u.id ? (
                          <div className="d-flex justify-content-end gap-2">
                            <button 
                              onClick={() => handleUpdateRole(u.id)}
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
                              onClick={() => handleStartEdit(u)}
                              disabled={isSelf}
                              className="btn btn-sm btn-light border d-flex align-items-center justify-content-center p-2"
                              title="Change Role"
                            >
                              <FaUserTag className="text-secondary" />
                            </button>
                            <button 
                              onClick={() => handleDeleteUser(u.id)}
                              disabled={isSelf}
                              className="btn btn-sm btn-light border d-flex align-items-center justify-content-center p-2"
                              title="Delete Account"
                            >
                              <FaTrash className="text-danger" />
                            </button>
                          </div>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Users;
