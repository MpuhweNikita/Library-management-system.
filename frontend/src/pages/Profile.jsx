import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import axiosInstance from '../api/axiosInstance';
import { useAuth } from '../context/AuthContext';
import { useLoading } from '../context/LoadingContext';
import { FaUser, FaSave, FaEdit, FaTimes } from 'react-icons/fa';

const schema = yup.object().shape({
  firstName: yup.string().required('First name is required').min(2, 'At least 2 characters'),
  lastName: yup.string().required('Last name is required').min(2, 'At least 2 characters'),
  email: yup.string().email('Provide a valid email').required('Email is required'),
  phoneNumber: yup.string().max(20, 'Max 20 characters').nullable(),
});

const Profile = () => {
  const { user: authUser } = useAuth();
  const { setIsLoading } = useLoading();

  const [profile, setProfile] = useState(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const { register, handleSubmit, setValue, formState: { errors } } = useForm({
    resolver: yupResolver(schema)
  });

  const loadProfile = async () => {
    setIsLoading(true);
    setError('');
    try {
      const res = await axiosInstance.get('/users/me');
      const data = res.data.data;
      setProfile(data);
      
      // Prefill values
      setValue('firstName', data.firstName);
      setValue('lastName', data.lastName);
      setValue('email', data.email);
      setValue('phoneNumber', data.phoneNumber || '');
    } catch (err) {
      setError('Failed to load user profile');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadProfile();
  }, []);

  const onSubmit = async (data) => {
    setError('');
    setSuccess('');
    setIsLoading(true);
    try {
      const payload = {
        ...data,
        username: profile.username,
        role: profile.role // preserve username and role
      };
      const res = await axiosInstance.put(`/users/${profile.id}`, payload);
      setProfile(res.data.data);
      setSuccess('Profile updated successfully!');
      setIsEditMode(false);
      
      // Update global context cache items
      localStorage.setItem('firstName', data.firstName);
      localStorage.setItem('lastName', data.lastName);
      localStorage.setItem('email', data.email);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update profile');
    } finally {
      setIsLoading(false);
    }
  };

  if (!profile) return null;

  return (
    <div>
      <div className="mb-4">
        <h2 className="fw-bold text-dark mb-1">My Profile</h2>
        <p className="text-muted mb-0">Manage your personal account profile details.</p>
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
        {/* Left Card: Summary */}
        <div className="col-12 col-md-4">
          <div className="card border-0 shadow-sm text-center p-4" style={{ borderRadius: '16px' }}>
            <div className="card-body">
              <div 
                className="rounded-circle text-white d-flex align-items-center justify-content-center fw-bold mx-auto mb-3 shadow"
                style={{ width: '80px', height: '80px', fontSize: '32px', background: 'var(--primary-gradient)' }}
              >
                {profile.firstName ? profile.firstName.charAt(0).toUpperCase() : profile.username.charAt(0).toUpperCase()}
              </div>
              <h4 className="fw-bold text-dark mb-1">{profile.firstName} {profile.lastName}</h4>
              <span className="badge bg-secondary-subtle text-secondary border border-secondary border-opacity-10 px-3 py-1.5" style={{ fontSize: '12px' }}>
                {profile.role}
              </span>
              
              <div className="border-top border-light mt-4 pt-4 text-start" style={{ fontSize: '13.5px' }}>
                <div className="text-muted mb-1">USERNAME</div>
                <span className="fw-semibold text-dark d-block mb-3">{profile.username}</span>

                <div className="text-muted mb-1">ACCOUNT CREATED</div>
                <span className="fw-semibold text-dark d-block">
                  {profile.createdAt ? new Date(profile.createdAt).toLocaleDateString() : 'N/A'}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Card: Details / Form */}
        <div className="col-12 col-md-8">
          <div className="card border-0 shadow-sm" style={{ borderRadius: '16px' }}>
            <div className="card-header bg-white py-3 border-bottom border-light px-4 d-flex justify-content-between align-items-center">
              <h5 className="mb-0 fw-bold text-dark">Profile Details</h5>
              {!isEditMode && (
                <button 
                  onClick={() => setIsEditMode(true)}
                  className="btn btn-outline-primary btn-sm d-flex align-items-center gap-1.5 px-3 py-1.5"
                  style={{ borderRadius: '6px' }}
                >
                  <FaEdit /> Edit Profile
                </button>
              )}
            </div>
            
            <div className="card-body p-4">
              <form onSubmit={handleSubmit(onSubmit)}>
                <div className="row g-3">
                  {/* First Name */}
                  <div className="col-md-6">
                    <label className="form-label fw-semibold text-secondary" style={{ fontSize: '13px' }}>FIRST NAME</label>
                    <input
                      type="text"
                      className={`form-control bg-light border-0 ${errors.firstName ? 'is-invalid' : ''}`}
                      disabled={!isEditMode}
                      style={{ borderRadius: '8px', padding: '10px 12px' }}
                      {...register('firstName')}
                    />
                    {errors.firstName && <div className="invalid-feedback">{errors.firstName.message}</div>}
                  </div>

                  {/* Last Name */}
                  <div className="col-md-6">
                    <label className="form-label fw-semibold text-secondary" style={{ fontSize: '13px' }}>LAST NAME</label>
                    <input
                      type="text"
                      className={`form-control bg-light border-0 ${errors.lastName ? 'is-invalid' : ''}`}
                      disabled={!isEditMode}
                      style={{ borderRadius: '8px', padding: '10px 12px' }}
                      {...register('lastName')}
                    />
                    {errors.lastName && <div className="invalid-feedback">{errors.lastName.message}</div>}
                  </div>

                  {/* Email */}
                  <div className="col-12">
                    <label className="form-label fw-semibold text-secondary" style={{ fontSize: '13px' }}>EMAIL ADDRESS</label>
                    <input
                      type="email"
                      className={`form-control bg-light border-0 ${errors.email ? 'is-invalid' : ''}`}
                      disabled={!isEditMode}
                      style={{ borderRadius: '8px', padding: '10px 12px' }}
                      {...register('email')}
                    />
                    {errors.email && <div className="invalid-feedback">{errors.email.message}</div>}
                  </div>

                  {/* Phone Number */}
                  <div className="col-12">
                    <label className="form-label fw-semibold text-secondary" style={{ fontSize: '13px' }}>PHONE NUMBER</label>
                    <input
                      type="text"
                      className={`form-control bg-light border-0 ${errors.phoneNumber ? 'is-invalid' : ''}`}
                      disabled={!isEditMode}
                      placeholder="e.g. +1234567890"
                      style={{ borderRadius: '8px', padding: '10px 12px' }}
                      {...register('phoneNumber')}
                    />
                    {errors.phoneNumber && <div className="invalid-feedback">{errors.phoneNumber.message}</div>}
                  </div>
                </div>

                {isEditMode && (
                  <div className="mt-4 pt-3 border-top border-light d-flex justify-content-end gap-2">
                    <button 
                      type="button" 
                      onClick={() => setIsEditMode(false)}
                      className="btn btn-outline-secondary px-4 py-2 d-flex align-items-center gap-1.5"
                      style={{ borderRadius: '8px' }}
                    >
                      <FaTimes /> Cancel
                    </button>
                    <button 
                      type="submit" 
                      className="btn btn-primary px-4 py-2 d-flex align-items-center gap-1.5"
                      style={{ borderRadius: '8px' }}
                    >
                      <FaSave /> Save Profile
                    </button>
                  </div>
                )}
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
