import React, { useState, useRef } from 'react';
import { BlogPost, BilingualText } from '../types/blog';
import { Button } from './ui/Button';
import { Save, Globe, Upload, X, Image as ImageIcon, Languages } from 'lucide-react';
import { translateAPI } from '../services/apiService';
interface PostEditorProps {
  post?: BlogPost;
  onSave: (post: Omit<BlogPost, 'id'> & {
    id?: string;
  }) => void;
  onCancel: () => void;
  onTranslateSuccess?: () => void;
  onTranslateError?: (message: string) => void;
}
const AVAILABLE_CATEGORIES = ['Sách', 'Phim', 'Học tập', 'AI', 'Nhật kí', 'Tài chính'];
export function PostEditor({
  post,
  onSave,
  onCancel,
  onTranslateSuccess,
  onTranslateError,
}: PostEditorProps) {
  const [formData, setFormData] = useState<Omit<BlogPost, 'id'> & {
    id?: string;
  }>({
    title: {
      en: '',
      vi: ''
    },
    excerpt: {
      en: '',
      vi: ''
    },
    content: {
      en: '',
      vi: ''
    },
    categories: [],
    date: new Date().toISOString().split('T')[0],
    readTime: 5,
    imageUrl: '',
    ...post
  });
  const [activeTab, setActiveTab] = useState<'en' | 'vi'>('en');
  const [isDragging, setIsDragging] = useState(false);
  const [translateLoading, setTranslateLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleTranslateViToEn = async () => {
    const { title, excerpt, content } = formData;
    if (!title.vi?.trim() && !excerpt.vi?.trim() && !content.vi?.trim()) {
      onTranslateError?.('Hãy nhập ít nhất một trường tiếng Việt (tiêu đề, tóm tắt hoặc nội dung).');
      return;
    }
    setTranslateLoading(true);
    try {
      const { translated } = await translateAPI.post({
        title: title.vi || '',
        excerpt: excerpt.vi || '',
        content: content.vi || '',
      });
      setFormData((prev) => ({
        ...prev,
        title: { ...prev.title, en: translated.title },
        excerpt: { ...prev.excerpt, en: translated.excerpt },
        content: { ...prev.content, en: translated.content },
      }));
      setActiveTab('en');
      onTranslateSuccess?.();
    } catch (err) {
      onTranslateError?.(err instanceof Error ? err.message : 'Dịch thất bại.');
    } finally {
      setTranslateLoading(false);
    }
  };

  const handleChange = (field: keyof BlogPost, value: string | number | BilingualText | string[], lang?: 'en' | 'vi') => {
    if (lang && typeof value === 'string') {
      // Handle bilingual fields
      setFormData(prev => ({
        ...prev,
        [field]: {
          ...(prev[field] as BilingualText),
          [lang]: value
        }
      }));
    } else {
      // Handle regular fields
      setFormData(prev => ({
        ...prev,
        [field]: value
      }));
    }
  };
  const handleCategoryToggle = (category: string) => {
    setFormData(prev => {
      const currentCategories = prev.categories || [];
      const newCategories = currentCategories.includes(category) ? currentCategories.filter(c => c !== category) : [...currentCategories, category];
      return {
        ...prev,
        categories: newCategories
      };
    });
  };
  const handleImageUpload = (file: File) => {
    // Validate file type
    if (!file.type.startsWith('image/')) {
      alert('Please upload an image file');
      return;
    }
    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert('File size must be less than 5MB');
      return;
    }
    const reader = new FileReader();
    reader.onloadend = () => {
      handleChange('imageUrl', reader.result as string);
    };
    reader.readAsDataURL(file);
  };
  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleImageUpload(e.target.files[0]);
    }
  };
  const onDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };
  const onDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };
  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleImageUpload(e.dataTransfer.files[0]);
    }
  };
  const removeImage = () => {
    handleChange('imageUrl', '');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.categories.length === 0) {
      alert('Please select at least one category');
      return;
    }
    onSave(formData);
  };
  return <form onSubmit={handleSubmit} className="space-y-8 bg-background rounded-lg border border-border p-6">
      <div className="flex items-center justify-between border-b border-border pb-6">
        <h2 className="text-2xl font-bold tracking-tight">
          {post ? 'Edit Post' : 'Create New Post'}
        </h2>
        <div className="flex items-center gap-2">
          <Button type="button" variant="ghost" onClick={onCancel}>
            Cancel
          </Button>
          <Button type="submit" className="gap-2">
            <Save className="h-4 w-4" />
            Save Post
          </Button>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Common Fields */}
        <div className="space-y-4 md:col-span-2">
          <h3 className="text-lg font-semibold">General Information</h3>
          <div className="grid gap-4 md:grid-cols-3">
            <div className="space-y-2">
              <label className="text-sm font-medium">Date</label>
              <input type="date" required value={formData.date} onChange={e => handleChange('date', e.target.value)} className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Read Time (minutes)</label>
              <input type="number" min="1" required value={formData.readTime} onChange={e => handleChange('readTime', parseInt(e.target.value))} className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring" />
            </div>

            {/* Image Upload Section */}
            <div className="space-y-2">
              <label className="text-sm font-medium">
                Cover Image (Optional)
              </label>
              <div className={`relative flex flex-col items-center justify-center w-full h-32 rounded-md border-2 border-dashed transition-colors ${isDragging ? 'border-primary bg-primary/10' : 'border-input hover:bg-muted/50'} ${formData.imageUrl ? 'border-solid p-0 overflow-hidden' : 'p-4'}`} onDragOver={onDragOver} onDragLeave={onDragLeave} onDrop={onDrop}>
                {formData.imageUrl ? <>
                    <img src={formData.imageUrl} alt="Cover preview" className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-black/40 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                      <Button type="button" variant="secondary" size="sm" onClick={() => fileInputRef.current?.click()}>
                        Change
                      </Button>
                      <Button type="button" variant="destructive" size="sm" className="bg-red-500 hover:bg-red-600 text-white" onClick={removeImage}>
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  </> : <div className="flex flex-col items-center justify-center gap-2 cursor-pointer w-full h-full" onClick={() => fileInputRef.current?.click()}>
                    <div className="p-2 bg-background rounded-full border border-input shadow-sm">
                      <Upload className="h-4 w-4 text-muted-foreground" />
                    </div>
                    <div className="text-center">
                      <p className="text-xs font-medium text-foreground">
                        Click to upload or drag & drop
                      </p>
                      <p className="text-[10px] text-muted-foreground">
                        SVG, PNG, JPG or GIF (max. 5MB)
                      </p>
                    </div>
                  </div>}
                <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={onFileChange} />
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Categories</label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 p-4 border border-input rounded-md bg-background">
              {AVAILABLE_CATEGORIES.map(category => <label key={category} className="flex items-center space-x-2 cursor-pointer hover:bg-muted/50 p-2 rounded transition-colors">
                  <input type="checkbox" checked={formData.categories.includes(category)} onChange={() => handleCategoryToggle(category)} className="h-4 w-4 rounded border-primary text-primary focus:ring-primary" />
                  <span className="text-sm">{category}</span>
                </label>)}
            </div>
            {formData.categories.length === 0 && <p className="text-xs text-destructive">
                Please select at least one category
              </p>}
          </div>
        </div>

        {/* Bilingual Content */}
        <div className="space-y-4 md:col-span-2">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h3 className="text-lg font-semibold">Content</h3>
            <div className="flex items-center gap-2">
              <div className="flex bg-muted rounded-lg p-1">
                <button type="button" onClick={() => setActiveTab('en')} className={`px-3 py-1 text-sm font-medium rounded-md transition-colors ${activeTab === 'en' ? 'bg-background text-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground'}`}>
                  English
                </button>
                <button type="button" onClick={() => setActiveTab('vi')} className={`px-3 py-1 text-sm font-medium rounded-md transition-colors ${activeTab === 'vi' ? 'bg-background text-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground'}`}>
                  Vietnamese
                </button>
              </div>
              <Button
                type="button"
                variant="secondary"
                size="sm"
                onClick={handleTranslateViToEn}
                disabled={translateLoading}
                className="gap-2"
                title="Dịch tiêu đề, tóm tắt và nội dung từ tiếng Việt sang tiếng Anh (Gemini API)"
              >
                <Languages className="h-4 w-4" />
                {translateLoading ? 'Đang dịch...' : 'Tạo bản tiếng Anh từ tiếng Việt'}
              </Button>
            </div>
          </div>
          <p className="text-sm text-muted-foreground">
            Có thể chỉ cần nhập <strong>tiếng Việt</strong> (tiêu đề, tóm tắt, nội dung), rồi bấm &quot;Tạo bản tiếng Anh từ tiếng Việt&quot; để tự dịch sang tiếng Anh (Gemini API).
          </p>

          <div className="grid gap-6 p-6 border border-border rounded-lg bg-muted/5">
            <div className="space-y-2">
              <label className="text-sm font-medium flex items-center gap-2">
                <Globe className="h-4 w-4 text-muted-foreground" />
                Title ({activeTab.toUpperCase()})
              </label>
              <input type="text" required value={formData.title[activeTab]} onChange={e => handleChange('title', e.target.value, activeTab)} className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring" placeholder={activeTab === 'en' ? 'Enter post title' : 'Nhập tiêu đề bài viết'} />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium flex items-center gap-2">
                <Globe className="h-4 w-4 text-muted-foreground" />
                Excerpt ({activeTab.toUpperCase()})
              </label>
              <textarea required rows={3} value={formData.excerpt[activeTab]} onChange={e => handleChange('excerpt', e.target.value, activeTab)} className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring" placeholder={activeTab === 'en' ? 'Brief summary of the post...' : 'Tóm tắt ngắn gọn về bài viết...'} />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium flex items-center gap-2">
                <Globe className="h-4 w-4 text-muted-foreground" />
                Content ({activeTab.toUpperCase()})
              </label>
              <textarea required rows={10} value={formData.content[activeTab]} onChange={e => handleChange('content', e.target.value, activeTab)} className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring font-mono" placeholder={activeTab === 'en' ? '<p>Write your content here...</p>' : '<p>Viết nội dung của bạn ở đây...</p>'} />
              <p className="text-xs text-muted-foreground">
                HTML tags are supported for formatting.
              </p>
            </div>
          </div>
        </div>
      </div>
    </form>;
}