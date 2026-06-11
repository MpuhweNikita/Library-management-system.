import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useAuth } from '../context/AuthContext';
import { useLoading } from '../context/LoadingContext';
import { FaBook, FaEye, FaEyeSlash } from 'react-icons/fa';

const schema = yup.object().shape({
  firstName: yup.string().required('First name is required').min(2, 'At least 2 characters'),
  lastName: yup.string().required('Last name is required').min(2, 'At least 2 characters'),
  username: yup.string().required('Username is required').min(3, 'At least 3 characters'),
  email: yup.string().email('Provide a valid email').required('Email is required'),
  role: yup.string().required('Role selection is required'),
  phoneNumber: yup.string().max(20, 'Max 20 characters').nullable(),
  password: yup.string().required('Password is required').min(6, 'At least 6 characters'),
  confirmPassword: yup.string()
    .oneOf([yup.ref('password'), null], 'Passwords must match')
    .required('Confirm password is required'),
});

const Register = () => {
  const { register: registerUser } = useAuth();
  const { setIsLoading } = useLoading();
  const navigate = useNavigate();
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const { register: formRegister, handleSubmit, formState: { errors } } = useForm({
    resolver: yupResolver(schema)
  });

  const onSubmit = async (data) => {
    setError('');
    setIsLoading(true);
    try {
      const payload = {
        firstName: data.firstName,
        lastName: data.lastName,
        username: data.username,
        email: data.email,
        phoneNumber: data.phoneNumber,
        password: data.password,
        role: data.role
      };
      await registerUser(payload);
      setSuccess(true);
      setTimeout(() => {
        navigate('/login');
      }, 2000);
    } catch (err) {
      setError(err || 'Registration failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div 
      className="d-flex align-items-center justify-content-center" 
      style={{ 
        minHeight: '100vh', 
        background: 'var(--bg-slate)',
        padding: '20px'
      }}
    >
      <div 
        className="card border shadow text-dark my-5" 
        style={{ 
          maxWidth: '550px', 
          width: '100%', 
          borderRadius: '16px',
          backgroundColor: '#ffffff'
        }}
      >
        <div className="card-body p-5">
          <div className="text-center mb-4">
            <div 
              className="rounded-circle d-inline-flex align-items-center justify-content-center text-white mb-3 shadow-sm" 
              style={{ width: '60px', height: '60px', backgroundColor: 'var(--primary-purple)' }}
            >
              <FaBook className="fs-3" />
            </div>
            <h3 className="fw-bold">Create Account</h3>
            <p className="text-muted">Register your SmartLib account</p>
          </div>

          {success && (
            <div className="alert alert-success border-0 py-2.5 rounded shadow-sm mb-4" role="alert" style={{ fontSize: '14px' }}>
              Registration successful! Redirecting to login page...
            </div>
          )}

          {error && (
            <div className="alert alert-danger border-0 py-2.5 rounded shadow-sm mb-4" role="alert" style={{ fontSize: '14px' }}>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="row">
              <div className="col-md-6 mb-3">
                <label className="form-label fw-semibold text-secondary" style={{ fontSize: '13px' }}>FIRST NAME</label>
                <input
                  type="text"
                  className={`form-control bg-light border-0 ${errors.firstName ? 'is-invalid' : ''}`}
                  placeholder="John"
                  style={{ fontSize: '14px', borderRadius: '8px', padding: '10px 12px' }}
                  {...formRegister('firstName')}
                />
                {errors.firstName && (
                  <div className="invalid-feedback">{errors.firstName.message}</div>
                )}
              </div>
              <div className="col-md-6 mb-3">
                <label className="form-label fw-semibold text-secondary" style={{ fontSize: '13px' }}>LAST NAME</label>
                <input
                  type="text"
                  className={`form-control bg-light border-0 ${errors.lastName ? 'is-invalid' : ''}`}
                  placeholder="Doe"
                  style={{ fontSize: '14px', borderRadius: '8px', padding: '10px 12px' }}
                  {...formRegister('lastName')}
                />
                {errors.lastName && (
                  <div className="invalid-feedback">{errors.lastName.message}</div>
                )}
              </div>
            </div>

            <div className="mb-3">
              <label className="form-label fw-semibold text-secondary" style={{ fontSize: '13px' }}>USERNAME</label>
              <input
                type="text"
                className={`form-control bg-light border-0 ${errors.username ? 'is-invalid' : ''}`}
                placeholder="johndoe"
                style={{ fontSize: '14px', borderRadius: '8px', padding: '10px 12px' }}
                {...formRegister('username')}
              />
              {errors.username && (
                <div className="invalid-feedback">{errors.username.message}</div>
              )}
            </div>

            <div className="mb-3">
              <label className="form-label fw-semibold text-secondary" style={{ fontSize: '13px' }}>EMAIL ADDRESS</label>
              <input
                type="email"
                className={`form-control bg-light border-0 ${errors.email ? 'is-invalid' : ''}`}
                placeholder="john@example.com"
                style={{ fontSize: '14px', borderRadius: '8px', padding: '10px 12px' }}
                {...formRegister('email')}
              />
              {errors.email && (
                <div className="invalid-feedback">{errors.email.message}</div>
              )}
            </div>

            <div className="mb-3">
              <label className="form-label fw-semibold text-secondary" style={{ fontSize: '13px' }}>PHONE NUMBER</label>
              <input
                type="text"
                className={`form-control bg-light border-0 ${errors.phoneNumber ? 'is-invalid' : ''}`}
                placeholder="+123456789"
                style={{ fontSize: '14px', borderRadius: '8px', padding: '10px 12px' }}
                {...formRegister('phoneNumber')}
              />
              {errors.phoneNumber && (
                <div className="invalid-feedback">{errors.phoneNumber.message}</div>
              )}
            </div>

            <div className="mb-3">
              <label className="form-label fw-semibold text-secondary" style={{ fontSize: '13px' }}>CHOOSE YOUR ROLE</label>
              <select
                className={`form-select bg-light border-0 ${errors.role ? 'is-invalid' : ''}`}
                style={{ fontSize: '14px', borderRadius: '8px', padding: '10px 12px' }}
                {...formRegister('role')}
              >
                <option value="">Select a role...</option>
                <option value="USER">Reader / User</option>
                <option value="LIBRARIAN">Librarian</option>
                <option value="ADMIN">System Administrator</option>
              </select>
              {errors.role && (
                <div className="invalid-feedback">{errors.role.message}</div>
              )}
            </div>

            <div className="row">
              <div className="col-md-6 mb-3">
                <label className="form-label fw-semibold text-secondary" style={{ fontSize: '13px' }}>PASSWORD</label>
                <div className="input-group">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    className={`form-control bg-light border-0 ${errors.password ? 'is-invalid' : ''}`}
                    placeholder="password"
                    style={{ fontSize: '14px', borderTopLeftRadius: '8px', borderBottomLeftRadius: '8px', padding: '10px 12px' }}
                    {...formRegister('password')}
                  />
                  <button
                    type="button"
                    className="btn btn-light border-0"
                    onClick={() => setShowPassword(!showPassword)}
                    style={{ borderTopRightRadius: '8px', borderBottomRightRadius: '8px' }}
                  >
                    {showPassword ? <FaEyeSlash className="text-secondary" style={{ fontSize: '14px' }} /> : <FaEye className="text-secondary" style={{ fontSize: '14px' }} />}
                  </button>
                </div>
                {errors.password && (
                  <div className="invalid-feedback d-block">{errors.password.message}</div>
                )}
              </div>
              <div className="col-md-6 mb-4">
                <label className="form-label fw-semibold text-secondary" style={{ fontSize: '13px' }}>CONFIRM PASSWORD</label>
                <input
                  type="password"
                  className={`form-control bg-light border-0 ${errors.confirmPassword ? 'is-invalid' : ''}`}
                  placeholder="confirm password"
                  style={{ fontSize: '14px', borderRadius: '8px', padding: '10px 12px' }}
                  {...formRegister('confirmPassword')}
                />
                {errors.confirmPassword && (
                  <div className="invalid-feedback">{errors.confirmPassword.message}</div>
                )}
              </div>
            </div>

            <button 
              type="submit" 
              className="btn btn-primary btn-lg w-100 fw-bold border-0 shadow py-3 transition-all mb-4"
              style={{ 
                borderRadius: '8px'
              }}
            >
              Sign Up
            </button>
          </form>

          <div className="text-center mt-2" style={{ fontSize: '14px' }}>
            <span className="text-muted">Already have an account? </span>
            <Link to="/login" className="text-primary fw-bold text-decoration-none hover-underline">Login Here</Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
