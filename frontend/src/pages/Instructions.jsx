import { useState } from 'react';
import { 
  Download, 
  Search, 
  FileText, 
  Trophy, 
  Target, 
  Swords, 
  Crown, 
  Activity, 
  Dumbbell, 
  Medal 
} from 'lucide-react';

const Instructions = () => {
  const [searchTerm, setSearchTerm] = useState('');
  
 const [talimatnameler] = useState([
    {
      id: 1,
      title: "Masa Tenisi",
      icon: "tennis",
      color: "text-orange-600",
      bg: "bg-orange-50",
      file: "MasaTenisiTurnuvası.pdf",
      description: "Masa tenisi turnuvalarının organizasyonu, maç yönetimi, ekipman gereksinimleri ve hakem kuralları."
    },
    {
      id: 2,
      title: "Karate",
      icon: "karate",
      color: "text-slate-700",
      bg: "bg-slate-100",
      file: "Karate Talimatnamesi-1.pdf",
      description: "Kata ve Kumite disiplinlerinin teknik kuralları, tatami yerleşimi, yasaklı hareketler ve hakem komutları."
    },
    {
      id: 3,
      title: "Dart",
      icon: "dart",
      color: "text-emerald-600",
      bg: "bg-emerald-50",
      file: "SPOROYUNLARIDARTTALİMATNAMESİ.pdf",
      description: "Dart tahtası standartları, atış mesafeleri, oyun formatları (501/301) ve teknik kural detayları."
    },
  ]);

  const handleDownload = (file) => {
    try {
      const fileUrl = `/assets/talimatname/${file}`;
      const link = document.createElement('a');
      link.href = fileUrl;
      link.setAttribute('download', file);
      link.setAttribute('target', '_blank');
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error('İndirme hatası:', error);
      alert('Dosya indirilemedi. Lütfen daha sonra tekrar deneyin.');
    }
  };

const getIcon = (iconName, className) => {
    switch (iconName.toLowerCase()) {
      case 'tennis': return <Activity className={className} />;
      case 'combat': return <Swords className={className} />;
      case 'chess': return <Crown className={className} />;
      case 'badminton': return <Activity className={className} />;
      case 'mangala': return <Target className={className} />;
      case 'karate': return <Swords className={className} />;
      case 'dart': return <Target className={className} />;
      case 'armwrestling': return <Dumbbell className={className} />;
      case 'archery': return <Target className={className} />; 
      case 'football': return <Trophy className={className} />;
      case 'volleyball': return <Medal className={className} />;
      case 'fitness': return <Dumbbell className={className} />;
      default: return <FileText className={className} />;
    }
  };

  const filteredTalimatnameler = talimatnameler.filter(item =>
    item.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="py-24 md:py-44 bg-[#FDFBF7] relative overflow-hidden font-sans selection:bg-red-100 selection:text-red-900 mt-10">
      
      {/* --- ARKA PLAN EFEKTLERİ --- */}
      <div className="absolute inset-0 pointer-events-none opacity-30">
        <div className="absolute top-0 left-1/4 w-px h-full bg-slate-200/60"></div>
        <div className="absolute top-0 left-2/4 w-px h-full bg-slate-200/60"></div>
        <div className="absolute top-0 left-3/4 w-px h-full bg-slate-200/60"></div>
      </div>
      
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-red-600/5 rounded-full blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-blue-600/5 rounded-full blur-[100px] pointer-events-none"></div>

      <div className="container mx-auto px-6 relative z-10">
        
        {/* --- BAŞLIK ALANI --- */}
        <div className="text-center mb-12 max-w-3xl mx-auto">
            <h1 className="text-5xl md:text-7xl font-black text-slate-900 tracking-tight leading-[0.9] mb-8">
              Talimatnameler & <br/>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-600 to-red-400">
                Kurallar
              </span>
            </h1>
            
            <p className="text-slate-500 text-lg font-medium max-w-xl mx-auto mb-10">
              Branşlara özel teknik talimatnameleri, yarışma kurallarını ve resmi belgeleri buradan inceleyip indirebilirsiniz.
            </p>

            {/* --- MODERN ARAMA ÇUBUĞU --- */}
            <div className="relative max-w-lg mx-auto group">
              <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-slate-400 group-focus-within:text-red-600 transition-colors" />
              </div>
              <input 
                type="text" 
                placeholder="Branş veya talimatname ara..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="block w-full pl-12 pr-4 py-4 bg-white border border-slate-200 rounded-full text-slate-900 placeholder-slate-400 focus:outline-none focus:border-red-300 focus:ring-4 focus:ring-red-500/10 shadow-lg shadow-slate-200/50 transition-all duration-300"
              />
            </div>
        </div>

        {/* --- CONTENT GRID --- */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-16">
          {filteredTalimatnameler.map((item) => (
            <div
              key={item.id}
              className="group relative bg-white p-2 rounded-[2.5rem] border border-slate-100 shadow-[0_10px_30px_-10px_rgba(0,0,0,0.05)] hover:shadow-2xl hover:shadow-slate-200/50 transition-all duration-500 hover:-translate-y-2 flex flex-col h-full"
            >
               <div className="flex flex-col h-full p-6 pb-2">
                  {/* Header: Icon & Badge */}
                  <div className="flex items-start justify-between mb-6">
                    <div className={`w-16 h-16 rounded-2xl flex items-center justify-center transition-transform duration-500 group-hover:scale-110 group-hover:rotate-3 ${item.bg} ${item.color}`}>
                      {getIcon(item.icon, "w-8 h-8")}
                    </div>
                    <span className="px-3 py-1 bg-slate-50 border border-slate-100 rounded-full text-[10px] font-bold text-slate-400 uppercase tracking-wide">
                        PDF
                    </span>
                  </div>
                  
                  {/* Content */}
                  <div className="flex-1">
                    <h3 className="text-2xl font-black text-slate-900 mb-3 group-hover:text-red-600 transition-colors">
                      {item.title}
                    </h3>
                    <p className="text-slate-500 text-sm leading-relaxed font-medium">
                        {item.description}
                    </p>
                  </div>
                  
                  {/* Download Action */}
                  <div className="mt-8 pt-6 border-t border-slate-50">
                    <button
                      onClick={() => handleDownload(item.file)}
                      className="w-full flex items-center justify-between group/btn cursor-pointer"
                    >
                      <span className="text-sm font-bold text-slate-900 group-hover/btn:text-red-600 transition-colors">
                        Talimatnameyi İndir
                      </span>
                      <div className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 group-hover/btn:bg-red-600 group-hover/btn:text-white transition-all duration-300 group-hover/btn:scale-110">
                          <Download size={18} />
                      </div>
                    </button>
                  </div>
               </div>
            </div>
          ))}
        </div>

        {/* --- BOŞ SONUÇ DURUMU --- */}
        {filteredTalimatnameler.length === 0 && (
          <div className="text-center py-24">
            <div className="inline-block p-6 rounded-full bg-white border border-slate-100 shadow-xl mb-6">
                <Search className="text-slate-300 w-12 h-12" />
            </div>
            <h3 className="text-xl font-black text-slate-900 mb-2">Sonuç Bulunamadı</h3>
            <p className="text-slate-500">
                "<span className="font-bold text-slate-900">{searchTerm}</span>" araması için herhangi bir talimatname bulunamadı.
            </p>
          </div>
        )}

      </div>
    </div>
  );
};

export default Instructions;