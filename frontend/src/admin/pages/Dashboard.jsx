import React from 'react';
import { Link } from 'react-router-dom';
import { Camera, Upload, Trophy, FileText, TrendingUp, Users } from 'lucide-react';

const Dashboard = () => {
  const stats = [
    { label: 'Toplam Fotoğraf', value: '245', icon: Camera, color: 'blue' },
    { label: 'Toplam Başvuru', value: '128', icon: Users, color: 'green' },
    { label: 'Aktif Turnuva', value: '8', icon: Trophy, color: 'purple' },
    { label: 'Bu Ay', value: '+42', icon: TrendingUp, color: 'orange' },
  ];

  const menuItems = [
    {
      to: '/admin/photos',
      icon: Camera,
      title: 'Fotoğraf Galerisi',
      description: 'Mevcut fotoğrafları görüntüleyin, düzenleyin veya silin',
      gradient: 'from-blue-500 to-blue-600',
      iconBg: 'bg-blue-100',
      iconColor: 'text-blue-600'
    },
    {
      to: '/admin/upload',
      icon: Upload,
      title: 'Fotoğraf Yükle',
      description: 'Galeriye yeni fotoğraflar ekleyin',
      gradient: 'from-green-500 to-green-600',
      iconBg: 'bg-green-100',
      iconColor: 'text-green-600'
    },
    {
      to: '/admin/tournaments',
      icon: Trophy,
      title: 'Turnuva Yönetimi',
      description: 'Turnuvaları yönetin, düzenleyin ve takip edin',
      gradient: 'from-purple-500 to-purple-600',
      iconBg: 'bg-purple-100',
      iconColor: 'text-purple-600'
    },
    {
      to: '/admin/applications',
      icon: FileText,
      title: 'Başvuru Yönetimi',
      description: 'Okul başvurularını inceleyin ve yönetin',
      gradient: 'from-orange-500 to-orange-600',
      iconBg: 'bg-orange-100',
      iconColor: 'text-orange-600'
    }
  ];

  return (
    <div className="min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2">
            Yönetim Paneli
          </h1>
          <p className="text-gray-600 text-lg">
            16. İmam Hatip Spor Oyunları Yönetim Sistemi
          </p>
        </div>

        {/* Quick Actions */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            İşlemler
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {menuItems.map((item, index) => (
              <Link
                key={index}
                to={item.to}
                className="group bg-white rounded-xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100 transform hover:-translate-y-1"
              >
                {/* Gradient Header */}
                <div className={`h-2 bg-gradient-to-r ${item.gradient}`}></div>
                
                {/* Content */}
                <div className="p-6">
                  {/* Icon */}
                  <div className={`inline-flex items-center justify-center w-12 h-12 rounded-lg ${item.iconBg} mb-4 group-hover:scale-110 transition-transform`}>
                    <item.icon className={`w-6 h-6 ${item.iconColor}`} />
                  </div>
                  
                  {/* Title */}
                  <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-red-600 transition-colors">
                    {item.title}
                  </h3>
                  
                  {/* Description */}
                  <p className="text-sm text-gray-600 leading-relaxed">
                    {item.description}
                  </p>
                </div>

                {/* Hover Arrow */}
                <div className="px-6 pb-4 opacity-0 group-hover:opacity-100 transition-opacity">
                  <span className="text-sm font-medium text-red-600 flex items-center gap-1">
                    Yönet
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
};

export default Dashboard;