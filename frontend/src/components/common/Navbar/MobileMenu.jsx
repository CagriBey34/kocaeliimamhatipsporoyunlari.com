import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Menu,
  X,
  Home,
  Mail,
  FileText,
  UserPlus,
  Instagram,
  Medal,
  Trophy,
  Image,
  Twitter,
  Facebook,
  Youtube
} from 'lucide-react';

import Logo from './altli_logo.png'

const MobileMenu = () => {
  const [isOpen, setIsOpen] = useState(false);
  
  const toggleMenu = () => {
    setIsOpen(!isOpen);
    // Menü açıkken scroll'u engelle
    if (!isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
  };

  const menuItems = [
    {
      icon: <Home strokeWidth={1.5} />,
      text: 'Anasayfa',
      to: '/'
    },
    {
      icon: <Trophy strokeWidth={1.5} />,
      text: 'Dereceye Girenler',
      to: '/dereceye-girenler'
    },
    {
      icon: <Medal strokeWidth={1.5} />,
      text: 'Turnuva',
      to: '/turnuva'
    },
    {
      icon: <FileText strokeWidth={1.5} />,
      text: 'Talimatname',
      to: '/instructions'
    },
    {
      icon: <Image strokeWidth={1.5} />,
      text: 'Galeri',
      to: '/gallery'
    },
    {
      icon: <UserPlus strokeWidth={1.5} />,
      text: 'Kayıt Ol',
      to: '/ogrenci-kayit'
    },
    {
      icon: <Mail strokeWidth={1.5} />,
      text: 'İletişim',
      to: '/contact'
    }
  ];
  
  const socialIcons = [
    { icon: <Instagram strokeWidth={1.5} />, href: 'https://www.instagram.com/oncugenclikspor/' },
    { icon: <Twitter strokeWidth={1.5} />, href: 'https://x.com/oncugenclikspor' },
    { icon: <Facebook strokeWidth={1.5} />, href: 'https://www.facebook.com/OncuGenclikveSpor/' },
    { icon: <Youtube strokeWidth={1.5} />, href: 'https://www.youtube.com/@ÖncüSporKulübü' },
  ];
  
  return (
    <div className="relative z-50">
      <div className="absolute top-0 left-1/3 transform -translate-x-1/1 -translate-y-1/10 z-50 w-28">
        <Link to="/">
          <img 
            src={Logo}
            alt="İmam Hatip Spor Oyunları" 
            className="w-full h-auto"
          />
        </Link>
      </div>
      
      <nav className="py-4 px-4 pt-1" style={{ backgroundColor: '#E84049' }}>
        <div className="flex items-center justify-end max-w-6xl mx-auto">
          <button 
            onClick={toggleMenu} 
            className="flex items-center justify-center w-10 h-10 text-white focus:outline-none"
            aria-label="Toggle Menu"
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </nav>
      
      {/* Overlay */}
      <div 
        className={`fixed inset-0 bg-black bg-opacity-50 transition-opacity duration-300 z-40 ${
          isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
        onClick={toggleMenu}
      ></div>
      
      {/* Sidebar Menu */}
      <div 
        className={`fixed top-0 right-0 w-72 h-full bg-white shadow-xl transition-transform duration-300 ease-in-out transform z-50 ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="flex justify-end p-4">
          <button 
            onClick={toggleMenu}
            className="text-gray-800 hover:text-red-500 focus:outline-none"
            aria-label="Close Menu"
          >
            <X size={24} />
          </button>
        </div>
        
        <div className="px-6 py-2">
          <ul className="space-y-4">
            {menuItems.map((item, index) => (
              <li key={index}>
                <Link
                  to={item.to}
                  className="flex items-center py-3 px-2 text-gray-700 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors duration-200"
                  onClick={toggleMenu}
                >
                  <span className="mr-3 text-red-500">{item.icon}</span>
                  <span className="font-medium">{item.text}</span>
                </Link>
              </li>
            ))}
          </ul>
          
          <div className="mt-10 pt-6 border-t border-gray-200">
            <p className="text-sm text-gray-500 mb-4">Bizi Takip Edin</p>
            <div className="flex space-x-4">
              {socialIcons.map((item, index) => (
                <a
                  key={index}
                  href={item.href}
                  className="w-10 h-10 flex items-center justify-center rounded-full text-white hover:opacity-80 transition-opacity"
                  style={{ backgroundColor: '#E84049' }}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {item.icon}
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MobileMenu;