// src/pages/blog/Blog.jsx
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Calendar, Tag, Eye, ChevronLeft, ChevronRight, Search, ArrowRight } from 'lucide-react';
import { postService } from '../../services/postService';

const Blog = () => {
  const [posts, setPosts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [popularTags, setPopularTags] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 6, // Kartlar büyük olduğu için sayfa başına 6 adet ideal
    total: 0,
    totalPages: 0
  });

  useEffect(() => {
    fetchCategories();
    fetchPopularTags();
  }, []);

  useEffect(() => {
    fetchPosts();
  }, [pagination.page, selectedCategory]);

  const fetchPosts = async () => {
    try {
      setLoading(true);
      const data = await postService.getAllPosts(
        pagination.page,
        pagination.limit,
        selectedCategory
      );
      
      setPosts(data.posts || []);
      setPagination(prev => ({
        ...prev,
        ...data.pagination
      }));
      setLoading(false);
    } catch (error) {
      console.error('Postlar yüklenirken hata:', error);
      setError('Postlar yüklenemedi');
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const data = await postService.getAllCategories();
      setCategories(data.categories || []);
    } catch (error) {
      console.error('Kategoriler yüklenirken hata:', error);
    }
  };

  const fetchPopularTags = async () => {
    try {
      const data = await postService.getPopularTags(10);
      setPopularTags(data.tags || []);
    } catch (error) {
      console.error('Tag\'ler yüklenirken hata:', error);
    }
  };

  const getImageUrl = (imagePath) => {
    if (!imagePath) return '/api/placeholder/800/600';
    const baseUrl = import.meta.env.PROD ? '' : 'http://localhost:8561';
    return `${baseUrl}${imagePath.startsWith('/') ? imagePath : `/${imagePath}`}`;
  };

  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('tr-TR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const stripHtml = (html) => {
    const tmp = document.createElement('DIV');
    tmp.innerHTML = html;
    return tmp.textContent || tmp.innerText || '';
  };

  const handleCategoryClick = (categoryId) => {
    setSelectedCategory(categoryId === selectedCategory ? null : categoryId);
    setPagination(prev => ({ ...prev, page: 1 }));
  };

  const handlePageChange = (newPage) => {
    setPagination(prev => ({ ...prev, page: newPage }));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen  font-sans">
      
      {/* --- HERO SECTION (Light Mode - Header Uyumlu) --- */}
      <div className="border-b border-gray-100 py-16 px-4 relative overflow-hidden">
        {/* Arka plan dekoratif elementler */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-red-100 rounded-full filter blur-3xl opacity-30 -mr-20 -mt-20"></div>
        <div className="absolute bottom-0 left-0 w-72 h-72 bg-gray-100 rounded-full filter blur-3xl opacity-50 -ml-10 -mb-10"></div>

        <div className="max-w-7xl mx-auto relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
            <h1 className="text-4xl md:text-6xl font-extrabold mb-6 leading-tight text-gray-900">
                Keşfetmeye <span className="text-red-600 relative inline-block">
                Başla
                {/* Alt çizgi vektörü */}
                <svg className="absolute w-full h-3 -bottom-1 left-0 text-red-200 -z-10" viewBox="0 0 100 10" preserveAspectRatio="none">
                    <path d="M0 5 Q 50 10 100 5" stroke="currentColor" strokeWidth="8" fill="none" />
                </svg>
                </span>.<br />
                Haberleri Yakala.
            </h1>
            
            <p className="text-gray-600 text-lg mb-8 max-w-md leading-relaxed">
                İmam Hatip Spor Oyunları ile ilgili en güncel gelişmeler, başarı hikayeleri ve duyurular burada.
            </p>
            
            {/* Search Bar */}
            <div className="relative max-w-lg group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400 group-focus-within:text-red-500 transition-colors" />
                </div>
                <input 
                type="text" 
                placeholder="haber veya başarı hikayesi ara..." 
                className="w-full bg-gray-50 border border-gray-200 text-gray-900 text-sm rounded-full py-4 pl-12 pr-32 focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 transition-all shadow-sm hover:shadow-md"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                />
                <button className="absolute right-2 top-2 bottom-2 bg-red-600 text-white px-6 rounded-full text-sm font-medium hover:bg-red-700 transition-colors shadow-md shadow-red-200">
                Ara
                </button>
            </div>
            </div>
            
            {/* Sağ Taraf - Dekoratif Görsel Alanı */}
            <div className="hidden lg:flex justify-end relative">
                <div className="relative w-80 h-96">
                    {/* Dekoratif Kart 1 (Ön) */}
                    <div className="absolute top-0 right-0 w-64 h-80 bg-white rounded-2xl shadow-2xl transform rotate-3 border border-gray-100 p-4 z-10 hover:rotate-0 transition-transform duration-500">
                        <div className="w-full h-40 bg-gradient-to-br from-red-500 to-red-600 rounded-xl mb-4 relative overflow-hidden">
                        <div className="absolute bottom-0 left-0 w-full h-1/2 bg-white/10 backdrop-blur-sm"></div>
                        </div>
                        <div className="h-4 bg-gray-100 rounded w-3/4 mb-3"></div>
                        <div className="h-3 bg-gray-50 rounded w-full mb-2"></div>
                        <div className="h-3 bg-gray-50 rounded w-2/3 mb-4"></div>
                        <div className="flex items-center gap-2 mt-8">
                        <div className="w-8 h-8 rounded-full bg-red-100 flex items-center justify-center text-red-500 text-xs font-bold">IH</div>
                        <div className="h-3 bg-gray-100 rounded w-20"></div>
                        </div>
                    </div>

                    {/* Dekoratif Kart 2 (Arka) */}
                    <div className="absolute top-8 right-12 w-64 h-80 bg-gray-50 rounded-2xl transform -rotate-6 border border-gray-200 p-4 z-0 opacity-60">
                        <div className="w-full h-40 bg-gray-200 rounded-xl mb-4"></div>
                    </div>
                </div>
            </div>
        </div>
      </div>

      {/* --- MAIN CONTENT --- */}
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          
          {/* SIDEBAR */}
          <aside className="lg:col-span-3 space-y-10">
            {/* Kategoriler */}
            <div>
              <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-6">Konu Başlıkları</h3>
              <div className="space-y-1">
                <button
                  onClick={() => handleCategoryClick(null)}
                  className={`w-full text-left px-4 py-3 rounded-xl transition-all flex items-center group ${
                    selectedCategory === null
                      ? 'bg-red-50 text-red-600 font-semibold border border-red-100'
                      : 'text-gray-600 hover:bg-white hover:shadow-sm hover:text-red-500'
                  }`}
                >
                  <span className={`w-2 h-2 rounded-full mr-3 ${selectedCategory === null ? 'bg-red-500' : 'bg-gray-300 group-hover:bg-red-400'}`}></span>
                  Tümü
                </button>
                {categories.map((category) => (
                  <button
                    key={category.id}
                    onClick={() => handleCategoryClick(category.id)}
                    className={`w-full text-left px-4 py-3 rounded-xl transition-all flex items-center justify-between group ${
                      selectedCategory === category.id
                        ? 'bg-red-50 text-red-600 font-semibold border border-red-100'
                        : 'text-gray-600 hover:bg-white hover:shadow-sm hover:text-red-500'
                    }`}
                  >
                    <div className="flex items-center">
                       <span className="text-gray-300 mr-2 text-lg group-hover:text-red-300">#</span>
                       <span>{category.name}</span>
                    </div>
                    {selectedCategory === category.id && <ChevronRight className="w-4 h-4" />}
                  </button>
                ))}
              </div>
            </div>

            {/* Popüler Etiketler */}
            {popularTags.length > 0 && (
              <div>
                <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-6">Trend Etiketler</h3>
                <div className="flex flex-wrap gap-2">
                  {popularTags.map((tag) => (
                    <Link
                      key={tag.id}
                      to={`/blog/tag/${tag.slug}`}
                      className="inline-flex items-center px-3 py-1.5 bg-white border border-gray-200 hover:border-red-500 hover:text-red-600 text-gray-600 rounded-lg text-sm transition-colors shadow-sm"
                    >
                      {tag.name}
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </aside>

          {/* POST GRID */}
          <div className="lg:col-span-9">
            
            {/* Üst Başlık */}
            <div className="flex items-center justify-between mb-8 pb-4 border-b border-gray-200/60">
                <h2 className="text-2xl font-bold text-gray-800">
                    {selectedCategory 
                        ? `${categories.find(c => c.id === selectedCategory)?.name} Yazıları` 
                        : 'Son Eklenenler'}
                </h2>
                <span className="text-sm font-medium text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
                    {pagination.total} içerik
                </span>
            </div>

            {loading ? (
              <div className="flex justify-center items-center h-96">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-600"></div>
              </div>
            ) : error ? (
              <div className="bg-red-50 text-red-600 p-6 rounded-xl text-center border border-red-100">
                {error}
              </div>
            ) : posts.length > 0 ? (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
                  {posts.map((post) => (
                    <Link
                      key={post.id}
                      to={`/blog/${post.slug}`}
                      className="group flex flex-col bg-white rounded-2xl overflow-hidden shadow-[0_2px_15px_-3px_rgba(0,0,0,0.07),0_10px_20px_-2px_rgba(0,0,0,0.04)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.12)] transition-all duration-300 border border-gray-100 hover:-translate-y-1"
                    >
                      {/* Card Image */}
                      <div className="relative h-64 overflow-hidden">
                        <img
                          src={getImageUrl(post.thumbnail)}
                          alt={post.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-in-out"
                          onError={(e) => {
                            e.target.src = '/api/placeholder/800/600';
                          }}
                        />
                        <div className="absolute top-4 left-4 bg-white/95 backdrop-blur-md px-3 py-1.5 rounded-lg text-xs font-bold text-red-600 shadow-sm tracking-wide uppercase">
                           {post.category_name}
                        </div>
                      </div>

                      {/* Card Content */}
                      <div className="p-6 flex-1 flex flex-col">
                        <div className="flex items-center text-xs font-medium text-gray-400 mb-4 space-x-4">
                            <span className="flex items-center">
                                <Calendar className="w-3.5 h-3.5 mr-1.5 text-red-400" />
                                {formatDate(post.published_at)}
                            </span>
                            <span className="flex items-center">
                                <Eye className="w-3.5 h-3.5 mr-1.5 text-red-400" />
                                {post.view_count} okunma
                            </span>
                        </div>

                        <h3 className="text-xl font-bold text-gray-800 mb-3 group-hover:text-red-600 transition-colors leading-tight">
                          {post.title}
                        </h3>
                        
                        <p className="text-gray-500 text-sm line-clamp-2 mb-6 flex-1 leading-relaxed">
                          {stripHtml(post.content)}
                        </p>

                        <div className="flex items-center justify-between pt-5 border-t border-gray-50 mt-auto">
                            <div className="flex items-center gap-2">
                                {/* Yazar Avatar (Placeholder) */}
                                <div className="w-8 h-8 rounded-full bg-gray-100 border border-gray-200 flex items-center justify-center">
                                    <span className="text-xs font-bold text-gray-500">EH</span>
                                </div>
                                <span className="text-xs text-gray-500 font-medium">Editör</span>
                            </div>
                            
                            <span className="inline-flex items-center text-sm font-bold text-red-600 group-hover:underline underline-offset-4">
                                Devamını Oku <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                            </span>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>

                {/* Modern Pagination */}
                {pagination.totalPages > 1 && (
                  <div className="flex justify-center items-center gap-2">
                    <button
                      onClick={() => handlePageChange(pagination.page - 1)}
                      disabled={pagination.page === 1}
                      className="w-10 h-10 flex items-center justify-center rounded-full bg-white border border-gray-200 text-gray-600 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      <ChevronLeft className="w-5 h-5" />
                    </button>

                    {[...Array(pagination.totalPages)].map((_, index) => {
                      const pageNum = index + 1;
                      if (
                        pageNum === 1 ||
                        pageNum === pagination.totalPages ||
                        (pageNum >= pagination.page - 1 && pageNum <= pagination.page + 1)
                      ) {
                        return (
                          <button
                            key={pageNum}
                            onClick={() => handlePageChange(pageNum)}
                            className={`w-10 h-10 rounded-full font-medium transition-all ${
                              pagination.page === pageNum
                                ? 'bg-red-600 text-white shadow-lg shadow-red-600/20 scale-110'
                                : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50 hover:border-red-200'
                            }`}
                          >
                            {pageNum}
                          </button>
                        );
                      } else if (
                        pageNum === pagination.page - 2 ||
                        pageNum === pagination.page + 2
                      ) {
                        return <span key={pageNum} className="text-gray-300 px-2">...</span>;
                      }
                      return null;
                    })}

                    <button
                      onClick={() => handlePageChange(pagination.page + 1)}
                      disabled={pagination.page === pagination.totalPages}
                      className="w-10 h-10 flex items-center justify-center rounded-full bg-white border border-gray-200 text-gray-600 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      <ChevronRight className="w-5 h-5" />
                    </button>
                  </div>
                )}
              </>
            ) : (
              <div className="bg-white rounded-2xl p-16 text-center shadow-sm border border-gray-100">
                <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Search className="w-10 h-10 text-gray-300" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Sonuç Bulunamadı</h3>
                <p className="text-gray-500">Aradığınız kriterlere uygun içerik henüz eklenmemiş olabilir.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Blog;