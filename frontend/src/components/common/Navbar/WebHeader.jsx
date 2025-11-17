import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';

import Logo from './altli_logo.png'

const WebHeader = () => {
  const location = useLocation();
  const [activeLink, setActiveLink] = useState('');

  // Sol köşede olacak linkler
  const leftNavLinks = [
    { name: 'Anasayfa', path: '/' },
    { name: 'Galeri', path: '/gallery' },
    { name: 'İletişim', path: '/iletişim' },
  ];

  // Sağ köşede olacak linkler
  const rightNavLinks = [
    { name: 'Talimatname', path: '/instructions' },
    { name: 'Turnuva', path: '/turnuva' },
    { name: 'Derece', path: '/dereceye-girenler' },
        { name: 'Başvuru', path: '/ogrenci-kayit' }
  ];

  useEffect(() => {
    const currentPath = location.pathname;
    const allNavLinks = [...leftNavLinks, ...rightNavLinks];
    const activeNavLink = allNavLinks.find(link => link.path === currentPath);
    if (activeNavLink) {
      setActiveLink(activeNavLink.name);
    } else {
      if (currentPath === '/') {
        setActiveLink('Anasayfa');
      }
    }
  }, [location, leftNavLinks, rightNavLinks]);

  return (
    <header className="relative pt-5 pb-6 pl-4 pr-5 w-full md:w-11/12 lg:w-10/12 mx-auto rounded-b-3xl shadow-md z-40"
      style={{ backgroundColor: '#E84049' }}>

      <div className="absolute top-10 left-1/2 transform -translate-x-1/2 -translate-y-1/3 z-50 w-28 md:w-32 lg:w-36">
        <Link to="/">
          <img
            src={Logo}
            alt="Öncü Spor Logo"
            className="w-full h-auto"
          />
        </Link>
      </div>

      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between">

          {/* Sol Köşe - Anasayfa, Galeri, İletişim */}
          <div className="w-1/3 flex justify-start">
            <nav className="hidden md:block">
              <ul className="flex">
                {leftNavLinks.map((link) => (
                  <li key={link.name} className="mr-2">
                    <Link
                      to={link.path}
                      className={`text-white text-sm font-medium py-1 px-2  ${
                        activeLink === link.name
                          ? 'border-white'
                          : 'border-transparent hover:border-white/50'
                      }`}
                      onClick={() => setActiveLink(link.name)}
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          </div>

          {/* Orta - Logo için boşluk */}
          <div className="w-1/3 flex justify-center">
            {/* Logo absolute positioned */}
          </div>

          {/* Sağ Köşe - Talimatname, Turnuva, Derece */}
          <div className="w-1/3 flex justify-end">
            <nav className="hidden md:block">
              <ul className="flex">
                {rightNavLinks.map((link) => (
                  <li key={link.name} className="ml-2">
                    <Link
                      to={link.path}
                      className={`text-white text-sm font-medium py-1 px-2  ${
                        activeLink === link.name
                          ? 'border-white'
                          : 'border-transparent hover:border-white/50'
                      }`}
                      onClick={() => setActiveLink(link.name)}
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          </div>
        </div>
      </div>
    </header>
  );
};

export default WebHeader;