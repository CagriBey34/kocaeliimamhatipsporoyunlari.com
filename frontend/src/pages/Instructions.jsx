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
  
  // Liste 3 öğeye indirildi
  const [talimatnameler] = useState([
    {
      id: 1,
      title: "Masa Tenisi",
      icon: "tennis",
      color: "red",
      file: "MasaTenisiTurnuvası.pdf",
      description: "Masa tenisi turnuvalarının organizasyonu, maç yönetimi, ekipman gereksinimleri ve hakem kuralları."
    },
    {
      id: 2,
      title: "Taekwondo",
      icon: "combat", 
      color: "red",
      file: "taekwondotalimatnamesi.pdf",
      description: "Taekwondo müsabakalarının düzenlenmesi, müsabık kategorileri, teknik kurallar ve puanlama sistemi."
    },
    {
      id: 3,
      title: "Satranç",
      icon: "chess",
      color: "red",
      file: "SATRANÇTALİMATNAMESİ.pdf",
      description: "Satranç turnuvalarının genel işleyişi, hamle kuralları, süre kontrolleri ve eşlendirme sistemleri."
    }
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

  // Lucide-react ikon eşleştirmeleri
  const getIcon = (iconName) => {
    const className = "w-8 h-8"; // Standart ikon boyutu
    switch (iconName.toLowerCase()) {
      case 'tennis': return <Activity className={`text-orange-600 ${className}`} />;
      case 'combat': return <Swords className={`text-gray-700 ${className}`} />; // Taekwondo/Dövüş
      case 'chess': return <Crown className={`text-yellow-600 ${className}`} />; // Satranç (Kral Tacı)
      case 'archery': return <Target className={`text-red-600 ${className}`} />; 
      case 'football': return <Trophy className={`text-green-600 ${className}`} />;
      case 'volleyball': return <Medal className={`text-blue-500 ${className}`} />;
      case 'fitness': return <Dumbbell className={`text-purple-600 ${className}`} />;
      default: return <FileText className={`text-red-600 ${className}`} />;
    }
  };

  const filteredTalimatnameler = talimatnameler.filter(item =>
    item.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen font-sans">
      
      {/* --- HERO SECTION --- */}
      <div className="py-16 px-4 relative overflow-hidden">
        {/* Dekoratif Arka Plan */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-red-100 rounded-full filter blur-3xl opacity-30 -mr-20 -mt-20"></div>
        <div className="absolute bottom-0 left-0 w-72 h-72 bg-gray-100 rounded-full filter blur-3xl opacity-50 -ml-10 -mb-10"></div>

        <div className="max-w-7xl mx-auto relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <h1 className="text-4xl md:text-6xl font-extrabold mb-6 leading-tight text-gray-900">
              Talimatnameler & <br/>
              <span className="text-red-600 relative inline-block">
                Kurallar
                <svg className="absolute w-full h-3 -bottom-1 left-0 text-red-200 -z-10" viewBox="0 0 100 10" preserveAspectRatio="none">
                   <path d="M0 5 Q 50 10 100 5" stroke="currentColor" strokeWidth="8" fill="none" />
                </svg>
              </span>
            </h1>
            
            <p className="text-gray-600 text-lg mb-8 max-w-md leading-relaxed">
              Branşlara özel teknik talimatnameleri, yarışma kurallarını ve resmi belgeleri buradan inceleyip indirebilirsiniz.
            </p>
            
            {/* Search Bar */}
            <div className="relative max-w-lg group">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400 group-focus-within:text-red-500 transition-colors" />
              </div>
              <input 
                type="text" 
                placeholder="Branş veya talimatname ara..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-gray-50 border border-gray-200 text-gray-900 text-sm rounded-full py-4 pl-12 pr-4 focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 transition-all shadow-sm hover:shadow-md"
              />
            </div>
          </div>

          {/* Sağ Taraf - Dekoratif İkon Grid */}
          <div className="hidden lg:grid grid-cols-2 gap-4 opacity-80">
             <div className="space-y-4 mt-8">
                <div className="bg-white p-4 rounded-2xl shadow-lg border border-gray-100 flex items-center gap-3 animate-pulse-slow">
                    <div className="w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center text-blue-600">
                        <Activity className="w-6 h-6" />
                    </div>
                    <div className="h-2 bg-gray-100 rounded w-20"></div>
                </div>
                <div className="bg-white p-4 rounded-2xl shadow-lg border border-gray-100 flex items-center gap-3 transform translate-x-4">
                    <div className="w-12 h-12 rounded-full bg-red-50 flex items-center justify-center text-red-600">
                        <Target className="w-6 h-6" />
                    </div>
                    <div className="h-2 bg-gray-100 rounded w-24"></div>
                </div>
             </div>
             <div className="space-y-4">
                <div className="bg-white p-4 rounded-2xl shadow-lg border border-gray-100 flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-gray-50 flex items-center justify-center text-gray-800">
                        <Crown className="w-6 h-6" />
                    </div>
                    <div className="h-2 bg-gray-100 rounded w-16"></div>
                </div>
                <div className="bg-white p-4 rounded-2xl shadow-lg border border-gray-100 flex items-center gap-3 transform -translate-x-4">
                    <div className="w-12 h-12 rounded-full bg-green-50 flex items-center justify-center text-green-600">
                        <Trophy className="w-6 h-6" />
                    </div>
                    <div className="h-2 bg-gray-100 rounded w-20"></div>
                </div>
             </div>
          </div>
        </div>
      </div>

      {/* --- CONTENT GRID --- */}
      <div className="max-w-7xl mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredTalimatnameler.map((item) => (
            <div
              key={item.id}
              className="group bg-white rounded-2xl p-6 shadow-sm hover:shadow-xl border border-gray-100 transition-all duration-300 hover:-translate-y-1 flex flex-col h-full"
            >
              {/* Header & Icon */}
              <div className="flex items-start justify-between mb-6">
                <div className={`w-16 h-16 rounded-2xl flex items-center justify-center transition-transform duration-500 group-hover:scale-110 group-hover:rotate-3 shadow-sm
                    ${item.color === 'red' ? 'bg-red-50' : 'bg-gray-50'}`}
                >
                  {getIcon(item.icon)}
                </div>
                <span className="text-xs font-bold text-gray-400 bg-gray-50 px-2 py-1 rounded border border-gray-100">
                    PDF
                </span>
              </div>
              
              {/* Title */}
              <h3 className="text-xl font-bold text-gray-800 mb-3 group-hover:text-red-600 transition-colors">
                {item.title}
              </h3>
              
              {/* Description */}
              <p className="text-gray-500 text-sm leading-relaxed mb-8 flex-grow">
                  {item.description}
              </p>
              
              {/* Action Button */}
              <button
                onClick={() => handleDownload(item.file)}
                className="w-full py-3 px-4 bg-white border-2 border-red-600 text-red-600 rounded-xl font-bold transition-all duration-300 
                hover:bg-red-600 hover:text-white hover:shadow-lg hover:shadow-red-200 flex items-center justify-center group/btn"
              >
                <span>İndir</span>
                <Download className="ml-2 w-4 h-4 transform group-hover/btn:translate-y-1 transition-transform" />
              </button>
            </div>
          ))}
        </div>

        {filteredTalimatnameler.length === 0 && (
          <div className="text-center py-16 bg-white rounded-3xl border border-gray-100 shadow-sm">
            <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
                <Search className="text-gray-300 w-8 h-8" />
            </div>
            <h3 className="text-lg font-bold text-gray-900">Sonuç Bulunamadı</h3>
            <p className="text-gray-500 mt-2">"{searchTerm}" araması için herhangi bir talimatname bulunamadı.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Instructions;