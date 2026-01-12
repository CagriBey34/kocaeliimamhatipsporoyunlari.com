import React from "react";
import Logo from "./footer_logo.png";
import {
  Instagram,
  Twitter,
  Facebook,
  Youtube,
  MapPin,
  Phone,
  Mail,
  ArrowRight,
  Heart,
} from "lucide-react";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const socialLinks = [
    {
      icon: <Instagram size={20} />,
      href: "https://www.instagram.com/oncugenclikspor/",
      label: "Instagram",
    },
    {
      icon: <Twitter size={20} />,
      href: "https://x.com/oncugenclikspor",
      label: "Twitter",
    },
    {
      icon: <Facebook size={20} />,
      href: "https://www.facebook.com/OncuGenclikveSpor/",
      label: "Facebook",
    },
    {
      icon: <Youtube size={20} />,
      href: "https://www.youtube.com/@ÖncüSporKulübü",
      label: "Youtube",
    },
  ];

  const quickLinks = [
    { name: "Anasayfa", href: "/" },
    { name: "Galeri", href: "/gallery" },
    { name: "İletişim", href: "/iletişim" },
    { name: "Talimatnameler", href: "/instructions" },
    { name: "Turnuvalar", href: "/turnuva" },
    { name: "Dereceler", href: "/dereceye-girenler" },
  ];

  return (
    <footer className="relative bg-slate-900 text-white pt-24 pb-12 mt-0  overflow-hidden font-sans selection:bg-red-600 selection:text-white">
      {/* --- ARKA PLAN EFEKTLERİ --- */}
      {/* 1. Grid Çizgileri */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.03]">
        <div className="absolute top-0 left-1/4 w-px h-full bg-white"></div>
        <div className="absolute top-0 left-2/4 w-px h-full bg-white"></div>
        <div className="absolute top-0 left-3/4 w-px h-full bg-white"></div>
      </div>

      {/* 2. Renkli Işıklar (Blur) */}
      <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-red-600/10 rounded-full blur-[120px] pointer-events-none -translate-x-1/2 -translate-y-1/2"></div>
      <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-blue-600/10 rounded-full blur-[100px] pointer-events-none translate-x-1/2 translate-y-1/2"></div>

      <div className="container mx-auto px-6 relative z-10">
        {/* --- ÜST BÖLÜM (GRID) --- */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 mb-16">
          {/* 1. KOLON: LOGO VE MİSYON (4 birim genişlik) */}
          <div className="lg:col-span-4 flex flex-col items-center lg:items-start text-center lg:text-left">
            <div className="relative mb-6 group">
              {/* Logo Arkası Parlama */}
              <div className="absolute inset-0 bg-white/5 blur-xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <img
                src={Logo}
                alt="Öncü Spor Logo"
                className="relative w-48 h-auto object-contain drop-shadow-2xl"
              />
            </div>
            <p className="text-slate-400 leading-relaxed mb-6 font-medium max-w-sm">
              Sporun birleştirici gücüyle gençleri geleceğe hazırlıyor, ahlak ve
              kardeşlik ilkeleriyle şampiyonlar yetiştiriyoruz.
            </p>
            {/* Sosyal Medya İkonları */}
            <div className="flex gap-3">
              {socialLinks.map((social, index) => (
                <a
                  key={index}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-slate-300 hover:bg-red-600 hover:border-red-600 hover:text-white hover:-translate-y-1 transition-all duration-300"
                  aria-label={social.label}
                >
                  {social.icon}
                </a>
              ))}
            </div>
          </div>

          {/* 2. KOLON: HIZLI ERİŞİM (3 birim genişlik) */}
          <div className="lg:col-span-3 lg:pl-8 flex flex-col items-center lg:items-start">
            <h3 className="text-lg font-black tracking-wider uppercase mb-6 flex items-center gap-2">
              <span className="w-8 h-1 bg-red-600 rounded-full"></span>
              Kurumsal
            </h3>
            <ul className="space-y-4">
              {quickLinks.map((link, idx) => (
                <li key={idx}>
                  <a
                    href={link.href}
                    className="group flex items-center gap-2 text-slate-400 hover:text-white transition-colors duration-300"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-slate-600 group-hover:bg-red-600 transition-colors"></span>
                    {link.name}
                    <ArrowRight
                      size={14}
                      className="opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300 text-red-600"
                    />
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* 3. KOLON: İLETİŞİM (5 birim genişlik) */}
          {/* Değişiklik: 'hidden' eklendi ve 'flex' -> 'lg:flex' yapıldı */}
          <div className="hidden lg:flex lg:col-span-5 flex-col items-center lg:items-start">
            <h3 className="text-lg font-black tracking-wider uppercase mb-6 flex items-center gap-2">
              <span className="w-8 h-1 bg-red-600 rounded-full"></span>
              Bize Ulaşın
            </h3>

            <div className="space-y-6 w-full max-w-md">
              {/* Adres Kartı */}
              <div className="flex items-start gap-4 p-4 rounded-2xl bg-white/5 border border-white/5 hover:border-white/10 transition-colors">
                <div className="mt-1 w-10 h-10 rounded-full bg-red-600/20 flex items-center justify-center text-red-500 shrink-0">
                  <MapPin size={20} />
                </div>
                <div>
                  <h4 className="text-white font-bold mb-1">Genel Merkez</h4>
                  <p className="text-slate-400 text-sm leading-relaxed">
                    Akşemsettin Mh. Şair Fuzuli Sk. No: 22 <br /> Fatih /
                    İstanbul
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Telefon */}
                <a
                  href="tel:05309159293"
                  className="flex items-center gap-3 p-4 rounded-2xl bg-white/5 border border-white/5 hover:bg-white/10 transition-all group"
                >
                  <div className="w-10 h-10 rounded-full bg-blue-600/20 flex items-center justify-center text-blue-500 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                    <Phone size={20} />
                  </div>
                  <div>
                    <span className="block text-xs text-slate-500">
                      Telefon
                    </span>
                    <span className="text-slate-300 font-bold group-hover:text-white">
                      0530 915 92 93
                    </span>
                  </div>
                </a>

                {/* E-Posta */}
                <a
                  href="mailto:oncugeclikvespor@gmail.com"
                  className="flex items-center gap-3 p-4 rounded-2xl bg-white/5 border border-white/5 hover:bg-white/10 transition-all group min-w-0"
                >
                  <div className="w-10 h-10 rounded-full bg-yellow-600/20 flex items-center justify-center text-yellow-500 group-hover:bg-yellow-600 group-hover:text-white transition-colors shrink-0">
                    <Mail size={20} />
                  </div>
                  <div className="min-w-0"> {/* Taşmayı engellemek için önemli */}
                    <span className="block text-xs text-slate-500">
                      E-Posta
                    </span>
                    <span className="text-slate-300 font-bold group-hover:text-white text-[13px] sm:text-sm break-all">
                      oncugeclikvespor@gmail.com
                    </span>
                  </div>
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* --- ALT ÇİZGİ VE TELİF --- */}
        <div className="border- border-white/10 pt-0 mt-0 flex flex-col lg:flex-row items-center justify-between gap-4">
          <div className="text-slate-500 text-sm font-medium">
            © {currentYear}{" "}
            <span className="text-white font-bold">Öncü Spor Kulübü</span>. Tüm
            hakları saklıdır.
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
