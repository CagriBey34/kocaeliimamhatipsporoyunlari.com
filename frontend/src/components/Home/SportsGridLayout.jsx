import React from 'react';
import { Gem, LayoutGrid, Users, Heart } from 'lucide-react';

const CreativeInfo = () => {
  const cards = [
    { 
      title: "Değer Kazandırma", 
      desc: "Sporun birleştirici gücüyle gençlere sadece sportif beceriler değil, manevi ve ahlaki değerler kazandırıyoruz.", 
      icon: <Gem size={32} />, 
      color: "text-blue-600",
      bg: "bg-blue-50",
      border: "group-hover:border-blue-200",
      shadow: "group-hover:shadow-blue-500/10"
    },
    { 
      title: "Çeşitli Branşlar", 
      desc: "Futboldan güreşe, basketboldan atletizme kadar geniş bir yelpazede yeteneklerin keşfedilmesini sağlıyoruz.",
      icon: <LayoutGrid size={32} />, 
      color: "text-purple-600",
      bg: "bg-purple-50",
      border: "group-hover:border-purple-200",
      shadow: "group-hover:shadow-purple-500/10"
    },
    { 
      title: "Takım Ruhu", 
      desc: "Ortak hedefler doğrultusunda birbirine destek olmayı, dayanışmayı ve 'biz' olma bilincini aşılıyoruz.", 
      icon: <Users size={32} />, 
      color: "text-yellow-600",
      bg: "bg-yellow-50",
      border: "group-hover:border-yellow-200",
      shadow: "group-hover:shadow-yellow-500/10"
    },
    { 
      title: "Ahlaki Değerler", 
      desc: "Fair-play ruhuyla; dostluk, saygı, hoşgörü ve sabır gibi erdemleri sahanın merkezine koyuyoruz.", 
      icon: <Heart size={32} />, 
      color: "text-red-600",
      bg: "bg-red-50",
      border: "group-hover:border-red-200",
      shadow: "group-hover:shadow-red-500/10"
    },
  ];

  return (
    <div className="py-24 md:py-32 bg-[#FDFBF7] relative overflow-hidden font-sans selection:bg-red-100 selection:text-red-900">
      
      {/* --- ARKA PLAN EFEKTLERİ --- */}
      <div className="absolute inset-0 pointer-events-none opacity-30">
        <div className="absolute top-0 left-1/4 w-px h-full bg-slate-200/60"></div>
        <div className="absolute top-0 left-2/4 w-px h-full bg-slate-200/60"></div>
        <div className="absolute top-0 left-3/4 w-px h-full bg-slate-200/60"></div>
      </div>

      <div className="container mx-auto px-6 relative z-10">
        
        <div className="flex flex-col lg:flex-row gap-16 items-start lg:items-center">
            
            {/* --- SOL TARAF: BAŞLIK (Sticky) --- */}
            <div className="lg:w-1/3sticky top-12">
                <h2 className="text-4xl md:text-5xl lg:text-6xl font-black text-slate-900 mb-6 leading-[1.1] tracking-tight">
                    İmam Hatip <br/>
                    <span className="text-red-600">Spor Oyunları</span>
                </h2>
                
                <p className="text-slate-500 text-lg leading-relaxed mb-8 font-medium max-w-sm">
                    Genç yetenekleri buluşturan, spor ve manevi değerleri harmanlayan köklü bir yapı.
                </p>

                {/* Dekoratif Çizgi */}
                <div className="w-24 h-1.5 bg-slate-900 rounded-full"></div>
            </div>

            {/* --- SAĞ TARAF: KARTLAR --- */}
            <div className="lg:w-2/3 w-full grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
                {cards.map((card, idx) => (
                    <div 
                        key={idx}
                        className={`
                            group relative p-8 bg-white border border-slate-100 rounded-[2rem]
                            transition-all duration-500 ease-out
                            hover:-translate-y-1 
                            hover:shadow-2xl 
                            ${card.shadow} 
                            ${card.border}
                            ${idx % 2 === 1 ? 'md:translate-y-12' : ''} /* Asimetri */
                        `}
                    >
                        <div className="relative z-10 flex flex-col h-full">
                            {/* İkon Kutusu */}
                            <div className={`w-14 h-14 mb-6 rounded-2xl flex items-center justify-center ${card.bg} ${card.color} transition-transform duration-500 group-hover:scale-110`}>
                                {card.icon}
                            </div>

                            {/* Başlık */}
                            <h3 className="text-xl font-bold text-slate-900 mb-3 group-hover:text-slate-700 transition-colors">
                                {card.title}
                            </h3>
                            
                            {/* Açıklama */}
                            <p className="text-slate-500 text-sm leading-relaxed mb-6 font-medium">
                                {card.desc}
                            </p>
                            
                            {/* Alt Çizgi (İkon Rengiyle Uyumlu) */}
                            <div className={`mt-auto w-8 h-1 rounded-full ${card.bg.replace('bg-', 'bg-').replace('50', '500')} opacity-20 group-hover:opacity-100 group-hover:w-16 transition-all duration-500`}></div>
                        </div>
                    </div>
                ))}
            </div>

        </div>
      </div>
    </div>
  );
};

export default CreativeInfo;