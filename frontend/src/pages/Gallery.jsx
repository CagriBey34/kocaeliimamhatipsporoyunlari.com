import { useState, useEffect } from 'react';
import { Download, ExternalLink, Image as ImageIcon, Loader2 } from 'lucide-react';
import { photoService } from '../services/api';

const Gallery = () => {
  // --- STATE VE MANTIK (Aynen Korundu) ---
  const [activeYear, setActiveYear] = useState('2024');
  const [years, setYears] = useState(['2024', '2023', '2022', '2021']);
  const [photos, setPhotos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchPhotos();
  }, [activeYear]);

  const fetchPhotos = async () => {
    try {
      setLoading(true);
      const data = await photoService.getPhotosByYear(activeYear);

      // Konsol logları debugging için faydalı olabilir, tutuyoruz
      console.log('API yanıtı:', data);

      setPhotos(data.photos || []);
      setLoading(false);
    } catch (error) {
      console.error('Fotoğraflar yüklenirken hata:', error);
      setError('Fotoğraflar yüklenemedi');
      setLoading(false);
    }
  };

  const handleDownload = (photoId, photoUrl) => {
    console.log(`Fotoğraf indiriliyor: ${photoId}`);
    window.open(getPhotoUrl(photoUrl), '_blank');
  };

  const getPhotoUrl = (photoPath) => {
    const baseUrl = import.meta.env.PROD ? '' : 'http://localhost:8561';
    // URL kontrolü
    if (!photoPath) return '';
    return `${baseUrl}${photoPath.startsWith('/') ? photoPath : `/${photoPath}`}`;
  };

  // Yedek veri (API boş dönerse veya hata verirse görsel düzeni görmek için)
  const examplePhotos = [
    { id: 1, year: '2024', url: '', title: 'Voleybol Takımı' },
    { id: 2, year: '2024', url: '', title: 'Tenis Müsabakası' },
    { id: 3, year: '2024', url: '', title: 'Taekwondo Gösterisi' },
    { id: 4, year: '2024', url: '', title: 'Okçuluk Finali' },
    { id: 5, year: '2024', url: '', title: 'Dart Turnuvası' },
    { id: 6, year: '2024', url: '', title: 'Basketbol Maçı' },
  ];

  // Görüntülenecek fotoğrafları belirle (API'den gelmezse örnekleri göster)
  const displayPhotos = photos.length > 0 ? photos : examplePhotos.filter(p => p.year === activeYear);

  // --- TASARIM (Yeni Tasarıma Dönüştürüldü) ---
  return (
    <div className="py-24 md:py-44 bg-[#FDFBF7] relative overflow-hidden font-sans selection:bg-red-100 selection:text-red-900 mt-10">
      
      {/* Arka Plan Efektleri */}
      <div className="absolute inset-0 pointer-events-none opacity-30">
        <div className="absolute top-0 left-1/4 w-px h-full bg-slate-200/60"></div>
        <div className="absolute top-0 left-2/4 w-px h-full bg-slate-200/60"></div>
        <div className="absolute top-0 left-3/4 w-px h-full bg-slate-200/60"></div>
      </div>
      
      <div className="absolute top-20 right-0 w-[500px] h-[500px] bg-red-600/5 rounded-full blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-blue-600/5 rounded-full blur-[100px] pointer-events-none"></div>

      <div className="container mx-auto px-6 relative z-10">
        
        {/* Başlık Alanı */}
        <div className="text-center mb-12">
            <h1 className="text-5xl md:text-7xl font-black text-slate-900 tracking-tight leading-[0.9] mb-6">
                Unutulmaz <br/>
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-600 to-red-400">Anlar</span>
            </h1>
            
            <p className="text-slate-500 text-lg font-medium max-w-2xl mx-auto leading-relaxed">
                Sahadaki mücadelenin, tribündeki coşkunun ve zaferin en güzel kareleri. 
                Seçilmiş özel albümümüzü inceleyin.
            </p>
        </div>

        {/* Google Drive Linki */}
        <div className="max-w-xl mx-auto mb-16">
          <a
            href="https://drive.google.com/drive/folders/1xthhsCAXAdEAj2elHJQdvD5hA3dtyJ9B"
            target="_blank"
            rel="noopener noreferrer"
            className="group flex items-center justify-between p-1 pl-6 bg-white border border-slate-200 rounded-full hover:border-red-200 hover:shadow-xl hover:shadow-red-500/10 transition-all duration-300"
          >
            <span className="font-bold text-slate-700 group-hover:text-red-600 transition-colors text-sm sm:text-base">
              16. İmam Hatip Spor Oyunları Fotoğraf Arşivi
            </span>
            <div className="w-12 h-12 bg-red-50 rounded-full flex items-center justify-center text-red-600 group-hover:bg-red-600 group-hover:text-white transition-all duration-300 shrink-0">
                <ExternalLink size={20} />
            </div>
          </a>
        </div>

        {/* Yıl Filtreleri */}
        <div className="flex flex-wrap justify-center gap-4 mb-16">
          {years.map((year) => (
            <button
              key={year}
              onClick={() => setActiveYear(year)}
              className={`
                px-8 py-3 rounded-full font-bold text-sm tracking-wide transition-all duration-300 border
                ${activeYear === year
                  ? 'bg-slate-900 text-white border-slate-900 shadow-lg shadow-slate-900/20 scale-105'
                  : 'bg-white text-slate-500 border-slate-200 hover:border-red-200 hover:text-red-600 hover:bg-red-50'
                }
              `}
            >
              {year}
            </button>
          ))}
        </div>

        {/* Galeri Grid */}
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <Loader2 className="w-12 h-12 text-red-600 animate-spin" />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {displayPhotos.map((photo) => (
              <div
                key={photo.id}
                className="group relative bg-white p-3 rounded-[2rem] border border-slate-100 shadow-sm hover:shadow-2xl hover:shadow-slate-200/50 hover:-translate-y-2 transition-all duration-500"
              >
                {/* Fotoğraf Alanı */}
                <div className="relative aspect-[4/3] rounded-[1.5rem] overflow-hidden bg-slate-100">
                  {/* Resim Varsa */}
                  {photo.url ? (
                     <img
                       src={getPhotoUrl(photo.url)}
                       alt={photo.title || 'Galeri Fotoğrafı'}
                       className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                       onError={(e) => {
                         // Hata durumunda placeholder'ı göster
                         e.target.style.display = 'none'; 
                         e.target.nextSibling.style.display = 'flex'; 
                       }}
                     />
                  ) : null}
                  
                  {/* Resim Yoksa veya Yüklenmediyse Placeholder */}
                  <div className={`absolute inset-0 flex flex-col items-center justify-center bg-slate-50 text-slate-300 ${photo.url ? 'hidden' : 'flex'}`}>
                      <ImageIcon size={48} className="mb-2" />
                      <span className="text-xs font-bold uppercase tracking-widest">Görsel Yüklenmedi</span>
                  </div>

                  {/* Hover Overlay (Buzlu Cam Efekti ve İndir Butonu) */}
                  <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-[2px] opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center z-10">
                    <button
                      onClick={() => handleDownload(photo.id, photo.url)}
                      className="transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300 flex items-center gap-3 bg-white text-slate-900 px-6 py-3 rounded-full font-bold hover:bg-red-600 hover:text-white shadow-xl cursor-pointer"
                    >
                      <Download size={18} />
                      <span>İndir</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Veri Yoksa Mesajı */}
        {!loading && displayPhotos.length === 0 && (
            <div className="text-center py-20">
                <div className="inline-block p-6 rounded-full bg-slate-50 mb-4">
                    <ImageIcon size={48} className="text-slate-300" />
                </div>
                <h3 className="text-xl font-bold text-slate-900">Bu yıla ait fotoğraf bulunamadı.</h3>
                <p className="text-slate-500">Lütfen diğer yılları kontrol ediniz.</p>
            </div>
        )}
        
      </div>
    </div>
  );
};

export default Gallery;