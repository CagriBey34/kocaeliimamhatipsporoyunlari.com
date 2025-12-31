// src/components/Tournament/MatchCard.jsx
import React from 'react';
import { Calendar, Clock, MapPin, Trophy, Minus } from 'lucide-react';

const MatchCard = ({ match }) => {
  // --- MANTIK KISMI (Aynen Korundu) ---
  
  // Tarih ve saat formatlaması için yardımcı fonksiyon
  const formatMatchTime = (isoDateString) => {
    if (!isoDateString) return { date: '', time: '' };
    
    const matchDate = new Date(isoDateString);
    
    const year = matchDate.getUTCFullYear();
    const month = String(matchDate.getUTCMonth() + 1).padStart(2, '0');
    const day = String(matchDate.getUTCDate()).padStart(2, '0');
    const hours = String(matchDate.getUTCHours()).padStart(2, '0');
    const minutes = String(matchDate.getUTCMinutes()).padStart(2, '0');
    
    const formattedDate = `${day}.${month}.${year}`;
    const formattedTime = `${hours}:${minutes}`;
    
    return { date: formattedDate, time: formattedTime };
  };
  
  const { date: formattedDate, time: formattedTime } = formatMatchTime(match.match_time);
  
  const now = new Date();
  const matchTimeUTC = new Date(match.match_time);
  const isUpcoming = !match.is_finished && matchTimeUTC > now;
  const isLive = !match.is_finished && matchTimeUTC <= now;

  // --- TASARIM YARDIMCILARI ---

  // Duruma göre etiket rengi ve metni
  const getStatusBadge = () => {
    if (match.is_finished) {
      return { text: "Tamamlandı", classes: "bg-slate-100 text-slate-500" };
    } else if (isLive) {
      return { text: "Canlı", classes: "bg-red-100 text-red-600 animate-pulse" };
    } else {
      return { text: "Başlamadı", classes: "bg-blue-50 text-blue-600" };
    }
  };

  const status = getStatusBadge();

  return (
    <div className="group relative bg-white p-6 rounded-[2.5rem] border border-slate-100 shadow-[0_10px_30px_-10px_rgba(0,0,0,0.05)] hover:shadow-2xl hover:shadow-slate-200/50 transition-all duration-500 hover:-translate-y-2 h-full flex flex-col">
      
      {/* Üst Bilgi: Tarih, Saat ve Durum */}
      <div className="flex justify-between items-start mb-6">
        <div className="flex flex-col gap-1">
            <div className="flex items-center gap-2 text-slate-500 text-xs font-bold uppercase tracking-wider">
                <Calendar size={14} className="text-red-500" />
                <span>{formattedDate}</span>
            </div>
            <div className="flex items-center gap-2 text-slate-900 font-black text-xl">
                <Clock size={18} className="text-slate-400" />
                <span>{formattedTime}</span>
            </div>
        </div>
        
        <div className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border border-transparent ${status.classes}`}>
            {status.text}
        </div>
      </div>

      {/* Takımlar ve Skor Alanı */}
      <div className="flex-1 flex flex-col justify-center gap-4 relative">
        
        {/* Dekoratif Dikey Çizgi (Sol tarafta) */}
        <div className="absolute left-6 top-2 bottom-2 w-0.5 bg-slate-100 rounded-full"></div>

        {/* Takım 1 */}
        <div className="flex items-center justify-between pl-4 relative z-10">
            <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-red-500 to-red-600 text-white flex items-center justify-center font-black text-xl shadow-lg shadow-red-500/20 shrink-0 transform group-hover:scale-110 transition-transform duration-500">
                    {match.team1_name.charAt(0)}
                </div>
                <span className="font-bold text-slate-800 text-lg leading-tight">
                    {match.team1_name}
                </span>
            </div>
            {match.is_finished ? (
                <span className={`text-2xl font-black ${Number(match.team1_score) > Number(match.team2_score) ? 'text-slate-900' : 'text-slate-400'}`}>
                    {match.team1_score}
                </span>
            ) : null}
        </div>

        {/* VS Ayracı (Eğer maç bitmediyse) */}
        {!match.is_finished && (
            <div className="pl-16 flex items-center gap-2 opacity-50">
                 <span className="text-xs font-black text-slate-300 bg-slate-50 px-2 py-1 rounded-md">VS</span>
            </div>
        )}

        {/* Takım 2 */}
        <div className="flex items-center justify-between pl-4 relative z-10">
            <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-white border-2 border-slate-100 text-slate-700 flex items-center justify-center font-black text-xl shrink-0 transform group-hover:scale-110 transition-transform duration-500">
                    {match.team2_name.charAt(0)}
                </div>
                <span className="font-bold text-slate-800 text-lg leading-tight">
                    {match.team2_name}
                </span>
            </div>
            {match.is_finished ? (
                <span className={`text-2xl font-black ${Number(match.team2_score) > Number(match.team1_score) ? 'text-slate-900' : 'text-slate-400'}`}>
                    {match.team2_score}
                </span>
            ) : null}
        </div>

      </div>

      {/* Alt Bilgi: Lokasyon  */}
      {match.location && (
        <div className="mt-6 pt-4 border-t border-slate-50 flex items-center justify-center text-slate-400 text-sm font-bold group-hover:text-red-500 transition-colors">
            <MapPin size={16} className="mr-2" />
            <span className="truncate max-w-[250px]">{match.location}</span>
        </div>
      )}

    </div>
  );
};

export default MatchCard;