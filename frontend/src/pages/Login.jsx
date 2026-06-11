import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useAuth } from '../context/AuthContext';
import { useLoading } from '../context/LoadingContext';
import { FaBook, FaEye, FaEyeSlash } from 'react-icons/fa';

const schema = yup.object().shape({
  username: yup.string().required('Username is required'),
  password: yup.string().required('Password is required'),
});

const Login = () => {
  const { login } = useAuth();
  const { setIsLoading } = useLoading();
  const navigate = useNavigate();
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const { register: formRegister, handleSubmit, formState: { errors } } = useForm({
    resolver: yupResolver(schema)
  });

  const onSubmit = async (data) => {
    setError('');
    setIsLoading(true);
    try {
      await login(data.username, data.password);
      navigate('/dashboard');
    } catch (err) {
      setError(err || 'Invalid username or password');
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
        className="card border shadow text-dark" 
        style={{ 
          maxWidth: '450px', 
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
            <h3 className="fw-bold">Welcome Back</h3>
            <p className="text-muted">Sign in to your library account</p>
          </div>

          {error && (
            <div className="alert alert-danger border-0 py-2.5 rounded shadow-sm mb-4" role="alert" style={{ fontSize: '14px' }}>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="mb-3">
              <label className="form-label fw-semibold text-secondary" style={{ fontSize: '13px' }}>USERNAME</label>
              <input
                type="text"
                className={`form-control form-control-lg bg-light border-0 ${errors.username ? 'is-invalid' : ''}`}
                placeholder="Enter your username"
                style={{ fontSize: '15px', borderRadius: '10px' }}
                {...formRegister('username')}
              />
              {errors.username && (
                <div className="invalid-feedback">{errors.username.message}</div>
              )}
            </div>

            <div className="mb-4">
              <label className="form-label fw-semibold text-secondary" style={{ fontSize: '13px' }}>PASSWORD</label>
              <div className="input-group">
                <input
                  type={showPassword ? 'text' : 'password'}
                  className={`form-control form-control-lg bg-light border-0 ${errors.password ? 'is-invalid' : ''}`}
                  placeholder="Enter your password"
                  style={{ fontSize: '15px', borderTopLeftRadius: '10px', borderBottomLeftRadius: '10px' }}
                  {...formRegister('password')}
                />
                <button
                  type="button"
                  className="btn btn-light border-0"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{ borderTopRightRadius: '10px', borderBottomRightRadius: '10px' }}
                >
                  {showPassword ? <FaEyeSlash className="text-secondary" /> : <FaEye className="text-secondary" />}
                </button>
                {errors.password && (
                  <div className="invalid-feedback d-block">{errors.password.message}</div>
                )}
              </div>
            </div>

            <button 
              type="submit" 
              className="btn btn-primary btn-lg w-100 fw-bold border-0 shadow py-3 transition-all mb-4"
              style={{ 
                borderRadius: '10px'
              }}
            >
              Sign In
            </button>
          </form>

          <div className="text-center mt-3" style={{ fontSize: '14px' }}>
            <span className="text-muted">Don't have an account? </span>
            <Link to="/register" className="text-primary fw-bold text-decoration-none hover-underline">Register Here</Link>
          </div>
        </div>
      </div>
      
      <style>{`
        .hover-underline:hover {
          text-decoration: underline !important;
        }
      `}</style>
    </div>
  );
};

export default Login;
