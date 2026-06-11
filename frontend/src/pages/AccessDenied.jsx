import React from 'react';
import { Link } from 'react-router-dom';
import { FaExclamationTriangle } from 'react-icons/fa';

const AccessDenied = () => {
  return (
    <div className="d-flex flex-column align-items-center justify-content-center text-center p-5" style={{ minHeight: '80vh' }}>
      <div className="text-danger mb-4" style={{ fontSize: '72px' }}>
        <FaExclamationTriangle />
      </div>
      <h1 className="fw-bold text-dark mb-2">403 - Access Denied</h1>
      <p className="text-muted fs-5 mb-4" style={{ maxWidth: '500px' }}>
        You do not have the required permissions to view this resource. Please contact your system administrator if you think this is a mistake.
      </p>
      <Link to="/" className="btn btn-primary px-4 py-2 fw-semibold border-0 shadow-sm" style={{ borderRadius: '8px' }}>
        Back to Dashboard
      </Link>
    </div>
  );
};

export default AccessDenied;
