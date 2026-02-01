import React, { useState } from 'react';

const PhotoTable = ({ photos = [], onDelete, onRefresh }) => {
  const [yearFilter, setYearFilter] = useState('all');
  
  // API URL'yi ortam değişkenlerinden al
  const API_URL = import.meta.env.PROD ? '' : 'http://localhost:9561';
  
  // Photos dizisi tanımlı olduğundan emin ol
  const safePhotos = Array.isArray(photos) ? photos : [];
  
  // Mevcut yılları çıkar
  const availableYears = [...new Set(safePhotos.map(photo => photo.year))].sort().reverse();
  
  // Yıl filtresine göre fotoğrafları filtrele
  const filteredPhotos = yearFilter === 'all'
    ? safePhotos
    : safePhotos.filter(photo => photo.year === yearFilter);

  if (!safePhotos || safePhotos.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        <p className="mb-4">Gösterilecek fotoğraf bulunamadı.</p>
        <button 
          onClick={onRefresh}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Yenile
        </button>
      </div>
    );
  }

  const confirmDelete = (photo) => {
    if (window.confirm(`"${photo.title}" fotoğrafını silmek istediğinize emin misiniz?`)) {
      onDelete(photo.id);
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-semibold">Fotoğraf Listesi</h3>
        <div className="flex items-center space-x-2">
          <select
            className="border rounded p-2"
            value={yearFilter}
            onChange={(e) => setYearFilter(e.target.value)}
          >
            <option value="all">Tüm Yıllar</option>
            {availableYears.map(year => (
              <option key={year} value={year}>{year}</option>
            ))}
          </select>
          <button 
            onClick={onRefresh}
            className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
          >
            Yenile
          </button>
        </div>
      </div>
      
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white">
          <thead>
            <tr>
              <th className="py-2 px-4 border-b text-left">ID</th>
              <th className="py-2 px-4 border-b text-left">Önizleme</th>
              <th className="py-2 px-4 border-b text-left">Başlık</th>
              <th className="py-2 px-4 border-b text-left">Yıl</th>
              <th className="py-2 px-4 border-b text-left">İşlemler</th>
            </tr>
          </thead>
          <tbody>
            {filteredPhotos.map(photo => (
              <tr key={photo.id}>
                <td className="py-2 px-4 border-b">{photo.id}</td>
                <td className="py-2 px-4 border-b">
                  <img 
                    src={`${API_URL}${photo.url}`} 
                    alt={photo.title || 'Fotoğraf'}
                    className="w-16 h-16 object-cover rounded"
                    onError={(e) => {
                      console.error(`Resim yüklenemedi: ${photo.url}`);
                      e.target.src = '/placeholder.jpg'; // Yüklenemezse yedek görsel
                    }}
                  />
                </td>
                <td className="py-2 px-4 border-b">{photo.title || 'İsimsiz'}</td>
                <td className="py-2 px-4 border-b">{photo.year || '-'}</td>
                <td className="py-2 px-4 border-b">
                  <button
                    onClick={() => confirmDelete(photo)}
                    className="text-red-500 hover:text-red-700"
                  >
                    Sil
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default PhotoTable;