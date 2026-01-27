import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Play, X, Trophy, MapPin } from 'lucide-react';

const CreativeHeroFinal = () => {

  return (
    <div className="py-24 top-10 bg-[#FDFBF7] relative overflow-hidden font-sans selection:bg-red-100 selection:text-red-900 min-h-[90vh] flex items-center">
      
      {/* --- 1. ARKA PLAN EFEKTLERİ --- */}
      <div className="absolute inset-0 pointer-events-none opacity-40">
        <div className="absolute top-0 left-1/4 w-px h-full bg-slate-200/60"></div>
        <div className="absolute top-0 left-2/4 w-px h-full bg-slate-200/60"></div>
        <div className="absolute top-0 left-3/4 w-px h-full bg-slate-200/60"></div>
      </div>

      {/* Noise Texture */}
      <div className="absolute inset-0 opacity-[0.04] z-0 pointer-events-none mix-blend-multiply" 
           style={{backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`}}>
      </div>

      {/* Kocaeli/Spor Vurgulu Arka Plan Glow */}
      <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-red-600/5 rounded-full blur-[120px] pointer-events-none -translate-y-1/2 translate-x-1/4"></div>

      {/* --- 2. INFINITE MARQUEE (Kayan Yazı) --- */}
      <div className="absolute top-[15%] left-0 w-full z-0 overflow-hidden pointer-events-none select-none">
        <div className="whitespace-nowrap animate-[marquee_60s_linear_infinite] opacity-[0.02]">
            <span className="text-[12vw] font-black tracking-tighter text-slate-900 mx-4">
                KOCAELİ ÖNCÜ SPOR • GENÇLİK VE SPOR KULÜBÜ •
            </span>
            <span className="text-[12vw] font-black tracking-tighter text-slate-900 mx-4">
                KOCAELİ ÖNCÜ SPOR • GENÇLİK VE SPOR KULÜBÜ •
            </span>
        </div>
      </div>

      {/* --- 3. ANA İÇERİK --- */}
      <div className="container mx-auto px-6 relative z-10">
        <div className="flex flex-col-reverse lg:flex-row items-center justify-between gap-12 lg:gap-20">
          
          {/* SOL: METİN VE BUTONLAR */}
          <div className="w-full lg:w-1/2 flex flex-col items-start text-left z-20">
            
            {/* Üst Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-red-50 border border-red-100 rounded-full text-red-600 font-bold text-xs tracking-widest uppercase mb-8 animate-[fadeIn_1s_ease-out] shadow-sm">
              <span className="w-2 h-2 rounded-full bg-red-600 animate-pulse"></span>
              2025 - 2026 Sezonu
            </div>

            {/* Ana Başlık */}
            <h1 className="text-5xl sm:text-6xl md:text-7xl xl:text-8xl font-black text-slate-900 leading-[0.95] tracking-tighter mb-8">
              <span className="block overflow-hidden">
                  <span className="block animate-[slideUp_0.8s_ease-out_0.2s_both] text-slate-800">
                    KOCAELİ
                  </span>
              </span>
              <span className="block overflow-hidden pt-2">
                  <span className="block text-transparent bg-clip-text bg-gradient-to-r from-red-600 via-red-500 to-orange-500 animate-[slideUp_0.8s_ease-out_0.4s_both] drop-shadow-sm">
                    ÖNCÜ SPOR
                  </span>
              </span>
            </h1>

            <p className="text-slate-600 text-lg md:text-xl font-medium leading-relaxed max-w-xl mb-10 animate-[fadeIn_1s_ease-out_0.6s_both]">
            Şampiyonluk sadece kupadan ibaret değildir. 
            <br/>
             Sahaya karakterini koy, geleceği inşa et.
            </p>

            {/* Butonlar */}
            <div className="flex flex-col sm:flex-row items-center gap-5 animate-[fadeIn_1s_ease-out_0.8s_both] w-full sm:w-auto">
              
              <Link 
                to="/ogrenci-kayit" 
                className="group relative px-8 py-4 bg-slate-900 text-white font-bold rounded-4xl overflow-hidden hover:shadow-2xl hover:shadow-red-900/20 transition-all duration-300 w-full sm:w-auto flex items-center justify-center"
              >
                  <div className="absolute inset-0 w-full h-full bg-red-600 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left"></div>
                  <span className="relative flex items-center justify-center gap-3">
                      HEMEN BAŞVUR <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                  </span>
              </Link>

              {/* İsteğe bağlı 2. buton (İletişim vb.) */}
             {/* <button className="px-8 py-4 bg-white border-2 border-slate-200 text-slate-700 font-bold rounded-xl hover:border-red-600 hover:text-red-600 transition-all duration-300 w-full sm:w-auto flex items-center justify-center gap-2">
                 <MapPin size={20} /> İletişim
              </button> */}

            </div>
            
            {/* Alt İstatistikler / Iconlar */}
            <div className="mt-12 flex items-center gap-8 text-slate-400 animate-[fadeIn_1s_ease-out_1s_both]">
                <div className="flex items-center gap-2">
                    <MapPin size={18} className="text-red-500" />
                    <span className="text-sm font-semibold text-slate-600">Kocaeli Geneli</span>
                </div>
            </div>

          </div>

          {/* SAĞ: GÖRSEL ALANI */}
          <div className="w-full lg:w-1/2 relative z-10 perspective-1000">
             
             {/* Dekoratif Arka Plan Şekilleri */}
             <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-gradient-to-tr from-red-100 to-orange-50 rounded-full blur-3xl opacity-60 z-0"></div>
             
             <div className="relative w-full max-w-lg lg:max-w-xl mx-auto aspect-[4/5] md:aspect-square lg:aspect-[4/3] group">
                
                {/* Çerçeve Efekti */}
                <div className="absolute -top-4 -right-4 w-full h-full border-2 border-red-200 rounded-[2.5rem] z-0 transition-transform duration-500 group-hover:translate-x-2 group-hover:-translate-y-2"></div>
                <div className="absolute -bottom-4 -left-4 w-full h-full border-2 border-slate-900 rounded-[2.5rem] z-0 transition-transform duration-500 group-hover:-translate-x-2 group-hover:translate-y-2"></div>

                {/* Ana Resim */}
                <div className="absolute inset-0 rounded-[2.5rem] overflow-hidden shadow-2xl z-10 bg-slate-100">
                   <img 
                      src="https://imamhatipsporoyunlari.com/assets/banner.jpeg" 
                      alt="Kocaeli Öncü Spor" 
                      className="w-full h-full object-cover transform scale-100 group-hover:scale-110 transition-transform duration-[1.5s]"
                   />
                   {/* Resim Üzeri Gradient Overlay */}
                   <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-60"></div>
                   
                   {/* Resim Üzeri Metin (Opsiyonel) */}
                   <div className="absolute bottom-6 left-6 md:bottom-10 md:left-10 text-white z-20">
                       <p className="font-bold text-lg md:text-2xl tracking-wide">SPORUN VE</p>
                       <p className="font-black text-2xl md:text-4xl text-red-500">GENÇLİĞİN ÖNCÜSÜ</p>
                   </div>
                </div>

                {/* Video Play Butonu (Resmin Üzerinde) */}
               
             </div>
          </div>

        </div>
      </div>

      {/* --- VIDEO MODAL --- */}
      

      {/* Animasyonlar */}
      <style jsx>{`
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        @keyframes slideUp {
            from { transform: translateY(100%); opacity: 0; }
            to { transform: translateY(0); opacity: 1; }
        }
        @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
        }
        @keyframes scaleIn {
            from { transform: scale(0.95); opacity: 0; }
            to { transform: scale(1); opacity: 1; }
        }
      `}</style>
    </div>
  );
};

export default CreativeHeroFinal;