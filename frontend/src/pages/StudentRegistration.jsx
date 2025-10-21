import React, { useState, useEffect } from 'react';
import { getSportConfigurations, createStudentRegistration } from '../services/studentService';
import { applicationService } from '../services/applicationService';
import { toast } from 'react-toastify';
import { FaCheckCircle, FaTimesCircle, FaInfoCircle, FaPlus, FaTrash } from 'react-icons/fa';

const StudentRegistration = () => {
  const [step, setStep] = useState(1);
  const [configurations, setConfigurations] = useState(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  // Okul listeleri
  const [registeredSchools, setRegisteredSchools] = useState([]);
  const [districts, setDistricts] = useState([]);

  // Ana form data
  const [formData, setFormData] = useState({
    school: {
      side: '',
      district: '',
      name: '',
      type: ''
    },
    teacher_name: '',
    teacher_phone: '',
    sport_branch: '',
    age_category: '',
    weight_class: '',
    students: [], // Öğrenci listesi
    notes: ''
  });

  // Mevcut öğrenci
  const [currentStudent, setCurrentStudent] = useState({
    first_name: '',
    last_name: '',
    birth_date: '',
    registration_number: ''
  });

  useEffect(() => {
    fetchConfigurations();
  }, []);

  const fetchConfigurations = async () => {
    try {
      const data = await getSportConfigurations();
      setConfigurations(data);
    } catch (error) {
      toast.error('Branş bilgileri yüklenemedi');
      console.error(error);
    }
  };

  // Yaka seçilince ilçeleri yükle
  const handleSideChange = async (side) => {
    setFormData(prev => ({
      ...prev,
      school: {
        ...prev.school,
        side,
        district: '',
        name: '',
        type: ''
      }
    }));

    try {
      const data = await applicationService.getDistrictsBySide(side);
      setDistricts(data);
      setRegisteredSchools([]);
    } catch (err) {
      console.error('İlçeler yüklenirken hata:', err);
      toast.error('İlçeler yüklenemedi');
    }
  };

  // İlçe seçilince okulları yükle
  const handleDistrictChange = async (district) => {
    setFormData(prev => ({
      ...prev,
      school: {
        ...prev.school,
        district,
        name: '',
        type: ''
      }
    }));

    try {
      const data = await applicationService.getSchoolsByDistrict(district);
      const schoolObjects = data.map((schoolName, index) => ({
        id: index,
        school_name: schoolName,
        school_type: ''
      }));
      setRegisteredSchools(schoolObjects);
    } catch (err) {
      console.error('Okullar yüklenirken hata:', err);
      toast.error('Okullar yüklenemedi');
    }
  };

  // Okul seçilince
  const handleSchoolChange = (schoolName) => {
    setFormData(prev => ({
      ...prev,
      school: {
        ...prev.school,
        name: schoolName
      }
    }));
  };

  const getCategories = () => {
    if (!formData.sport_branch || !configurations) return [];
    return Object.keys(configurations[formData.sport_branch]?.categories || {});
  };

  const getWeights = () => {
    if (!formData.sport_branch || !formData.age_category || !configurations) return [];
    const categoryData = configurations[formData.sport_branch]?.categories?.[formData.age_category];
    return categoryData?.weights || [];
  };

  const hasWeights = () => {
    const weights = getWeights();
    return weights.length > 0;
  };

  const isTaekwondo = () => {
    return formData.sport_branch === 'Taekwondo';
  };

  // Öğrenci ekle
  const addStudent = () => {
    if (!currentStudent.first_name || !currentStudent.last_name || !currentStudent.birth_date) {
      toast.warning('Lütfen tüm öğrenci bilgilerini doldurun');
      return;
    }

    if (isTaekwondo() && !currentStudent.registration_number) {
      toast.warning('Taekwondo için sicil numarası zorunludur');
      return;
    }

    setFormData(prev => ({
      ...prev,
      students: [...prev.students, currentStudent]
    }));

    setCurrentStudent({
      first_name: '',
      last_name: '',
      birth_date: '',
      registration_number: ''
    });

    toast.success('Öğrenci eklendi');
  };

  // Öğrenci sil
  const removeStudent = (index) => {
    setFormData(prev => ({
      ...prev,
      students: prev.students.filter((_, i) => i !== index)
    }));
    toast.info('Öğrenci silindi');
  };

  // Form gönder
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.school.name || !formData.school.district || !formData.school.side || !formData.school.type) {
      setError('Lütfen tüm okul bilgilerini doldurun');
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    if (!formData.teacher_name || !formData.teacher_phone) {
      setError('Lütfen öğretmen bilgilerini doldurun');
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    if (!formData.sport_branch || !formData.age_category) {
      setError('Lütfen branş ve kategori seçin');
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    if (hasWeights() && !formData.weight_class) {
      setError('Lütfen siklet seçin');
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    if (formData.students.length === 0) {
      setError('En az bir öğrenci eklemelisiniz');
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    setLoading(true);
    setError('');

    try {
      const registrationData = {
        school: formData.school,
        teacher_name: formData.teacher_name,
        teacher_phone: formData.teacher_phone,
        sport_branch: formData.sport_branch,
        age_category: formData.age_category,
        weight_class: formData.weight_class || null,
        students: formData.students,
        notes: formData.notes
      };

      await createStudentRegistration(registrationData);

      setSuccess(true);
      window.scrollTo({ top: 0, behavior: 'smooth' });

      // Formu sıfırla
      setFormData({
        school: { side: '', district: '', name: '', type: '' },
        teacher_name: '',
        teacher_phone: '',
        sport_branch: '',
        age_category: '',
        weight_class: '',
        students: [],
        notes: ''
      });
      setStep(1);

      setTimeout(() => setSuccess(false), 8000);
    } catch (err) {
      setError(err.error || 'Kayıt sırasında bir hata oluştu');
      window.scrollTo({ top: 0, behavior: 'smooth' });
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const totalSteps = hasWeights() ? 6 : 5;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-red-50 to-gray-100 py-8 sm:py-12 md:py-16 px-4">
      <div className="max-w-5xl mx-auto">
        
        {/* Header */}
        <div className="text-center mb-8 sm:mb-12 pt-4 sm:pt-8">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-800 mb-3 sm:mb-4 relative inline-block">
            <span className="relative z-10">Öğrenci Kayıt Formu</span>
            <span className="absolute -bottom-1 sm:-bottom-2 left-0 right-0 h-2 sm:h-3 bg-red-300 opacity-50 z-0"></span>
          </h1>
          <p className="text-base sm:text-lg md:text-xl text-gray-600 max-w-2xl mx-auto px-4">
            16. İmam Hatip Spor Oyunları'na katılacak öğrencileri kaydedin
          </p>
        </div>

        {/* Info Box */}
        <div className="bg-blue-50 border-l-4 border-blue-400 rounded-lg p-4 sm:p-6 mb-6 sm:mb-8 shadow-sm">
          <div className="flex flex-col sm:flex-row items-start gap-3 sm:gap-4">
            <div className="flex-shrink-0">
              <FaInfoCircle className="text-2xl sm:text-3xl text-blue-500" />
            </div>
            <div className="flex-1">
              <h3 className="text-base sm:text-lg font-semibold text-blue-900 mb-2">Önemli Bilgilendirme</h3>
              <p className="text-sm sm:text-base text-blue-800 mb-3">
                - Her kayıt formunda sadece bir branş için öğrenci kaydedebilirsiniz.
              </p>
              <p className="text-sm sm:text-base text-blue-800 mb-3">
                - Farklı branşlar için ayrı ayrı kayıt yapmanız gerekmektedir.
              </p>
              <p className="text-sm sm:text-base text-red-800">
                - Taekwondo branşında sicil numarası zorunludur.
              </p>
            </div>
          </div>
        </div>

        {/* Success Message */}
        {success && (
          <div className="bg-green-50 border-l-4 border-green-400 rounded-lg p-4 sm:p-6 mb-6 sm:mb-8 shadow-lg animate-fade-in">
            <div className="flex items-start gap-3 sm:gap-4">
              <FaCheckCircle className="text-2xl sm:text-3xl text-green-500 flex-shrink-0 mt-1" />
              <div className="flex-1">
                <h3 className="text-base sm:text-lg font-semibold text-green-800 mb-1 sm:mb-2">Kayıt Başarılı!</h3>
                <p className="text-sm sm:text-base text-green-700 mb-2">
                  Öğrenci kayıtlarınız başarıyla sisteme eklendi.
                </p>
                <p className="text-sm text-green-600">
                  Başka bir branş için kayıt yapmak isterseniz formu tekrar doldurabilirsiniz.
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
          
          {/* Progress Indicator */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-700">Adım {step} / {totalSteps}</span>
              <span className="text-sm font-medium text-gray-700">
                {Math.round((step / totalSteps) * 100)}% Tamamlandı
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-gradient-to-r from-red-500 to-red-600 h-2 rounded-full transition-all duration-500"
                style={{ width: `${(step / totalSteps) * 100}%` }}
              />
            </div>
          </div>

          {/* ADIM 1: Okul Bilgileri */}
          {step === 1 && (
            <div>
              <div className="flex items-center gap-2 mb-4 sm:mb-6">
                <div className="w-1 h-6 sm:h-8 bg-red-500 rounded-full"></div>
                <h2 className="text-xl sm:text-2xl font-bold text-gray-800">Okul Bilgileri</h2>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                
                {/* Yaka */}
                <div>
                  <label className="block text-sm sm:text-base text-gray-700 font-medium mb-2">
                    Yaka <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={formData.school.side}
                    onChange={(e) => handleSideChange(e.target.value)}
                    className="w-full px-3 sm:px-4 py-2.5 sm:py-3 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    required
                  >
                    <option value="">Seçiniz</option>
                    <option value="Anadolu">Anadolu Yakası</option>
                    <option value="Avrupa">Avrupa Yakası</option>
                  </select>
                </div>

                {/* İlçe */}
                <div>
                  <label className="block text-sm sm:text-base text-gray-700 font-medium mb-2">
                    İlçe <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={formData.school.district}
                    onChange={(e) => handleDistrictChange(e.target.value)}
                    className="w-full px-3 sm:px-4 py-2.5 sm:py-3 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent disabled:bg-gray-100"
                    required
                    disabled={!formData.school.side}
                  >
                    <option value="">{formData.school.side ? 'İlçe Seçin' : 'Önce yaka seçin'}</option>
                    {districts.map((district, index) => (
                      <option key={`district-${index}`} value={district}>{district}</option>
                    ))}
                  </select>
                </div>

                {/* Okul */}
                <div className="sm:col-span-2">
                  <label className="block text-sm sm:text-base text-gray-700 font-medium mb-2">
                    Okul Adı <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={formData.school.name}
                    onChange={(e) => handleSchoolChange(e.target.value)}
                    className="w-full px-3 sm:px-4 py-2.5 sm:py-3 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent disabled:bg-gray-100"
                    required
                    disabled={!formData.school.district}
                  >
                    <option value="">{formData.school.district ? 'Okul Seçin' : 'Önce ilçe seçin'}</option>
                    {registeredSchools.map((school, index) => (
                      <option 
                        key={`school-${index}`} 
                        value={school.school_name}
                      >
                        {school.school_name}
                      </option>
                    ))}
                  </select>
                  {registeredSchools.length > 0 && (
                    <p className="text-xs text-gray-500 mt-1">
                      {registeredSchools.length} okul listelendi
                    </p>
                  )}
                </div>

                {/* Okul Tipi */}
                <div className="sm:col-span-2">
                  <label className="block text-sm sm:text-base text-gray-700 font-medium mb-2">
                    Okul Tipi <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={formData.school.type}
                    onChange={(e) => setFormData({
                      ...formData, 
                      school: {...formData.school, type: e.target.value}
                    })}
                    className="w-full px-3 sm:px-4 py-2.5 sm:py-3 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    required
                  >
                    <option value="">Seçiniz</option>
                    <option value="Orta">Ortaokul</option>
                    <option value="Lise">Lise</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-end pt-6">
                <button
                  type="button"
                  onClick={() => {
                    if (!formData.school.name || !formData.school.district || !formData.school.side || !formData.school.type) {
                      toast.warning('Lütfen tüm okul bilgilerini doldurun');
                      return;
                    }
                    setStep(2);
                  }}
                  className="px-6 py-3 bg-red-500 text-white rounded-lg hover:bg-red-600 transition font-semibold shadow-md hover:shadow-lg"
                >
                  İleri
                </button>
              </div>
            </div>
          )}

          {/* ADIM 2: Öğretmen Bilgileri */}
          {step === 2 && (
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
                    value={formData.teacher_name}
                    onChange={(e) => setFormData({...formData, teacher_name: e.target.value})}
                    className="w-full px-3 sm:px-4 py-2.5 sm:py-3 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
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
                    value={formData.teacher_phone}
                    onChange={(e) => setFormData({...formData, teacher_phone: e.target.value})}
                    className="w-full px-3 sm:px-4 py-2.5 sm:py-3 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    placeholder="05XXXXXXXXX"
                    pattern="[0-9]{11}"
                    required
                  />
                </div>
              </div>

              <div className="flex justify-between pt-6">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition font-medium"
                >
                  Geri
                </button>
                <button
                  type="button"
                  onClick={() => {
                    if (!formData.teacher_name || !formData.teacher_phone) {
                      toast.warning('Lütfen öğretmen bilgilerini doldurun');
                      return;
                    }
                    setStep(3);
                  }}
                  className="px-6 py-3 bg-red-500 text-white rounded-lg hover:bg-red-600 transition font-semibold shadow-md hover:shadow-lg"
                >
                  İleri
                </button>
              </div>
            </div>
          )}

          {/* ADIM 3: Branş Seçimi */}
          {step === 3 && (
            <div>
              <div className="flex items-center gap-2 mb-4 sm:mb-6">
                <div className="w-1 h-6 sm:h-8 bg-red-500 rounded-full"></div>
                <h2 className="text-xl sm:text-2xl font-bold text-gray-800">Branş Seçimi</h2>
              </div>

              <div>
                <label className="block text-sm sm:text-base text-gray-700 font-medium mb-2">
                  Branş <span className="text-red-500">*</span>
                </label>
                <select
                  value={formData.sport_branch}
                  onChange={(e) => setFormData({
                    ...formData,
                    sport_branch: e.target.value,
                    age_category: '',
                    weight_class: ''
                  })}
                  className="w-full px-3 sm:px-4 py-2.5 sm:py-3 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  required
                >
                  <option value="">Branş Seçin</option>
                  {configurations && Object.keys(configurations).map(branch => (
                    <option key={branch} value={branch}>{branch}</option>
                  ))}
                </select>
              </div>

              <div className="flex justify-between pt-6">
                <button
                  type="button"
                  onClick={() => setStep(2)}
                  className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition font-medium"
                >
                  Geri
                </button>
                <button
                  type="button"
                  onClick={() => {
                    if (!formData.sport_branch) {
                      toast.warning('Lütfen branş seçin');
                      return;
                    }
                    setStep(4);
                  }}
                  className="px-6 py-3 bg-red-500 text-white rounded-lg hover:bg-red-600 transition font-semibold shadow-md hover:shadow-lg"
                >
                  İleri
                </button>
              </div>
            </div>
          )}

          {/* ADIM 4: Kategori Seçimi */}
          {step === 4 && (
            <div>
              <div className="flex items-center gap-2 mb-4 sm:mb-6">
                <div className="w-1 h-6 sm:h-8 bg-red-500 rounded-full"></div>
                <h2 className="text-xl sm:text-2xl font-bold text-gray-800">Kategori Seçimi</h2>
              </div>

              <div>
                <label className="block text-sm sm:text-base text-gray-700 font-medium mb-2">
                  Kategori <span className="text-red-500">*</span>
                </label>
                <select
                  value={formData.age_category}
                  onChange={(e) => setFormData({...formData, age_category: e.target.value})}
                  className="w-full px-3 sm:px-4 py-2.5 sm:py-3 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  required
                >
                  <option value="">Kategori Seçin</option>
                  {getCategories().map(category => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
              </div>

              <div className="flex justify-between pt-6">
                <button
                  type="button"
                  onClick={() => setStep(3)}
                  className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition font-medium"
                >
                  Geri
                </button>
               <button
                  type="button"
                  onClick={() => {
                    if (!formData.age_category) {
                      toast.warning('Lütfen kategori seçin');
                      return;
                    }
                    setStep(5);
                  }}
                  className="px-6 py-3 bg-red-500 text-white rounded-lg hover:bg-red-600 transition font-semibold shadow-md hover:shadow-lg"
                >
                  İleri
                </button>
              </div>
            </div>
          )}

          {/* ADIM 5: Siklet Seçimi (Varsa) */}
          {step === 5 && hasWeights() && (
            <div>
              <div className="flex items-center gap-2 mb-4 sm:mb-6">
                <div className="w-1 h-6 sm:h-8 bg-red-500 rounded-full"></div>
                <h2 className="text-xl sm:text-2xl font-bold text-gray-800">Siklet Seçimi</h2>
              </div>

              <div>
                <label className="block text-sm sm:text-base text-gray-700 font-medium mb-2">
                  Siklet <span className="text-red-500">*</span>
                </label>
                <select
                  value={formData.weight_class}
                  onChange={(e) => setFormData({...formData, weight_class: e.target.value})}
                  className="w-full px-3 sm:px-4 py-2.5 sm:py-3 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  required
                >
                  <option value="">Seçiniz</option>
                  {getWeights().map(weight => (
                    <option key={weight} value={weight}>{weight} kg</option>
                  ))}
                </select>
              </div>

              <div className="flex justify-between pt-6">
                <button
                  type="button"
                  onClick={() => setStep(4)}
                  className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition font-medium"
                >
                  Geri
                </button>
                <button
                  type="button"
                  onClick={() => {
                    if (!formData.weight_class) {
                      toast.warning('Lütfen siklet seçin');
                      return;
                    }
                    setStep(6);
                  }}
                  className="px-6 py-3 bg-red-500 text-white rounded-lg hover:bg-red-600 transition font-semibold shadow-md hover:shadow-lg"
                >
                  İleri
                </button>
              </div>
            </div>
          )}

          {/* ADIM 6: Öğrenci Bilgileri */}
          {step === (hasWeights() ? 6 : 5) && (
            <div>
              <div className="flex items-center gap-2 mb-4 sm:mb-6">
                <div className="w-1 h-6 sm:h-8 bg-red-500 rounded-full"></div>
                <h2 className="text-xl sm:text-2xl font-bold text-gray-800">Öğrenci Bilgileri</h2>
              </div>

              {/* Eklenen Öğrenciler */}
              {formData.students.length > 0 && (
<div className="bg-gradient-to-br from-gray-50 to-green-50 rounded-xl p-4 sm:p-5 border border-gray-200 mb-6">
                  <h3 className="text-sm sm:text-base font-semibold text-gray-800 mb-3 flex items-center gap-2">
                    <FaCheckCircle className="text-green-500" />
                    Eklenen Öğrenciler ({formData.students.length})
                  </h3>
                  <div className="space-y-2">
                    {formData.students.map((student, index) => (
                      <div key={index} className="flex items-center justify-between bg-white p-3 rounded-lg shadow-sm hover:shadow-md transition">
                        <div>
                          <p className="font-medium text-gray-900">
                            {student.first_name} {student.last_name}
                          </p>
                          <p className="text-sm text-gray-600">
                            {student.birth_date}
                            {student.registration_number && ` • Sicil: ${student.registration_number}`}
                          </p>
                        </div>
                        <button
                          type="button"
                          onClick={() => removeStudent(index)}
                          className="text-red-500 hover:text-red-700 p-2 hover:bg-red-50 rounded transition"
                        >
                          <FaTrash />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Öğrenci Ekleme Formu */}
              <div className="bg-blue-50 rounded-xl p-4 sm:p-6 mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <FaPlus className="text-red-600" />
                  Öğrenci Ekle
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Adı *</label>
                    <input
                      type="text"
                      value={currentStudent.first_name}
                      onChange={(e) => setCurrentStudent({...currentStudent, first_name: e.target.value})}
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                      placeholder="Öğrenci adı"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Soyadı *</label>
                    <input
                      type="text"
                      value={currentStudent.last_name}
                      onChange={(e) => setCurrentStudent({...currentStudent, last_name: e.target.value})}
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                      placeholder="Öğrenci soyadı"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Doğum Tarihi *</label>
                    <input
                      type="date"
                      value={currentStudent.birth_date}
                      onChange={(e) => setCurrentStudent({...currentStudent, birth_date: e.target.value})}
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    />
                  </div>

                  {isTaekwondo() && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Sicil Numarası * (Taekwondo için zorunlu)
                      </label>
                      <input
                        type="text"
                        value={currentStudent.registration_number}
                        onChange={(e) => setCurrentStudent({...currentStudent, registration_number: e.target.value})}
                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                        placeholder="34-TKD-6025"
                      />
                    </div>
                  )}
                </div>

                <button
                  type="button"
                  onClick={addStudent}
                  className="w-full mt-4 px-4 py-3 bg-red-500 text-white rounded-lg hover:bg-green-600 transition flex items-center justify-center gap-2 font-semibold shadow-md hover:shadow-lg"
                >
                  <FaPlus />
                  Öğrenci Ekle
                </button>
              </div>

              {/* Notlar */}
              {/* <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Eklemek İstediğiniz Notlar
                </label>
                <textarea
                  value={formData.notes}
                  onChange={(e) => setFormData({...formData, notes: e.target.value})}
                  rows="4"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent resize-none"
                  placeholder="Varsa belirtmek istediğiniz notları buraya yazabilirsiniz..."
                />
              </div> */}

              {/* Kayıt Özeti */}
              {formData.students.length > 0 && (
                <div className="bg-gradient-to-r from-red-500 to-red-600 rounded-xl shadow-lg p-6 text-white mb-6">
                  <h3 className="text-lg font-semibold mb-3">📋 Kayıt Özeti</h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div>
                      <p className="opacity-80">Okul</p>
                      <p className="font-semibold">{formData.school.name}</p>
                    </div>
                    <div>
                      <p className="opacity-80">Branş</p>
                      <p className="font-semibold">{formData.sport_branch}</p>
                    </div>
                    <div>
                      <p className="opacity-80">Kategori</p>
                      <p className="font-semibold">{formData.age_category}</p>
                    </div>
                    <div>
                      <p className="opacity-80">Öğrenci Sayısı</p>
                      <p className="font-semibold">{formData.students.length}</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Navigation Buttons */}
              <div className="flex justify-between pt-6 border-t border-gray-200">
                <button
                  type="button"
                  onClick={() => setStep(hasWeights() ? 5 : 4)}
                  className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition font-medium"
                >
                  Geri
                </button>
                <button
                  type="submit"
                  disabled={loading || formData.students.length === 0}
                  className="px-6 py-3 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-lg hover:from-red-600 hover:to-red-700 transition disabled:from-gray-400 disabled:to-gray-500 disabled:cursor-not-allowed font-semibold shadow-lg hover:shadow-xl"
                >
                  {loading ? (
                    <span className="flex items-center gap-2">
                      <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                      Kaydediliyor...
                    </span>
                  ) : (
                    'Kayıtları Gönder'
                  )}
                </button>
              </div>

              {/* Uyarı - En az 1 öğrenci */}
              {formData.students.length === 0 && (
                <div className="bg-yellow-50 border-l-4 border-yellow-400 rounded-lg p-4 mt-4">
                  <div className="flex items-start gap-3">
                    <FaInfoCircle className="text-yellow-600 flex-shrink-0 mt-1" />
                    <p className="text-sm text-yellow-800">
                      En az bir öğrenci eklemelisiniz. Yukarıdaki formu doldurup "Öğrenci Ekle" butonuna basın.
                    </p>
                  </div>
                </div>
              )}
            </div>
          )}
        </form>
      </div>
    </div>
  );
};

export default StudentRegistration;