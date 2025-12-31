import React, { useState, useEffect } from 'react';
import { tournamentService } from '../services/api';
import MatchCard from '../components/Tournament/MatchCard';
import { 
    Trophy, 
    Calendar, 
    Filter, 
    AlertCircle, 
    Loader2, 
    ChevronDown, 
    Swords 
} from 'lucide-react';

const Tournament = () => {
    const [tournaments, setTournaments] = useState([]);
    const [selectedTournament, setSelectedTournament] = useState(null);
    const [tournamentMatches, setTournamentMatches] = useState({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // --- 1. Turnuvaları Çek ---
    useEffect(() => {
        const fetchTournaments = async () => {
            try {
                setLoading(true);
                const data = await tournamentService.getAllTournaments();
                const tournamentsArray = Array.isArray(data) ? data : [];
                setTournaments(tournamentsArray);
                if (tournamentsArray.length > 0) {
                    setSelectedTournament(tournamentsArray[0].id);
                }
                setLoading(false);
            } catch (err) {
                console.error('Turnuvalar yüklenirken hata:', err);
                setError('Turnuva bilgileri yüklenemedi');
                setLoading(false);
            }
        };
        fetchTournaments();
    }, []);

    // --- 2. Seçilen Turnuvanın Maçlarını Çek ---
    useEffect(() => {
        if (!selectedTournament) return;
        const fetchTournamentMatches = async () => {
            try {
                setLoading(true);
                const data = await tournamentService.getTournamentMatches(selectedTournament);
                setTournamentMatches(data);
                setLoading(false);
            } catch (err) {
                console.error('Turnuva maçları yüklenirken hata:', err);
                setError('Turnuva maçları yüklenemedi');
                setLoading(false);
            }
        };
        fetchTournamentMatches();
    }, [selectedTournament]);

    const handleTournamentChange = (e) => {
        setSelectedTournament(Number(e.target.value));
    };

    return (
        <div className="py-24 md:py-44 bg-[#FDFBF7] relative overflow-hidden font-sans selection:bg-red-100 selection:text-red-900 mt-10">
            
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
                <div className="text-center mb-12 max-w-4xl mx-auto">
                    <h1 className="text-5xl md:text-7xl font-black text-slate-900 tracking-tight leading-[0.9] mb-6">
                        Mücadele & <br/>
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-600 to-red-400">Takvimi</span>
                    </h1>
                    <p className="text-slate-500 text-lg font-medium max-w-2xl mx-auto mb-10">
                        Seçili branşlardaki eşleşmeleri, maç programlarını ve sonuçları buradan anlık takip edebilirsiniz.
                    </p>

                    {/* --- KONTROLLER --- */}
                    <div className="max-w-3xl mx-auto bg-white p-2 rounded-[2.5rem] border border-slate-200 shadow-xl shadow-slate-200/50 flex flex-col md:flex-row items-center gap-3">
                        
                        {/* Dropdown (Seçim Kutusu) */}
                        <div className="relative w-full md:flex-1 group">
                            <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none">
                                <Filter className="h-5 w-5 text-slate-400 group-focus-within:text-red-600 transition-colors" />
                            </div>
                            <select
                                id="tournament-select"
                                value={selectedTournament || ''}
                                onChange={handleTournamentChange}
                                className="block w-full pl-12 pr-10 py-4 bg-slate-50 hover:bg-slate-100 border border-transparent rounded-[2rem] text-slate-900 text-sm font-bold focus:ring-4 focus:ring-red-500/10 focus:bg-white focus:outline-none transition-all appearance-none cursor-pointer"
                            >
                                {tournaments.map((tournament) => (
                                    <option key={tournament.id} value={tournament.id}>
                                        {tournament.name} ({tournament.sport_type})
                                    </option>
                                ))}
                            </select>
                            <div className="absolute inset-y-0 right-0 pr-5 flex items-center pointer-events-none">
                                <ChevronDown className="h-5 w-5 text-slate-400" />
                            </div>
                        </div>

                        {/* Finaller Butonu */}
                        <a 
                            href="/turnuva-final-asamasi"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="w-full md:w-auto px-8 py-4 bg-slate-900 text-white font-bold rounded-[2rem] hover:bg-red-600 transition-all duration-300 flex items-center justify-center gap-3 shadow-lg hover:shadow-red-600/30 group whitespace-nowrap"
                        >
                            <span>Finaller</span>
                            <Trophy className="w-5 h-5 text-yellow-400 group-hover:scale-110 transition-transform" />
                        </a>
                    </div>
                </div>

                {/* --- DURUM YÖNETİMİ --- */}
                
                {/* 1. Yükleniyor */}
                {loading && (
                    <div className="flex justify-center items-center h-64">
                        <Loader2 className="w-12 h-12 text-red-600 animate-spin" />
                    </div>
                )}

                {/* 2. Hata */}
                {!loading && error && (
                    <div className="max-w-2xl mx-auto text-center py-16">
                        <div className="inline-block p-4 rounded-full bg-red-50 mb-4">
                            <AlertCircle className="w-10 h-10 text-red-500" />
                        </div>
                        <h3 className="text-xl font-bold text-slate-900 mb-2">Veri Yüklenemedi</h3>
                        <p className="text-slate-500">{error}</p>
                    </div>
                )}

                {/* 3. Boş Veri (Turnuva Yok) */}
                {!loading && !error && tournaments.length === 0 && (
                    <div className="text-center py-24">
                        <div className="inline-block p-6 rounded-full bg-white border border-slate-100 shadow-xl mb-6">
                           <Calendar className="text-slate-300 w-12 h-12" />
                        </div>
                        <h3 className="text-xl font-black text-slate-900">Henüz Turnuva Bulunamadı</h3>
                        <p className="text-slate-500 mt-2">Şu an için listelenecek bir turnuva kaydı mevcut değil.</p>
                    </div>
                )}

                {/* 4. Maç Listesi */}
                {!loading && !error && tournaments.length > 0 && (
                    <div className="max-w-6xl mx-auto mt-16 space-y-16">
                        {Object.keys(tournamentMatches).length === 0 ? (
                            <div className="text-center py-24">
                                <div className="inline-block p-6 rounded-full bg-white border border-slate-100 shadow-xl mb-6">
                                   <Swords className="text-slate-300 w-12 h-12" />
                                </div>
                                <h3 className="text-xl font-black text-slate-900">Maç Programı Hazırlanıyor</h3>
                                <p className="text-slate-500 mt-2">Bu turnuva için henüz eşleşme veya maç kaydı girilmemiş.</p>
                            </div>
                        ) : (
                            <div className="space-y-12 animate-fadeIn">
                                {Object.entries(tournamentMatches)
                                    .sort((a, b) => a[1].order_num - b[1].order_num)
                                    .map(([stageName, stageData]) => (
                                        <div key={stageName}>
                                            
                                            {/* Aşama Başlığı (DerecePage Style) */}
                                            <div className="flex items-center gap-4 mb-8 pl-2">
                                                <div className="h-10 w-1.5 rounded-full bg-red-600"></div>
                                                <div className="flex items-baseline gap-3">
                                                    <h2 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight uppercase">
                                                        {stageName}
                                                    </h2>
                                                    <span className="text-xs font-bold text-slate-400 bg-white px-3 py-1 rounded-full border border-slate-200 shadow-sm">
                                                        {stageData.matches.length} Maç
                                                    </span>
                                                </div>
                                            </div>

                                            {/* Maç Kartları Grid */}
                                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                                {stageData.matches.map(match => (
                                                    <div 
                                                        key={match.id} 
                                                        className="transform transition-all duration-300 hover:-translate-y-2 group"
                                                    >
                                                        {/* MatchCard bileşeni dışarıdan stil kabul etmiyorsa bile 
                                                            bu wrapper div hover efektlerini yönetecektir. 
                                                            Eğer MatchCard'ın kendi border'ı varsa buradaki stil ezilebilir,
                                                            ama layout'u bozmaz.
                                                        */}
                                                        <MatchCard match={match} />
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    ))}
                            </div>
                        )}
                    </div>
                )}
            </div>

            <style jsx>{`
                @keyframes fadeIn {
                    from { opacity: 0; transform: translateY(10px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                .animate-fadeIn {
                    animation: fadeIn 0.5s ease-out forwards;
                }
            `}</style>
        </div>
    );
};

export default Tournament;