// src/layouts/AdminLayout.jsx
import React from 'react';
import { Outlet, Navigate, useLocation } from 'react-router-dom';

const AdminLayout = () => {
  const isAuthenticated = sessionStorage.getItem('isLoggedIn') === 'true';
  const location = useLocation();
  
  // Login sayfası için ayrı kontrol
  if (!isAuthenticated && location.pathname !== '/admin/login') {
    return <Navigate to="/admin/login" replace />;
  }

  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-grow p-4">
        <Outlet />
      </main>
    </div>
  );
};

export default AdminLayout;