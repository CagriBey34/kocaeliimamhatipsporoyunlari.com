import React, { useState, useEffect } from "react";
import { 
  Trophy, 
  Medal, 
  School, 
  User, 
  ChevronLeft, 
  ChevronRight, 
  Scale, 
  Activity,
  Search,
  Calendar,
  Sparkles 
} from "lucide-react";

// Veri dosyalarını import ediyoruz
import { data2024 } from "./data2024";
import { data2025 } from "./data2025";

// Spor dalları tanımı
const allSportsConfig = [
  { id: 'all', title: 'Tümü', icon: '🏆' },
  { id: 'archery', title: 'Okçuluk', icon: '🏹' },
  { id: 'badminton', title: 'Badminton', icon: '🏸' },
  { id: 'atletizm', title: 'Atletizm', icon: '🏃' },
  { id: 'taekwondo', title: 'Taekwondo', icon: '🥋' },
  { id: 'tableTennis', title: 'Masa Tenisi', icon: '🏓' },
  { id: 'dart', title: 'Dart', icon: '🎯' },
  { id: 'wrestling', title: 'Bilek Güreşi', icon: '💪' },
  { id: 'gures', title: 'Güreş', icon: '🤼' },
  { id: 'basketbol', title: '3x3 Basketbol', icon: '🏀' },
  { id: 'futsal', title: 'Futsal', icon: '⚽' },
  { id: 'voleybol', title: 'Voleybol', icon: '🏐' },
  { id: 'chess', title: 'Satranç', icon: '♟️' },
];

