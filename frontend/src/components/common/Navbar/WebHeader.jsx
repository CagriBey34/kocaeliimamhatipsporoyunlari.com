import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  Menu, X, Home, Image, Phone, FileText, 
  Trophy, Award, UserPlus, Instagram, Twitter, 
  Facebook, Youtube, ChevronRight 
} from 'lucide-react';

import Logo from './kocaeli_logo.png';

const ResponsiveHeader = () => {
  const location = useLocation();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // --- Scroll Takibi ---
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // --- Sayfa Değişimi ---
  useEffect(() => {
    setIsMobileMenuOpen(false);
    window.scrollTo(0, 0);
  }, [location]);

  // --- Link Verileri ---
  const leftLinks = [
    { name: 'Anasayfa', path: '/', icon: <Home size={18} /> },
    { name: 'Galeri', path: '/gallery', icon: <Image size={18} /> },
    { name: 'İletişim', path: '/iletişim', icon: <Phone size={18} /> },
  ];

  const rightLinks = [
    { name: 'Talimatname', path: '/instructions', icon: <FileText size={18} /> },
    { name: 'Turnuva', path: '/turnuva', icon: <Trophy size={18} /> },
    { name: 'Dereceler', path: '/dereceye-girenler', icon: <Award size={18} /> },
  ];

  const socialLinks = [
    { icon: <Instagram size={20} />, href: 'https://www.instagram.com/oncugenclikspor/' },
    { icon: <Twitter size={20} />, href: 'https://x.com/oncugenclikspor' },
    { icon: <Facebook size={20} />, href: 'https://www.facebook.com/OncuGenclikveSpor/' },
    { icon: <Youtube size={20} />, href: 'https://www.youtube.com/@ÖncüSporKulübü' },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <>
      <header 
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ease-in-out px-4 md:px-8 ${
          isScrolled ? 'pt-2' : 'pt-4 md:pt-6'
        }`}
      >
        <div 
          className={`relative mx-auto transition-all duration-500 rounded-[1.5rem] md:rounded-[2rem] flex items-center justify-between ${
            isScrolled 
              ? 'max-w-7xl bg-white/95 backdrop-blur-md shadow-2xl shadow-slate-200/40 py-2 px-6 border border-white/20' 
              : 'max-w-[90rem] bg-white shadow-lg shadow-slate-100/50 py-3 md:py-4 px-6 md:px-8'
          }`}
        >
          
          {/* DESKTOP GÖRÜNÜMÜ */}
          <div className="hidden lg:flex w-full items-center justify-between">
            <nav className="flex items-center gap-1 w-5/12 justify-start">
              {leftLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className="relative group px-4 py-2 rounded-full overflow-hidden"
                >
                  <span className={`relative z-10 text-sm font-bold transition-colors duration-300 ${
                    isActive(link.path) ? 'text-red-600' : 'text-slate-600 group-hover:text-slate-900'
                  }`}>
                    {link.name}
                  </span>
                  <span className={`absolute bottom-0 left-0 w-full h-1 bg-red-100 transform origin-bottom scale-y-0 group-hover:scale-y-100 transition-transform duration-300 ${
                    isActive(link.path) ? 'scale-y-100 bg-red-50 h-full' : ''
                  }`}></span>
                </Link>
              ))}
            </nav>

            <div className="absolute left-1/2 top-4/4 -translate-x-1/2 -translate-y-[58%] z-50">
              <Link to="/" className="relative block group">
                <img
                  src={Logo}
                  alt="Öncü Spor"
                  className={`transition-all duration-500 ease-in-out object-contain drop-shadow-md 
                    ${isScrolled ? 'h-24' : 'h-31'}`}
                />
              </Link>
            </div>

            <nav className="flex items-center gap-1 w-5/12 justify-end">
              {rightLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className="relative group px-4 py-2 rounded-full overflow-hidden"
                >
                  <span className={`relative z-10 text-sm font-bold transition-colors duration-300 ${
                    isActive(link.path) ? 'text-red-600' : 'text-slate-600 group-hover:text-slate-900'
                  }`}>
                    {link.name}
                  </span>
                  <span className={`absolute bottom-0 left-0 w-full h-1 bg-red-100 transform origin-bottom scale-y-0 group-hover:scale-y-100 transition-transform duration-300 ${
                    isActive(link.path) ? 'scale-y-100 bg-red-50 h-full' : ''
                  }`}></span>
                </Link>
              ))}
              
              <Link
                to="/turkiye-basvuru"
                className={`ml-2 px-6 py-2.5 rounded-full text-sm font-bold transition-all duration-300 flex items-center gap-2 shadow-lg ${
                  isScrolled 
                  ? 'bg-red-600 text-white hover:bg-slate-900' 
                  : 'bg-slate-900 text-white hover:bg-red-600'
                }`}
              >
                <UserPlus size={16} />
                <span>Başvuru</span>
              </Link>
            </nav>
          </div>

          {/* MOBİL GÖRÜNÜMÜ - Yükseklik Optimize Edildi */}
          <div className="flex lg:hidden w-full items-center justify-between h-10">
            <div className="absolute left-0 top-1/2 -translate-y-[40%] z-50">
               <Link to="/" className="relative block">
                 <img
                  src={Logo}
                  alt="Öncü Spor"
                  className={`transition-all duration-500 ease-in-out object-contain drop-shadow-md 
                    ${isScrolled ? 'h-16' : 'h-20'}`}
                />
               </Link>
            </div>

            <div className="ml-auto">
              <button
                onClick={() => setIsMobileMenuOpen(true)}
                className="p-2 bg-slate-50 text-slate-800 rounded-xl shadow-sm"
              >
                <Menu size={22} />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* MOBİL MENÜ OVERLAY */}
      <div 
        className={`fixed inset-0 z-[60] bg-white transition-all duration-500 ease-in-out lg:hidden flex flex-col ${
          isMobileMenuOpen ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-full pointer-events-none'
        }`}
      >
        <div className="flex items-center justify-between p-4 relative z-10 border-b border-slate-50">
            <img src={Logo} alt="Logo" className="h-10 w-auto" />
            <button 
              onClick={() => setIsMobileMenuOpen(false)}
              className="w-10 h-10 flex items-center justify-center bg-slate-50 rounded-full text-slate-500"
            >
                <X size={20} />
            </button>
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-4 relative z-10">
            <div className="space-y-2">
                {[...leftLinks, ...rightLinks].map((link, index) => (
                    <Link
                        key={index}
                        to={link.path}
                        className={`flex items-center justify-between p-3.5 rounded-2xl transition-all ${
                            isActive(link.path) 
                            ? 'bg-red-50 text-red-600 border border-red-100' 
                            : 'bg-white border border-slate-100 text-slate-600'
                        }`}
                    >
                        <div className="flex items-center gap-3">
                            <div className={`p-2 rounded-xl ${isActive(link.path) ? 'bg-white' : 'bg-slate-50'}`}>
                                {link.icon}
                            </div>
                            <span className="text-base font-bold">{link.name}</span>
                        </div>
                        <ChevronRight size={18} />
                    </Link>
                ))}
            </div>

            <div className="mt-6">
                <Link
                    to="/turkiye-basvuru"
                    className="flex items-center justify-center gap-3 w-full py-4 bg-slate-900 text-white rounded-2xl text-base font-bold shadow-lg"
                >
                    <UserPlus size={20} />
                    Öğrenci Kaydı Oluştur
                </Link>
            </div>
        </div>

        <div className="p-6 bg-slate-50 relative z-10">
            <div className="flex justify-center gap-4 mb-4">
                {socialLinks.map((social, idx) => (
                    <a
                        key={idx}
                        href={social.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-10 h-10 flex items-center justify-center bg-white rounded-full text-slate-400 border border-slate-200"
                    >
                        {social.icon}
                    </a>
                ))}
            </div>
            <p className="text-center text-[10px] font-bold text-slate-300 tracking-widest uppercase">
                Öncü Spor Kulübü © 2026
            </p>
        </div>
      </div>
    </>
  );
};

export default ResponsiveHeader;