import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { LoadingProvider } from './context/LoadingContext';
import ProtectedRoute from './components/ProtectedRoute';
import Layout from './components/Layout';

// Pages
import Landing from './pages/Landing';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Books from './pages/Books';
import BookDetails from './pages/BookDetails';
import BookForm from './pages/BookForm';
import Categories from './pages/Categories';
import Users from './pages/Users';
import Borrows from './pages/Borrows';
import Profile from './pages/Profile';
import Settings from './pages/Settings';
import AccessDenied from './pages/AccessDenied';
import NotFound from './pages/NotFound';

import 'bootstrap/dist/css/bootstrap.min.css';

function App() {
  return (
    <Router>
      <LoadingProvider>
        <AuthProvider>
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Landing />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            {/* Protected Client Routes wrapped in Layout */}
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute allowedRoles={['ADMIN', 'LIBRARIAN', 'USER']}>
                  <Layout>
                    <Dashboard />
                  </Layout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/books"
              element={
                <ProtectedRoute allowedRoles={['ADMIN', 'LIBRARIAN', 'USER']}>
                  <Layout>
                    <Books />
                  </Layout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/books/:id"
              element={
                <ProtectedRoute allowedRoles={['ADMIN', 'LIBRARIAN', 'USER']}>
                  <Layout>
                    <BookDetails />
                  </Layout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/profile"
              element={
                <ProtectedRoute allowedRoles={['ADMIN', 'LIBRARIAN', 'USER']}>
                  <Layout>
                    <Profile />
                  </Layout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/borrows"
              element={
                <ProtectedRoute allowedRoles={['ADMIN', 'LIBRARIAN', 'USER']}>
                  <Layout>
                    <Borrows />
                  </Layout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/access-denied"
              element={
                <ProtectedRoute allowedRoles={['ADMIN', 'LIBRARIAN', 'USER']}>
                  <Layout>
                    <AccessDenied />
                  </Layout>
                </ProtectedRoute>
              }
            />

            {/* Admin & Librarian Only Routes */}
            <Route
              path="/books/new"
              element={
                <ProtectedRoute allowedRoles={['ADMIN', 'LIBRARIAN']}>
                  <Layout>
                    <BookForm />
                  </Layout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/books/:id/edit"
              element={
                <ProtectedRoute allowedRoles={['ADMIN', 'LIBRARIAN']}>
                  <Layout>
                    <BookForm />
                  </Layout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/categories"
              element={
                <ProtectedRoute allowedRoles={['ADMIN', 'LIBRARIAN']}>
                  <Layout>
                    <Categories />
                  </Layout>
                </ProtectedRoute>
              }
            />

            {/* Admin Only Routes */}
            <Route
              path="/users"
              element={
                <ProtectedRoute allowedRoles={['ADMIN']}>
                  <Layout>
                    <Users />
                  </Layout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/settings"
              element={
                <ProtectedRoute allowedRoles={['ADMIN']}>
                  <Layout>
                    <Settings />
                  </Layout>
                </ProtectedRoute>
              }
            />

            {/* Catch-all Fallback */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AuthProvider>
      </LoadingProvider>
    </Router>
  );
}

export default App;
