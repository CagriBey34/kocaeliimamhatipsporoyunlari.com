import React from 'react';
import { MapPin, Phone, Mail, ArrowRight, ExternalLink } from 'lucide-react';

const Contact = () => {
  // Harita için gerçek embed linki (Adresinize göre)
  const mapEmbedUrl = "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3010.597693979879!2d28.94190367655459!3d41.01214097134988!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x14caba25e8729601%3A0x6273410656093680!2sAk%C5%9Femsettin%2C%20%C5%9Eair%20Fuzuli%20Sk.%20No%3A22%2C%2034080%20Fatih%2F%C4%B0stanbul!5e0!3m2!1str!2str!4v1703000000000!5m2!1str!2str";

  const contactMethods = [
    {
      id: 'address',
      title: 'Genel Merkez',
      content: 'Akşemsettin Mh. Şair Fuzuli Sk. No: 22 Fatih - İstanbul',
      link: 'https://www.google.com/maps?ll=41.015233,28.944325&z=16&t=m&hl=tr&gl=TR&mapclient=embed&q=%C5%9Eair+Fuzuli+Sk.+No:+22/2+Topkap%C4%B1+34080+Fatih/%C4%B0stanbul', // Buraya Google Maps linki koyabilirsiniz
      linkText: 'Yol Tarifi Al',
      icon: <MapPin size={24} />,
      color: 'text-red-600',
      bg: 'bg-red-50',
      border: 'group-hover:border-red-200',
      shadow: 'group-hover:shadow-red-500/10'
    },
    {
      id: 'phone',
      title: 'Telefon',
      content: '0530 915 92 93',
      link: 'tel:05309159293',
      linkText: 'Hemen Ara',
      icon: <Phone size={24} />,
      color: 'text-blue-600',
      bg: 'bg-blue-50',
      border: 'group-hover:border-blue-200',
      shadow: 'group-hover:shadow-blue-500/10'
    },
    {
      id: 'email',
      title: 'E-Posta',
      content: 'oncugeclikvespor@gmail.com',
      link: 'mailto:oncugeclikvespor@gmail.com',
      linkText: 'Mail Gönder',
      icon: <Mail size={24} />,
      color: 'text-orange-600',
      bg: 'bg-orange-50',
      border: 'group-hover:border-orange-200',
      shadow: 'group-hover:shadow-orange-500/10'
    }
  ];

  return (
    <div className="py-44 bg-[#FDFBF7] relative overflow-hidden font-sans selection:bg-red-100 selection:text-red-900 mt-10">
      
      {/* --- ARKA PLAN EFEKTLERİ --- */}
      <div className="absolute inset-0 pointer-events-none opacity-30">
        <div className="absolute top-0 left-1/4 w-px h-full bg-slate-200/60"></div>
        <div className="absolute top-0 left-2/4 w-px h-full bg-slate-200/60"></div>
        <div className="absolute top-0 left-3/4 w-px h-full bg-slate-200/60"></div>
      </div>

      <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-red-600/5 rounded-full blur-[120px] pointer-events-none -translate-x-1/2 -translate-y-1/2"></div>
      <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-blue-600/5 rounded-full blur-[100px] pointer-events-none translate-x-1/2 translate-y-1/2"></div>

      <div className="container mx-auto px-6 relative z-10">
        
        {/* --- BAŞLIK ALANI --- */}
        <div className="text-center mb-16 max-w-3xl mx-auto">
            <h1 className="text-5xl md:text-7xl font-black text-slate-900 tracking-tight leading-[0.9]">
                Bize <br/>
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-600 to-orange-600">
                    Ulaşın
                </span>
            </h1>
            <p className="text-slate-500 text-lg font-medium mt-6 max-w-lg mx-auto">
                Sorularınız, önerileriniz veya başvuru süreçleri için aşağıdaki kanallardan bize ulaşabilirsiniz.
            </p>
        </div>

        {/* --- İÇERİK GRID (KARTLAR ve HARİTA) --- */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
            
            {/* SOL: İLETİŞİM KARTLARI (5 Kolon) */}
            <div className="lg:col-span-5 space-y-6">
                {contactMethods.map((method) => (
                    <div 
                        key={method.id}
                        className={`
                            group relative p-6 bg-white border border-slate-100 rounded-[2rem]
                            transition-all duration-500 hover:-translate-y-1 hover:shadow-xl
                            flex items-center gap-6
                            ${method.border} ${method.shadow}
                        `}
                    >
                        {/* İkon */}
                        <div className={`w-16 h-16 rounded-2xl flex items-center justify-center shrink-0 transition-transform duration-500 group-hover:scale-110 ${method.bg} ${method.color}`}>
                            {method.icon}
                        </div>

                        {/* İçerik */}
                        <div className="flex-1">
                            <h3 className="text-lg font-bold text-slate-900 mb-1">{method.title}</h3>
                            <p className="text-slate-500 text-sm font-medium mb-3 leading-relaxed">
                                {method.content}
                            </p>
                            
                            {/* Link Butonu */}
                            <a 
                                href={method.link} 
                                target="_blank"
                                rel="noopener noreferrer"
                                className={`
                                    inline-flex items-center gap-2 text-xs font-bold tracking-widest uppercase
                                    ${method.color} opacity-70 hover:opacity-100 transition-opacity
                                `}
                            >
                                {method.linkText} <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                            </a>
                        </div>
                    </div>
                ))}
            </div>

            {/* SAĞ: HARİTA (7 Kolon) */}
            <div className="lg:col-span-7 h-full min-h-[400px] lg:min-h-0">
                <div className="relative w-full h-full bg-white p-3 rounded-[2.5rem] border border-slate-200 shadow-2xl shadow-slate-200/50">
                    
                    {/* Harita Embed */}
                    <div className="w-full h-full rounded-[2rem] overflow-hidden bg-slate-100 relative group">
                        <iframe
                            src={mapEmbedUrl}
                            width="100%"
                            height="100%"
                            style={{ border: 0 }}
                            allowFullScreen=""
                            loading="lazy"
                            referrerPolicy="no-referrer-when-downgrade"
                            title="Office Location"
                            className="grayscale group-hover:grayscale-0 transition-all duration-700"
                        ></iframe>

                        {/* Harita Üzeri Overlay (Sadece dekoratif) */}
                        <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-md px-4 py-2 rounded-full border border-white/20 shadow-lg flex items-center gap-2 pointer-events-none">
                            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                            <span className="text-xs font-bold text-slate-900">Şu an açık</span>
                        </div>
                    </div>

                </div>
            </div>

        </div>

        {/* --- ALT LOGO ALANI --- */}
        <div className="mt-20 flex justify-center">
             <div className="relative group">
                 {/* Logo Arkası Işık */}
                 <div className="absolute -inset-4 bg-gradient-to-r from-red-600/20 to-blue-600/20 blur-xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
                 <img 
                    src="/assets/YatayLogo.png" 
                    alt="Öncü Spor Kulübü" 
                    className="relative max-w-[200px] md:max-w-xs opacity-80 group-hover:opacity-100 transition-opacity duration-500 grayscale group-hover:grayscale-0" 
                 />
             </div>
        </div>

      </div>
    </div>
  );
};

export default Contact;