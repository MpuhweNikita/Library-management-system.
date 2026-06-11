import React from 'react';
import { Link } from 'react-router-dom';
import { FaQuestionCircle } from 'react-icons/fa';

const NotFound = () => {
  return (
    <div className="d-flex flex-column align-items-center justify-content-center text-center p-5" style={{ minHeight: '80vh' }}>
      <div className="text-primary mb-4" style={{ fontSize: '72px' }}>
        <FaQuestionCircle />
      </div>
      <h1 className="fw-bold text-dark mb-2">404 - Page Not Found</h1>
      <p className="text-muted fs-5 mb-4" style={{ maxWidth: '500px' }}>
        The page you are looking for does not exist, has been removed, or is temporarily unavailable.
      </p>
      <Link to="/" className="btn btn-primary px-4 py-2 fw-semibold border-0 shadow-sm" style={{ borderRadius: '8px' }}>
        Back to Dashboard
      </Link>
    </div>
  );
};

export default NotFound;
