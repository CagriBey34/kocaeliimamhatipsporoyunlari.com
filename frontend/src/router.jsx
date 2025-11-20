// router.jsx
import React from 'react';
import { Route, Routes, Navigate } from 'react-router-dom';

// Ana sayfalar
import Home from './pages/Home';
import Contact from './pages/Contact';
import Gallery from './pages/Gallery';
import Awards from './pages/awards/DerecePage';
import Instructions from './pages/Instructions';
import Tournament from './pages/Tournament'; 
import Application from './pages/Application'; 
import StudentRegistration from './pages/StudentRegistration'; // ✅ YENİimport NationalApplication from './pages/NationalApplication'; // ✅ EKLE
import NationalApplication from './pages/NationalApplication'; // ✅ EKLE
import Blog from './pages/blog/Blog';
import BlogDetail from './pages/blog/BlogDetail';
// Admin sayfaları
import Login from './admin/pages/Login';
import Dashboard from './admin/pages/Dashboard';
import PhotosPage from './admin/pages/PhotosPage';
import UploadPhotos from './admin/pages/UploadPhotos';
import TournamentManagement from './admin/pages/TournamentManagement';
import ApplicationsPage from './admin/pages/ApplicationsPage';
import StudentsPage from './admin/pages/StudentsPage'; // ✅ YENİ
import NationalApplicationsPage from './admin/pages/NationalApplicationsPage'; // ✅ EKLE
import PostsPage from './admin/pages/blog/PostsPage';
import PostEditor from './admin/pages/blog/PostEditor';


// Layouts
import MainLayout from './layouts/MainLayout';
import AdminLayout from './layouts/AdminLayout';
import TournamentFinal from './pages/TournamentFinal';

const AppRoutes = () => {
  return (
    <Routes>
      {/* Ana sayfalar - MainLayout ile */}
      <Route element={<MainLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/iletişim" element={<Contact />} />
        <Route path="/gallery" element={<Gallery />} />
        <Route path="/dereceye-girenler" element={<Awards />} />
        <Route path="/instructions" element={<Instructions />} />
        <Route path="/turnuva" element={<Tournament />} />
        <Route path="/turnuva-final-asamasi" element={<TournamentFinal />} />
        <Route path="/basvuru" element={<Application />} />
        <Route path="/turkiye-basvuru" element={<NationalApplication />} /> 
        <Route path="/ogrenci-kayit" element={<StudentRegistration />} /> 
        <Route path="/blog" element={<Blog />} />
        <Route path="/blog/:slug" element={<BlogDetail />} />
      </Route>
      
      <Route element={<AdminLayout />}>
        <Route path="/admin/login" element={<Login />} />
        <Route path="/admin/dashboard" element={<Dashboard />} />
        <Route path="/admin/photos" element={<PhotosPage />} />
        <Route path="/admin/upload" element={<UploadPhotos />} />
        <Route path="/admin/tournaments" element={<TournamentManagement />} /> 
        <Route path="/admin/national-applications" element={<NationalApplicationsPage />} />
        <Route path="/admin/applications" element={<ApplicationsPage />} />
        <Route path="/admin/students" element={<StudentsPage />} /> 
        <Route path="/admin" element={<Navigate to="/admin/dashboard" />} />
        <Route path="/admin/*" element={<Navigate to="/admin/dashboard" />} />
        <Route path="/admin/blog" element={<PostsPage />} />
        <Route path="/admin/blog/new" element={<PostEditor />} />
        <Route path="/admin/blog/edit/:id" element={<PostEditor />} />
      </Route>
    </Routes>
  );
};

export default AppRoutes;