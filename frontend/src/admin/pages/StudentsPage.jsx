import React, { useState, useEffect } from 'react';
import { 
  getAllStudents, 
  getStatistics, 
  deleteStudent,
  exportAllToExcel,
  exportFilteredToExcel,
  updateStudent
} from '../../services/studentService';
import { toast } from 'react-toastify';
import {
  Users,
  School,
  Trophy,
  Filter,
  Download,
  Trash2,
  Edit,
  X,
  Search,
  ChevronDown,
  ChevronUp,
  FileSpreadsheet,
  BarChart3,
  RefreshCw,
  Eye,
  MapPin,
  Calendar,
  Phone,
  User,
  FileText
} from 'lucide-react';

const StudentsPage = () => {
  const [students, setStudents] = useState([]);
  const [statistics, setStatistics] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);

  // Filtreler
  const [filters, setFilters] = useState({
    side: '',
    district: '',
    school_id: '',
    sport_branch: '',
    age_category: '',
    weight_class: ''
  });

  // Arama
  const [searchQuery, setSearchQuery] = useState('');

  // İlçeler
  const districts = {
    Avrupa: [
      "Arnavutköy", "Avcılar", "Bağcılar", "Bahçelievler", "Bakırköy",
      "Başakşehir", "Bayrampaşa", "Beşiktaş", "Beylikdüzü", "Beyoğlu",
      "Büyükçekmece", "Çatalca", "Esenler", "Esenyurt", "Eyüpsultan",
      "Fatih", "Gaziosmanpaşa", "Güngören", "Kağıthane", "Küçükçekmece",
      "Sarıyer", "Silivri", "Sultangazi", "Şişli", "Zeytinburnu"
    ],
    Anadolu: [
      "Adalar", "Ataşehir", "Beykoz", "Çekmeköy", "Kadıköy",
      "Kartal", "Maltepe", "Pendik", "Sancaktepe", "Sultanbeyli",
      "Şile", "Tuzla", "Ümraniye", "Üsküdar"
    ]
  };

  // Branşlar (örnek - configurations'dan da çekilebilir)
  const branches = [
    "Taekwondo", "Güreş", "Karate", "Bilek Güreşi", "Masa Tenisi",
    "Satranç", "Badminton", "Mangala", "Dart", "Voleybol",
    "Geleneksel Türk Okçuluğu", "Atletizm", "3+3 Basketbol",
    "Bocce", "Futsal", "Ayak Tenisi", "Modern Okçuluk Klasik Yay"
  ];

  useEffect(() => {
    fetchStudents();
    fetchStatistics();
  }, []);

  const fetchStudents = async (customFilters = filters) => {
    setLoading(true);
    try {
      const data = await getAllStudents(customFilters);
      setStudents(data);
    } catch (error) {
      toast.error('Öğrenciler yüklenirken hata oluştu');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const fetchStatistics = async () => {
    try {
      const data = await getStatistics();
      setStatistics(data);
    } catch (error) {
      console.error('İstatistikler yüklenirken hata:', error);
    }
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const applyFilters = () => {
    fetchStudents(filters);
    toast.info('Filtreler uygulandı');
  };

  const clearFilters = () => {
    setFilters({
      side: '',
      district: '',
      school_id: '',
      sport_branch: '',
      age_category: '',
      weight_class: ''
    });
    fetchStudents({});
    toast.info('Filtreler temizlendi');
  };

  const handleDelete = async (studentId, studentName) => {
    if (!window.confirm(`${studentName} isimli öğrenciyi silmek istediğinize emin misiniz?`)) {
      return;
    }

    try {
      await deleteStudent(studentId);
      toast.success('Öğrenci silindi');
      fetchStudents();
      fetchStatistics();
    } catch (error) {
      toast.error('Öğrenci silinirken hata oluştu');
      console.error(error);
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    
    try {
      await updateStudent(selectedStudent.id, {
        student_first_name: selectedStudent.student_first_name,
        student_last_name: selectedStudent.student_last_name,
        birth_date: selectedStudent.birth_date,
        weight_class: selectedStudent.weight_class,
        registration_number: selectedStudent.registration_number,
        notes: selectedStudent.notes
      });
      
      toast.success('Öğrenci bilgileri güncellendi');
      setShowEditModal(false);
      fetchStudents();
    } catch (error) {
      toast.error('Güncelleme sırasında hata oluştu');
      console.error(error);
    }
  };

  const handleExportAll = async () => {
    try {
      await exportAllToExcel();
      toast.success('Excel dosyası indiriliyor...');
    } catch (error) {
      toast.error('Excel indirme hatası');
      console.error(error);
    }
  };

  const handleExportFiltered = async () => {
    try {
      await exportFilteredToExcel(filters);
      toast.success('Filtrelenmiş Excel dosyası indiriliyor...');
    } catch (error) {
      toast.error('Excel indirme hatası');
      console.error(error);
    }
  };

  // Arama fonksiyonu
  const filteredStudents = students.filter(student => {
    const query = searchQuery.toLowerCase();
    return (
      student.student_first_name.toLowerCase().includes(query) ||
      student.student_last_name.toLowerCase().includes(query) ||
      student.school_name.toLowerCase().includes(query) ||
      student.teacher_name.toLowerCase().includes(query) ||
      student.sport_branch.toLowerCase().includes(query)
    );
  });

  return (
    <div className="min-h-screen p-6">
      <div className="max-w-7xl mx-auto">
        
{/* Header */}
<div className="mb-8">
  <div className="flex items-center justify-between gap-4">
    {/* Sol Taraf: Başlık */}
    <div>
      <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 flex items-center">
        <Users className="mr-3 text-blue-600" size={32} />
        {/* Mobilde sadece "Öğrenci Yönetimi" görünsün */}
        <span className='text-red-500 mr-2 hidden sm:inline'>ÖNCÜ SPOR</span>
        <span>Öğrenci Yönetimi</span>
      </h1>
      {/* Açıklama metnini sadece orta ekran (md) ve üzerinde göster */}
      <p className="text-gray-600 mt-1 hidden md:block">
        Kayıtlı öğrencileri görüntüleyin, düzenleyin ve raporlayın
      </p>
    </div>

    {/* Sağ Taraf: Buton */}
    {/* flex-shrink-0: Ekran küçüldüğünde butonun sıkışıp küçülmesini engeller */}
    <button
      onClick={() => fetchStudents()}
      className="flex items-center p-2 sm:px-4 sm:py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition flex-shrink-0"
    >
      {/* Mobilde sadece ikon görünsün */}
      <RefreshCw size={18} />
      <span className="ml-2 hidden sm:inline">Yenile</span>
    </button>
  </div>
</div>
        {/* Statistics Cards */}
        {statistics && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl shadow-lg p-6 text-white">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-100 text-sm font-medium">Toplam Öğrenci</p>
                  <p className="text-3xl font-bold mt-1">{statistics.total_students}</p>
                </div>
                <Users className="opacity-80" size={40} />
              </div>
            </div>

            <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl shadow-lg p-6 text-white">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-green-100 text-sm font-medium">Toplam Okul</p>
                  <p className="text-3xl font-bold mt-1">{statistics.total_schools}</p>
                </div>
                <School className="opacity-80" size={40} />
              </div>
            </div>

            <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl shadow-lg p-6 text-white">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-purple-100 text-sm font-medium">Toplam Branş</p>
                  <p className="text-3xl font-bold mt-1">{statistics.by_branch?.length || 0}</p>
                </div>
                <Trophy className="opacity-80" size={40} />
              </div>
            </div>

            <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl shadow-lg p-6 text-white">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-orange-100 text-sm font-medium">Avrupa Yakası</p>
                  <p className="text-3xl font-bold mt-1">
                    {statistics.by_side?.find(s => s.side === 'Avrupa')?.count || 0}
                  </p>
                </div>
                <MapPin className="opacity-80" size={40} />
              </div>
            </div>
          </div>
        )}

        {/* Actions Bar */}
        <div className="bg-white rounded-xl shadow-md p-6 mb-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            
            {/* Search */}
            <div className="flex-1 max-w-md">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="text"
                  placeholder="Öğrenci, okul veya öğretmen ara..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap gap-3">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className={`flex items-center px-4 py-2 rounded-lg transition ${
                  showFilters 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                <Filter className="mr-2" size={18} />
                Filtreler
                {showFilters ? <ChevronUp className="ml-2" size={18} /> : <ChevronDown className="ml-2" size={18} />}
              </button>

              <button
                onClick={handleExportAll}
                className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
              >
                <Download className="mr-2" size={18} />
                Tümünü İndir
              </button>

              {(filters.side || filters.district || filters.sport_branch || filters.age_category || filters.weight_class) && (
                <button
                  onClick={handleExportFiltered}
                  className="flex items-center px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition"
                >
                  <FileSpreadsheet className="mr-2" size={18} />
                  Filtrelenmiş İndir
                </button>
              )}
            </div>
          </div>

          {/* Filters Panel */}
          {showFilters && (
            <div className="mt-6 pt-6 border-t border-gray-200">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Yaka</label>
                  <select
                    name="side"
                    value={filters.side}
                    onChange={handleFilterChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">Tümü</option>
                    <option value="Avrupa">Avrupa</option>
                    <option value="Anadolu">Anadolu</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">İlçe</label>
                  <select
                    name="district"
                    value={filters.district}
                    onChange={handleFilterChange}
                    disabled={!filters.side}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100"
                  >
                    <option value="">Tümü</option>
                    {filters.side && districts[filters.side]?.map(district => (
                      <option key={district} value={district}>{district}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Branş</label>
                  <select
                    name="sport_branch"
                    value={filters.sport_branch}
                    onChange={handleFilterChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">Tümü</option>
                    {branches.map(branch => (
                      <option key={branch} value={branch}>{branch}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Kategori</label>
                  <input
                    type="text"
                    name="age_category"
                    value={filters.age_category}
                    onChange={handleFilterChange}
                    placeholder="Örn: Yıldız Erkek"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Siklet</label>
                  <input
                    type="text"
                    name="weight_class"
                    value={filters.weight_class}
                    onChange={handleFilterChange}
                    placeholder="Örn: 45"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div className="flex items-end gap-2">
                  <button
                    onClick={applyFilters}
                    className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                  >
                    Uygula
                  </button>
                  <button
                    onClick={clearFilters}
                    className="flex-1 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition"
                  >
                    Temizle
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Students Table */}
        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          <div className="overflow-x-auto">
            {loading ? (
              <div className="flex items-center justify-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
              </div>
            ) : filteredStudents.length === 0 ? (
              <div className="text-center py-12">
                <Users className="mx-auto text-gray-400 mb-4" size={48} />
                <p className="text-gray-600">Kayıtlı öğrenci bulunamadı</p>
              </div>
            ) : (
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Öğrenci
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Okul
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Branş
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Kategori
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Siklet
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Öğretmen
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      İşlemler
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredStudents.map((student) => (
                    <tr key={student.id} className="hover:bg-gray-50 transition">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10 bg-blue-100 rounded-full flex items-center justify-center">
                            <User className="text-blue-600" size={20} />
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">
                              {student.student_first_name} {student.student_last_name}
                            </div>
                            <div className="text-sm text-gray-500">
                              {new Date(student.birth_date).toLocaleDateString('tr-TR')}
                            </div>
                            {student.registration_number && (
                              <div className="text-xs text-blue-600 mt-1">
                                Sicil: {student.registration_number}
                              </div>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-900">{student.school_name}</div>
                        <div className="text-sm text-gray-500">
                          {student.district} • {student.side}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-purple-100 text-purple-800">
                          {student.sport_branch}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {student.age_category}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {student.weight_class ? `${student.weight_class} kg` : '-'}
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-900">{student.teacher_name}</div>
                        <div className="text-sm text-gray-500">{student.teacher_phone}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => {
                              setSelectedStudent(student);
                              setShowDetailModal(true);
                            }}
                            className="text-blue-600 hover:text-blue-900 p-2 hover:bg-blue-50 rounded-lg transition"
                            title="Detay"
                          >
                            <Eye size={18} />
                          </button>
                          <button
                            onClick={() => {
                              setSelectedStudent(student);
                              setShowEditModal(true);
                            }}
                            className="text-green-600 hover:text-green-900 p-2 hover:bg-green-50 rounded-lg transition"
                            title="Düzenle"
                          >
                            <Edit size={18} />
                          </button>
                          <button
                            onClick={() => handleDelete(student.id, `${student.student_first_name} ${student.student_last_name}`)}
                            className="text-red-600 hover:text-red-900 p-2 hover:bg-red-50 rounded-lg transition"
                            title="Sil"
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>

          {/* Pagination info */}
          <div className="bg-gray-50 px-6 py-4 border-t border-gray-200">
            <div className="text-sm text-gray-700">
              Toplam <span className="font-medium">{filteredStudents.length}</span> öğrenci gösteriliyor
            </div>
          </div>
        </div>

        {/* Statistics Charts Section */}
        {statistics && (
          <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-6">
            
            {/* Branşlara Göre Dağılım */}
            <div className="bg-white rounded-xl shadow-md p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <BarChart3 className="mr-2 text-blue-600" size={24} />
                Branşlara Göre Dağılım
              </h3>
              <div className="space-y-3">
                {statistics.by_branch?.slice(0, 10).map((item, index) => (
                  <div key={index}>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm font-medium text-gray-700">{item.sport_branch}</span>
                      <span className="text-sm font-bold text-gray-900">{item.count}</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full transition-all"
                        style={{ width: `${(item.count / statistics.total_students) * 100}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* İlçelere Göre Dağılım */}
            <div className="bg-white rounded-xl shadow-md p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <MapPin className="mr-2 text-green-600" size={24} />
                İlçelere Göre Dağılım (İlk 10)
              </h3>
              <div className="space-y-3">
                {statistics.by_district?.slice(0, 10).map((item, index) => (
                  <div key={index}>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm font-medium text-gray-700">{item.district}</span>
                      <span className="text-sm font-bold text-gray-900">{item.count}</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-gradient-to-r from-green-500 to-teal-500 h-2 rounded-full transition-all"
                        style={{ width: `${(item.count / statistics.total_students) * 100}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Edit Modal */}
      {showEditModal && selectedStudent && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
              <h2 className="text-xl font-bold text-gray-900 flex items-center">
                <Edit className="mr-2 text-blue-600" size={24} />
                Öğrenci Düzenle
              </h2>
              <button
                onClick={() => setShowEditModal(false)}
                className="text-gray-400 hover:text-gray-600 transition"
              >
                <X size={24} />
              </button>
            </div>

            <form onSubmit={handleUpdate} className="p-6 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Adı</label>
                  <input
                    type="text"
                    value={selectedStudent.student_first_name}
                    onChange={(e) => setSelectedStudent({...selectedStudent, student_first_name: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Soyadı</label>
                  <input
                    type="text"
                    value={selectedStudent.student_last_name}
                    onChange={(e) => setSelectedStudent({...selectedStudent, student_last_name: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Doğum Tarihi</label>
                  <input
                    type="date"
                    value={selectedStudent.birth_date}
                    onChange={(e) => setSelectedStudent({...selectedStudent, birth_date: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Siklet</label>
                  <input
                    type="text"
                    value={selectedStudent.weight_class || ''}
                    onChange={(e) => setSelectedStudent({...selectedStudent, weight_class: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    placeholder="Varsa"
                  />
                </div>

                {selectedStudent.sport_branch === 'Taekwondo' && (
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Sicil Numarası</label>
                    <input
                      type="text"
                      value={selectedStudent.registration_number || ''}
                      onChange={(e) => setSelectedStudent({...selectedStudent, registration_number: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      placeholder="TKD2024XXX"
                    />
                  </div>
                )}

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Notlar</label>
                  <textarea
                    value={selectedStudent.notes || ''}
                    onChange={(e) => setSelectedStudent({...selectedStudent, notes: e.target.value})}
                    rows="3"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    placeholder="Ek notlar..."
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowEditModal(false)}
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition"
                >
                  İptal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                >
                  Güncelle
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Detail Modal */}
      {showDetailModal && selectedStudent && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-4 flex items-center justify-between">
              <h2 className="text-xl font-bold flex items-center">
                <Eye className="mr-2" size={24} />
                Öğrenci Detayları
              </h2>
              <button
                onClick={() => setShowDetailModal(false)}
                className="text-white hover:text-gray-200 transition"
              >
                <X size={24} />
              </button>
            </div>

            <div className="p-6">
              {/* Student Info */}
              <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-lg p-6 mb-6">
                <div className="flex items-center mb-4">
                  <div className="ml-4">
                    <h3 className="text-2xl font-bold text-gray-900">
                      {selectedStudent.student_first_name} {selectedStudent.student_last_name}
                    </h3>
                    <p className="text-gray-600 flex items-center mt-1">
                      <Calendar className="mr-2" size={16} />
                      {new Date(selectedStudent.birth_date).toLocaleDateString('tr-TR', { 
                        year: 'numeric', 
                        month: 'long', 
                        day: 'numeric' 
                      })}
                    </p>
                  </div>
                </div>

                {selectedStudent.registration_number && (
                  <div className="bg-white rounded-lg p-3 inline-block">
                    <span className="text-sm font-medium text-gray-600">Sicil Numarası:</span>
                    <span className="ml-2 text-lg font-bold text-blue-600">
                      {selectedStudent.registration_number}
                    </span>
                  </div>
                )}
              </div>

              {/* Details Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                {/* School Info */}
                <div className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center mb-3">
                    <School className="text-blue-600 mr-2" size={20} />
                    <h4 className="font-semibold text-gray-900">Okul Bilgileri</h4>
                  </div>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Okul:</span>
                      <span className="font-medium text-gray-900">{selectedStudent.school_name}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">İlçe:</span>
                      <span className="font-medium text-gray-900">{selectedStudent.district}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Yaka:</span>
                      <span className="font-medium text-gray-900">{selectedStudent.side}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Tür:</span>
                      <span className="font-medium text-gray-900">{selectedStudent.school_type}</span>
                    </div>
                  </div>
                </div>

                {/* Teacher Info */}
                <div className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center mb-3">
                    <User className="text-green-600 mr-2" size={20} />
                    <h4 className="font-semibold text-gray-900">Öğretmen Bilgileri</h4>
                  </div>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Ad Soyad:</span>
                      <span className="font-medium text-gray-900">{selectedStudent.teacher_name}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Telefon:</span>
                      <span className="font-medium text-gray-900 flex items-center">
                        <Phone size={14} className="mr-1" />
                        {selectedStudent.teacher_phone}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Sport Info */}
                <div className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center mb-3">
                    <Trophy className="text-purple-600 mr-2" size={20} />
                    <h4 className="font-semibold text-gray-900">Branş Bilgileri</h4>
                  </div>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Branş:</span>
                      <span className="font-medium text-gray-900">{selectedStudent.sport_branch}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Kategori:</span>
                      <span className="font-medium text-gray-900">{selectedStudent.age_category}</span>
                    </div>
                    {selectedStudent.weight_class && (
                      <div className="flex justify-between">
                        <span className="text-gray-600">Siklet:</span>
                        <span className="font-medium text-gray-900">{selectedStudent.weight_class} kg</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Registration Info */}
                <div className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center mb-3">
                    <Calendar className="text-orange-600 mr-2" size={20} />
                    <h4 className="font-semibold text-gray-900">Kayıt Bilgileri</h4>
                  </div>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Kayıt Tarihi:</span>
                      <span className="font-medium text-gray-900">
                        {new Date(selectedStudent.created_at).toLocaleDateString('tr-TR')}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Kayıt Saati:</span>
                      <span className="font-medium text-gray-900">
                        {new Date(selectedStudent.created_at).toLocaleTimeString('tr-TR', { 
                          hour: '2-digit', 
                          minute: '2-digit' 
                        })}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Notes */}
              {selectedStudent.notes && (
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                  <h4 className="font-semibold text-gray-900 mb-2 flex items-center">
                    <FileText className="text-yellow-600 mr-2" size={18} />
                    Notlar
                  </h4>
                  <p className="text-gray-700 text-sm whitespace-pre-wrap">
                    {selectedStudent.notes}
                  </p>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex gap-3 mt-6 pt-6 border-t border-gray-200">
                <button
                  onClick={() => {
                    setShowDetailModal(false);
                    setShowEditModal(true);
                  }}
                  className="flex-1 flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                >
                  <Edit className="mr-2" size={18} />
                  Düzenle
                </button>
                <button
                  onClick={() => {
                    setShowDetailModal(false);
                    handleDelete(selectedStudent.id, `${selectedStudent.student_first_name} ${selectedStudent.student_last_name}`);
                  }}
                  className="flex-1 flex items-center justify-center px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
                >
                  <Trash2 className="mr-2" size={18} />
                  Sil
                </button>
                <button
                  onClick={() => setShowDetailModal(false)}
                  className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition"
                >
                  Kapat
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StudentsPage;