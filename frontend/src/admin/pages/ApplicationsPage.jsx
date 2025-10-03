import React, { useState, useEffect } from 'react';
import { applicationService } from '../../services/applicationService';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import { FaFileExcel, FaSearch, FaFilter, FaTimes, FaEye, FaPhone, FaSchool, FaCalendar } from 'react-icons/fa';

const ApplicationsPage = () => {
  const [applications, setApplications] = useState([]);
  const [filteredApplications, setFilteredApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // Filter states
  const [filters, setFilters] = useState({
    search: '',
    side: '',
    district: '',
    schoolType: '',
    sport: '',
    dateFrom: '',
    dateTo: ''
  });

  // Modal state
  const [selectedApplication, setSelectedApplication] = useState(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    loadApplications();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [applications, filters]);

  const loadApplications = async () => {
    try {
      setLoading(true);
      const data = await applicationService.getAllApplications();
      setApplications(data);
    } catch (err) {
      setError('Başvurular yüklenirken hata oluştu');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = [...applications];

    // Search filter
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      filtered = filtered.filter(app => 
        app.school_name.toLowerCase().includes(searchLower) ||
        app.teacher_name.toLowerCase().includes(searchLower) ||
        app.teacher_phone.includes(searchLower)
      );
    }

    // Side filter
    if (filters.side) {
      filtered = filtered.filter(app => app.side === filters.side);
    }

    // District filter
    if (filters.district) {
      filtered = filtered.filter(app => app.district === filters.district);
    }

    // School type filter
    if (filters.schoolType) {
      filtered = filtered.filter(app => app.school_type === filters.schoolType);
    }

    // Sport filter
    if (filters.sport) {
      filtered = filtered.filter(app => 
        app.categories && app.categories.toLowerCase().includes(filters.sport.toLowerCase())
      );
    }

    // Date filters
    if (filters.dateFrom) {
      filtered = filtered.filter(app => 
        new Date(app.created_at) >= new Date(filters.dateFrom)
      );
    }

    if (filters.dateTo) {
      const dateTo = new Date(filters.dateTo);
      dateTo.setHours(23, 59, 59, 999);
      filtered = filtered.filter(app => 
        new Date(app.created_at) <= dateTo
      );
    }

    setFilteredApplications(filtered);
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const clearFilters = () => {
    setFilters({
      search: '',
      side: '',
      district: '',
      schoolType: '',
      sport: '',
      dateFrom: '',
      dateTo: ''
    });
  };

  const exportToExcel = () => {
    const exportData = filteredApplications.map(app => ({
      'Başvuru No': app.id,
      'Okul Adı': app.school_name,
      'İlçe': app.district,
      'Yaka': app.side,
      'Okul Tipi': app.school_type,
      'Öğretmen Adı': app.teacher_name,
      'Telefon': app.teacher_phone,
      'Kategoriler': app.categories || '-',
      'Notlar': app.notes || '-',
      'Başvuru Tarihi': new Date(app.created_at).toLocaleString('tr-TR')
    }));

    const ws = XLSX.utils.json_to_sheet(exportData);
    
    // Column widths
    ws['!cols'] = [
      { wch: 12 }, // Başvuru No
      { wch: 30 }, // Okul Adı
      { wch: 15 }, // İlçe
      { wch: 12 }, // Yaka
      { wch: 12 }, // Okul Tipi
      { wch: 25 }, // Öğretmen Adı
      { wch: 15 }, // Telefon
      { wch: 50 }, // Kategoriler
      { wch: 40 }, // Notlar
      { wch: 20 }  // Başvuru Tarihi
    ];

    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Başvurular');
    
    const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
    const data = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    
    const fileName = `basvurular_${new Date().toISOString().split('T')[0]}.xlsx`;
    saveAs(data, fileName);
  };

  const viewDetails = async (id) => {
    try {
      const details = await applicationService.getApplicationById(id);
      setSelectedApplication(details);
      setShowModal(true);
    } catch (err) {
      setError('Başvuru detayları yüklenirken hata oluştu');
      console.error(err);
    }
  };

  const getUniqueValues = (key) => {
    return [...new Set(applications.map(app => app[key]))].filter(Boolean).sort();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Yükleniyor...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-2">Başvuru Yönetimi</h1>
        <p className="text-gray-600">Toplam {filteredApplications.length} başvuru listeleniyor</p>
      </div>

      {error && (
        <div className="bg-red-50 border-l-4 border-red-400 p-4 mb-6">
          <p className="text-red-700">{error}</p>
        </div>
      )}

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-md p-4 sm:p-6 mb-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
            <FaFilter className="text-blue-600" />
            Filtreler
          </h2>
          <button
            onClick={clearFilters}
            className="text-sm text-gray-600 hover:text-gray-800 flex items-center gap-1"
          >
            <FaTimes /> Temizle
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {/* Search */}
          <div className="sm:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">Ara</label>
            <div className="relative">
              <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                name="search"
                value={filters.search}
                onChange={handleFilterChange}
                placeholder="Okul, öğretmen adı veya telefon..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Side */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Yaka</label>
            <select
              name="side"
              value={filters.side}
              onChange={handleFilterChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">Tümü</option>
              <option value="Anadolu">Anadolu</option>
              <option value="Avrupa">Avrupa</option>
            </select>
          </div>

          {/* District */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">İlçe</label>
            <select
              name="district"
              value={filters.district}
              onChange={handleFilterChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">Tümü</option>
              {getUniqueValues('district').map(district => (
                <option key={district} value={district}>{district}</option>
              ))}
            </select>
          </div>

          {/* School Type */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Okul Tipi</label>
            <select
              name="schoolType"
              value={filters.schoolType}
              onChange={handleFilterChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">Tümü</option>
              <option value="Orta">Ortaokul</option>
              <option value="Lise">Lise</option>
            </select>
          </div>

          {/* Sport */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Branş</label>
            <input
              type="text"
              name="sport"
              value={filters.sport}
              onChange={handleFilterChange}
              placeholder="Branş adı..."
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* Date From */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Başlangıç Tarihi</label>
            <input
              type="date"
              name="dateFrom"
              value={filters.dateFrom}
              onChange={handleFilterChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* Date To */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Bitiş Tarihi</label>
            <input
              type="date"
              name="dateTo"
              value={filters.dateTo}
              onChange={handleFilterChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>
      </div>

      {/* Export Button */}
      <div className="mb-6">
        <button
          onClick={exportToExcel}
          className="px-6 py-3 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2 shadow-md"
        >
          <FaFileExcel className="text-xl" />
          Excel'e Aktar ({filteredApplications.length} kayıt)
        </button>
      </div>

      {/* Applications Table */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">No</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Okul</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">İlçe/Yaka</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Öğretmen</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Telefon</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Kategoriler</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tarih</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">İşlem</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredApplications.length === 0 ? (
                <tr>
                  <td colSpan="8" className="px-4 py-8 text-center text-gray-500">
                    Başvuru bulunamadı
                  </td>
                </tr>
              ) : (
                filteredApplications.map((app) => (
                  <tr key={app.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-3 text-sm font-medium text-gray-900">#{app.id}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-start gap-2">
                        <FaSchool className="text-blue-600 mt-1 flex-shrink-0" />
                        <div>
                          <div className="text-sm font-medium text-gray-900">{app.school_name}</div>
                          <div className="text-xs text-gray-500">{app.school_type}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="text-sm text-gray-900">{app.district}</div>
                      <div className="text-xs text-gray-500">{app.side} Yakası</div>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-900">{app.teacher_name}</td>
                    <td className="px-4 py-3">
                      <a href={`tel:${app.teacher_phone}`} className="text-sm text-blue-600 hover:text-blue-800 flex items-center gap-1">
                        <FaPhone className="text-xs" />
                        {app.teacher_phone}
                      </a>
                    </td>
                    <td className="px-4 py-3">
                      <div className="text-xs text-gray-600 max-w-xs truncate">
                        {app.categories || '-'}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1 text-xs text-gray-500">
                        <FaCalendar />
                        {new Date(app.created_at).toLocaleDateString('tr-TR')}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <button
                        onClick={() => viewDetails(app.id)}
                        className="text-blue-600 hover:text-blue-800 font-medium text-sm flex items-center gap-1"
                      >
                        <FaEye /> Detay
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Detail Modal */}
      {showModal && selectedApplication && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-800">Başvuru Detayları</h2>
              <button
                onClick={() => setShowModal(false)}
                className="text-gray-400 hover:text-gray-600 text-2xl"
              >
                <FaTimes />
              </button>
            </div>

            <div className="p-6 space-y-6">
              {/* School Info */}
              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
                  <FaSchool className="text-blue-600" />
                  Okul Bilgileri
                </h3>
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div>
                    <span className="text-gray-600">Okul Adı:</span>
                    <p className="font-medium text-gray-900">{selectedApplication.school_name}</p>
                  </div>
                  <div>
                    <span className="text-gray-600">Okul Tipi:</span>
                    <p className="font-medium text-gray-900">{selectedApplication.school_type}</p>
                  </div>
                  <div>
                    <span className="text-gray-600">İlçe:</span>
                    <p className="font-medium text-gray-900">{selectedApplication.district}</p>
                  </div>
                  <div>
                    <span className="text-gray-600">Yaka:</span>
                    <p className="font-medium text-gray-900">{selectedApplication.side} Yakası</p>
                  </div>
                </div>
              </div>

              {/* Teacher Info */}
              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="font-semibold text-gray-800 mb-3">Öğretmen Bilgileri</h3>
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div>
                    <span className="text-gray-600">Ad Soyad:</span>
                    <p className="font-medium text-gray-900">{selectedApplication.teacher_name}</p>
                  </div>
                  <div>
                    <span className="text-gray-600">Telefon:</span>
                    <a href={`tel:${selectedApplication.teacher_phone}`} className="font-medium text-blue-600 hover:text-blue-800">
                      {selectedApplication.teacher_phone}
                    </a>
                  </div>
                </div>
              </div>

              {/* Categories */}
              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="font-semibold text-gray-800 mb-3">Seçili Kategoriler</h3>
                <div className="space-y-2">
                  {selectedApplication.categories && selectedApplication.categories.map((cat, index) => (
                    <div key={index} className="bg-white px-4 py-2 rounded-lg border border-gray-200">
                      <span className="font-medium text-gray-900">{cat.sport_branch}</span>
                      <span className="text-gray-600"> - {cat.age_category}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Notes */}
              {selectedApplication.notes && (
                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="font-semibold text-gray-800 mb-3">Notlar</h3>
                  <p className="text-sm text-gray-700 whitespace-pre-wrap">{selectedApplication.notes}</p>
                </div>
              )}

              {/* Date */}
              <div className="text-sm text-gray-600 pt-4 border-t">
                <span className="font-medium">Başvuru Tarihi:</span> {new Date(selectedApplication.created_at).toLocaleString('tr-TR')}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ApplicationsPage;