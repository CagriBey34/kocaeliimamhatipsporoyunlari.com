import { useState } from 'react';
import { FaDownload, FaSearch } from 'react-icons/fa';
import { GiScrollUnfurled, GiDart, GiBowArrow, GiTennisRacket, GiArtificialIntelligence } from 'react-icons/gi';
import { MdOutlineSportsKabaddi, MdSportsScore } from 'react-icons/md';
import { IoFootball } from 'react-icons/io5';
import { FaHandRock } from 'react-icons/fa';
import { GiShuttlecock, GiRunningShoe } from 'react-icons/gi';

const Instructions = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [talimatnameler, setTalimatnameler] = useState([
    {
      id: 4,
      title: "Masa Tenisi",
      icon: "tennis",
      color: "purple",
      file: "MasaTenisiTurnuvası.pdf",
      description: "Masa tenisi turnuvalarının organizasyonu, maç yönetimi, ekipman gereksinimleri ve hakem kuralları"
    },
    {
      id: 5,
      title: "Taekwondo",
      icon: "kabaddi",
      color: "orange",
      file: "taekwondotalimatnamesi.pdf",
      description: "Taekwondo müsabakalarının düzenlenmesi, müsabık kategorileri, teknik kurallar ve puanlama sistemi"
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
      
      console.log(`İndirme başlatıldı: ${file}`);
    } catch (error) {
      console.error('İndirme hatası:', error);
      alert('Dosya indirilemedi. Lütfen daha sonra tekrar deneyin.');
    }
  };

  const getIcon = (iconName) => {
    switch (iconName) {
      case 'scroll':
        return <GiScrollUnfurled size={36} className="text-blue-600" />;
      case 'dart':
        return <GiDart size={36} className="text-green-600" />;
      case 'bow':
        return <GiBowArrow size={36} className="text-red-600" />;
      case 'tennis':
        return <GiTennisRacket size={36} className="text-purple-600" />;
      case 'kabaddi':
        return <MdOutlineSportsKabaddi size={36} className="text-orange-600" />;
      case 'ai':
        return <GiArtificialIntelligence size={36} className="text-yellow-600" />;
      case 'football':
        return <IoFootball size={36} className="text-green-700" />;
      case 'hand':
        return <FaHandRock size={36} className="text-gray-700" />;
      case 'shuttle':
        return <GiShuttlecock size={36} className="text-teal-600" />;
      case 'running':
        return <GiRunningShoe size={36} className="text-pink-600" />;
      default:
        return <MdSportsScore size={36} className="text-blue-600" />;
    }
  };

  const getBgColor = (color) => {
    switch (color) {
      case 'blue': return 'bg-blue-50';
      case 'green': return 'bg-green-50';
      case 'red': return 'bg-red-50';
      case 'purple': return 'bg-purple-50';
      case 'orange': return 'bg-orange-50';
      case 'yellow': return 'bg-yellow-50';
      case 'gray': return 'bg-gray-50';
      case 'teal': return 'bg-teal-50';
      case 'pink': return 'bg-pink-50';
      default: return 'bg-blue-50';
    }
  };

  const filteredTalimatnameler = talimatnameler.filter(item =>
    item.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="w-full py-20 px-4 md:px-8 bg-gradient-to-b from-gray-50 to-white min-h-screen">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold text-gray-800 mb-6 relative inline-block">
            <span className="relative z-10">Spor Talimatnameleri</span>
            <span className="absolute -bottom-2 left-0 right-0 h-3 bg-red-200 opacity-50 z-0"></span>
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto mt-6">
            Branşlara özel talimatnameleri buradan indirebilirsiniz
          </p>
        </div>

        <div className="mb-10 max-w-md mx-auto">
          <div className="relative">
            <input
              type="text"
              placeholder="Talimatname ara..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-5 py-3 pr-12 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-red-300 shadow-sm"
            />
            <div className="absolute right-4 top-3 text-gray-400">
              <FaSearch />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredTalimatnameler.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-xl shadow-lg overflow-hidden transform transition-all duration-300 hover:shadow-2xl hover:-translate-y-2 flex flex-col h-full border border-gray-100"
            >
              <div className="p-6 flex-1 flex flex-col">
                <div className="flex items-center mb-6">
                  <div className={`w-16 h-16 rounded-full ${getBgColor(item.color)} flex items-center justify-center mr-4 transition-all duration-300 hover:scale-110 shadow-sm`}>
                    {getIcon(item.icon)}
                  </div>
                  <h3 className="text-xl font-semibold text-gray-800">
                    {item.title}
                  </h3>
                </div>
                
                <p className="text-gray-600 mb-6 flex-grow">{item.description}</p>
                
                <button
                  onClick={() => handleDownload(item.file)}
                  className="w-full py-3 px-4 bg-[#E84049] hover:from-red-600 hover:to-red-700 text-white rounded-lg transition-all duration-300 flex items-center justify-center group shadow-md"
                >
                  <span className="font-medium">Talimatnameyi İndir</span>
                  <FaDownload className="ml-2 w-5 h-5 transform group-hover:translate-y-1 transition-transform" />
                </button>
              </div>
            </div>
          ))}
        </div>

        {filteredTalimatnameler.length === 0 && (
          <div className="text-center py-12">
            <p className="text-xl text-gray-500">Aradığınız talimatname bulunamadı.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Instructions;