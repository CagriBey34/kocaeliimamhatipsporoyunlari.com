import React, { useState, useEffect } from 'react';
import { nationalApplicationService } from '../services/nationalApplicationService';
import { FaCheckCircle, FaTimesCircle, FaPhone, FaInfoCircle } from 'react-icons/fa';

const NationalApplication = () => {
  const [formData, setFormData] = useState({
    school_id: '',
    teacher_name: '',
    teacher_phone: '',
    notes: '',
    categories: []
  });

  const [sportCategories, setSportCategories] = useState({});
  const [provinces, setProvinces] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [schools, setSchools] = useState([]);
  
  const [selectedProvince, setSelectedProvince] = useState('');
  const [selectedDistrict, setSelectedDistrict] = useState('');
  
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const [selectedSport, setSelectedSport] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');

  useEffect(() => {
    loadInitialData();
  }, []);

  const loadInitialData = async () => {
    try {
      const [categoriesData, provincesData] = await Promise.all([
        nationalApplicationService.getSportCategories(),
        nationalApplicationService.getProvinces()
      ]);
      setSportCategories(categoriesData);
      setProvinces(provincesData);
    } catch (err) {
      setError('Veriler yüklenirken bir hata oluştu');
      console.error(err);
    }
  };

  const handleProvinceChange = async (e) => {
    const province = e.target.value;
    setSelectedProvince(province);
    setSelectedDistrict('');
    setDistricts([]);
    setSchools([]);
    setFormData(prev => ({ ...prev, school_id: '' }));

    if (province) {
      try {
        const districtsData = await nationalApplicationService.getDistrictsByProvince(province);
        setDistricts(districtsData);
      } catch (err) {
        console.error('İlçeler yüklenirken hata:', err);
        setError('İlçeler yüklenirken bir hata oluştu');
      }
    }
  };

  const handleDistrictChange = async (e) => {
    const district = e.target.value;
    setSelectedDistrict(district);
    setSchools([]);
    setFormData(prev => ({ ...prev, school_id: '' }));

    if (district && selectedProvince) {
      try {
        const schoolsData = await nationalApplicationService.getSchoolsByDistrict(selectedProvince, district);
        setSchools(schoolsData);
      } catch (err) {
        console.error('Okullar yüklenirken hata:', err);
        setError('Okullar yüklenirken bir hata oluştu');
      }
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const addCategory = () => {
    if (!selectedSport || !selectedCategory) {
      setError('Lütfen branş ve kategori seçin');
      setTimeout(() => setError(''), 3000);
      return;
    }

    const exists = formData.categories.some(
      cat => cat.sport_branch === selectedSport && cat.age_category === selectedCategory
    );

    if (exists) {
      setError('Bu kategori zaten eklenmiş');
      setTimeout(() => setError(''), 3000);
      return;
    }

    setFormData(prev => ({
      ...prev,
      categories: [
        ...prev.categories,
        {
          sport_branch: selectedSport,
          age_category: selectedCategory
        }
      ]
    }));

    setSelectedSport('');
    setSelectedCategory('');
    setError('');
  };

  const removeCategory = (index) => {
    setFormData(prev => ({
      ...prev,
      categories: prev.categories.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    // Validasyon
    if (!formData.school_id) {
      setError('Lütfen okul seçin');
      setLoading(false);
      return;
    }

    if (!formData.teacher_name || !formData.teacher_phone) {
      setError('Lütfen öğretmen bilgilerini doldurun');
      setLoading(false);
      return;
    }

    if (formData.categories.length === 0) {
      setError('Lütfen en az bir kategori seçin');
      setLoading(false);
      return;
    }

    try {
      await nationalApplicationService.createApplication(formData);
      setSuccess(true);

      // Sayfayı en üste scroll et
      window.scrollTo({ top: 0, behavior: 'smooth' });

      // Formu sıfırla
      setFormData({
        school_id: '',
        teacher_name: '',
        teacher_phone: '',
        notes: '',
        categories: []
      });
      setSelectedProvince('');
      setSelectedDistrict('');
      setDistricts([]);
      setSchools([]);
      setSelectedSport('');
      setSelectedCategory('');

      // 8 saniye sonra success mesajını kaldır
      setTimeout(() => setSuccess(false), 8000);
    } catch (err) {
      setError(err.error || 'Başvuru gönderilirken bir hata oluştu');
      console.error(err);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-red-50 to-gray-100 py-8 sm:py-12 md:py-16 px-4">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8 sm:mb-12 pt-4 sm:pt-8">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-800 mb-3 sm:mb-4 relative inline-block">
            <span className="relative z-10">Türkiye Geneli Başvuru Formu</span>
            <span className="absolute -bottom-1 sm:-bottom-2 left-0 right-0 h-2 sm:h-3 bg-red-300 opacity-50 z-0"></span>
          </h1>
          <p className="text-base sm:text-lg md:text-xl text-gray-600 max-w-2xl mx-auto px-4">
            16. İmam Hatip Spor Oyunları'na katılmak için başvuru yapın
          </p>
        </div>

        {/* Info Box - Güncelleme Bilgisi */}
        <div className="bg-blue-50 border-l-4 border-blue-400 rounded-lg p-4 sm:p-6 mb-6 sm:mb-8 shadow-sm">
          <div className="flex flex-col sm:flex-row items-start gap-3 sm:gap-4">
            <div className="flex-shrink-0">
              <FaInfoCircle className="text-2xl sm:text-3xl text-blue-500" />
            </div>
            <div className="flex-1">
              <h3 className="text-base sm:text-lg font-semibold text-blue-900 mb-2">Önemli Bilgilendirme</h3>
              <p className="text-sm sm:text-base text-blue-800 mb-3">
                - Başvurunuzu tamamladıktan sonra herhangi bir güncelleme veya değişiklik yapmak isterseniz,
                lütfen bizimle iletişime geçin.
              </p>

              <p className="text-sm sm:text-base text-red-800 mb-3">
                - Başvuru formu yalnızca sorumlu hocamız tarafından doldurulmalıdır. Öğrencilerin bireysel başvuru yapmaları kesinlikle yasaktır.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 text-sm sm:text-base">
                <a
                  href="tel:+905309159293"
                  className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-800 font-medium"
                >
                  <FaPhone className="text-sm" />
                  <span>0530 915 92 93</span>
                </a>
                <a
                  href="mailto:oncugeclikvespor@gmail.com"
                  className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-800 font-medium"
                >
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                    <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                  </svg>
                  <span className="break-all">oncugeclikvespor@gmail.com</span>
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Success Message */}
        {success && (
          <div className="bg-green-50 border-l-4 border-green-400 rounded-lg p-4 sm:p-6 mb-6 sm:mb-8 shadow-lg animate-fade-in">
            <div className="flex items-start gap-3 sm:gap-4">
              <FaCheckCircle className="text-2xl sm:text-3xl text-green-500 flex-shrink-0 mt-1" />
              <div className="flex-1">
                <h3 className="text-base sm:text-lg font-semibold text-green-800 mb-1 sm:mb-2">Başvurunuz Başarıyla Alındı!</h3>
                <p className="text-sm sm:text-base text-green-700 mb-2">
                  Başvurunuz sistemimize kaydedildi. En kısa sürede sizinle iletişime geçeceğiz.
                </p>
                <p className="text-xs sm:text-sm text-green-600">
                  Herhangi bir sorunuz varsa yukarıdaki iletişim bilgilerinden bize ulaşabilirsiniz.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border-l-4 border-red-400 rounded-lg p-4 sm:p-6 mb-6 sm:mb-8 shadow-lg animate-fade-in">
            <div className="flex items-start gap-3 sm:gap-4">
              <FaTimesCircle className="text-2xl sm:text-3xl text-red-500 flex-shrink-0 mt-1" />
              <div className="flex-1">
                <h3 className="text-base sm:text-lg font-semibold text-red-800 mb-1">Hata Oluştu</h3>
                <p className="text-sm sm:text-base text-red-700">{error}</p>
              </div>
            </div>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-xl p-4 sm:p-6 md:p-8 space-y-6 sm:space-y-8">
          {/* Okul Bilgileri */}
          <div>
            <div className="flex items-center gap-2 mb-4 sm:mb-6">
              <div className="w-1 h-6 sm:h-8 bg-red-500 rounded-full"></div>
              <h2 className="text-xl sm:text-2xl font-bold text-gray-800">Okul Bilgileri</h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
              {/* İl Seçimi */}
              <div>
                <label className="block text-sm sm:text-base text-gray-700 font-medium mb-2">
                  İl <span className="text-red-500">*</span>
                </label>
                <select
                  value={selectedProvince}
                  onChange={handleProvinceChange}
                  className="w-full px-3 sm:px-4 py-2.5 sm:py-3 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  required
                >
                  <option value="">İl Seçiniz</option>
                  {provinces.map(province => (
                    <option key={province} value={province}>{province}</option>
                  ))}
                </select>
              </div>

              {/* İlçe Seçimi */}
              <div>
                <label className="block text-sm sm:text-base text-gray-700 font-medium mb-2">
                  İlçe <span className="text-red-500">*</span>
                </label>
                <select
                  value={selectedDistrict}
                  onChange={handleDistrictChange}
                  className="w-full px-3 sm:px-4 py-2.5 sm:py-3 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent disabled:bg-gray-100"
                  required
                  disabled={!selectedProvince}
                >
                  <option value="">{selectedProvince ? 'İlçe Seçin' : 'Önce il seçin'}</option>
                  {districts.map(district => (
                    <option key={district} value={district}>{district}</option>
                  ))}
                </select>
              </div>

              {/* Okul Seçimi */}
              <div className="sm:col-span-2">
                <label className="block text-sm sm:text-base text-gray-700 font-medium mb-2">
                  Okul Adı <span className="text-red-500">*</span>
                </label>
                <select
                  name="school_id"
                  value={formData.school_id}
                  onChange={handleInputChange}
                  className="w-full px-3 sm:px-4 py-2.5 sm:py-3 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent disabled:bg-gray-100"
                  required
                  disabled={!selectedDistrict}
                >
                  <option value="">{selectedDistrict ? 'Okul Seçin' : 'Önce ilçe seçin'}</option>
                  {schools.map(school => (
                    <option key={school.id} value={school.id}>
                      {school.kurum_adi} {school.okul_turu === 'ortaokul' ? '(Ortaokul)' : '(Lise)'}
                    </option>
                  ))}
                </select>
                {schools.length > 0 && (
                  <p className="text-xs text-gray-500 mt-1">
                    {schools.length} okul listelendi
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Öğretmen Bilgileri */}
          <div>
            <div className="flex items-center gap-2 mb-4 sm:mb-6">
              <div className="w-1 h-6 sm:h-8 bg-red-500 rounded-full"></div>
              <h2 className="text-xl sm:text-2xl font-bold text-gray-800">Öğretmen Bilgileri</h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
              <div>
                <label className="block text-sm sm:text-base text-gray-700 font-medium mb-2">
                  Ad Soyad <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="teacher_name"
                  value={formData.teacher_name}
                  onChange={handleInputChange}
                  className="w-full px-3 sm:px-4 py-2.5 sm:py-3 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all"
                  placeholder="Örn: Ahmet Yılmaz"
                  required
                />
              </div>

              <div>
                <label className="block text-sm sm:text-base text-gray-700 font-medium mb-2">
                  Telefon <span className="text-red-500">*</span>
                </label>
                <input
                  type="tel"
                  name="teacher_phone"
                  value={formData.teacher_phone}
                  onChange={handleInputChange}
                  className="w-full px-3 sm:px-4 py-2.5 sm:py-3 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all"
                  placeholder="05XXXXXXXXX"
                  pattern="[0-9]{11}"
                  required
                />
              </div>
            </div>
          </div>

          {/* Kategori Seçimi */}
          <div>
            <div className="flex items-center gap-2 mb-4 sm:mb-6">
              <div className="w-1 h-6 sm:h-8 bg-red-500 rounded-full"></div>
              <h2 className="text-xl sm:text-2xl font-bold text-gray-800">
                Katılmak İstediğiniz Branşlar <span className="text-red-500">*</span>
              </h2>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-1 gap-4">
                <div>
                  <label className="block text-sm sm:text-base text-gray-700 font-medium mb-2">Branş Seçin</label>
                  <select
                    value={selectedSport}
                    onChange={(e) => {
                      setSelectedSport(e.target.value);
                      setSelectedCategory('');
                    }}
                    className="w-full px-3 sm:px-4 py-2.5 sm:py-3 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all"
                  >
                    <option value="">Branş Seçin</option>
                    {Object.keys(sportCategories).map(sport => (
                      <option key={sport} value={sport}>{sport}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm sm:text-base text-gray-700 font-medium mb-2">Kategori Seçin</label>
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="w-full px-3 sm:px-4 py-2.5 sm:py-3 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all disabled:bg-gray-100"
                    disabled={!selectedSport}
                  >
                    <option value="">{selectedSport ? 'Kategori Seçin' : 'Önce branş seçin'}</option>
                    {selectedSport && sportCategories[selectedSport]?.map(category => (
                      <option key={category} value={category}>{category}</option>
                    ))}
                  </select>
                </div>

                <button
                  type="button"
                  onClick={addCategory}
                  className="w-full px-4 sm:px-6 py-3 sm:py-3.5 bg-red-500 text-white text-sm sm:text-base font-semibold rounded-lg hover:bg-red-600 active:bg-red-700 transition-colors shadow-md hover:shadow-lg"
                >
                  Kategori Ekle
                </button>
              </div>

              {/* Seçili Kategoriler */}
              {formData.categories.length > 0 && (
                <div className="bg-gradient-to-br from-gray-50 to-red-50 rounded-xl p-4 sm:p-5 border border-gray-200">
                  <h3 className="text-sm sm:text-base font-semibold text-gray-800 mb-3 flex items-center gap-2">
                    <span className="w-2 h-2 bg-red-500 rounded-full"></span>
                    Seçili Kategoriler ({formData.categories.length})
                  </h3>
                  <div className="space-y-2">
                    {formData.categories.map((cat, index) => (
                      <div key={index} className="flex items-center justify-between bg-white p-3 sm:p-4 rounded-lg shadow-sm hover:shadow-md transition-shadow">
                        <span className="text-sm sm:text-base text-gray-800 font-medium">
                          {cat.sport_branch} - <span className="text-gray-600">{cat.age_category}</span>
                        </span>
                        <button
                          type="button"
                          onClick={() => removeCategory(index)}
                          className="text-red-500 hover:text-red-700 font-semibold text-sm sm:text-base px-2 sm:px-3 py-1 rounded hover:bg-red-50 transition-colors"
                        >
                          Kaldır
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Notlar */}
          <div>
            <label className="block text-sm sm:text-base text-gray-700 font-medium mb-2">
              Eklemek İstediğiniz Notlar
            </label>
            <textarea
              name="notes"
              value={formData.notes}
              onChange={handleInputChange}
              rows="4"
              className="w-full px-3 sm:px-4 py-2.5 sm:py-3 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all resize-none"
              placeholder="Varsa belirtmek istediğiniz notları buraya yazabilirsiniz..."
            ></textarea>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full px-4 sm:px-6 py-3.5 sm:py-4 bg-gradient-to-r from-red-500 to-red-600 text-white text-base sm:text-lg font-bold rounded-xl hover:from-red-600 hover:to-red-700 active:from-red-700 active:to-red-800 transition-all disabled:from-gray-400 disabled:to-gray-500 disabled:cursor-not-allowed shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 active:translate-y-0"
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                Gönderiliyor...
              </span>
            ) : (
              'Başvuruyu Gönder'
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default NationalApplication;