const DerecePage = () => {
  const [selectedYear, setSelectedYear] = useState(2024);
  const [allResults, setAllResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedSport, setSelectedSport] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  
  const [activeSports, setActiveSports] = useState([]);

  const ITEMS_PER_PAGE = 6;

  const gameTitle = selectedYear === 2024 ? "15. İmam Hatip Spor Oyunları" : "16. İmam Hatip Spor Oyunları";

  // 1. Veri Yükleme
  useEffect(() => {
    const loadData = () => {
      setLoading(true);
      
      let currentData = [];
      if (selectedYear === 2024) {
        currentData = data2024;
      } else if (selectedYear === 2025) {
        currentData = data2025;
      }

      setAllResults(currentData);

      const existingSportIds = new Set(currentData.map(item => item.sport));
      const filteredSports = allSportsConfig.filter(sport => 
        sport.id === 'all' || existingSportIds.has(sport.id)
      );

      setActiveSports(filteredSports);
      setLoading(false);
      setSelectedSport('all');
      setCurrentPage(1);
    };

    loadData();
  }, [selectedYear]);

  // 2. Sayfalama
  useEffect(() => {
    const filteredData = selectedSport === 'all'
      ? allResults
      : allResults.filter(item => item.sport === selectedSport);

    const categories = [...new Set(filteredData.map(item => item.category))].filter(Boolean);
    const total = Math.max(1, Math.ceil(categories.length / ITEMS_PER_PAGE));
    setTotalPages(total);
    
    if (currentPage > total) {
      setCurrentPage(1);
    }
  }, [selectedSport, allResults, currentPage]);

  // 3. Veriyi Hazırlama
  const getFilteredAndPaginatedData = () => {
    const filteredData = selectedSport === 'all'
      ? allResults
      : allResults.filter(item => item.sport === selectedSport);

    const categories = [...new Set(filteredData.map(item => item.category))].filter(Boolean);
    const grouped = categories.map(category => ({
      category,
      winners: filteredData.filter(item => item.category === category)
    }));

    const sorted = [...grouped].sort((a, b) => {
      const aIsTeam = a.category.includes('TAKIM');
      const bIsTeam = b.category.includes('TAKIM');
      return (aIsTeam ? 1 : 0) - (bIsTeam ? 1 : 0);
    });

    return sorted.slice(
      (currentPage - 1) * ITEMS_PER_PAGE,
      currentPage * ITEMS_PER_PAGE
    );
  };

  const changePage = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const getRankStyle = (rank) => {
    switch (rank) {
      case '1': return "bg-gradient-to-br from-yellow-300 to-yellow-500 text-white shadow-yellow-200";
      case '2': return "bg-gradient-to-br from-slate-300 to-slate-400 text-white shadow-slate-200";
      case '3': return "bg-gradient-to-br from-orange-400 to-orange-600 text-white shadow-orange-200";
      default: return "bg-slate-100 text-slate-600 border-slate-200";
    }
  };

  return (
    <div className="py-24 md:py-44 bg-[#FDFBF7] relative overflow-hidden font-sans selection:bg-red-100 selection:text-red-900 mt-10">
      
      {/* Background FX */}
      <div className="absolute inset-0 pointer-events-none opacity-30">
        <div className="absolute top-0 left-1/4 w-px h-full bg-slate-200/60"></div>
        <div className="absolute top-0 left-2/4 w-px h-full bg-slate-200/60"></div>
        <div className="absolute top-0 left-3/4 w-px h-full bg-slate-200/60"></div>
      </div>
      <div className="absolute top-20 right-0 w-[500px] h-[500px] bg-red-600/5 rounded-full blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-blue-600/5 rounded-full blur-[100px] pointer-events-none"></div>

      <div className="container mx-auto px-6 relative z-10">
        
        {/* --- HEADER --- */}
        <div className="text-center mb-12 max-w-4xl mx-auto">
          <h1 className="text-5xl md:text-7xl font-black text-slate-900 tracking-tight leading-[0.9] mb-6">
             Şampiyonlar & <br/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-600 to-orange-500">
              Dereceler 🏆
            </span>
          </h1>
          <p className="text-slate-500 text-lg font-medium mb-10">
            {gameTitle} kapsamında dereceye giren okullarımızı ve sporcularımızı tebrik ederiz.
          </p>

          {/* ========================================================= */}
          {/* SADECE BU KISIM DEĞİŞTİRİLDİ (YENİ VE DAHA ŞIK TASARIM)   */}
          {/* ========================================================= */}
          <div className="inline-flex bg-slate-100 p-2 rounded-full border border-slate-200 shadow-inner mb-12 relative z-10">
            {[2024, 2025].map((year) => {
              const isActive = selectedYear === year;
              return (
                <button
                  key={year}
                  onClick={() => setSelectedYear(year)}
                  className={`
                    relative px-10 py-3.5 rounded-full text-sm font-black transition-all duration-500 flex items-center gap-2.5
                    ${isActive 
                      ? "text-white shadow-xl shadow-red-600/25" 
                      : "text-slate-400 hover:text-slate-600"
                    }
                  `}
                >
                  {/* Aktif Buton Arka Planı (Sadece aktifkense render olur) */}
                  {isActive && (
                     <div className="absolute inset-0 bg-gradient-to-r from-red-600 to-red-500 rounded-full"></div>
                  )}

                  {/* Buton İçeriği */}
                  <span className="relative z-10 flex items-center gap-2">
                    {year === 2024 ? (
                        <Trophy size={18} className={`transition-transform duration-300 ${isActive ? 'text-yellow-300 scale-110' : ''}`} />
                    ) : (
                        <Calendar size={18} className={`transition-transform duration-300 ${isActive ? 'text-white scale-110' : ''}`} />
                    )}
                    <span className="tracking-wide text-base">{year} Sezonu</span>
                  </span>
                </button>
              );
            })}
          </div>
          {/* ========================================================= */}

        </div>

        {/* --- SPOR FİLTRELERİ (AYNI KALDI) --- */}
        <div className="flex flex-wrap justify-center gap-4 mb-20 max-w-6xl mx-auto">
          {activeSports.map((sport) => {
            const isActive = selectedSport === sport.id;
            return (
              <button
                key={sport.id}
                onClick={() => setSelectedSport(sport.id)}
                className={`
                  group relative px-6 py-3 rounded-2xl flex items-center gap-3 text-sm font-bold transition-all duration-300
                  ${isActive 
                    ? "bg-red-600 text-white shadow-xl shadow-red-600/30 scale-105 ring-4 ring-red-500/20 translate-y-[-4px]" 
                    : "bg-white text-slate-600 border border-slate-100 hover:border-red-200 hover:text-red-600 hover:shadow-lg hover:shadow-red-500/10 hover:-translate-y-1"
                  }
                `}
              >
                <span className={`text-xl transition-transform duration-300 ${isActive ? 'scale-110' : 'group-hover:scale-125 group-hover:rotate-6'}`}>
                    {sport.icon}
                </span>
                
                <span className="tracking-wide">{sport.title}</span>

                {isActive && (
                    <span className="absolute top-0 right-0 -mt-1 -mr-1">
                        <span className="relative flex h-3 w-3">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
                          <span className="relative inline-flex rounded-full h-3 w-3 bg-white"></span>
                        </span>
                    </span>
                )}
              </button>
            );
          })}
        </div>

        {/* --- İÇERİK --- */}
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-600"></div>
          </div>
        ) : (
          <>
            {allResults.length === 0 ? (
               <div className="text-center py-24">
                 <div className="inline-block p-8 rounded-full bg-white border border-slate-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] mb-6 animate-bounce-slow">
                    <Trophy className="text-slate-300 w-16 h-16" />
                 </div>
                 <h3 className="text-2xl font-black text-slate-900 mb-2">Veri Yüklenmedi</h3>
                 <p className="text-slate-500">Bu yıla ait veri henüz sisteme girilmedi.</p>
               </div>
            ) : getFilteredAndPaginatedData().length === 0 ? (
              <div className="text-center py-24">
                 <div className="inline-block p-8 rounded-full bg-white border border-slate-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] mb-6">
                    <Search className="text-slate-300 w-16 h-16" />
                 </div>
                 <h3 className="text-2xl font-black text-slate-900 mb-2">Sonuç Bulunamadı</h3>
                 <p className="text-slate-500">Seçilen kriterlere uygun derece bulunamadı.</p>
               </div>
            ) : (
              <div className="space-y-16">
                {getFilteredAndPaginatedData().map((group, index) => (
                  <div key={index} className="animate-fade-in-up">
                    {/* Kategori Başlığı */}
                    <div className="flex items-center gap-4 mb-8">
                       <div className={`
                         flex items-center justify-center w-12 h-12 rounded-2xl shadow-lg
                         ${group.category.includes('TAKIM') ? 'bg-blue-600 shadow-blue-500/30' : 'bg-red-600 shadow-red-500/30'}
                       `}>
                          {group.category.includes('TAKIM') ? <User className="text-white" size={24}/> : <Medal className="text-white" size={24}/>}
                       </div>
                       <h2 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight uppercase">
                         {group.category}
                       </h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                      {group.winners.map((winner, idx) => (
                        <div 
                          key={idx} 
                          className="group relative bg-white p-2 rounded-[2.5rem] border border-slate-100 shadow-[0_10px_40px_-10px_rgba(0,0,0,0.05)] hover:shadow-[0_20px_40px_-15px_rgba(220,38,38,0.15)] transition-all duration-500 hover:-translate-y-2"
                        >
                          <div className="p-5 flex items-start gap-5 h-full">
                            {/* Derece Rozeti */}
                            <div className={`
                                w-16 h-16 rounded-2xl flex flex-col items-center justify-center shadow-lg shrink-0 transform group-hover:rotate-6 transition-transform duration-500
                                ${getRankStyle(winner.rank)}
                            `}>
                                <span className="text-2xl font-black drop-shadow-md">{winner.rank}.</span>
                                <span className="text-[10px] font-bold uppercase tracking-wider opacity-90">Sıra</span>
                            </div>

                            {/* Bilgiler */}
                            <div className="flex-1 min-w-0 py-1">
                                <h3 className="text-lg font-black text-slate-900 leading-tight mb-2 group-hover:text-red-600 transition-colors line-clamp-2">
                                  {winner.isTeam ? winner.school : winner.name}
                                </h3>
                                
                                {!winner.isTeam && winner.school && (
                                   <div className="flex items-center gap-2 text-slate-500 mb-3 bg-slate-50 p-1.5 rounded-lg w-fit">
                                      <School size={14} className="shrink-0 text-red-500" />
                                      <p className="text-xs font-bold truncate max-w-[150px]">{winner.school}</p>
                                   </div>
                                )}
                                
                                <div className="flex flex-wrap gap-2 mt-auto">
                                    {winner.weight && (
                                      <span className="inline-flex items-center gap-1 bg-slate-50 text-slate-600 border border-slate-100 text-[10px] px-2.5 py-1 rounded-full font-bold uppercase group-hover:bg-red-50 group-hover:text-red-600 transition-colors">
                                        <Scale size={12} />
                                        {winner.weight}
                                      </span>
                                    )}
                                    {winner.puan && (
                                      <span className="inline-flex items-center gap-1 bg-blue-50 text-blue-600 border border-blue-100 text-[10px] px-2.5 py-1 rounded-full font-bold uppercase">
                                        <Activity size={12} />
                                        {winner.puan} Puan
                                      </span>
                                    )}
                                </div>
                            </div>
                            
                            {/* Dekoratif Ikon */}
                            {idx === 0 && <div className="absolute top-4 right-4 text-yellow-400 opacity-20 transform rotate-12"><Trophy size={40}/></div>}

                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}

                {/* --- SAYFALAMA (AYNI KALDI) --- */}
                {totalPages > 1 && (
                  <div className="flex justify-center mt-20 gap-4">
                    <button
                      onClick={() => changePage(currentPage - 1)}
                      disabled={currentPage === 1}
                      className={`
                        w-14 h-14 flex items-center justify-center rounded-2xl transition-all duration-300
                        ${currentPage === 1
                          ? 'bg-slate-50 text-slate-300 cursor-not-allowed'
                          : 'bg-white text-slate-700 shadow-lg shadow-slate-200/50 hover:bg-red-600 hover:text-white hover:shadow-red-500/30 hover:-translate-y-1'
                        }
                      `}
                    >
                      <ChevronLeft size={24} strokeWidth={3} />
                    </button>

                    <div className="flex items-center justify-center px-8 bg-white rounded-2xl shadow-lg shadow-slate-200/50">
                      <span className="text-2xl font-black text-slate-900">{currentPage}</span>
                      <span className="mx-2 text-slate-300 text-xl">/</span>
                      <span className="text-lg font-bold text-slate-400">{totalPages}</span>
                    </div>

                    <button
                      onClick={() => changePage(currentPage + 1)}
                      disabled={currentPage === totalPages}
                      className={`
                        w-14 h-14 flex items-center justify-center rounded-2xl transition-all duration-300
                        ${currentPage === totalPages
                          ? 'bg-slate-50 text-slate-300 cursor-not-allowed'
                          : 'bg-white text-slate-700 shadow-lg shadow-slate-200/50 hover:bg-red-600 hover:text-white hover:shadow-red-500/30 hover:-translate-y-1'
                        }
                      `}
                    >
                      <ChevronRight size={24} strokeWidth={3} />
                    </button>
                  </div>
                )}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default DerecePage;