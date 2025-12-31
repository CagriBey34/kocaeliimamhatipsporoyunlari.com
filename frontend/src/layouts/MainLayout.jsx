import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from '../components/common/Navbar/WebHeader.jsx';
import Footer from '../components/common/Footer/Footer.jsx';

const MainLayout = () => {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-gray-50 to-gray-100 relative">
      <Navbar />
      <main className="flex-grow">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export default MainLayout;