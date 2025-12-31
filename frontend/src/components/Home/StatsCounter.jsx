import React, { useState, useEffect, useRef } from 'react';
import { Trophy, Users, School, Layers } from 'lucide-react';

const StatsCounter = () => {
  const [counts, setCounts] = useState({
    cups: 0,
    branches: 0,
    athletes: 0,
    schools: 0
  });
  
  const [isVisible, setIsVisible] = useState(false);
  const containerRef = useRef(null);
  
  // Hedeflenen Rakamlar
  const targets = {
    cups: 40,
    branches: 17,
    athletes: 4000,
    schools: 400
  };

  // Görünürlük Kontrolü
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setIsVisible(true);
          observer.disconnect(); 
        }
      },
      { threshold: 0.3 } 
    );
    
    if (containerRef.current) {
      observer.observe(containerRef.current);
    }
    
    return () => observer.disconnect();
  }, []);

  // Sayaç Mantığı (Hepsini yaklaşık aynı sürede bitirecek şekilde ayarladım)
  useEffect(() => {
    let interval;
    if (isVisible) {
      interval = setInterval(() => {
        setCounts(prev => ({
          cups: prev.cups < targets.cups ? prev.cups + 1 : targets.cups,
          branches: prev.branches < targets.branches ? prev.branches + 1 : targets.branches,
          athletes: prev.athletes < targets.athletes ? prev.athletes + 100 : targets.athletes, // Daha hızlı artsın
          schools: prev.schools < targets.schools ? prev.schools + 10 : targets.schools
        }));
      }, 40); // 40ms hız
    }
    return () => clearInterval(interval);
  }, [isVisible]);

  const statsData = [
    { 
      key: 'cups',
      label: 'Kazanılan Kupa', 
      value: counts.cups, 
      icon: <Trophy size={32} />,
      color: 'text-yellow-500',
      bg: 'bg-yellow-50',
      border: 'group-hover:border-yellow-200',
      shadow: 'group-hover:shadow-yellow-500/20'
    },
    { 
      key: 'branches',
      label: 'Aktif Branş', 
      value: counts.branches, 
      icon: <Layers size={32} />,
      color: 'text-blue-600',
      bg: 'bg-blue-50',
      border: 'group-hover:border-blue-200',
      shadow: 'group-hover:shadow-blue-500/20'
    },
    { 
      key: 'athletes',
      label: 'Lisanslı Sporcu', 
      value: counts.athletes, 
      icon: <Users size={32} />,
      color: 'text-red-600',
      bg: 'bg-red-50',
      border: 'group-hover:border-red-200',
      shadow: 'group-hover:shadow-red-500/20'
    },
    { 
      key: 'schools',
      label: 'Katılımcı Okul', 
      value: counts.schools, 
      icon: <School size={32} />,
      color: 'text-orange-500',
      bg: 'bg-orange-50',
      border: 'group-hover:border-orange-200',
      shadow: 'group-hover:shadow-orange-500/20'
    }
  ];

  return (
    <div className="py-12 bg-[#FDFBF7] relative overflow-hidden font-sans selection:bg-red-100 selection:text-red-900">
      
      {/* --- 1. ARKA PLAN IZGARA --- */}
      <div className="absolute inset-0 pointer-events-none opacity-30">
        <div className="absolute top-0 left-1/4 w-px h-full bg-slate-200/60"></div>
        <div className="absolute top-0 left-2/4 w-px h-full bg-slate-200/60"></div>
        <div className="absolute top-0 left-3/4 w-px h-full bg-slate-200/60"></div>
      </div>

      <div className="container mx-auto px-6 relative z-10" ref={containerRef}>
        
        {/* --- 2. BAŞLIK ALANI --- */}
        <div className="text-center mb-16 max-w-3xl mx-auto">
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-black text-slate-900 tracking-tight leading-[1.1]">
                Rakamlarla <br/>
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-600 to-orange-500">
                    Büyüyen Heyecan
                </span>
            </h2>
        </div>

        {/* --- 3. İSTATİSTİK KARTLARI --- */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8 mb-16">
          {statsData.map((stat, index) => (
            <div 
              key={index} 
              className={`
                group relative bg-white p-6 md:p-8 rounded-[2.5rem] border border-slate-100
                transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl
                flex flex-col items-center text-center justify-between min-h-[240px] md:min-h-[280px]
                ${stat.border} ${stat.shadow}
              `}
            >
              {/* İkon */}
              <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-4 transition-transform duration-500 group-hover:scale-110  ${stat.bg} ${stat.color}`}>
                {stat.icon}
              </div>

              {/* Rakam */}
              <div className="relative">
                 <span className="text-4xl md:text-5xl lg:text-6xl font-black text-slate-900 tracking-tighter">
                   {stat.value}
                 </span>
                 <span className={`absolute -top-2 -right-6 text-2xl font-bold ${stat.color}`}>+</span>
              </div>

              {/* Etiket */}
              <div className="mt-4">
                <div className="h-1 w-8 bg-slate-100 rounded-full mx-auto mb-3 group-hover:w-16 transition-all duration-500 group-hover:bg-current group-hover:bg-red-600 text-slate-200"></div>
                <p className="text-slate-500 font-bold text-sm tracking-widest uppercase">
                  {stat.label}
                </p>
              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
};

export default StatsCounter;