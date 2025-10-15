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
        notes: '',
        branches: [] // Her branş: { sport_branch, age_category, weight_class, students: [] }
    });

    // Mevcut branş ekleme
    const [currentBranch, setCurrentBranch] = useState({
        sport_branch: '',
        age_category: '',
        weight_class: '',
        students: []
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

    // ✅ Yaka seçilince ilçeleri yükle
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
            console.log('📚 Gelen okul datası:', data);

            // ✅ String array'i object array'e çevir
            const schoolObjects = data.map((schoolName, index) => ({
                id: index,
                school_name: schoolName,
                school_type: '' // Tip bilgisi yok, boş bırak
            }));

            setRegisteredSchools(schoolObjects);
        } catch (err) {
            console.error('Okullar yüklenirken hata:', err);
            toast.error('Okullar yüklenemedi');
        }
    };

    // Okul seçilince (tip bilgisi olmadığı için manuel seçtir)
    const handleSchoolChange = (schoolName) => {
        setFormData(prev => ({
            ...prev,
            school: {
                ...prev.school,
                name: schoolName,
                type: prev.school.type // Tip ayrıca seçilecek
            }
        }));
    };

    const getCategories = () => {
        if (!currentBranch.sport_branch || !configurations) return [];
        return Object.keys(configurations[currentBranch.sport_branch]?.categories || {});
    };

    const getWeights = () => {
        if (!currentBranch.sport_branch || !currentBranch.age_category || !configurations) return [];
        const categoryData = configurations[currentBranch.sport_branch]?.categories?.[currentBranch.age_category];
        return categoryData?.weights || [];
    };

    const hasWeights = () => {
        const weights = getWeights();
        return weights.length > 0;
    };

    const isTaekwondo = () => {
        return currentBranch.sport_branch === 'Taekwondo';
    };

    // Öğrenci ekle (mevcut branşa)
    const addStudentToBranch = () => {
  if (!currentStudent.first_name || !currentStudent.last_name || !currentStudent.birth_date) {
    toast.warning('Lütfen tüm öğrenci bilgilerini doldurun');
    return;
  }

  // ✅ Taekwondo kontrolü
  if (isTaekwondo() && !currentStudent.registration_number) {
    toast.warning('Taekwondo için sicil numarası zorunludur');
    return;
  }

  // ✅ DEBUG: Öğrenci objesi doğru mu kontrol et
  console.log('➕ Eklenen öğrenci:', currentStudent);

  setCurrentBranch(prev => ({
    ...prev,
    students: [...prev.students, currentStudent] // ✅ Tüm öğrenci bilgileri ekleniyor
  }));

  setCurrentStudent({
    first_name: '',
    last_name: '',
    birth_date: '',
    registration_number: '' // ✅ Sıfırlanıyor
  });

  toast.success('Öğrenci eklendi');
};

    // Branşı kaydet ve listeye ekle
   const saveBranch = () => {
  if (!currentBranch.sport_branch || !currentBranch.age_category) {
    toast.warning('Branş ve kategori seçmelisiniz');
    return;
  }

  if (hasWeights() && !currentBranch.weight_class) {
    toast.warning('Siklet seçmelisiniz');
    return;
  }

  if (currentBranch.students.length === 0) {
    toast.warning('En az bir öğrenci eklemelisiniz');
    return;
  }

  // ✅ DEBUG: Branş objesi kontrol et
  console.log('💾 Kaydedilen branş:', currentBranch);
  console.log('💾 Öğrenciler:', currentBranch.students);

  setFormData(prev => ({
    ...prev,
    branches: [...prev.branches, currentBranch]
  }));

  setCurrentBranch({
    sport_branch: '',
    age_category: '',
    weight_class: '',
    students: []
  });

  toast.success('Branş kaydedildi!');
};

    // Branş sil
    const removeBranch = (index) => {
        setFormData(prev => ({
            ...prev,
            branches: prev.branches.filter((_, i) => i !== index)
        }));
        toast.info('Branş silindi');
    };

    // Öğrenci sil (mevcut branştan)
    const removeStudent = (index) => {
        setCurrentBranch(prev => ({
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

        if (formData.branches.length === 0) {
            setError('En az bir branş eklemelisiniz');
            window.scrollTo({ top: 0, behavior: 'smooth' });
            return;
        }

        setLoading(true);
        setError('');

        try {
            // Her branş için ayrı kayıt oluştur
            for (const branch of formData.branches) {
                const registrationData = {
                    school: formData.school,
                    teacher_name: formData.teacher_name,
                    teacher_phone: formData.teacher_phone,
                    sport_branch: branch.sport_branch,
                    age_category: branch.age_category,
                    weight_class: branch.weight_class || null,
                    students: branch.students,
                    notes: formData.notes
                };
                console.log('📤 Gönderilen data:', registrationData);
      console.log('📤 Öğrenciler:', registrationData.students);
                await createStudentRegistration(registrationData);
            }

            setSuccess(true);
            window.scrollTo({ top: 0, behavior: 'smooth' });

            // Formu sıfırla
            setFormData({
                school: { side: '', district: '', name: '', type: '' },
                teacher_name: '',
                teacher_phone: '',
                notes: '',
                branches: []
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
                                - Birden fazla branş için öğrenci kaydedebilirsiniz.
                            </p>
                            <p className="text-sm sm:text-base text-blue-800 mb-3">
                                - Her branş için ayrı ayrı öğrenci ekleyin.
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
                                <p className="text-sm sm:text-base text-green-700">
                                    Öğrenci kayıtlarınız başarıyla sisteme eklendi.
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
                                                key={`school-${school.id || index}`}
                                                value={school.school_name || school.name}
                                            >
                                                {school.school_name || school.name}
                                            </option>
                                        ))}
                                    </select>
                                    {registeredSchools.length > 0 && (
                                        <p className="text-xs text-gray-500 mt-1">
                                            {registeredSchools.length} okul listelendi
                                        </p>
                                    )}
                                </div>

                                {/* Okul Tipi - Manuel seçim */}
                                <div className="sm:col-span-2">
                                    <label className="block text-sm sm:text-base text-gray-700 font-medium mb-2">
                                        Okul Tipi <span className="text-red-500">*</span>
                                    </label>
                                    <select
                                        value={formData.school.type}
                                        onChange={(e) => setFormData({
                                            ...formData,
                                            school: { ...formData.school, type: e.target.value }
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
                                        if (!formData.school.name || !formData.school.district || !formData.school.side) {
                                            toast.warning('Lütfen tüm okul bilgilerini doldurun');
                                            return;
                                        }
                                        setStep(2);
                                    }}
                                    className="px-6 py-3 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
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
                                        onChange={(e) => setFormData({ ...formData, teacher_name: e.target.value })}
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
                                        onChange={(e) => setFormData({ ...formData, teacher_phone: e.target.value })}
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
                                    className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition"
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
                                    className="px-6 py-3 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
                                >
                                    İleri
                                </button>
                            </div>
                        </div>
                    )}

                    {/* ADIM 3: Branş ve Öğrenci Ekleme */}
                    {step === 3 && (
                        <div>
                            <div className="flex items-center gap-2 mb-4 sm:mb-6">
                                <div className="w-1 h-6 sm:h-8 bg-red-500 rounded-full"></div>
                                <h2 className="text-xl sm:text-2xl font-bold text-gray-800">Branş ve Öğrenci Ekleme</h2>
                            </div>

                            {/* Kaydedilmiş Branşlar */}
                            {formData.branches.length > 0 && (
                                <div className="bg-gradient-to-br from-gray-50 to-green-50 rounded-xl p-4 sm:p-5 border border-gray-200 mb-6">
                                    <h3 className="text-sm sm:text-base font-semibold text-gray-800 mb-3 flex items-center gap-2">
                                        <FaCheckCircle className="text-green-500" />
                                        Kaydedilen Branşlar ({formData.branches.length})
                                    </h3>
                                    <div className="space-y-3">
                                        {formData.branches.map((branch, index) => (
                                            <div key={index} className="bg-white p-4 rounded-lg shadow-sm">
                                                <div className="flex items-start justify-between">
                                                    <div className="flex-1">
                                                        <p className="font-semibold text-gray-900">
                                                            {branch.sport_branch} - {branch.age_category}
                                                            {branch.weight_class && ` (${branch.weight_class} kg)`}
                                                        </p>
                                                        <p className="text-sm text-gray-600 mt-1">
                                                            {branch.students.length} öğrenci kayıtlı
                                                        </p>
                                                        {/* Öğrenci isimleri */}
                                                        <div className="mt-2 flex flex-wrap gap-2">
                                                            {branch.students.map((student, idx) => (
                                                                <span key={idx} className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                                                                    {student.first_name} {student.last_name}
                                                                </span>
                                                            ))}
                                                        </div>
                                                    </div>
                                                    <button
                                                        type="button"
                                                        onClick={() => removeBranch(index)}
                                                        className="text-red-500 hover:text-red-700 p-2 hover:bg-red-50 rounded transition"
                                                    >
                                                        <FaTrash />
                                                    </button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Yeni Branş Ekleme Formu */}
                            <div className="bg-blue-50 rounded-xl p-4 sm:p-6 mb-6">
                                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                                    <FaPlus className="text-blue-600" />
                                    {formData.branches.length > 0 ? 'Yeni Branş Ekle' : 'Branş Bilgileri'}
                                </h3>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                                    {/* Branş */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Branş *</label>
                                        <select
                                            value={currentBranch.sport_branch}
                                            onChange={(e) => setCurrentBranch({
                                                ...currentBranch,
                                                sport_branch: e.target.value,
                                                age_category: '',
                                                weight_class: ''
                                            })}
                                            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                                        >
                                            <option value="">Branş Seçin</option>
                                            {configurations && Object.keys(configurations).map(branch => (
                                                <option key={branch} value={branch}>{branch}</option>
                                            ))}
                                        </select>
                                    </div>

                                    {/* Kategori */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Kategori *</label>
                                        <select
                                            value={currentBranch.age_category}
                                            onChange={(e) => setCurrentBranch({ ...currentBranch, age_category: e.target.value })}
                                            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent disabled:bg-gray-100"
                                            disabled={!currentBranch.sport_branch}
                                        >
                                            <option value="">{currentBranch.sport_branch ? 'Kategori Seçin' : 'Önce branş seçin'}</option>
                                            {getCategories().map(category => (
                                                <option key={category} value={category}>{category}</option>
                                            ))}
                                        </select>
                                    </div>

                                    {/* Siklet (varsa) */}
                                    {hasWeights() && (
                                        <div className="md:col-span-2">
                                            <label className="block text-sm font-medium text-gray-700 mb-2">Siklet *</label>
                                            <select
                                                value={currentBranch.weight_class}
                                                onChange={(e) => setCurrentBranch({ ...currentBranch, weight_class: e.target.value })}
                                                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                                            >
                                                <option value="">Seçiniz</option>
                                                {getWeights().map(weight => (
                                                    <option key={weight} value={weight}>{weight} kg</option>
                                                ))}
                                            </select>
                                        </div>
                                    )}
                                </div>

                                {/* Öğrenci Eklenen Listesi */}
                                {currentBranch.students.length > 0 && (
                                    <div className="bg-white rounded-lg p-4 mb-4">
                                        <h4 className="font-semibold text-gray-900 mb-3">
                                            Bu Branşa Eklenen Öğrenciler ({currentBranch.students.length})
                                        </h4>
                                        <div className="space-y-2">
                                            {currentBranch.students.map((student, index) => (
                                                <div key={index} className="flex items-center justify-between bg-gray-50 p-3 rounded hover:bg-gray-100 transition">
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
                                                        <FaTrash size={16} />
                                                    </button>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* Öğrenci Ekleme Formu */}
                                <div className="bg-white rounded-lg p-4 mb-4">
                                    <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                                        <FaPlus className="text-green-600" size={16} />
                                        Öğrenci Ekle
                                    </h4>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">Adı *</label>
                                            <input
                                                type="text"
                                                value={currentStudent.first_name}
                                                onChange={(e) => setCurrentStudent({ ...currentStudent, first_name: e.target.value })}
                                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                                                placeholder="Öğrenci adı"
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">Soyadı *</label>
                                            <input
                                                type="text"
                                                value={currentStudent.last_name}
                                                onChange={(e) => setCurrentStudent({ ...currentStudent, last_name: e.target.value })}
                                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                                                placeholder="Öğrenci soyadı"
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">Doğum Tarihi *</label>
                                            <input
                                                type="date"
                                                value={currentStudent.birth_date}
                                                onChange={(e) => setCurrentStudent({ ...currentStudent, birth_date: e.target.value })}
                                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
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
                                                    onChange={(e) => setCurrentStudent({ ...currentStudent, registration_number: e.target.value })}
                                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                                                    placeholder="TKD2024XXX"
                                                />
                                            </div>
                                        )}
                                    </div>

                                    <button
                                        type="button"
                                        onClick={addStudentToBranch}
                                        className="w-full mt-4 px-4 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 active:bg-green-700 transition flex items-center justify-center gap-2 font-semibold shadow-md hover:shadow-lg"
                                    >
                                        <FaPlus />
                                        Öğrenci Ekle
                                    </button>
                                </div>

                                {/* Branşı Kaydet */}
                                <button
                                    type="button"
                                    onClick={saveBranch}
                                    disabled={currentBranch.students.length === 0}
                                    className="w-full px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 active:bg-blue-800 transition disabled:bg-gray-400 disabled:cursor-not-allowed font-semibold shadow-md hover:shadow-lg"
                                >
                                    {formData.branches.length > 0 ? 'Bu Branşı Kaydet ve Yeni Branş Ekle' : 'Bu Branşı Kaydet'}
                                </button>
                            </div>

                            {/* Notlar */}
                            <div className="mb-6">
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Eklemek İstediğiniz Notlar
                                </label>
                                <textarea
                                    value={formData.notes}
                                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                                    rows="4"
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent resize-none"
                                    placeholder="Varsa belirtmek istediğiniz notları buraya yazabilirsiniz..."
                                />
                            </div>

                            {/* Navigation Buttons */}
                            <div className="flex justify-between pt-6 border-t border-gray-200">
                                <button
                                    type="button"
                                    onClick={() => setStep(2)}
                                    className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition font-medium"
                                >
                                    Geri
                                </button>
                                <button
                                    type="submit"
                                    disabled={loading || formData.branches.length === 0}
                                    className="px-6 py-3 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-lg hover:from-red-600 hover:to-red-700 active:from-red-700 active:to-red-800 transition disabled:from-gray-400 disabled:to-gray-500 disabled:cursor-not-allowed font-semibold shadow-lg hover:shadow-xl"
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
                                        'Tüm Kayıtları Gönder'
                                    )}
                                </button>
                            </div>

                            {/* Uyarı - En az 1 branş */}
                            {formData.branches.length === 0 && (
                                <div className="bg-yellow-50 border-l-4 border-yellow-400 rounded-lg p-4 mt-4">
                                    <div className="flex items-start gap-3">
                                        <FaInfoCircle className="text-yellow-600 flex-shrink-0 mt-1" />
                                        <p className="text-sm text-yellow-800">
                                            En az bir branş kaydetmelisiniz. Yukarıdaki formu doldurup "Bu Branşı Kaydet" butonuna basın.
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