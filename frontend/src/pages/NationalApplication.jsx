import React, { useState, useEffect } from 'react';
import { nationalApplicationService } from '../services/nationalApplicationService';
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
  List,
  Calendar, 
  ChevronRight, 
  ChevronLeft,
  Loader2,
  FileText,
  MapPin
} from 'lucide-react';

const NationalApplication = () => {
  // --- STATE YÖNETİMİ ---
  const [step, setStep] = useState(1);
  const totalSteps = 4;
  
  const [formData, setFormData] = useState({
    school_id: '',
    teacher_name: '',
    teacher_phone: '',
    notes: '',
    categories: [] // Seçilen branşlar listesi
  });

  // Seçim Stateleri
  const [sportCategories, setSportCategories] = useState({});
  const [districts, setDistricts] = useState([]);
  const [schools, setSchools] = useState([]);
  
  const [selectedProvince] = useState('Kocaeli'); // Sabit
  const [selectedDistrict, setSelectedDistrict] = useState('');
  
  const [selectedSport, setSelectedSport] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');

  // UI Stateleri
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  // --- VERİ YÜKLEME ---
  useEffect(() => {
    loadInitialData();
  }, []);

  const loadInitialData = async () => {
    try {
      const categoriesData = await nationalApplicationService.getSportCategories();
      setSportCategories(categoriesData);
      await loadKocaeliDistricts();
    } catch (err) {
      setError('Veriler yüklenirken bir hata oluştu');
      console.error(err);
    }
  };

  const loadKocaeliDistricts = async () => {
    try {
      const districtsData = await nationalApplicationService.getDistrictsByProvince('Kocaeli');
      setDistricts(districtsData);
    } catch (err) {
      // Fallback
      setDistricts(['Başiskele', 'Çayırova', 'Darıca', 'Derince', 'Dilovası', 'Gebze', 'Gölcük', 'İzmit', 'Kandıra', 'Karamürsel', 'Kartepe', 'Körfez']);
    }
  };

  // --- HANDLERS ---

  const handleDistrictChange = async (e) => {
    const district = e.target.value;
    setSelectedDistrict(district);
    setSchools([]);
    setFormData(prev => ({ ...prev, school_id: '' }));

    if (district) {
      try {
        const schoolsData = await nationalApplicationService.getSchoolsByDistrict('Kocaeli', district);
        setSchools(schoolsData);
      } catch (err) {
        console.error('Okullar yüklenirken hata:', err);
        setError('Okullar yüklenirken bir hata oluştu');
      }
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const addCategory = () => {
    if (!selectedSport || !selectedCategory) {
      showErrorTemporary('Lütfen branş ve kategori seçin');
      return;
    }

    const exists = formData.categories.some(
      cat => cat.sport_branch === selectedSport && cat.age_category === selectedCategory
    );

    if (exists) {
      showErrorTemporary('Bu kategori zaten eklenmiş');
      return;
    }

    setFormData(prev => ({
      ...prev,
      categories: [...prev.categories, { sport_branch: selectedSport, age_category: selectedCategory }]
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

  const showErrorTemporary = (msg) => {
    setError(msg);
    setTimeout(() => setError(''), 3000);
  };

  const validateStep = (currentStep) => {
    setError('');
    if (currentStep === 1) {
      if (!selectedDistrict) { showErrorTemporary('Lütfen ilçe seçiniz'); return false; }
      if (!formData.school_id) { showErrorTemporary('Lütfen okul seçiniz'); return false; }
    }
    if (currentStep === 2) {
      if (!formData.teacher_name) { showErrorTemporary('Öğretmen adı zorunludur'); return false; }
      if (!formData.teacher_phone || formData.teacher_phone.length < 10) { showErrorTemporary('Geçerli bir telefon giriniz'); return false; }
    }
    if (currentStep === 3) {
      if (formData.categories.length === 0) { showErrorTemporary('En az bir branş/kategori eklemelisiniz'); return false; }
    }
    return true;
  };

  const handleNext = () => {
    if (validateStep(step)) {
      setStep(prev => prev + 1);
    }
  };

  const handleBack = () => {
    setStep(prev => prev - 1);
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateStep(3)) return; // Final check

    setLoading(true);
    setError('');

    try {
      await nationalApplicationService.createApplication(formData);
      setSuccess(true);
      window.scrollTo({ top: 0, behavior: 'smooth' });

      // Reset
      setFormData({ school_id: '', teacher_name: '', teacher_phone: '', notes: '', categories: [] });
      setSelectedDistrict('');
      setSchools([]);
      setStep(1);
      
      setTimeout(() => setSuccess(false), 8000);
    } catch (err) {
      setError(err.error || 'Başvuru gönderilirken bir hata oluştu');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } finally {
      setLoading(false);
    }
  };

  // Seçilen okul adını bulmak için (Özet ekranı için)
  const getSelectedSchoolName = () => {
    const school = schools.find(s => s.id.toString() === formData.school_id.toString());
    return school ? school.kurum_adi : '';
  };

  return (
    <div className="py-40 sm:py-52 bg-[#FDFBF7] relative overflow-hidden font-sans selection:bg-red-100 selection:text-red-900 min-h-screen">
      
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
                Kocaeli<br/>
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-600 to-red-400">Başvuru Formu.</span>
            </h1>
            <p className="text-slate-500 text-lg font-medium max-w-2xl mx-auto">
                16. İmam Hatip Spor Oyunları Kocaeli kayıt işlemleri.
            </p>
        </div>

        {/* --- BİLGİ KUTUSU --- */}
        <div className="bg-blue-50/50 backdrop-blur-sm border border-blue-100 rounded-[1.5rem] p-6 mb-8 flex items-start gap-4 shadow-sm">
            <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 shrink-0">
                <Info size={20} />
            </div>
            <div>
                <h3 className="text-blue-900 font-bold mb-2">Önemli Bilgilendirme</h3>
                <ul className="text-sm text-blue-800 space-y-1">
                    <li>Bu form sadece <span className="font-bold">Kocaeli İli</span> okulları içindir.</li>
                    <li>Her kayıt formunda sadece bir branş için öğrenci kaydedebilirsiniz.</li>
                    <li>Farklı branşlar için işlemi tekrarlayınız.</li>
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
                <h3 className="text-green-900 font-bold mb-1">Başvurunuz Alındı!</h3>
                <p className="text-sm text-green-800">
                  Kaydınız başarıyla sistemimize iletilmiştir. En kısa sürede sizinle iletişime geçilecektir.
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
                <h3 className="text-red-900 font-bold mb-1">Dikkat</h3>
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
                  <div className="space-y-2 md:col-span-2">
                    <label className="text-sm font-bold text-slate-700 ml-1">İl</label>
                    <div className="w-full px-4 py-3 bg-slate-100 border border-transparent rounded-xl text-slate-500 font-bold flex items-center gap-2">
                      <MapPin size={18} /> Kocaeli
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-700 ml-1">İlçe *</label>
                    <select
                      value={selectedDistrict}
                      onChange={handleDistrictChange}
                      className="w-full px-4 py-3 bg-slate-50 border border-transparent rounded-xl text-slate-900 focus:bg-white focus:ring-2 focus:ring-red-500/20 focus:border-red-200 transition-all outline-none"
                    >
                      <option value="">İlçe Seçiniz</option>
                      {districts.map(d => <option key={d} value={d}>{d}</option>)}
                    </select>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-700 ml-1">Okul Adı *</label>
                    <select
                      name="school_id"
                      value={formData.school_id}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 bg-slate-50 border border-transparent rounded-xl text-slate-900 focus:bg-white focus:ring-2 focus:ring-red-500/20 focus:border-red-200 transition-all outline-none disabled:opacity-50"
                      disabled={!selectedDistrict}
                    >
                      <option value="">{selectedDistrict ? 'Okul Seçiniz' : 'Önce ilçe seçiniz'}</option>
                      {schools.map(school => (
                        <option key={school.id} value={school.id}>
                           {school.kurum_adi} {school.okul_turu === 'ortaokul' ? '(Ortaokul)' : '(Lise)'}
                        </option>
                      ))}
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
                      name="teacher_name"
                      value={formData.teacher_name}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 bg-slate-50 border border-transparent rounded-xl text-slate-900 focus:bg-white focus:ring-2 focus:ring-red-500/20 focus:border-red-200 transition-all outline-none"
                      placeholder="Örn: Ahmet Yılmaz"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-700 ml-1">Telefon *</label>
                    <div className="relative">
                      <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                      <input
                        type="tel"
                        name="teacher_phone"
                        value={formData.teacher_phone}
                        onChange={handleInputChange}
                        className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-transparent rounded-xl text-slate-900 focus:bg-white focus:ring-2 focus:ring-red-500/20 focus:border-red-200 transition-all outline-none"
                        placeholder="05XXXXXXXXX"
                        maxLength={11}
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* ADIM 3: Branş Ekleme */}
            {step === 3 && (
              <div className="animate-fadeIn space-y-8">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-red-50 text-red-600 flex items-center justify-center">
                      <Trophy size={20} />
                  </div>
                  <h2 className="text-2xl font-black text-slate-800">Branş Seçimi</h2>
                </div>

                {/* Eklenen Kategoriler Listesi */}
                {formData.categories.length > 0 && (
                  <div className="bg-slate-50 rounded-[1.5rem] p-5 border border-slate-100">
                    <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-4 flex items-center gap-2">
                      <CheckCircle size={16} className="text-green-500" />
                      Eklenen Kategoriler ({formData.categories.length})
                    </h3>
                    <div className="space-y-3">
                      {formData.categories.map((cat, index) => (
                        <div key={index} className="flex items-center justify-between bg-white p-4 rounded-xl shadow-sm border border-slate-100">
                          <div className="flex items-center gap-4">
                              <div className="w-10 h-10 rounded-full bg-red-50 flex items-center justify-center text-red-500 font-bold">
                                  {index + 1}
                              </div>
                              <div>
                                  <p className="font-bold text-slate-900">
                                      {cat.sport_branch}
                                  </p>
                                  <div className="flex items-center gap-2 text-xs text-slate-500 font-medium">
                                      <span className="bg-blue-50 text-blue-600 px-2 py-0.5 rounded border border-blue-100">
                                          {cat.age_category}
                                      </span>
                                  </div>
                              </div>
                          </div>
                          <button
                            type="button"
                            onClick={() => removeCategory(index)}
                            className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:text-red-600 hover:bg-red-50 transition-all"
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Kategori Ekleme Alanı */}
                <div className="bg-white p-6 rounded-[1.5rem] border-2 border-slate-100 shadow-sm">
                  <h3 className="text-lg font-bold text-slate-900 mb-6 flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-red-100 flex items-center justify-center text-red-600">
                        <Plus size={18} />
                    </div>
                    Listeye Branş Ekle
                  </h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-500 uppercase ml-1">Branş</label>
                      <select
                        value={selectedSport}
                        onChange={(e) => { setSelectedSport(e.target.value); setSelectedCategory(''); }}
                        className="w-full px-4 py-3 bg-slate-50 border border-transparent rounded-xl text-slate-900 focus:bg-white focus:ring-2 focus:ring-red-500/20 focus:border-red-200 transition-all outline-none"
                      >
                        <option value="">Branş Seçin</option>
                        {Object.keys(sportCategories).map(sport => (
                          <option key={sport} value={sport}>{sport}</option>
                        ))}
                      </select>
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-500 uppercase ml-1">Kategori</label>
                      <select
                        value={selectedCategory}
                        onChange={(e) => setSelectedCategory(e.target.value)}
                        className="w-full px-4 py-3 bg-slate-50 border border-transparent rounded-xl text-slate-900 focus:bg-white focus:ring-2 focus:ring-red-500/20 focus:border-red-200 transition-all outline-none disabled:opacity-50"
                        disabled={!selectedSport}
                      >
                        <option value="">{selectedSport ? 'Kategori Seçin' : 'Önce branş seçin'}</option>
                        {selectedSport && sportCategories[selectedSport]?.map(cat => (
                          <option key={cat} value={cat}>{cat}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={addCategory}
                    className="w-full mt-6 px-4 py-3 bg-slate-900 text-white rounded-xl hover:bg-red-600 transition-colors flex items-center justify-center gap-2 font-bold shadow-lg shadow-slate-200"
                  >
                    <Plus size={18} />
                    Ekle
                  </button>
                </div>
              </div>
            )}

            {/* ADIM 4: Özet ve Notlar */}
            {step === 4 && (
              <div className="animate-fadeIn space-y-6">
                 <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 rounded-xl bg-red-50 text-red-600 flex items-center justify-center">
                      <FileText size={20} />
                  </div>
                  <h2 className="text-2xl font-black text-slate-800">Özet ve Onay</h2>
                </div>

                {/* Özet Kartı */}
                <div className="bg-gradient-to-r from-red-600 to-red-500 rounded-[1.5rem] p-6 text-white shadow-xl shadow-red-500/20">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
                    <div>
                      <p className="text-white/60 font-medium mb-1">Okul</p>
                      <p className="font-bold text-white text-lg leading-tight">{getSelectedSchoolName()}</p>
                      <p className="text-white/80 text-sm">{selectedDistrict}</p>
                    </div>
                    <div>
                      <p className="text-white/60 font-medium mb-1">Öğretmen</p>
                      <p className="font-bold text-white text-lg">{formData.teacher_name}</p>
                      <p className="text-white/80 text-sm">{formData.teacher_phone}</p>
                    </div>
                  </div>
                  <div className="mt-4 pt-4 border-t border-white/20">
                     <p className="text-white/60 font-medium mb-1">Başvurulan Branş Sayısı</p>
                     <p className="font-bold text-white text-2xl">{formData.categories.length}</p>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700 ml-1">Eklemek İstediğiniz Notlar</label>
                  <textarea
                    name="notes"
                    value={formData.notes}
                    onChange={handleInputChange}
                    rows="4"
                    className="w-full px-4 py-3 bg-slate-50 border border-transparent rounded-xl text-slate-900 focus:bg-white focus:ring-2 focus:ring-red-500/20 focus:border-red-200 transition-all outline-none resize-none"
                    placeholder="Varsa belirtmek istediğiniz notlar..."
                  ></textarea>
                </div>
              </div>
            )}

          </div>

          {/* --- NAVİGASYON BUTONLARI --- */}
          <div className="flex justify-between pt-8 mt-8 border-t border-slate-100 relative z-20">
            {step > 1 ? (
                <button
                type="button"
                onClick={handleBack}
                className="px-6 py-3 border border-slate-200 text-slate-600 rounded-xl hover:bg-slate-50 hover:text-slate-900 transition font-bold flex items-center gap-2"
              >
                <ChevronLeft size={18} /> Geri
              </button>
            ) : <div></div>}
           
            {step < totalSteps ? (
                <button
                    type="button"
                    onClick={handleNext}
                    className="px-8 py-3 bg-slate-900 text-white rounded-xl hover:bg-red-600 transition font-bold shadow-lg flex items-center gap-2"
                >
                    İleri <ChevronRight size={18} />
                </button>
            ) : (
                <button
                  type="submit"
                  disabled={loading}
                  className="px-8 py-3 bg-red-600 text-white rounded-xl hover:bg-red-700 transition font-bold shadow-lg shadow-red-500/30 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  {loading ? (
                    <>
                      <Loader2 size={18} className="animate-spin" /> Gönderiliyor...
                    </>
                  ) : (
                    <>
                      <CheckCircle size={18} /> Başvuruyu Tamamla
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

export default NationalApplication;