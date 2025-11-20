// src/admin/pages/blog/PostEditor.jsx
import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Save, Image as ImageIcon, Upload } from 'lucide-react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import ImageExtension from '@tiptap/extension-image';
import Link from '@tiptap/extension-link';
import Placeholder from '@tiptap/extension-placeholder';
import { postService } from '../../../services/postService';

const PostEditor = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditMode = Boolean(id);

  const [formData, setFormData] = useState({
    title: '',
    content: '',
    category_id: '',
    thumbnail: '',
    tags: []
  });

  const [categories, setCategories] = useState([]);
  const [allTags, setAllTags] = useState([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [thumbnailPreview, setThumbnailPreview] = useState('');
  const [uploadingThumbnail, setUploadingThumbnail] = useState(false);
  const [uploadingContent, setUploadingContent] = useState(false);

  // TipTap Editor
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [1, 2, 3, 4, 5, 6]
        }
      }),
      ImageExtension.configure({
        inline: true,
        allowBase64: false
      }),
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: 'text-red-500 underline'
        }
      }),
      Placeholder.configure({
        placeholder: 'İçeriğinizi buraya yazın...'
      })
    ],
    content: formData.content,
    onUpdate: ({ editor }) => {
      setFormData(prev => ({ ...prev, content: editor.getHTML() }));
    },
    editorProps: {
      attributes: {
        class: 'prose prose-lg max-w-none focus:outline-none min-h-[400px] px-4 py-3'
      }
    }
  });

  useEffect(() => {
    fetchCategories();
    fetchTags();
    if (isEditMode) {
      fetchPost();
    }
  }, [id]);

  const fetchCategories = async () => {
    try {
      const data = await postService.getAllCategories();
      setCategories(data.categories || []);
    } catch (error) {
      console.error('Kategoriler yüklenirken hata:', error);
    }
  };

  const fetchTags = async () => {
    try {
      const data = await postService.getAllTags();
      setAllTags(data.tags || []);
    } catch (error) {
      console.error('Tag\'ler yüklenirken hata:', error);
    }
  };

  const fetchPost = async () => {
    try {
      setLoading(true);
      const data = await postService.getPostById(id);
      const post = data.post;
      
      setFormData({
        title: post.title,
        content: post.content,
        category_id: post.category_id,
        thumbnail: post.thumbnail || '',
        tags: post.tags.map(tag => tag.id)
      });
      
      if (post.thumbnail) {
        const baseUrl = import.meta.env.PROD ? '' : 'http://localhost:8561';
        setThumbnailPreview(`${baseUrl}${post.thumbnail}`);
      }
      
      if (editor) {
        editor.commands.setContent(post.content);
      }
      
      setLoading(false);
    } catch (error) {
      console.error('Post yüklenirken hata:', error);
      alert('Post yüklenemedi');
      navigate('/admin/blog');
    }
  };

  const handleThumbnailUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      setUploadingThumbnail(true);
      const data = await postService.uploadThumbnail(file);
      
      const baseUrl = import.meta.env.PROD ? '' : 'http://localhost:8561';
      setFormData(prev => ({ ...prev, thumbnail: data.url }));
      setThumbnailPreview(`${baseUrl}${data.url}`);
      setUploadingThumbnail(false);
    } catch (error) {
      console.error('Thumbnail yüklenirken hata:', error);
      alert('Resim yüklenirken bir hata oluştu');
      setUploadingThumbnail(false);
    }
  };

  const handleContentImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      setUploadingContent(true);
      const data = await postService.uploadContentImage(file);
      
      const baseUrl = import.meta.env.PROD ? '' : 'http://localhost:8561';
      const imageUrl = `${baseUrl}${data.url}`;
      
      if (editor) {
        editor.chain().focus().setImage({ src: imageUrl }).run();
      }
      
      setUploadingContent(false);
    } catch (error) {
      console.error('İçerik resmi yüklenirken hata:', error);
      alert('Resim yüklenirken bir hata oluştu');
      setUploadingContent(false);
    }
  };

  const handleTagToggle = (tagId) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.includes(tagId)
        ? prev.tags.filter(id => id !== tagId)
        : [...prev.tags, tagId]
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.title || !formData.content || !formData.category_id) {
      alert('Başlık, içerik ve kategori gereklidir');
      return;
    }

    try {
      setSaving(true);
      
      const postData = {
        ...formData,
        content: editor.getHTML()
      };

      if (isEditMode) {
        await postService.updatePost(id, postData);
        alert('Post başarıyla güncellendi');
      } else {
        await postService.createPost(postData);
        alert('Post başarıyla oluşturuldu');
      }
      
      navigate('/admin/blog');
    } catch (error) {
      console.error('Post kaydedilirken hata:', error);
      alert('Post kaydedilirken bir hata oluştu');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-500"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center">
          <button
            onClick={() => navigate('/admin/blog')}
            className="mr-4 text-gray-600 hover:text-gray-800"
          >
            <ArrowLeft className="w-6 h-6" />
          </button>
          <h1 className="text-3xl font-bold text-gray-800">
            {isEditMode ? 'Post Düzenle' : 'Yeni Post'}
          </h1>
        </div>
        <button
          onClick={handleSubmit}
          disabled={saving}
          className="flex items-center bg-red-500 hover:bg-red-600 text-white px-6 py-3 rounded-lg transition-colors disabled:opacity-50"
        >
          <Save className="w-5 h-5 mr-2" />
          {saving ? 'Kaydediliyor...' : 'Kaydet'}
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Title */}
            <div className="bg-white rounded-lg shadow p-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Başlık *
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                placeholder="Post başlığı..."
                required
              />
            </div>

            {/* Content Editor */}
            <div className="bg-white rounded-lg shadow">
              <div className="border-b border-gray-200 p-4">
                <div className="flex flex-wrap gap-2">
                  {/* Heading Buttons */}
                  {[1, 2, 3, 4, 5, 6].map(level => (
                    <button
                      key={level}
                      type="button"
                      onClick={() => editor.chain().focus().toggleHeading({ level }).run()}
                      className={`px-3 py-1 text-sm border rounded ${
                        editor?.isActive('heading', { level })
                          ? 'bg-red-500 text-white border-red-500'
                          : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                      }`}
                    >
                      H{level}
                    </button>
                  ))}

                  <div className="w-px bg-gray-300 mx-2" />

                  {/* Text Format Buttons */}
                  <button
                    type="button"
                    onClick={() => editor.chain().focus().toggleBold().run()}
                    className={`px-3 py-1 text-sm font-bold border rounded ${
                      editor?.isActive('bold')
                        ? 'bg-red-500 text-white border-red-500'
                        : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    B
                  </button>
                  <button
                    type="button"
                    onClick={() => editor.chain().focus().toggleItalic().run()}
                    className={`px-3 py-1 text-sm italic border rounded ${
                      editor?.isActive('italic')
                        ? 'bg-red-500 text-white border-red-500'
                        : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    I
                  </button>

                  <div className="w-px bg-gray-300 mx-2" />

                  {/* List Buttons */}
                  <button
                    type="button"
                    onClick={() => editor.chain().focus().toggleBulletList().run()}
                    className={`px-3 py-1 text-sm border rounded ${
                      editor?.isActive('bulletList')
                        ? 'bg-red-500 text-white border-red-500'
                        : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    • Liste
                  </button>
                  <button
                    type="button"
                    onClick={() => editor.chain().focus().toggleOrderedList().run()}
                    className={`px-3 py-1 text-sm border rounded ${
                      editor?.isActive('orderedList')
                        ? 'bg-red-500 text-white border-red-500'
                        : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    1. Liste
                  </button>

                  <div className="w-px bg-gray-300 mx-2" />

                  {/* Image Upload */}
                  <label className="px-3 py-1 text-sm border rounded bg-white text-gray-700 border-gray-300 hover:bg-gray-50 cursor-pointer flex items-center">
                    <ImageIcon className="w-4 h-4 mr-1" />
                    {uploadingContent ? 'Yükleniyor...' : 'Resim'}
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleContentImageUpload}
                      className="hidden"
                      disabled={uploadingContent}
                    />
                  </label>
                </div>
              </div>

              <EditorContent editor={editor} />
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Category */}
            <div className="bg-white rounded-lg shadow p-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Kategori *
              </label>
              <select
                value={formData.category_id}
                onChange={(e) => setFormData({ ...formData, category_id: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                required
              >
                <option value="">Seçiniz</option>
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Thumbnail */}
            <div className="bg-white rounded-lg shadow p-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Kapak Görseli
              </label>
              
              {thumbnailPreview && (
                <div className="mb-4">
                  <img
                    src={thumbnailPreview}
                    alt="Önizleme"
                    className="w-full rounded-lg"
                  />
                </div>
              )}
              
              <label className="flex items-center justify-center w-full px-4 py-3 bg-white text-gray-700 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer hover:bg-gray-50">
                <Upload className="w-5 h-5 mr-2" />
                <span>{uploadingThumbnail ? 'Yükleniyor...' : 'Resim Yükle'}</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleThumbnailUpload}
                  className="hidden"
                  disabled={uploadingThumbnail}
                />
              </label>
            </div>

            {/* Tags */}
            <div className="bg-white rounded-lg shadow p-6">
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Etiketler
              </label>
              <div className="space-y-2 max-h-64 overflow-y-auto">
                {allTags.map((tag) => (
                  <label key={tag.id} className="flex items-center">
                    <input
                      type="checkbox"
                      checked={formData.tags.includes(tag.id)}
                      onChange={() => handleTagToggle(tag.id)}
                      className="rounded text-red-500 focus:ring-red-500"
                    />
                    <span className="ml-2 text-sm text-gray-700">{tag.name}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default PostEditor;