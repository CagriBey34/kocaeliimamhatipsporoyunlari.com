import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Sparkles, User, Lock, ArrowRight, AlertCircle } from 'lucide-react'; // Yeni ikonlar eklendi
import { adminService } from '../../services/api';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Inputlara focus olunca stil değişimi için state
  const [activeField, setActiveField] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    
    try {
      // console.log('Giriş isteği gönderiliyor:', { username, password });
      const response = await adminService.login(username, password);
      
      if (response.success) {
        try {
          const authCheck = await adminService.checkAuth();
          
          if (authCheck.isAuthenticated) {
            sessionStorage.setItem('isLoggedIn', 'true');
            navigate('/admin/dashboard', { replace: true });
          } else {
            setError('Oturum başarılı oldu ancak doğrulanamadı');
          }
        } catch (authError) {
          setError('Oturum doğrulama hatası: ' + (authError.message || 'Bilinmeyen hata'));
        }
      } else {
        setError('Giriş başarısız. Sunucu başarılı bir yanıt dönmedi.');
      }
    } catch (error) {
      console.error('Giriş hatası:', error);
      setError('Giriş başarısız. Lütfen bilgilerinizi kontrol edin.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden bg-gray-50">
      
      {/* --- Dashboard ile Eşleşen Arka Plan Dekorasyonu --- */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute -top-[10%] -left-[10%] w-[50%] h-[50%] bg-gradient-to-br from-red-100 to-orange-100 rounded-full blur-3xl opacity-40 animate-pulse"></div>
        <div className="absolute bottom-[10%] -right-[10%] w-[40%] h-[40%] bg-gradient-to-br from-purple-100 to-pink-100 rounded-full blur-3xl opacity-40 animate-pulse delay-1000"></div>
      </div>

      {/* --- Login Kartı --- */}
      <div 
        className="w-full max-w-md relative z-10 px-4"
        style={{ animation: 'fadeInUp 0.6s ease-out forwards' }}
      >
        <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/50 p-8 sm:p-10">
          
        
          {/* Hata Mesajı */}
          {error && (
            <div className="mb-6 p-4 rounded-2xl bg-red-50 border border-red-100 flex items-start gap-3 animate-pulse">
              <AlertCircle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
              <p className="text-sm text-red-600 font-medium">{error}</p>
            </div>
          )}
          
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Kullanıcı Adı Input */}
            <div className="space-y-2">
              <label className="block text-sm font-bold text-gray-700 ml-1">
                Kullanıcı Adı
              </label>
              <div className={`relative group transition-all duration-300 ${activeField === 'username' ? 'scale-[1.02]' : ''}`}>
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <User className={`w-5 h-5 transition-colors duration-300 ${activeField === 'username' ? 'text-red-500' : 'text-gray-400'}`} />
                </div>
                <input 
                  type="text" 
                  value={username}
                  onFocus={() => setActiveField('username')}
                  onBlur={() => setActiveField(null)}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full pl-11 pr-4 py-3.5 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 text-sm focus:ring-2 focus:ring-red-500/20 focus:border-red-500 transition-all duration-300 outline-none hover:bg-white"
                  placeholder="Kullanıcı adınızı giriniz"
                  required 
                />
              </div>
            </div>
            
            {/* Şifre Input */}
            <div className="space-y-2">
              <label className="block text-sm font-bold text-gray-700 ml-1">
                Şifre
              </label>
              <div className={`relative group transition-all duration-300 ${activeField === 'password' ? 'scale-[1.02]' : ''}`}>
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Lock className={`w-5 h-5 transition-colors duration-300 ${activeField === 'password' ? 'text-red-500' : 'text-gray-400'}`} />
                </div>
                <input 
                  type="password" 
                  value={password}
                  onFocus={() => setActiveField('password')}
                  onBlur={() => setActiveField(null)}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-11 pr-4 py-3.5 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 text-sm focus:ring-2 focus:ring-red-500/20 focus:border-red-500 transition-all duration-300 outline-none hover:bg-white"
                  placeholder="••••••••"
                  required 
                />
              </div>
            </div>
            
            {/* Submit Button */}
            <button 
              type="submit" 
              disabled={loading}
              className="w-full group relative flex items-center justify-center py-4 px-4 border border-transparent text-sm font-bold rounded-xl text-white bg-gradient-to-r from-red-500 via-orange-500 to-red-500 bg-[length:200%_auto] hover:bg-[position:right_center] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-all duration-500 shadow-lg shadow-red-500/30 hover:shadow-red-500/50 hover:scale-[1.02] active:scale-[0.98] mt-8"
            >
              {loading ? (
                <div className="w-6 h-6 border-3 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <span>Giriş Yap</span>
                  <ArrowRight className="ml-2 w-5 h-5 transform group-hover:translate-x-1 transition-transform duration-300" />
                </>
              )}
            </button>

          </form>
        </div>

        {/* Footer Link (Opsiyonel) */}
        <p className="text-center mt-8 text-gray-500 text-sm">
          İmam Hatip Spor Oyunları Yönetim Sistemi &copy; 2025
        </p>
      </div>

      <style jsx>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
};

export default Login;