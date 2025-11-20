import React from 'react';
import { Link } from 'react-router-dom';
import { Camera, Upload, Trophy, FileText, Users, MapPin, Sparkles, ArrowRight, LogOut } from 'lucide-react';
import {  useNavigate } from 'react-router-dom';

const Dashboard = () => {

  const navigate = useNavigate();

  const handleLogout = () => {
    // sessionStorage'dan 'isLoggedIn' anahtarını kaldır
    sessionStorage.removeItem('isLoggedIn');
    // Kullanıcıyı giriş sayfasına yönlendir
    navigate('/admin/login');
  };


  const menuItems = [
    {
      to: '/admin/photos',
      icon: Camera,
      title: 'Fotoğraf Galerisi',
      description: 'Mevcut fotoğrafları görüntüleyin, düzenleyin veya silin',
      gradient: 'from-red-500 via-red-600 to-red-600',
      bgPattern: 'bg-red-50/50',
      glowColor: 'group-hover:shadow-red-500/20'
    },
    {
      to: '/admin/upload',
      icon: Upload,
      title: 'Fotoğraf Yükle',
      description: 'Galeriye yeni fotoğraflar ekleyin',
      gradient: 'from-red-500 via-red-600 to-red-600',
      bgPattern: 'bg-red-50/50',
      glowColor: 'group-hover:shadow-red-500/20'
    },
    {
      to: '/admin/tournaments',
      icon: Trophy,
      title: 'Turnuva Yönetimi',
      description: 'Turnuvaları yönetin, düzenleyin ve takip edin',
      gradient: 'from-red-500 via-red-600 to-red-700',
      bgPattern: 'bg-red-50/50',
      glowColor: 'group-hover:shadow-red-500/20'
    },
    {
      to: '/admin/applications',
      icon: FileText,
      title: 'İstanbul Başvuruları',
      description: 'İstanbul okullarının başvurularını yönetin',
      gradient: 'from-red-500 via-red-600 to-red-600',
      bgPattern: 'bg-red-50/50',
      glowColor: 'group-hover:shadow-red-500/20'
    },
    {
      to: '/admin/national-applications',
      icon: MapPin,
      title: 'Türkiye Başvuruları',
      description: 'Tüm Türkiye genelinden gelen başvuruları yönetin',
      gradient: 'from-red-500 via-red-600 to-red-600',
      bgPattern: 'bg-red-50/50',
      glowColor: 'group-hover:shadow-red-500/20'
    },
    {
      to: '/admin/students',
      icon: Users,
      title: 'Öğrenci Bilgileri',
      description: 'Kayıtlı öğrencileri inceleyin ve yönetin',
      gradient: 'from-red-500 via-red-600 to-red-600',
      bgPattern: 'bg-red-50/50',
      glowColor: 'group-hover:shadow-red-500/20'
    },
    {
      to: '/admin/blog',
      icon: Users,
      title: 'Blog Yönetimi',
      description: 'Blog gönderilerini oluşturun, düzenleyin ve silin',
      gradient: 'from-red-500 via-red-600 to-red-600',
      bgPattern: 'bg-red-50/50',
      glowColor: 'group-hover:shadow-cyan-500/20'
    }
  ];

  return (
    <div className="min-h-screen ">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Premium Header */}
        <div className="mb-12 relative">
          {/* Background Decoration */}
          <div className="absolute -top-20 -left-20 w-72 h-72 bg-gradient-to-br from-red-100 to-orange-100 rounded-full blur-3xl opacity-20 animate-pulse"></div>
          <div className="absolute -top-10 -right-20 w-96 h-96 bg-gradient-to-br from-purple-100 to-pink-100 rounded-full blur-3xl opacity-20 animate-pulse delay-1000"></div>
          
          <div className="relative">
            {/* Header Container with Logout */}
            <div className="flex items-start justify-between mb-3">
              {/* Title with Sparkle Effect */}
              <div className="flex items-center gap-3">
                <div className="p-3 bg-gradient-to-br from-red-500 to-orange-500 rounded-2xl shadow-lg shadow-red-500/30">
                  <Sparkles className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h1 className="text-4xl sm:text-5xl font-black bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 bg-clip-text text-transparent leading-tight">
                    Yönetim Paneli
                  </h1>
                  <div className="flex items-center gap-2 mt-1">
                    <div className="h-1 w-12 bg-gradient-to-r from-red-500 to-orange-500 rounded-full"></div>
                    <p className="text-gray-600 font-medium">
                      16. İmam Hatip Spor Oyunları
                    </p>
                  </div>
                </div>
              </div>

              {/* Logout Button */}
              <button 
                onClick={handleLogout}
                className="flex items-center gap-2 px-4 py-2.5  text-gray-700 hover:text-red-600 hover:bg-red-50  transition-all duration-300  "
              >
                <LogOut className="w-4 h-4" />
                <span className="hidden sm:inline font-medium">Çıkış Yap</span>
              </button>
            </div>
          </div>
        </div>

        {/* Premium Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {menuItems.map((item, index) => (
            <Link
              key={index}
              to={item.to}
              className={`group relative bg-white rounded-3xl shadow-lg hover:shadow-2xl ${item.glowColor} transition-all duration-500 overflow-hidden border border-gray-100/50 transform hover:-translate-y-2 hover:scale-[1.02]`}
              style={{
                animationDelay: `${index * 100}ms`,
                animation: 'fadeInUp 0.6s ease-out forwards',
                opacity: 0
              }}
            >
              {/* Animated Background Pattern */}
             
              {/* Content Container */}
              <div className="relative p-8">
                {/* Icon Container with Floating Animation */}
                <div className="mb-6">
                  <div className={`inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br ${item.gradient} shadow-lg group-hover:shadow-xl transition-all duration-500 group-hover:rotate-6 group-hover:scale-110`}>
                    <item.icon className="w-8 h-8 text-white" strokeWidth={2.5} />
                  </div>
                </div>

                {/* Title */}
                <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:bg-clip-text group-hover:from-gray-900 group-hover:to-gray-600 transition-all duration-300">
                  {item.title}
                </h3>

                {/* Description */}
                <p className="text-gray-600 text-sm leading-relaxed mb-6">
                  {item.description}
                </p>

                {/* Arrow Button with Slide Effect */}
                <div className="flex items-center gap-2 text-sm font-semibold text-gray-400 group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:bg-clip-text group-hover:from-red-600 group-hover:to-orange-600 transition-all duration-300">
                  <span>Yönetim Sayfası</span>
                  <ArrowRight className="w-4 h-4 transform group-hover:translate-x-2 transition-transform duration-300" />
                </div>
              </div>

              {/* Bottom Shine Effect */}
              <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            </Link>
          ))}
        </div>
      </div>

      {/* Custom Animations */}
      <style jsx>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .bg-grid-white\/\[0\.05\] {
          background-image: linear-gradient(to right, rgba(255, 255, 255, 0.05) 1px, transparent 1px),
                            linear-gradient(to bottom, rgba(255, 255, 255, 0.05) 1px, transparent 1px);
        }
      `}</style>
    </div>
  );
};

export default Dashboard;