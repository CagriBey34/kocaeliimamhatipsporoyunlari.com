import React from 'react';
import { 
  Trophy, 
  Calendar, 
  Clock, 
  MapPin, 
  Medal, 
  Award, 
  Goal, 
  Activity // Voleybol için alternatif
} from 'lucide-react';

const TournamentFinal = () => {
  // --- VERİ SETLERİ (Aynen Korundu) ---
  const pastVolleyballMatches = [
    {
      date: '08.05.2025',
      category: 'GENÇ KIZ',
      venue: 'Cevizlibağ Atatürk Öğrenci Yurdu',
      isCompleted: true,
      matches: [
        { time: '10:00', team1: 'KARTAL MEHMET AKİF ERSOY AİHL', team2: 'SARIYER KIZ AİHL', score: '2 - 0' },
        { time: '11:00', team1: 'SAMANDIRA KIZ AİHL', team2: 'SİLİVRİ KIZ AİHL', score: '2 - 0' }
      ]
    },
    {
      date: '08.05.2025',
      category: 'YILDIZ KIZ',
      venue: 'Cevizlibağ Atatürk Öğrenci Yurdu',
      isCompleted: true,
      matches: [
        { time: '12:00', team1: 'BAŞAKŞEHİR ŞEHİT HAKİ ARAS İHO', team2: 'TENZİLE ERDOĞAN İHO', score: '2 - 0' },
        { time: '13:00', team1: 'BAYRAMPAŞA MOBİL İHO', team2: 'KARTAL BORSA İHO', score: '1 - 2' }
      ]
    }
  ];

  const finalVolleyballMatches = [
    {
      date: '12.05.2025',
      category: 'YILDIZ KIZ',
      venue: 'Cevizlibağ Atatürk Öğrenci Yurdu',
      isCompleted: true,
      matches: [
        { time: '10:00', title: '3.LÜK MAÇI', team1: 'TENZİLE ERDOĞAN İHO', team2: 'BAYRAMPAŞA MOBİL İHO', score: '0 - 2' },
        { time: '11:00', title: 'FİNAL MAÇI', team1: 'BAŞAKŞEHİR ŞEHİT HAKİ ARAS İHO', team2: 'KARTAL BORSA İSTANBUL İHO', score: '2 - 0' }
      ]
    },
    {
      date: '12.05.2025',
      category: 'GENÇ KIZ',
      venue: 'Cevizlibağ Atatürk Öğrenci Yurdu',
      isCompleted: true,
      matches: [
        { time: '12:00', title: '3.LÜK MAÇI', team1: 'SARIYER KIZ AİHL', team2: 'SİLİVRİ KIZ AİHL', score: '0 - 2' },
        { time: '13:00', title: 'FİNAL MAÇI', team1: 'SANCAKTEPE SAMANDIRA KIZ AİHL', team2: 'KARTAL MEHMET AKİF ERSOY AİHL', score: '2 - 0' }
      ]
    }
  ];

  const pastFutsalMatches = [
    {
      date: '07.05.2025',
      category: 'GENÇ ERKEK',
      venue: 'Fatih UFSM Anadolu İmam Hatip Lisesi',
      isCompleted: true,
      matches: [
        { time: '10:00', team1: 'ÜSKÜDAR İTO MARMARA AİHL', team2: 'FATİH UFSM AİHL', score: '6 - 1' },
        { time: '11:00', team1: 'YAŞAR DEDEMAN AİHL', team2: 'YAVUZ BAHADIROĞLU AİHL', score: '9 - 1' }
      ]
    },
    {
      date: '07.05.2025',
      category: 'YILDIZ ERKEK',
      venue: 'Fatih UFSM Anadolu İmam Hatip Lisesi',
      isCompleted: true,
      matches: [
        { time: '12:00', team1: 'BAKIRKÖY ŞEHİT MUHAMMET AMBAR İHO', team2: 'ANAFARTALAR İHO', score: '5 - 1' },
        { time: '13:00', team1: 'BEYLİKDÜZÜ ŞEHİT ABDULLAH TAYYİP OLÇOK İHO', team2: 'ŞEHİT MUSTAFA KAYMAKÇI İHO', score: '6 - 3' }
      ]
    }
  ];

  const finalFutsalMatches = [
    {
      date: '08.05.2025',
      category: 'YILDIZ ERKEK',
      venue: 'Bağcılar Çok Amaçlı Spor Salonu',
      isCompleted: true,
      matches: [
        { time: '10:00', title: '3.LÜK MAÇI', team1: 'SULTANBEYLİ ANAFARTALAR İHO', team2: 'ŞEHİT MUSTAFA KAYMAKÇI İHO', score: '3 - 0' },
        { time: '11:00', title: 'FİNAL MAÇI', team1: 'BAKIRKÖY ŞEHİT MUHAMMET AMBAR İHO', team2: 'BEYLİKDÜZÜ ŞEHİT ABDULLAH TAYYİP OLÇOK İHO', score: '3 - 4' }
      ]
    },
    {
      date: '08.05.2025',
      category: 'GENÇ ERKEK',
      venue: 'Bağcılar Çok Amaçlı Spor Salonu',
      isCompleted: true,
      matches: [
        { time: '12:00', title: '3.LÜK MAÇI', team1: 'FATİH UFSM AİHL', team2: 'YAVUZ BAHADIROĞLU AİHL', score: '7 - 2' },
        { time: '13:00', title: 'FİNAL MAÇI', team1: 'ÜSKÜDAR İTO MARMARA AİHL', team2: 'SARIYER YAŞAR DEDEMAN AİHL', score: '8 - 2' }
      ]
    }
  ];

  // --- KAZANANLARI HESAPLA ---
  const getWinners = () => {
    // Futsal
    const yildizErkekFinal = finalFutsalMatches[0].matches[1];
    const gencErkekFinal = finalFutsalMatches[1].matches[1];
    const yildizErkekWinner = yildizErkekFinal.score === '3 - 4' ? yildizErkekFinal.team2 : yildizErkekFinal.team1;
    const yildizErkekRunnerUp = yildizErkekFinal.score === '3 - 4' ? yildizErkekFinal.team1 : yildizErkekFinal.team2;
    const gencErkekWinner = gencErkekFinal.score === '8 - 2' ? gencErkekFinal.team1 : gencErkekFinal.team2;
    const gencErkekRunnerUp = gencErkekFinal.score === '8 - 2' ? gencErkekFinal.team2 : gencErkekFinal.team1;

    // Voleybol
    const yildizKizFinal = finalVolleyballMatches[0].matches[1];
    const gencKizFinal = finalVolleyballMatches[1].matches[1];
    const yildizKizWinner = yildizKizFinal.score === '2 - 0' ? yildizKizFinal.team1 : yildizKizFinal.team2;
    const yildizKizRunnerUp = yildizKizFinal.score === '2 - 0' ? yildizKizFinal.team2 : yildizKizFinal.team1;
    const gencKizWinner = gencKizFinal.score === '2 - 0' ? gencKizFinal.team1 : gencKizFinal.team2;
    const gencKizRunnerUp = gencKizFinal.score === '2 - 0' ? gencKizFinal.team2 : gencKizFinal.team1;

    return [
      { category: "YILDIZ ERKEK FUTSAL", winner: yildizErkekWinner, second: yildizErkekRunnerUp, third: "SULTANBEYLİ ANAFARTALAR İHO" },
      { category: "GENÇ ERKEK FUTSAL", winner: gencErkekWinner, second: gencErkekRunnerUp, third: "FATİH UFSM AİHL" },
      { category: "YILDIZ KIZ VOLEYBOL", winner: yildizKizWinner, second: yildizKizRunnerUp, third: "BAYRAMPAŞA MOBİL İHO" },
      { category: "GENÇ KIZ VOLEYBOL", winner: gencKizWinner, second: gencKizRunnerUp, third: "SİLİVRİ KIZ AİHL" },
    ];
  };

  const winners = getWinners();

  // --- BİLEŞENLER ---

  const MatchCard = ({ match, isCompleted }) => (
    <div className="group relative bg-white p-5 rounded-[2rem] border border-slate-100 shadow-[0_10px_30px_-10px_rgba(0,0,0,0.05)] hover:shadow-2xl hover:shadow-slate-200/50 transition-all duration-500 hover:-translate-y-1">
      
      {/* Üst Bilgi (Saat ve Etiket) */}
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center gap-2 text-slate-500 text-sm font-bold bg-slate-50 px-3 py-1 rounded-full border border-slate-200">
            <Clock size={14} />
            <span>{match.time}</span>
        </div>
        {match.title && (
            <span className={`text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-wider
                ${match.title.includes('FİNAL') ? 'bg-red-100 text-red-600' : 'bg-orange-100 text-orange-600'}
            `}>
                {match.title}
            </span>
        )}
      </div>

      {/* Takımlar ve Skor */}
      <div className="flex flex-col gap-4">
        {/* Takım 1 */}
        <div className="flex justify-between items-center">
             <span className="font-bold text-slate-800 text-sm sm:text-base leading-tight">{match.team1}</span>
             {isCompleted && (
                 <span className={`font-black text-xl ${match.score.split('-')[0].trim() > match.score.split('-')[1].trim() ? 'text-green-600' : 'text-slate-400'}`}>
                     {match.score.split('-')[0]}
                 </span>
             )}
        </div>

        {/* VS Ayracı (Skor yoksa) */}
        {!isCompleted && (
             <div className="flex justify-center -my-2">
                 <span className="text-xs font-bold text-slate-300 bg-slate-50 px-2 rounded-full">VS</span>
             </div>
        )}

        {/* Takım 2 */}
        <div className="flex justify-between items-center">
             <span className={`font-bold text-sm sm:text-base leading-tight ${match.team2.includes('BEKLENİYOR') ? 'text-red-400 italic' : 'text-slate-800'}`}>
                 {match.team2}
             </span>
             {isCompleted && (
                 <span className={`font-black text-xl ${match.score.split('-')[1].trim() > match.score.split('-')[0].trim() ? 'text-green-600' : 'text-slate-400'}`}>
                     {match.score.split('-')[1]}
                 </span>
             )}
        </div>
      </div>
    </div>
  );

  const SectionHeader = ({ title, icon }) => (
      <div className="flex items-center gap-3 mb-8 pl-2">
         <div className="w-12 h-12 rounded-2xl bg-red-600 flex items-center justify-center text-white shadow-lg shadow-red-500/30">
            {icon}
         </div>
         <h2 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight uppercase">
            {title}
         </h2>
      </div>
  );

  return (
    <div className="py-44 md:py-24 bg-[#FDFBF7] relative overflow-hidden font-sans selection:bg-red-100 selection:text-red-900 mt-10">
      
      {/* --- ARKA PLAN EFEKTLERİ --- */}
      <div className="absolute inset-0 pointer-events-none opacity-30">
        <div className="absolute top-0 left-1/4 w-px h-full bg-slate-200/60"></div>
        <div className="absolute top-0 left-2/4 w-px h-full bg-slate-200/60"></div>
        <div className="absolute top-0 left-3/4 w-px h-full bg-slate-200/60"></div>
      </div>
      <div className="absolute top-20 right-0 w-[500px] h-[500px] bg-red-600/5 rounded-full blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-blue-600/5 rounded-full blur-[100px] pointer-events-none"></div>

      <div className="container mx-auto px-6 relative z-10">
        
        {/* --- BAŞLIK ALANI --- */}
        <div className="text-center mb-16 max-w-4xl mx-auto">
            <h1 className="text-5xl md:text-7xl font-black text-slate-900 tracking-tight leading-[0.9] mb-6">
                Turnuva <br/>
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-600 to-red-400">
                    Finalleri
                </span>
            </h1>
            <p className="text-slate-500 text-lg font-medium max-w-2xl mx-auto">
                2025 Sezonu İmam Hatip Spor Oyunları final müsabakaları ve şampiyonları.
            </p>
        </div>

        {/* --- ŞAMPİYONLAR BÖLÜMÜ --- */}
        <div className="mb-24">
            <div className="flex items-center justify-center gap-3 mb-10">
                 <Trophy className="text-yellow-500 w-8 h-8 animate-bounce" />
                 <h2 className="text-3xl font-black text-slate-900 uppercase">2025 Şampiyonları</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {winners.map((item, index) => (
                    <div key={index} className="group relative bg-white p-6 rounded-[2.5rem] border border-slate-100 shadow-xl shadow-slate-200/50 overflow-hidden hover:-translate-y-2 transition-transform duration-500">
                        {/* Kategori Etiketi */}
                        <div className="absolute top-0 left-0 bg-slate-900 text-white px-6 py-2 rounded-br-[2rem] font-bold text-xs tracking-widest uppercase">
                            {item.category}
                        </div>

                        <div className="mt-8 flex flex-col gap-6">
                            {/* Şampiyon */}
                            <div className="flex items-center gap-4 bg-yellow-50 p-4 rounded-[2rem] border border-yellow-100">
                                <div className="w-12 h-12 rounded-full bg-yellow-400 text-yellow-900 flex items-center justify-center font-black text-xl shadow-md shrink-0">
                                    1
                                </div>
                                <div>
                                    <span className="block text-xs font-bold text-yellow-600 uppercase mb-0.5">Şampiyon</span>
                                    <h3 className="font-black text-slate-900 leading-tight">{item.winner}</h3>
                                </div>
                                <Trophy className="ml-auto text-yellow-400 w-8 h-8 opacity-50" />
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                {/* 2. Olan */}
                                <div className="flex items-center gap-3 bg-slate-50 p-3 rounded-[1.5rem] border border-slate-100">
                                    <div className="w-8 h-8 rounded-full bg-slate-300 text-slate-700 flex items-center justify-center font-bold text-sm shrink-0">2</div>
                                    <div>
                                        <span className="block text-[10px] font-bold text-slate-400 uppercase">İkinci</span>
                                        <h4 className="font-bold text-slate-800 text-sm leading-tight line-clamp-2">{item.second}</h4>
                                    </div>
                                </div>
                                {/* 3. Olan */}
                                <div className="flex items-center gap-3 bg-orange-50 p-3 rounded-[1.5rem] border border-orange-100">
                                    <div className="w-8 h-8 rounded-full bg-orange-300 text-orange-800 flex items-center justify-center font-bold text-sm shrink-0">3</div>
                                    <div>
                                        <span className="block text-[10px] font-bold text-orange-400 uppercase">Üçüncü</span>
                                        <h4 className="font-bold text-slate-800 text-sm leading-tight line-clamp-2">{item.third}</h4>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>

        {/* --- FUTSAL BÖLÜMÜ --- */}
        <div className="mb-24">
            <SectionHeader title="Futsal Müsabakaları" icon={<Goal size={24} />} />
            
            <div className="space-y-12">
                {[...pastFutsalMatches, ...finalFutsalMatches].map((matchDay, idx) => (
                    <div key={idx} className="relative pl-4 border-l-2 border-slate-200">
                         {/* Tarih ve Yer Başlığı */}
                         <div className="mb-6">
                             <div className="flex flex-wrap items-center gap-3 mb-2">
                                <span className="text-xl font-bold text-slate-800">{matchDay.category}</span>
                                <span className="bg-red-600 text-white px-3 py-1 rounded-full text-xs font-bold">
                                    {matchDay.matches.some(m => m.title?.includes('FİNAL')) ? 'FİNAL ETABI' : 'YARI FİNAL'}
                                </span>
                             </div>
                             <div className="flex flex-wrap items-center gap-4 text-sm font-medium text-slate-500">
                                 <div className="flex items-center gap-1">
                                     <Calendar size={16} className="text-red-500"/>
                                     {matchDay.date}
                                 </div>
                                 <div className="flex items-center gap-1">
                                     <MapPin size={16} className="text-red-500"/>
                                     {matchDay.venue}
                                 </div>
                             </div>
                         </div>

                         <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                             {matchDay.matches.map((match, mIdx) => (
                                 <MatchCard key={mIdx} match={match} isCompleted={matchDay.isCompleted} />
                             ))}
                         </div>
                    </div>
                ))}
            </div>
        </div>

        {/* --- VOLEYBOL BÖLÜMÜ --- */}
        <div className="mb-12">
            <SectionHeader title="Voleybol Müsabakaları" icon={<Activity size={24} />} />
            
            <div className="space-y-12">
                {[...pastVolleyballMatches, ...finalVolleyballMatches].map((matchDay, idx) => (
                    <div key={idx} className="relative pl-4 border-l-2 border-slate-200">
                         <div className="mb-6">
                             <div className="flex flex-wrap items-center gap-3 mb-2">
                                <span className="text-xl font-bold text-slate-800">{matchDay.category}</span>
                                <span className="bg-red-600 text-white px-3 py-1 rounded-full text-xs font-bold">
                                    {matchDay.matches.some(m => m.title?.includes('FİNAL')) ? 'FİNAL ETABI' : 'YARI FİNAL'}
                                </span>
                             </div>
                             <div className="flex flex-wrap items-center gap-4 text-sm font-medium text-slate-500">
                                 <div className="flex items-center gap-1">
                                     <Calendar size={16} className="text-red-500"/>
                                     {matchDay.date}
                                 </div>
                                 <div className="flex items-center gap-1">
                                     <MapPin size={16} className="text-red-500"/>
                                     {matchDay.venue}
                                 </div>
                             </div>
                         </div>

                         <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                             {matchDay.matches.map((match, mIdx) => (
                                 <MatchCard key={mIdx} match={match} isCompleted={matchDay.isCompleted} />
                             ))}
                         </div>
                    </div>
                ))}
            </div>
        </div>

      </div>
    </div>
  );
};

export default TournamentFinal;