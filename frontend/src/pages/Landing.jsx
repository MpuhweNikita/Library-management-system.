import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  FaBook, 
  FaArrowRight, 
  FaBookmark, 
  FaCheckCircle, 
  FaHistory, 
  FaUsers, 
  FaLayerGroup 
} from 'react-icons/fa';

const Landing = () => {
  const { isAuthenticated } = useAuth();

  return (
    <div className="bg-white" style={{ minHeight: '100vh', overflowX: 'hidden' }}>
      {/* Top Navbar */}
      <nav className="navbar navbar-expand-lg navbar-light bg-white border-bottom py-3 px-4 shadow-sm">
        <div className="container-fluid max-width-container d-flex justify-content-between align-items-center">
          <Link to="/" className="navbar-brand d-flex align-items-center gap-2 text-decoration-none">
            <div 
              className="rounded-circle d-flex align-items-center justify-content-center text-white" 
              style={{ width: '40px', height: '40px', backgroundColor: 'var(--primary-purple)' }}
            >
              <FaBook className="fs-5" />
            </div>
            <span className="fw-bold fs-4 text-dark" style={{ letterSpacing: '-0.5px' }}>SmartLib</span>
          </Link>
          
          <div className="d-flex align-items-center gap-3">
            {isAuthenticated ? (
              <Link to="/dashboard" className="btn btn-primary px-4">
                Go to Console <FaArrowRight className="ms-1" />
              </Link>
            ) : (
              <>
                <Link to="/login" className="btn btn-outline-primary px-4 d-none d-sm-inline-block">
                  Sign In
                </Link>
                <Link to="/register" className="btn btn-primary px-4">
                  Get Started
                </Link>
              </>
            )}
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="py-5 bg-white">
        <div className="container px-4 py-5">
          <div className="row align-items-center g-5">
            {/* Hero Left Content */}
            <div className="col-lg-6">
              <span className="badge px-3 py-2 text-uppercase mb-3" style={{ backgroundColor: 'var(--primary-purple-light)', color: 'var(--primary-purple)', borderRadius: '9999px', fontSize: '12px', fontWeight: '600' }}>
                ABOUT SMARTLIB
              </span>
              <h1 className="display-4 fw-bold mb-4 text-dark" style={{ lineHeight: '1.2', letterSpacing: '-1.5px' }}>
                Modern Digital <span style={{ color: 'var(--primary-purple)' }}>Library</span> Management System
              </h1>
              <p className="lead text-secondary mb-5" style={{ fontSize: '18px', lineHeight: '1.7' }}>
                At SmartLib, we believe that tracking books and managing borrows should be effortless. Our platform provides structured tools to search the catalog, issue checkouts, manage categories, and track overdue loans under a secure dashboard designed specifically for administrators, librarians, and readers.
              </p>
              <div className="d-flex flex-wrap gap-3">
                <Link to="/register" className="btn btn-primary btn-lg">
                  Explore Catalog
                </Link>
                <Link to="/login" className="btn btn-outline-primary btn-lg">
                  Sign In
                </Link>
              </div>
            </div>
            
            {/* Hero Right Graphic Section */}
            <div className="col-lg-6">
              <div className="position-relative d-flex justify-content-center align-items-center">
                {/* Clean decorative elements matching the design image */}
                <div 
                  className="position-absolute" 
                  style={{ 
                    width: '120px', 
                    height: '120px', 
                    background: 'radial-gradient(var(--primary-purple-light) 20%, transparent 20%)', 
                    backgroundSize: '15px 15px',
                    top: '-40px',
                    left: '20px',
                    opacity: 0.8
                  }} 
                />
                
                {/* Modern visual layout frame */}
                <div 
                  className="rounded-4 overflow-hidden border p-3 shadow-lg bg-white" 
                  style={{ maxWidth: '480px', borderLeft: '8px solid var(--primary-purple)' }}
                >
                  <div className="d-flex align-items-center gap-2 border-bottom pb-2 mb-3">
                    <div className="rounded-circle" style={{ width: '12px', height: '12px', backgroundColor: '#ef4444' }} />
                    <div className="rounded-circle" style={{ width: '12px', height: '12px', backgroundColor: '#eab308' }} />
                    <div className="rounded-circle" style={{ width: '12px', height: '12px', backgroundColor: '#22c55e' }} />
                    <span className="ms-2 text-muted fw-mono" style={{ fontSize: '11px' }}>smartlib-dashboard-preview.sh</span>
                  </div>
                  
                  <div className="p-3 bg-light rounded" style={{ fontFamily: 'monospace', fontSize: '13px' }}>
                    <div className="text-secondary">// Library catalog database active</div>
                    <div className="text-success mt-1">status: online [port 8080]</div>
                    <div className="text-dark mt-2"><b>&gt; npm run fetch-stats</b></div>
                    <div className="text-secondary mt-1">
                      - Categories: 12<br />
                      - Books: 1,482<br />
                      - Borrow Logs: Active (148 overdue)<br />
                      - Roles Authorized: ADMIN, LIBRARIAN, USER
                    </div>
                    <div className="text-primary mt-2"><b>&gt; docker logs smartlib-postgres-1</b></div>
                    <div className="text-success mt-1">Ready for connection checkouts...</div>
                  </div>
                </div>

                <div 
                  className="position-absolute rounded-circle"
                  style={{ 
                    width: '32px', 
                    height: '32px', 
                    backgroundColor: 'var(--primary-purple)', 
                    right: '10px', 
                    bottom: '-10px' 
                  }} 
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Services/Features Section */}
      <section className="py-5 bg-light border-top border-bottom">
        <div className="container px-4 py-5 text-center">
          <span className="text-uppercase fw-semibold" style={{ color: 'var(--primary-purple)', fontSize: '13px', letterSpacing: '1px' }}>
            SERVICES
          </span>
          <h2 className="fw-bold mb-5 mt-2 text-dark fs-1" style={{ letterSpacing: '-1px' }}>
            Empowering Readers & Librarians Alike
          </h2>
          
          <div className="row g-4 justify-content-center text-start mt-2">
            {/* Card 1 */}
            <div className="col-12 col-md-4">
              <div className="card h-100 p-4 border shadow-sm">
                <div 
                  className="rounded-3 d-flex align-items-center justify-content-center mb-4" 
                  style={{ width: '50px', height: '50px', backgroundColor: 'var(--primary-purple-light)', color: 'var(--primary-purple)' }}
                >
                  <FaBookmark className="fs-4" />
                </div>
                <h5 className="fw-bold text-dark mb-3">Unified Catalog Search</h5>
                <p className="text-secondary" style={{ fontSize: '14px', lineHeight: '1.6' }}>
                  Readers can search for books by keyword, author, or ISBN. Filter by categories to find resources instantly and view real-time availability.
                </p>
                <Link to="/register" className="text-decoration-none mt-auto fw-bold" style={{ color: 'var(--primary-purple)', fontSize: '14px' }}>
                  Register to Browse
                </Link>
              </div>
            </div>

            {/* Card 2 (Highlighted active card matching purple container in design image) */}
            <div className="col-12 col-md-4">
              <div 
                className="card h-100 p-4 border-0 text-white" 
                style={{ backgroundColor: 'var(--primary-purple)' }}
              >
                <div 
                  className="rounded-3 d-flex align-items-center justify-content-center mb-4 bg-white" 
                  style={{ width: '50px', height: '50px', color: 'var(--primary-purple)' }}
                >
                  <FaLayerGroup className="fs-4" />
                </div>
                <h5 className="fw-bold text-white mb-3">Seamless Online Borrowing</h5>
                <p className="text-white text-opacity-75" style={{ fontSize: '14px', lineHeight: '1.6' }}>
                  Issue borrowings directly from the portal. Set automatic 14-day due dates, track copy limits, and register return checkouts in one click.
                </p>
                <Link to="/register" className="text-decoration-none mt-auto fw-bold text-white" style={{ fontSize: '14px' }}>
                  Start Borrowing
                </Link>
              </div>
            </div>

            {/* Card 3 */}
            <div className="col-12 col-md-4">
              <div className="card h-100 p-4 border shadow-sm">
                <div 
                  className="rounded-3 d-flex align-items-center justify-content-center mb-4" 
                  style={{ width: '50px', height: '50px', backgroundColor: 'var(--primary-purple-light)', color: 'var(--primary-purple)' }}
                >
                  <FaHistory className="fs-4" />
                </div>
                <h5 className="fw-bold text-dark mb-3">Operational Role Controls</h5>
                <p className="text-secondary" style={{ fontSize: '14px', lineHeight: '1.6' }}>
                  Whether you are a Reader borrowing books, a Librarian updating categories, or an Administrator managing users, SmartLib fits your role.
                </p>
                <Link to="/register" className="text-decoration-none mt-auto fw-bold" style={{ color: 'var(--primary-purple)', fontSize: '14px' }}>
                  Choose Your Role
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section (Clean Solid Violet Waves/Container) */}
      <section className="py-5 text-white" style={{ backgroundColor: 'var(--primary-purple)' }}>
        <div className="container px-4 py-5">
          <div className="row align-items-center g-4">
            <div className="col-md-4">
              <span className="text-uppercase fw-semibold text-white-50" style={{ fontSize: '13px', letterSpacing: '1px' }}>
                COMMUNITY VOICE
              </span>
              <h2 className="fw-bold mt-2 text-white fs-1" style={{ letterSpacing: '-1.5px' }}>
                Loved by Readers
              </h2>
              <Link to="/register" className="text-decoration-none fw-bold text-white mt-3 d-inline-block text-white-50" style={{ fontSize: '14px' }}>
                Join our Readers →
              </Link>
            </div>
            
            <div className="col-md-8">
              <div className="row g-4">
                <div className="col-sm-6">
                  <div className="bg-white rounded p-4 text-dark shadow-sm">
                    <p className="text-secondary italic" style={{ fontSize: '14px', lineHeight: '1.6' }}>
                      "Configuring permissions on our university catalog became painless. Role choosing makes segregating readers, catalogers, and managers simple."
                    </p>
                    <div className="d-flex align-items-center gap-3 mt-4">
                      <div 
                        className="rounded-circle d-flex align-items-center justify-content-center text-white fw-bold"
                        style={{ width: '40px', height: '40px', backgroundColor: 'var(--primary-purple)' }}
                      >
                        M
                      </div>
                      <div>
                        <div className="fw-bold text-dark" style={{ fontSize: '14px' }}>Mark R.</div>
                        <div className="text-muted" style={{ fontSize: '12px' }}>Head of Client Services</div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="col-sm-6">
                  <div className="bg-white rounded p-4 text-dark shadow-sm">
                    <p className="text-secondary italic" style={{ fontSize: '14px', lineHeight: '1.6' }}>
                      "The database migration to PostgreSQL was effortless, and the clean design holds zero corporate clunkiness. Our readers enjoy the modern, Poppins-styled catalog lookup."
                    </p>
                    <div className="d-flex align-items-center gap-3 mt-4">
                      <div 
                        className="rounded-circle d-flex align-items-center justify-content-center text-white fw-bold"
                        style={{ width: '40px', height: '40px', backgroundColor: 'var(--primary-purple)' }}
                      >
                        S
                      </div>
                      <div>
                        <div className="fw-bold text-dark" style={{ fontSize: '14px' }}>Sarah D.</div>
                        <div className="text-muted" style={{ fontSize: '12px' }}>Library Administrator</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Newsletter Signup Banner */}
      <section className="py-5 bg-white border-top">
        <div className="container px-4 py-4">
          <div className="row align-items-center justify-content-between g-4">
            <div className="col-md-6">
              <span className="text-uppercase fw-semibold" style={{ color: 'var(--primary-purple)', fontSize: '12px', letterSpacing: '1px' }}>
                SUBSCRIBE TO OUR
              </span>
              <h3 className="fw-bold text-dark mt-1 mb-0" style={{ letterSpacing: '-0.5px' }}>
                Newsletter
              </h3>
            </div>
            <div className="col-md-6">
              <form onSubmit={(e) => e.preventDefault()} className="d-flex gap-2">
                <input 
                  type="email" 
                  className="form-control" 
                  placeholder="Enter your email address..."
                  style={{ borderRadius: '9999px !important', paddingLeft: '1.5rem' }} 
                />
                <button type="submit" className="btn btn-primary px-4">
                  Subscribe Now
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-4 border-top bg-light">
        <div className="container px-4 text-center text-muted" style={{ fontSize: '13px' }}>
          &copy; {new Date().getFullYear()} SmartLib digital systems. All rights reserved. Configured with solid purple design.
        </div>
      </footer>
    </div>
  );
};

export default Landing;
