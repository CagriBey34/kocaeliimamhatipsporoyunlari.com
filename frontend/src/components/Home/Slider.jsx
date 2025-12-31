import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Play, Star, X } from 'lucide-react';

const CreativeHeroFinal = () => {
  // Video penceresinin açık/kapalı durumunu tutan state
  const [isVideoOpen, setIsVideoOpen] = useState(false);

  // Videoyu açma fonksiyonu
  const openVideo = () => {
    setIsVideoOpen(true);
    document.body.style.overflow = 'hidden'; // Sayfanın arkada kaymasını engelle
  };

  // Videoyu kapatma fonksiyonu
  const closeVideo = () => {
    setIsVideoOpen(false);
    document.body.style.overflow = 'auto'; // Kaydırmayı tekrar aç
  };

  return (
    <div className="py-24 top-10 bg-[#FDFBF7] relative overflow-hidden font-sans selection:bg-red-100 selection:text-red-900">
      
      {/* --- 1. ARKA PLAN IZGARA --- */}
      <div className="absolute inset-0 pointer-events-none opacity-30">
        <div className="absolute top-0 left-1/4 w-px h-full bg-slate-200/60"></div>
        <div className="absolute top-0 left-2/4 w-px h-full bg-slate-200/60"></div>
        <div className="absolute top-0 left-3/4 w-px h-full bg-slate-200/60"></div>
      </div>

      {/* Noise Efekti */}
      <div className="absolute inset-0 opacity-[0.03] z-0 pointer-events-none mix-blend-multiply" 
           style={{backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`}}>
      </div>

      {/* --- 2. INFINITE MARQUEE --- */}
      <div className="absolute top-1/2 left-0 w-full -translate-y-1/2 z-0 overflow-hidden py-10 pointer-events-none">
        <div className="whitespace-nowrap animate-[marquee_40s_linear_infinite] opacity-[0.03]">
            <span className="text-[15vw] font-black tracking-tighter text-black mx-4">
                SPOR • AHLAK • KARDEŞLİK • GELECEK •
            </span>
            <span className="text-[15vw] font-black tracking-tighter text-black mx-4">
                SPOR • AHLAK • KARDEŞLİK • GELECEK •
            </span>
        </div>
      </div>

      {/* --- 3. ANA İÇERİK --- */}
      <div className="container mx-auto px-6 relative z-10">
        <div className="flex flex-col-reverse lg:flex-row items-center justify-between gap-12 lg:gap-16">
          
          {/* SOL: METİN VE BUTONLAR */}
          <div className="w-full lg:w-5/12 flex flex-col items-start text-left z-20">
            
            <div className="flex items-center gap-3 mb-6 animate-[fadeIn_1s_ease-out]">
              <div className="w-12 h-[2px] bg-red-600"></div>
              <span className="text-red-600 font-bold tracking-[0.3em] text-sm uppercase">2025 - 2026 Sezonu</span>
            </div>

            <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-black text-slate-900 leading-[0.9] tracking-tighter mb-8">
              <span className="block overflow-hidden">
                  <span className="block animate-[slideUp_0.8s_ease-out_0.2s_both]">SINIRLARI</span>
              </span>
              <span className="block overflow-hidden">
                  <span className="block text-transparent bg-clip-text bg-gradient-to-r from-red-600 to-red-400 animate-[slideUp_0.8s_ease-out_0.4s_both]">
                    ZORLA
                  </span>
              </span>
            </h1>

            <p className="text-slate-500 text-lg md:text-xl font-medium leading-relaxed max-w-md mb-10 animate-[fadeIn_1s_ease-out_0.6s_both]">
              Şampiyonluk sadece kupadan ibaret değildir. Sahaya karakterini koy, geleceği inşa et.
            </p>

            <div className="flex flex-col sm:flex-row items-center gap-6 animate-[fadeIn_1s_ease-out_0.8s_both] w-full sm:w-auto">
              
              {/* --- BUTON 1: Hemen Başvur --- */}
              <Link 
                to="/ogrenci-kayit" 
                className="group relative px-8 py-4 bg-slate-900 text-white font-bold rounded-full overflow-hidden hover:shadow-2xl hover:shadow-red-500/20 transition-all duration-300 w-full sm:w-auto flex items-center justify-center"
              >
                  <div className="absolute inset-0 w-full h-full bg-red-600 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left"></div>
                  <span className="relative flex items-center justify-center gap-3">
                      HEMEN BAŞVUR <ArrowRight size={20} />
                  </span>
              </Link>
              
              {/* --- BUTON 2: Tanıtımı İzle (MODAL AÇAR) --- */}
           {/*    <button 
                onClick={openVideo}
                className="flex items-center justify-center gap-3 text-slate-900 font-bold group hover:text-red-600 transition-colors w-full sm:w-auto cursor-pointer"
              >
                  <div className="w-12 h-12 rounded-full border border-slate-200 flex items-center justify-center group-hover:border-red-600 group-hover:bg-red-50 transition-all">
                      <Play size={20} className="fill-current" />
                  </div>
                  <span>Tanıtımı İzle</span>
              </button> */}

            </div>

          </div>

          {/* SAĞ: GÖRSEL ALANI */}
          <div className="w-full lg:w-2/6 relative z-10">
             <div className="relative w-full max-w-lg lg:max-w-full mx-auto aspect-[4/5] md:aspect-square lg:aspect-[3/4]">
                <div className="absolute top-3 -right-3 md:top-6 md:-right-6 w-full h-full border-2 border-slate-900 rounded-[2rem] z-0"></div>
                <div className="absolute inset-0 rounded-[2rem] overflow-hidden shadow-2xl z-10 bg-slate-100">
                   <img 
                      src="https://imamhatipsporoyunlari.com/assets/banner.jpeg" 
                      alt="Hero Athlete" 
                      className="w-full h-full object-cover transform scale-100 hover:scale-105 transition-transform duration-[1.5s]"
                   />
                   <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent"></div>
                   {/* <div className="">
                   </div> */}
                </div>
             </div>
          </div>

        </div>
      </div>

      {/* --- VIDEO MODAL (POP-UP) --- */}
      {isVideoOpen && (
  <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
    
    {/* Karartılmış Arka Plan (Backdrop) */}
    <div 
      className="absolute inset-0 bg-slate-900/90 backdrop-blur-sm transition-opacity animate-[fadeIn_0.3s_ease-out]"
      onClick={closeVideo}
    ></div>

    {/* Video Konteyneri */}
    <div className="relative w-full max-w-5xl bg-black rounded-3xl overflow-hidden shadow-2xl shadow-red-600/20 border border-white/10 animate-[scaleIn_0.3s_ease-out]">
      
      {/* Kapatma Butonu */}
      <button 
        onClick={closeVideo}
        className="absolute top-4 right-4 z-50 w-10 h-10 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center text-white hover:bg-red-600 transition-colors border border-white/10"
      >
        <X size={20} />
      </button>

      {/* Video Elementi */}
      <video 
        src="/assets/intro.mp4"
        controls 
        autoPlay 
        className="w-full h-auto max-h-[80vh] object-cover"
      ></video>
    </div>
  </div>
)}


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