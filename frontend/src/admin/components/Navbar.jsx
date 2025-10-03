import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { LogOut } from 'lucide-react';

const Navbar = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    // sessionStorage'dan 'isLoggedIn' anahtarını kaldır
    sessionStorage.removeItem('isLoggedIn');
    // Kullanıcıyı giriş sayfasına yönlendir
    navigate('/admin/login');
  };

  return (
    // Arka planı koyu bir renge çevirip (bg-gray-800) ve kenarlığı kaldırıldı.
    <nav className="">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* justify-center ile içeriği yatayda ortala */}
        {/* flex-1 div'i ile logo ve çıkış butonunu ortada yan yana grupla */}
        <div className="flex justify-center items-center h-16">
          <div className="flex items-center space-x-8"> 
            {/* Logo */}
            <Link 
              to="/admin/dashboard" 
              // Yazı rengini arka plana uyacak şekilde beyaza (text-white) ve hover rengini kırmızıya çevirdik
              className="text-lg sm:text-xl font-bold text-black hover:text-red-400 transition-colors"
            >
              Yönetim Paneli
            </Link>

            {/* Logout Button */}
            <button 
              onClick={handleLogout}
              // Yazı rengini beyaza (text-white) ve hover arka planını kırmızıya çevirdik
              className="flex items-center gap-2 px-4 py-2 text-black hover:text-red-400 hover:bg-gray-700 rounded-lg transition-all"
            >
              <LogOut className="w-4 h-4" />
              <span className="hidden sm:inline">Çıkış</span>
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;