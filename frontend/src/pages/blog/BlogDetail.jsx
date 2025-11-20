// src/pages/blog/BlogDetail.jsx
import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Calendar, Tag, Eye, ArrowLeft, Share2, User } from 'lucide-react';
import { postService } from '../../services/postService';

const BlogDetail = () => {
  const { slug } = useParams();
  const [post, setPost] = useState(null);
  const [relatedPosts, setRelatedPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (slug) {
      fetchPost();
      window.scrollTo(0, 0);
    }
  }, [slug]);

  const fetchPost = async () => {
    try {
      setLoading(true);
      const data = await postService.getPostBySlug(slug);
      setPost(data.post);
      setRelatedPosts(data.relatedPosts || []);
      setLoading(false);
    } catch (error) {
      console.error('Post yüklenirken hata:', error);
      setError('Post yüklenemedi');
      setLoading(false);
    }
  };

  const getImageUrl = (imagePath) => {
    if (!imagePath) return '/api/placeholder/1200/600';
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

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: post.title,
        url: window.location.href
      }).catch(console.error);
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert('Bağlantı panoya kopyalandı!');
    }
  };

  const stripHtml = (html) => {
    const tmp = document.createElement('DIV');
    tmp.innerHTML = html;
    return tmp.textContent || tmp.innerText || '';
  };

  if (loading) {
    return (
      <div className="w-full min-h-screen flex justify-center items-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-600"></div>
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="w-full min-h-screen flex flex-col justify-center items-center bg-gray-50">
        <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-800 mb-2">İçerik Bulunamadı</h2>
            <p className="text-gray-500 mb-6">{error || 'Aradığınız yazı yayından kaldırılmış olabilir.'}</p>
            <Link
            to="/blog"
            className="inline-flex items-center px-6 py-3 bg-red-600 text-white rounded-full hover:bg-red-700 transition-colors"
            >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Blog'a Dön
            </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen font-sans">
      
      {/* --- HEADER / HERO SECTION --- */}
      <div className="pt-24 pb-12 px-4 relative overflow-hidden">
         {/* Dekoratif Arka Plan */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-red-50 rounded-full filter blur-3xl opacity-50 -mr-20 -mt-20 pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 w-72 h-72 bg-gray-100 rounded-full filter blur-3xl opacity-50 -ml-10 -mb-10 pointer-events-none"></div>

        <div className="max-w-4xl mx-auto relative z-10 ">
            {/* Back Link */}
            <Link
                to="/blog"
                className="inline-flex items-center text-sm text-gray-500 hover:text-red-600 mb-8 transition-colors group mr-4 "
            >
                <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center mr-2 group-hover:bg-red-100 transition-colors">
                    <ArrowLeft className="w-4 h-4" />
                </div>
                Blog Listesine Dön
            </Link>

            {/* Category Badge */}
            <Link
                to={`/blog/category/${post.category_slug}`}
                className="inline-block bg-red-100 text-red-700 px-4 py-1.5 rounded-full text-sm font-bold mb-6 hover:bg-red-200 transition-colors tracking-wide"
            >
                {post.category_name}
            </Link>

            {/* Title */}
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-gray-900 mb-8 leading-tight">
                {post.title}
            </h1>

            {/* Meta Info Bar */}
            <div className="flex flex-wrap items-center justify-between gap-6 py-6 border-t border-gray-100">
                <div className="flex items-center gap-6">
                    {/* Author Info */}
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden border-2 border-white shadow-sm">
                             <User className="w-5 h-5 text-gray-500" />
                        </div>
                        <div>
                            <p className="text-sm font-bold text-gray-900">Editör</p>
                            <div className="flex items-center text-xs text-gray-500">
                                <Calendar className="w-3 h-3 mr-1" />
                                {formatDate(post.published_at)}
                            </div>
                        </div>
                    </div>
                </div>

                <div className="flex items-center gap-4 text-sm text-gray-500">
                    <div className="flex items-center bg-gray-50 px-3 py-1 rounded-lg">
                        <Eye className="w-4 h-4 mr-2 text-gray-400" />
                        {post.view_count}
                    </div>
                    <button
                        onClick={handleShare}
                        className="flex items-center bg-gray-50 hover:bg-red-50 hover:text-red-600 px-3 py-1 rounded-lg transition-colors"
                    >
                        <Share2 className="w-4 h-4 mr-2" />
                        Paylaş
                    </button>
                </div>
            </div>
        </div>
      </div>

      {/* --- FEATURED IMAGE --- */}
      <div className="max-w-5xl mx-auto px-4 -mt-8 relative z-20">
          {post.thumbnail && (
            <div className="rounded-3xl overflow-hidden shadow-2xl border-4 border-white">
              <img
                src={getImageUrl(post.thumbnail)}
                alt={post.title}
                className="w-full h-[400px] md:h-[500px] object-cover"
                onError={(e) => {
                  e.target.src = '/api/placeholder/1200/600';
                }}
              />
            </div>
          )}
      </div>

      {/* --- CONTENT AREA (Kutu stili kaldırıldı) --- */}
      <div className="max-w-3xl mx-auto px-4 mt-12">
         {/* Eski stil: className="bg-white p-8 md:p-12 rounded-3xl shadow-sm border border-gray-100" 
            Yeni stil: Sadece padding (py-4) bırakıldı, kutu/bg/border kaldırıldı.
         */}
         <article className="py-4">
            
            {/* Main Text */}
            <div
              className="prose prose-lg max-w-none
                prose-headings:font-bold prose-headings:text-gray-900 prose-headings:mt-12 prose-headings:mb-6
                prose-p:text-gray-700 prose-p:leading-relaxed prose-p:mb-8 prose-p:text-lg
                prose-a:text-red-600 prose-a:font-semibold prose-a:no-underline hover:prose-a:underline
                prose-strong:text-gray-900 prose-strong:font-extrabold
                prose-ul:list-disc prose-ul:pl-6 prose-ul:my-6 prose-li:text-gray-700 prose-li:mb-3
                prose-img:rounded-2xl prose-img:shadow-lg prose-img:my-10
                /* Blockquote stilini güncelledik: Arka plan beyaz oldu ki gri zeminde öne çıksın */
                prose-blockquote:border-l-4 prose-blockquote:border-red-500 prose-blockquote:bg-white prose-blockquote:py-6 prose-blockquote:px-8 prose-blockquote:rounded-r-xl prose-blockquote:shadow-sm prose-blockquote:text-gray-800 prose-blockquote:italic prose-blockquote:not-italic"
              dangerouslySetInnerHTML={{ __html: post.content }}
            />

            {/* Tags Footer */}
            {post.tags && post.tags.length > 0 && (
              <div className="mt-16 pt-8 border-t border-gray-200">
                <div className="flex items-center gap-2 mb-4">
                    <Tag className="w-4 h-4 text-gray-400" />
                    <span className="text-sm font-bold text-gray-500 uppercase tracking-wider">Etiketler</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {post.tags.map((tag) => (
                    <Link
                      key={tag.id}
                      to={`/blog/tag/${tag.slug}`}
                      className="px-4 py-2 bg-white border border-gray-200 hover:border-red-500 hover:text-red-600 text-gray-600 rounded-lg text-sm transition-all duration-300 shadow-sm"
                    >
                      #{tag.name}
                    </Link>
                  ))}
                </div>
              </div>
            )}
         </article>
      </div>

      {/* --- RELATED POSTS --- */}
      {relatedPosts.length > 0 && (
        <div className="max-w-7xl mx-auto px-4 mt-24">
            <div className="flex items-center mb-8 pb-4 border-b border-gray-200">
                <div className="w-1 h-8 bg-red-600 rounded-full mr-4"></div>
                <h2 className="text-2xl font-bold text-gray-900">
                Bunlar da İlginizi Çekebilir
                </h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {relatedPosts.map((relatedPost) => (
                <Link
                  key={relatedPost.id}
                  to={`/blog/${relatedPost.slug}`}
                  className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 hover:-translate-y-1"
                >
                  <div className="relative h-48 overflow-hidden">
                    <img
                      src={getImageUrl(relatedPost.thumbnail)}
                      alt={relatedPost.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      onError={(e) => {
                        e.target.src = '/api/placeholder/800/400';
                      }}
                    />
                  </div>
                  <div className="p-6">
                    <div className="flex items-center text-xs text-gray-400 mb-3">
                      <Calendar className="w-3 h-3 mr-1" />
                      {formatDate(relatedPost.published_at)}
                    </div>
                    <h3 className="text-lg font-bold text-gray-800 group-hover:text-red-600 transition-colors line-clamp-2 mb-2">
                      {relatedPost.title}
                    </h3>
                  </div>
                </Link>
              ))}
            </div>
        </div>
      )}
    </div>
  );
};

export default BlogDetail;