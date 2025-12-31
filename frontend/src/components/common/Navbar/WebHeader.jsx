import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  Menu, X, Home, Image, Phone, FileText, 
  Trophy, Award, UserPlus, Instagram, Twitter, 
  Facebook, Youtube, ChevronRight 
} from 'lucide-react';

import Logo from './altli_logo.png';

const ResponsiveHeader = () => {
  const location = useLocation();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // --- Scroll Takibi ---
  useEffect(() => {
    const handleScroll = () => {
      // 20px aşağı inildiğinde scroll modu aktif olur
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
    { name: 'Talimatlar', path: '/instructions', icon: <FileText size={18} /> },
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
      {/* ==================================================================
          MAIN HEADER CONTAINER
          - Fixed position
          - Padding adjustment on scroll
      ================================================================== */}
      <header 
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ease-in-out px-4 md:px-8 ${
          isScrolled ? 'pt-2' : 'pt-6'
        }`}
      >
        <div 
          className={`relative mx-auto transition-all duration-500 rounded-[2rem] flex items-center justify-between ${
            isScrolled 
              ? 'max-w-7xl bg-white/95 backdrop-blur-md shadow-2xl shadow-slate-200/40 py-2 px-6 border border-white/20' 
              : 'max-w-[90rem] bg-white shadow-lg shadow-slate-100/50 py-4 px-8'
          }`}
        >
          
          {/* ==================================================================
              BÖLÜM 1: MASAÜSTÜ GÖRÜNÜMÜ (DESKTOP)
              - Sadece 'lg' (Large) ve üzeri ekranlarda görünür (hidden lg:flex)
              - Logo ORTADA
          ================================================================== */}
          <div className="hidden lg:flex w-full items-center justify-between">
            
            {/* 1. Sol Linkler */}
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

            {/* 2. Logo (Desktop Ortada) 
                - Absolute positioning relative to the container
                - Translate Y ile aşağı sarkıtıldı
            */}
            <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-[25%] z-50">
              <Link to="/" className="relative block group">
                <div className={`absolute inset-0 bg-red-500 blur-2xl transition-opacity duration-500 rounded-full 
                    ${isScrolled ? 'opacity-0' : 'opacity-0 group-hover:opacity-20'}`}
                ></div>
                <img
                  src={Logo}
                  alt="Öncü Spor"
                  className={`transition-all duration-500 ease-in-out object-contain drop-shadow-md 
                    ${isScrolled 
                      ? 'h-30'  // Scroll edildiğinde Desktop boyutu
                      : 'h-36'  // En tepedeyken Desktop boyutu (Büyük)
                    }
                  `}
                />
              </Link>
            </div>

            {/* 3. Sağ Linkler */}
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
                to="/ogrenci-kayit"
                className={`ml-2 px-6 py-2.5 rounded-full text-sm font-bold transition-all duration-300 flex items-center gap-2 shadow-lg transform hover:-translate-y-0.5 ${
                  isScrolled 
                  ? 'bg-red-600 text-white hover:bg-slate-900 hover:shadow-slate-500/30' 
                  : 'bg-slate-900 text-white hover:bg-red-600 hover:shadow-red-500/30'
                }`}
              >
                <UserPlus size={16} />
                <span>Başvuru</span>
              </Link>
            </nav>
          </div>

          {/* ==================================================================
              BÖLÜM 2: MOBİL & TABLET GÖRÜNÜMÜ
              - 'lg' altındaki ekranlarda görünür (flex lg:hidden)
              - Logo SOLDA
          ================================================================== */}
          <div className="flex lg:hidden w-full items-center justify-between h-12"> {/* h-12 ile minimum yükseklik verdik */}
            
            {/* 1. Logo (Mobil Solda) 
                - Absolute positioning
                - left-0 ile sola yaslı (biraz marginli gözüksün diye container padding'i zaten var)
            */}
            <div className="absolute left-1/20 top-1/2 -translate-y-[35%] z-50">
               <Link to="/" className="relative block">
                 <img
                  src={Logo}
                  alt="Öncü Spor"
                  className={`transition-all duration-500 ease-in-out object-contain drop-shadow-md 
                    ${isScrolled 
                      ? 'h-23'  // Scroll edildiğinde Mobil boyutu
                      : 'h-28'  // En tepedeyken Mobil boyutu (Büyük)
                    }
                  `}
                />
               </Link>
            </div>

            {/* 2. Hamburger Menü (Sağda) */}
            <div className="ml-auto">
              <button
                onClick={() => setIsMobileMenuOpen(true)}
                className="p-2.5 bg-slate-50 text-slate-800 rounded-xl hover:bg-red-50 hover:text-red-600 transition-colors shadow-sm"
              >
                <Menu size={24} />
              </button>
            </div>
          </div>

        </div>
      </header>

      {/* ==================================================================
          MOBİL MENÜ OVERLAY (Ortak)
      ================================================================== */}
      <div 
        className={`fixed inset-0 z-[60] bg-white transition-all duration-500 ease-in-out lg:hidden flex flex-col ${
          isMobileMenuOpen ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-full pointer-events-none'
        }`}
      >
        {/* Dekoratif Efektler */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-red-50 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 opacity-50"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-50 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2 opacity-50"></div>

        {/* Mobil Header (Logo ve Kapat Butonu) */}
        <div className="flex items-center justify-between p-6 relative z-10">
            <img src={Logo} alt="Logo" className="h-14 w-auto drop-shadow-sm" />
            <button 
              onClick={() => setIsMobileMenuOpen(false)}
              className="w-12 h-12 flex items-center justify-center bg-slate-50 rounded-full text-slate-500 hover:bg-red-50 hover:text-red-600 transition-colors shadow-sm"
            >
                <X size={24} />
            </button>
        </div>

        {/* Linkler Listesi */}
        <div className="flex-1 overflow-y-auto px-6 py-4 relative z-10">
            <div className="space-y-3">
                {[...leftLinks, ...rightLinks].map((link, index) => (
                    <Link
                        key={index}
                        to={link.path}
                        className={`flex items-center justify-between p-4 rounded-2xl transition-all duration-300 group ${
                            isActive(link.path) 
                            ? 'bg-red-50 text-red-600 border border-red-100 shadow-sm' 
                            : 'bg-white border border-slate-100 text-slate-600 hover:border-slate-200 hover:shadow-md'
                        }`}
                    >
                        <div className="flex items-center gap-4">
                            <div className={`p-2.5 rounded-xl ${isActive(link.path) ? 'bg-white' : 'bg-slate-50 group-hover:bg-slate-100'}`}>
                                {link.icon}
                            </div>
                            <span className="text-lg font-bold">{link.name}</span>
                        </div>
                        <ChevronRight size={20} className={`opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all ${isActive(link.path) ? 'opacity-100 translate-x-0' : ''}`} />
                    </Link>
                ))}
            </div>

            <div className="mt-8">
                <Link
                    to="/ogrenci-kayit"
                    className="flex items-center justify-center gap-3 w-full py-5 bg-gradient-to-r from-slate-900 to-slate-800 text-white rounded-2xl text-lg font-bold shadow-xl shadow-slate-200 hover:scale-[1.02] transition-transform"
                >
                    <UserPlus size={22} />
                    Öğrenci Kaydı Oluştur
                </Link>
            </div>
        </div>

        {/* Footer */}
        <div className="p-8 bg-slate-50 relative z-10">
            <div className="flex justify-center gap-4 mb-4">
                {socialLinks.map((social, idx) => (
                    <a
                        key={idx}
                        href={social.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-12 h-12 flex items-center justify-center bg-white rounded-full text-slate-400 hover:text-red-600 hover:shadow-md transition-all border border-slate-200"
                    >
                        {social.icon}
                    </a>
                ))}
            </div>
            <p className="text-center text-xs font-bold text-slate-300 tracking-[0.2em] uppercase">
                Öncü Spor Kulübü © 2025
            </p>
        </div>
      </div>
    </>
  );
};

export default ResponsiveHeader;