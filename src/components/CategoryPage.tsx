import { useState } from 'react';
import { BlogPost } from '../types/blog';
import { BlogCard } from './BlogCard';
import { useLanguage } from '../context/LanguageContext';
import { Search, Calendar } from 'lucide-react';

interface CategoryPageProps {
  posts: BlogPost[];
  categoryName: string;
  onPostClick: (post: BlogPost) => void;
}

export function CategoryPage({ posts, categoryName, onPostClick }: CategoryPageProps) {
  const { t, language } = useLanguage();
  
  // Search and Filter State
  const [searchQuery, setSearchQuery] = useState('');
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');
  
  // Filter posts based on search and date range (no category filter for category pages)
  const filteredPosts = posts.filter(post => {
    const matchesSearch = searchQuery === '' || 
      post.title.en.toLowerCase().includes(searchQuery.toLowerCase()) || 
      post.title.vi.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.excerpt.en.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.excerpt.vi.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFromDate = fromDate === '' || post.date >= fromDate;
    const matchesToDate = toDate === '' || post.date <= toDate;
    return matchesSearch && matchesFromDate && matchesToDate;
  });

  return (
    <div className="container mx-auto px-4 py-12 max-w-5xl animate-in fade-in duration-500">
      <div className="text-center space-y-4 mb-16">
        <h1 className="text-4xl md:text-6xl font-bold tracking-tighter font-sans">
          {categoryName}
        </h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Stories, thoughts, and experiences shared in English and Vietnamese.
        </p>
      </div>

      {/* Search and Filter Section */}
      <div className="mb-8 flex flex-col lg:flex-row gap-4 bg-background rounded-lg border border-border p-4 shadow-sm">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input 
            type="text" 
            placeholder={language === 'vi' ? 'Tìm kiếm bài viết...' : 'Search posts...'} 
            value={searchQuery} 
            onChange={e => setSearchQuery(e.target.value)} 
            className="flex h-10 w-full rounded-md border border-input bg-background pl-10 pr-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:border-primary transition-colors" 
          />
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <div className="relative group">
              <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground/70 group-hover:text-primary transition-colors pointer-events-none" />
              <input 
                type="date" 
                value={fromDate} 
                onChange={e => setFromDate(e.target.value)} 
                aria-label={language === 'vi' ? 'Từ ngày' : 'From Date'}
                className="flex h-10 w-full sm:w-40 rounded-lg border border-input/60 bg-background pl-10 pr-3 py-2 text-sm shadow-sm ring-offset-background transition-all hover:border-primary/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:border-primary cursor-pointer" 
              />
            </div>
            <span className="text-muted-foreground/70 text-sm font-medium">-</span>
            <div className="relative group">
              <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground/70 group-hover:text-primary transition-colors pointer-events-none" />
              <input 
                type="date" 
                value={toDate} 
                onChange={e => setToDate(e.target.value)} 
                aria-label={language === 'vi' ? 'Đến ngày' : 'To Date'}
                className="flex h-10 w-full sm:w-40 rounded-lg border border-input/60 bg-background pl-10 pr-3 py-2 text-sm shadow-sm ring-offset-background transition-all hover:border-primary/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:border-primary cursor-pointer" 
              />
            </div>
          </div>
        </div>
      </div>

      {/* Results count */}
      {(searchQuery || fromDate || toDate) && (
        <div className="text-sm text-muted-foreground mb-4">
          {language === 'vi' ? 'Tìm thấy' : 'Found'} {filteredPosts.length} {language === 'vi' ? 'bài viết' : 'post'}{filteredPosts.length !== 1 ? (language === 'vi' ? '' : 's') : ''}
          {searchQuery && ` ${language === 'vi' ? 'phù hợp với' : 'matching'} "${searchQuery}"`}
          {fromDate && ` ${language === 'vi' ? 'từ' : 'from'} ${fromDate}`}
          {toDate && ` ${language === 'vi' ? 'đến' : 'to'} ${toDate}`}
        </div>
      )}

      <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
        {filteredPosts.map(post => (
          <BlogCard key={post.id} post={post} onClick={onPostClick} />
        ))}
      </div>

      {filteredPosts.length === 0 && (
        <p className="text-center text-muted-foreground py-12">
          {t('noPosts')}
        </p>
      )}
    </div>
  );
}

