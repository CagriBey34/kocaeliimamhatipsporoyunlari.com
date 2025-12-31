import React, { useState, useEffect } from 'react';
import { getSportConfigurations, createStudentRegistration } from '../services/studentService';
import { applicationService } from '../services/applicationService';
import { toast } from 'react-toastify';
// Lucide ikonlarına geçiş yapıldı
import { 
  CheckCircle, 
  AlertCircle, 
  Info, 
  Plus, 
  Trash2, 
  School, 
  User, 
  Phone, 
  Trophy, 
  Users, 
  Calendar, 
  ChevronRight, 
  ChevronLeft,
  Loader2,
  FileText
} from 'lucide-react';

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
    school: { side: '', district: '', name: '', type: '' },
    teacher_name: '',
    teacher_phone: '',
    sport_branch: '',
    age_category: '',
    weight_class: '',
    students: [],
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

  const handleSideChange = async (side) => {
    setFormData(prev => ({
      ...prev,
      school: { ...prev.school, side, district: '', name: '', type: '' }
    }));
    try {
      const data = await applicationService.getDistrictsBySide(side);
      setDistricts(data);
      setRegisteredSchools([]);
    } catch (err) {
      console.error(err);
      toast.error('İlçeler yüklenemedi');
    }
  };

  const handleDistrictChange = async (district) => {
    setFormData(prev => ({
      ...prev,
      school: { ...prev.school, district, name: '', type: '' }
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
      console.error(err);
      toast.error('Okullar yüklenemedi');
    }
  };

  const handleSchoolChange = (schoolName) => {
    setFormData(prev => ({
      ...prev,
      school: { ...prev.school, name: schoolName }
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

  const isTaekwondo = () => formData.sport_branch === 'Taekwondo';

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

  const removeStudent = (index) => {
    setFormData(prev => ({
      ...prev,
      students: prev.students.filter((_, i) => i !== index)
    }));
    toast.info('Öğrenci silindi');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // (Validasyonlar korundu)
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
    } finally {
      setLoading(false);
    }
  };

  const totalSteps = hasWeights() ? 6 : 5;

  return (
    <div className="py-44 bg-[#FDFBF7] relative overflow-hidden font-sans selection:bg-red-100 selection:text-red-900 mt-10">
      
      {/* --- ARKA PLAN EFEKTLERİ --- */}
      <div className="absolute inset-0 pointer-events-none opacity-30">
        <div className="absolute top-0 left-1/4 w-px h-full bg-slate-200/60"></div>
        <div className="absolute top-0 left-2/4 w-px h-full bg-slate-200/60"></div>
        <div className="absolute top-0 left-3/4 w-px h-full bg-slate-200/60"></div>
      </div>
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-red-600/5 rounded-full blur-[120px] pointer-events-none -translate-x-1/2 -translate-y-1/2"></div>
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-blue-600/5 rounded-full blur-[100px] pointer-events-none translate-x-1/2 translate-y-1/2"></div>

      <div className="container mx-auto px-4 md:px-6 relative z-10 max-w-5xl">
        
        {/* --- BAŞLIK --- */}
        <div className="text-center mb-12">
            <h1 className="text-4xl md:text-6xl font-black text-slate-900 tracking-tight leading-[0.9] mb-4">
                Öğrenci <br/>
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-600 to-red-400">Kayıt Formu.</span>
            </h1>
            <p className="text-slate-500 text-lg font-medium max-w-2xl mx-auto">
                Sporcularınızı sisteme kaydetmek için aşağıdaki adımları takip ediniz.
            </p>
        </div>

        {/* --- BİLGİ KUTUSU --- */}
        <div className="bg-blue-50/50 backdrop-blur-sm border border-blue-100 rounded-[1.5rem] p-6 mb-8 flex items-start gap-4 shadow-sm">
            <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 shrink-0">
                <Info size={20} />
            </div>
            <div>
                <h3 className="text-blue-900 font-bold mb-2">Önemli Bilgilendirme</h3>
                <ul className="text-sm text-blue-800 space-y-1 list-disc list-inside">
                    <li>Her kayıt formunda sadece bir branş için öğrenci kaydedebilirsiniz.</li>
                    <li>Farklı branşlar için işlemi tekrarlayınız.</li>
                    <li><span className="font-bold text-red-600">Taekwondo</span> branşında sicil numarası zorunludur.</li>
                </ul>
            </div>
        </div>

        {/* --- BAŞARI MESAJI --- */}
        {success && (
          <div className="bg-green-50/50 border border-green-100 rounded-[1.5rem] p-6 mb-8 flex items-start gap-4 shadow-lg shadow-green-100/50 animate-fadeIn">
            <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center text-green-600 shrink-0">
                <CheckCircle size={20} />
            </div>
            <div>
                <h3 className="text-green-900 font-bold mb-1">Kayıt Başarılı!</h3>
                <p className="text-sm text-green-800">
                  Öğrenci kayıtlarınız başarıyla sisteme eklendi. Yeni bir branş için kayıt yapmaya devam edebilirsiniz.
                </p>
            </div>
          </div>
        )}

        {/* --- HATA MESAJI --- */}
        {error && (
          <div className="bg-red-50/50 border border-red-100 rounded-[1.5rem] p-6 mb-8 flex items-start gap-4 shadow-lg shadow-red-100/50 animate-fadeIn">
            <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center text-red-600 shrink-0">
                <AlertCircle size={20} />
            </div>
            <div>
                <h3 className="text-red-900 font-bold mb-1">Hata Oluştu</h3>
                <p className="text-sm text-red-800">{error}</p>
            </div>
          </div>
        )}

        {/* --- FORM KARTI --- */}
        <form onSubmit={handleSubmit} className="bg-white rounded-[2.5rem] border border-slate-100 shadow-xl shadow-slate-200/40 p-6 md:p-10 relative overflow-hidden">
          
          {/* Progress Bar */}
          <div className="mb-10 relative z-10">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Adım {step} / {totalSteps}</span>
              <span className="text-xs font-bold text-red-600 bg-red-50 px-2 py-1 rounded-md">
                {Math.round((step / totalSteps) * 100)}%
              </span>
            </div>
            <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
              <div
                className="bg-red-600 h-full rounded-full transition-all duration-500 ease-out"
                style={{ width: `${(step / totalSteps) * 100}%` }}
              />
            </div>
          </div>

          <div className="relative z-10 min-h-[300px]">
          {/* ADIM 1: Okul Bilgileri */}
          {step === 1 && (
            <div className="animate-fadeIn">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-red-50 text-red-600 flex items-center justify-center">
                    <School size={20} />
                </div>
                <h2 className="text-2xl font-black text-slate-800">Okul Bilgileri</h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700 ml-1">Yaka *</label>
                  <select
                    value={formData.school.side}
                    onChange={(e) => handleSideChange(e.target.value)}
                    className="w-full px-4 py-3 bg-slate-50 border border-transparent rounded-xl text-slate-900 focus:bg-white focus:ring-2 focus:ring-red-500/20 focus:border-red-200 transition-all outline-none"
                    required
                  >
                    <option value="">Seçiniz</option>
                    <option value="Anadolu">Anadolu Yakası</option>
                    <option value="Avrupa">Avrupa Yakası</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700 ml-1">İlçe *</label>
                  <select
                    value={formData.school.district}
                    onChange={(e) => handleDistrictChange(e.target.value)}
                    className="w-full px-4 py-3 bg-slate-50 border border-transparent rounded-xl text-slate-900 focus:bg-white focus:ring-2 focus:ring-red-500/20 focus:border-red-200 transition-all outline-none disabled:opacity-50"
                    required
                    disabled={!formData.school.side}
                  >
                    <option value="">{formData.school.side ? 'İlçe Seçin' : 'Önce yaka seçin'}</option>
                    {districts.map((d, i) => <option key={i} value={d}>{d}</option>)}
                  </select>
                </div>

                <div className="md:col-span-2 space-y-2">
                  <label className="text-sm font-bold text-slate-700 ml-1">Okul Adı *</label>
                  <select
                    value={formData.school.name}
                    onChange={(e) => handleSchoolChange(e.target.value)}
                    className="w-full px-4 py-3 bg-slate-50 border border-transparent rounded-xl text-slate-900 focus:bg-white focus:ring-2 focus:ring-red-500/20 focus:border-red-200 transition-all outline-none disabled:opacity-50"
                    required
                    disabled={!formData.school.district}
                  >
                    <option value="">{formData.school.district ? 'Okul Seçin' : 'Önce ilçe seçin'}</option>
                    {registeredSchools.map((s, i) => <option key={i} value={s.school_name}>{s.school_name}</option>)}
                  </select>
                </div>

                <div className="md:col-span-2 space-y-2">
                  <label className="text-sm font-bold text-slate-700 ml-1">Okul Tipi *</label>
                  <select
                    value={formData.school.type}
                    onChange={(e) => setFormData({ ...formData, school: {...formData.school, type: e.target.value} })}
                    className="w-full px-4 py-3 bg-slate-50 border border-transparent rounded-xl text-slate-900 focus:bg-white focus:ring-2 focus:ring-red-500/20 focus:border-red-200 transition-all outline-none"
                    required
                  >
                    <option value="">Seçiniz</option>
                    <option value="Orta">Ortaokul</option>
                    <option value="Lise">Lise</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* ADIM 2: Öğretmen Bilgileri */}
          {step === 2 && (
            <div className="animate-fadeIn">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-red-50 text-red-600 flex items-center justify-center">
                    <User size={20} />
                </div>
                <h2 className="text-2xl font-black text-slate-800">Öğretmen Bilgileri</h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700 ml-1">Ad Soyad *</label>
                  <input
                    type="text"
                    value={formData.teacher_name}
                    onChange={(e) => setFormData({...formData, teacher_name: e.target.value})}
                    className="w-full px-4 py-3 bg-slate-50 border border-transparent rounded-xl text-slate-900 focus:bg-white focus:ring-2 focus:ring-red-500/20 focus:border-red-200 transition-all outline-none"
                    placeholder="Örn: Ahmet Yılmaz"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700 ml-1">Telefon *</label>
                  <input
                    type="tel"
                    value={formData.teacher_phone}
                    onChange={(e) => setFormData({...formData, teacher_phone: e.target.value})}
                    className="w-full px-4 py-3 bg-slate-50 border border-transparent rounded-xl text-slate-900 focus:bg-white focus:ring-2 focus:ring-red-500/20 focus:border-red-200 transition-all outline-none"
                    placeholder="05XXXXXXXXX"
                    pattern="[0-9]{11}"
                    required
                  />
                </div>
              </div>
            </div>
          )}

          {/* ADIM 3: Branş */}
          {step === 3 && (
            <div className="animate-fadeIn">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-red-50 text-red-600 flex items-center justify-center">
                    <Trophy size={20} />
                </div>
                <h2 className="text-2xl font-black text-slate-800">Branş Seçimi</h2>
              </div>

              <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700 ml-1">Branş *</label>
                  <select
                    value={formData.sport_branch}
                    onChange={(e) => setFormData({ ...formData, sport_branch: e.target.value, age_category: '', weight_class: '' })}
                    className="w-full px-4 py-3 bg-slate-50 border border-transparent rounded-xl text-slate-900 focus:bg-white focus:ring-2 focus:ring-red-500/20 focus:border-red-200 transition-all outline-none"
                    required
                  >
                    <option value="">Branş Seçin</option>
                    {configurations && Object.keys(configurations).map(b => <option key={b} value={b}>{b}</option>)}
                  </select>
              </div>
            </div>
          )}

          {/* ADIM 4: Kategori */}
          {step === 4 && (
            <div className="animate-fadeIn">
               <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-red-50 text-red-600 flex items-center justify-center">
                    <Users size={20} />
                </div>
                <h2 className="text-2xl font-black text-slate-800">Kategori Seçimi</h2>
              </div>

              <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700 ml-1">Kategori *</label>
                  <select
                    value={formData.age_category}
                    onChange={(e) => setFormData({...formData, age_category: e.target.value})}
                    className="w-full px-4 py-3 bg-slate-50 border border-transparent rounded-xl text-slate-900 focus:bg-white focus:ring-2 focus:ring-red-500/20 focus:border-red-200 transition-all outline-none"
                    required
                  >
                    <option value="">Kategori Seçin</option>
                    {getCategories().map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
              </div>
            </div>
          )}

          {/* ADIM 5: Siklet */}
          {step === 5 && hasWeights() && (
            <div className="animate-fadeIn">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-red-50 text-red-600 flex items-center justify-center">
                    <FileText size={20} />
                </div>
                <h2 className="text-2xl font-black text-slate-800">Siklet Seçimi</h2>
              </div>

              <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700 ml-1">Siklet *</label>
                  <select
                    value={formData.weight_class}
                    onChange={(e) => setFormData({...formData, weight_class: e.target.value})}
                    className="w-full px-4 py-3 bg-slate-50 border border-transparent rounded-xl text-slate-900 focus:bg-white focus:ring-2 focus:ring-red-500/20 focus:border-red-200 transition-all outline-none"
                    required
                  >
                    <option value="">Seçiniz</option>
                    {getWeights().map(w => <option key={w} value={w}>{w} kg</option>)}
                  </select>
              </div>
            </div>
          )}

          {/* ADIM 6: Öğrenci Girişi */}
          {step === (hasWeights() ? 6 : 5) && (
            <div className="animate-fadeIn space-y-8">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-red-50 text-red-600 flex items-center justify-center">
                    <User size={20} />
                </div>
                <h2 className="text-2xl font-black text-slate-800">Öğrenci Bilgileri</h2>
              </div>

              {/* Eklenen Öğrenciler Listesi */}
              {formData.students.length > 0 && (
                <div className="bg-slate-50 rounded-[1.5rem] p-5 border border-slate-100">
                  <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-4 flex items-center gap-2">
                    <CheckCircle size={16} className="text-green-500" />
                    Eklenen Öğrenciler ({formData.students.length})
                  </h3>
                  <div className="space-y-3">
                    {formData.students.map((student, index) => (
                      <div key={index} className="flex items-center justify-between bg-white p-4 rounded-xl shadow-sm border border-slate-100">
                        <div className="flex items-center gap-4">
                            <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 font-bold">
                                {index + 1}
                            </div>
                            <div>
                                <p className="font-bold text-slate-900">
                                    {student.first_name} {student.last_name}
                                </p>
                                <div className="flex items-center gap-2 text-xs text-slate-500 font-medium">
                                    <span className="flex items-center gap-1"><Calendar size={12}/> {student.birth_date}</span>
                                    {student.registration_number && (
                                        <span className="bg-blue-50 text-blue-600 px-1.5 py-0.5 rounded border border-blue-100">
                                            Sicil: {student.registration_number}
                                        </span>
                                    )}
                                </div>
                            </div>
                        </div>
                        <button
                          type="button"
                          onClick={() => removeStudent(index)}
                          className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:text-red-600 hover:bg-red-50 transition-all"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Öğrenci Ekleme Formu */}
              <div className="bg-white p-6 rounded-[1.5rem] border-2 border-slate-100 shadow-sm">
                <h3 className="text-lg font-bold text-slate-900 mb-6 flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-red-100 flex items-center justify-center text-red-600">
                      <Plus size={18} />
                  </div>
                  Yeni Öğrenci Ekle
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-500 uppercase ml-1">Ad *</label>
                    <input
                      type="text"
                      value={currentStudent.first_name}
                      onChange={(e) => setCurrentStudent({...currentStudent, first_name: e.target.value})}
                      className="w-full px-4 py-3 bg-slate-50 border border-transparent rounded-xl text-slate-900 focus:bg-white focus:ring-2 focus:ring-red-500/20 focus:border-red-200 transition-all outline-none"
                      placeholder="Öğrenci Adı"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-500 uppercase ml-1">Soyad *</label>
                    <input
                      type="text"
                      value={currentStudent.last_name}
                      onChange={(e) => setCurrentStudent({...currentStudent, last_name: e.target.value})}
                      className="w-full px-4 py-3 bg-slate-50 border border-transparent rounded-xl text-slate-900 focus:bg-white focus:ring-2 focus:ring-red-500/20 focus:border-red-200 transition-all outline-none"
                      placeholder="Öğrenci Soyadı"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-500 uppercase ml-1">Doğum Tarihi *</label>
                    <input
                      type="date"
                      value={currentStudent.birth_date}
                      onChange={(e) => setCurrentStudent({...currentStudent, birth_date: e.target.value})}
                      className="w-full px-4 py-3 bg-slate-50 border border-transparent rounded-xl text-slate-900 focus:bg-white focus:ring-2 focus:ring-red-500/20 focus:border-red-200 transition-all outline-none"
                    />
                  </div>

                  {isTaekwondo() && (
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-500 uppercase ml-1">Sicil No *</label>
                      <input
                        type="text"
                        value={currentStudent.registration_number}
                        onChange={(e) => setCurrentStudent({...currentStudent, registration_number: e.target.value})}
                        className="w-full px-4 py-3 bg-slate-50 border border-transparent rounded-xl text-slate-900 focus:bg-white focus:ring-2 focus:ring-red-500/20 focus:border-red-200 transition-all outline-none"
                        placeholder="Örn: 34-TKD-6025"
                      />
                    </div>
                  )}
                </div>

                <button
                  type="button"
                  onClick={addStudent}
                  className="w-full mt-6 px-4 py-3 bg-slate-900 text-white rounded-xl hover:bg-red-600 transition-colors flex items-center justify-center gap-2 font-bold shadow-lg shadow-slate-200"
                >
                  <Plus size={18} />
                  Listeye Ekle
                </button>
              </div>

              {/* Özet Kartı */}
              {formData.students.length > 0 && (
                <div className="bg-gradient-to-r from-red-600 to-red-500 rounded-[1.5rem] p-6 text-white shadow-xl shadow-red-500/20">
                  <h3 className="text-lg font-bold mb-4 flex items-center gap-2 border-b border-white/20 pb-2">
                    <FileText size={18} /> Kayıt Özeti
                  </h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-sm">
                    <div>
                      <p className="text-white/60 font-medium mb-1">Okul</p>
                      <p className="font-bold text-white text-lg leading-tight">{formData.school.name}</p>
                    </div>
                    <div>
                      <p className="text-white/60 font-medium mb-1">Branş</p>
                      <p className="font-bold text-white text-lg">{formData.sport_branch}</p>
                    </div>
                    <div>
                      <p className="text-white/60 font-medium mb-1">Kategori</p>
                      <p className="font-bold text-white text-lg">{formData.age_category}</p>
                    </div>
                    <div>
                      <p className="text-white/60 font-medium mb-1">Öğrenci</p>
                      <p className="font-bold text-white text-lg">{formData.students.length} Kişi</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
          </div>

          {/* --- NAVİGASYON BUTONLARI --- */}
          <div className="flex justify-between pt-8 mt-8 border-t border-slate-100 relative z-20">
            {step > 1 ? (
                 <button
                 type="button"
                 onClick={() => setStep(step === 6 && !hasWeights() ? 4 : step - 1)}
                 className="px-6 py-3 border border-slate-200 text-slate-600 rounded-xl hover:bg-slate-50 hover:text-slate-900 transition font-bold flex items-center gap-2"
               >
                 <ChevronLeft size={18} /> Geri
               </button>
            ) : <div></div>}
           
            {step < (hasWeights() ? 6 : 5) ? (
                <button
                    type="button"
                    onClick={() => {
                        // Basit validasyonlar
                        if(step === 1 && (!formData.school.name || !formData.school.district)) { toast.warning('Okul bilgileri eksik'); return; }
                        if(step === 2 && (!formData.teacher_name || !formData.teacher_phone)) { toast.warning('Öğretmen bilgileri eksik'); return; }
                        if(step === 3 && !formData.sport_branch) { toast.warning('Branş seçmelisiniz'); return; }
                        if(step === 4 && !formData.age_category) { toast.warning('Kategori seçmelisiniz'); return; }
                        setStep(step + 1);
                    }}
                    className="px-8 py-3 bg-slate-900 text-white rounded-xl hover:bg-red-600 transition font-bold shadow-lg flex items-center gap-2"
                >
                    İleri <ChevronRight size={18} />
                </button>
            ) : (
                <button
                  type="submit"
                  disabled={loading || formData.students.length === 0}
                  className="px-8 py-3 bg-red-600 text-white rounded-xl hover:bg-red-700 transition font-bold shadow-lg shadow-red-500/30 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  {loading ? (
                    <>
                      <Loader2 size={18} className="animate-spin" /> Kaydediliyor...
                    </>
                  ) : (
                    <>
                      <CheckCircle size={18} /> Kaydı Tamamla
                    </>
                  )}
                </button>
            )}
          </div>

        </form>
      </div>
      
      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn {
          animation: fadeIn 0.4s ease-out forwards;
        }
      `}</style>
    </div>
  );
};

export default StudentRegistration;