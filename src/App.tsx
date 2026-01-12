import { useState, useEffect } from 'react';
import { LanguageProvider, useLanguage } from './context/LanguageContext';
import { AuthProvider } from './context/AuthContext';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { HomePage } from './pages/HomePage';
import { AdminDashboard } from './pages/AdminDashboard';
import { BlogCard } from './components/BlogCard';
import { BlogPost } from './components/BlogPost';
import { CategoryPage } from './components/CategoryPage';
import { BlogPost as BlogPostType, SocialLink } from './types/blog';
import { Search, Filter, Calendar } from 'lucide-react';
import { postsAPI, socialLinksAPI } from './services/apiService';
type ViewState = 'home' | 'blog' | 'post' | 'admin' | 'books' | 'movies' | 'study' | 'ai' | 'diary' | 'finance';
function BlogContent() {
  const [view, setView] = useState<ViewState>('home');
  const [previousView, setPreviousView] = useState<ViewState>('blog');
  
  const [posts, setPosts] = useState<BlogPostType[]>([]);
  const [socialLinks, setSocialLinks] = useState<SocialLink[]>([]);
  const [selectedPost, setSelectedPost] = useState<BlogPostType | null>(null);

  // Load initial data from API
  useEffect(() => {
    let isMounted = true;

    const loadData = async () => {
      try {
        const [firebasePosts, firebaseLinks] = await Promise.all([
          postsAPI.getAll(),
          socialLinksAPI.getAll()
        ]);

        if (isMounted) {
          // Use API data directly (empty array if no data exists)
          setPosts(firebasePosts);
          setSocialLinks(firebaseLinks);
        }
      } catch (error) {
        console.error('Error loading data from API:', error);
        if (isMounted) {
          // Set empty arrays on error
          setPosts([]);
          setSocialLinks([]);
        }
      }
    };

    loadData();

    return () => {
      isMounted = false;
    };
  }, []);
  const {
    t,
    language
  } = useLanguage();
  
  // Search and Filter State for Blog view
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');
  
  // Get unique categories from all posts
  const allCategories = Array.from(new Set(posts.flatMap(post => post.categories)));
  
  // Filter posts for blog view
  const getFilteredBlogPosts = (): BlogPostType[] => {
    return posts.filter(post => {
      const matchesSearch = searchQuery === '' || 
        post.title.en.toLowerCase().includes(searchQuery.toLowerCase()) || 
        post.title.vi.toLowerCase().includes(searchQuery.toLowerCase()) ||
        post.excerpt.en.toLowerCase().includes(searchQuery.toLowerCase()) ||
        post.excerpt.vi.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = selectedCategory === 'all' || post.categories.includes(selectedCategory);
      const matchesFromDate = fromDate === '' || post.date >= fromDate;
      const matchesToDate = toDate === '' || post.date <= toDate;
      return matchesSearch && matchesCategory && matchesFromDate && matchesToDate;
    });
  };
  const handleHomeClick = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
    setView('home');
    setSelectedPost(null);
  };
  const handleBlogClick = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
    setView('blog');
    setSelectedPost(null);
  };
  const handleAdminClick = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
    setView('admin');
    setSelectedPost(null);
  };
  const handlePostClick = (post: BlogPostType) => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
    // Only save previous view if current view is not 'post'
    if (view !== 'post') {
      setPreviousView(view);
    }
    setSelectedPost(post);
    setView('post');
  };
  const handleBackToBlog = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
    setView(previousView);
    setSelectedPost(null);
  };
  
  // Category handlers
  const handleCategoryClick = (categoryView: 'books' | 'movies' | 'study' | 'ai' | 'diary' | 'finance') => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
    setView(categoryView);
    setSelectedPost(null);
  };
  
  // Get category name for current view
  const getCurrentCategoryName = (): string => {
    const mapping: Record<string, string> = {
      'books': 'Sách',
      'movies': 'Phim',
      'study': 'Học tập',
      'ai': 'AI',
      'diary': 'Nhật kí',
      'finance': 'Tài chính'
    };
    return mapping[view] || '';
  };
  
  // Filter posts by category
  const filterPostsByCategory = (categoryName: string): BlogPostType[] => {
    return posts.filter(post => post.categories.includes(categoryName));
  };
  
  // Get filtered posts for current category view
  const getCategoryPosts = (): BlogPostType[] => {
    const categoryMapping: Record<string, string> = {
      'books': 'Sách',
      'movies': 'Phim',
      'study': 'Học tập',
      'ai': 'AI',
      'diary': 'Nhật kí',
      'finance': 'Tài chính'
    };
    const categoryName = categoryMapping[view];
    if (!categoryName) return [];
    return filterPostsByCategory(categoryName);
  };
  // Refresh data from API
  const refreshData = async () => {
    try {
      const [firebasePosts, firebaseLinks] = await Promise.all([
        postsAPI.getAll(),
        socialLinksAPI.getAll()
      ]);
      setPosts(firebasePosts);
      setSocialLinks(firebaseLinks);
    } catch (error) {
      console.error('Error refreshing data:', error);
    }
  };

  // Post CRUD Operations
  const handleCreatePost = async (newPostData: Omit<BlogPostType, 'id'>) => {
    try {
      await postsAPI.create(newPostData);
      await refreshData(); // Refresh data after creation
    } catch (error) {
      console.error('Error creating post:', error);
      throw error;
    }
  };
  
  const handleUpdatePost = async (updatedPost: BlogPostType) => {
    try {
      const { id, ...postData } = updatedPost;
      await postsAPI.update(id, postData);
      await refreshData(); // Refresh data after update
    } catch (error) {
      console.error('Error updating post:', error);
      throw error;
    }
  };
  
  const handleDeletePost = async (postId: string) => {
    try {
      await postsAPI.delete(postId);
      await refreshData(); // Refresh data after deletion
    } catch (error) {
      console.error('Error deleting post:', error);
      throw error;
    }
  };
  
  // Social Link CRUD Operations
  const handleCreateSocialLink = async (newLinkData: Omit<SocialLink, 'id'>) => {
    try {
      console.log('Creating social link:', newLinkData);
      await socialLinksAPI.create(newLinkData);
      console.log('✅ Social link created successfully');
      await refreshData(); // Refresh data after creation
    } catch (error: any) {
      console.error('❌ Error creating social link:', error);
      throw error; // Re-throw to let caller handle it
    }
  };
  
  const handleUpdateSocialLink = async (updatedLink: SocialLink) => {
    try {
      const { id, ...linkData } = updatedLink;
      await socialLinksAPI.update(id, linkData);
      await refreshData(); // Refresh data after update
    } catch (error) {
      console.error('Error updating social link:', error);
      throw error;
    }
  };
  
  const handleDeleteSocialLink = async (linkId: string) => {
    try {
      await socialLinksAPI.delete(linkId);
      await refreshData(); // Refresh data after deletion
    } catch (error) {
      console.error('Error deleting social link:', error);
      throw error;
    }
  };
  
  return <div className="min-h-screen bg-background text-foreground flex flex-col font-sans antialiased">
      <Header 
        onHomeClick={handleHomeClick} 
        onBlogClick={handleBlogClick} 
        onAdminClick={handleAdminClick}
        onCategoryClick={handleCategoryClick}
        currentView={view} 
      />

      <main className="flex-1">
        {view === 'home' && <HomePage />}

        {view === 'admin' && <AdminDashboard posts={posts} socialLinks={socialLinks} onCreatePost={handleCreatePost} onUpdatePost={handleUpdatePost} onDeletePost={handleDeletePost} onCreateSocialLink={handleCreateSocialLink} onUpdateSocialLink={handleUpdateSocialLink} onDeleteSocialLink={handleDeleteSocialLink} />}

        {view === 'blog' && <div className="container mx-auto px-4 py-12 max-w-5xl animate-in fade-in duration-500">
            <div className="text-center space-y-4 mb-16">
              <h1 className="text-4xl md:text-6xl font-bold tracking-tighter font-sans">
                {t('latestPosts')}
              </h1>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                Stories, thoughts, and experiences shared in English and
                Vietnamese.
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

              <div className="flex flex-col sm:flex-row gap-4">
                {allCategories.length > 0 && (
                  <div className="sm:w-52 relative">
                    <Filter className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
                    <select 
                      value={selectedCategory} 
                      onChange={e => setSelectedCategory(e.target.value)} 
                      aria-label="Filter by category"
                      className="flex h-10 w-full rounded-md border border-input bg-background pl-10 pr-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:border-primary appearance-none cursor-pointer transition-colors hover:border-primary/50"
                    >
                      <option value="all">{language === 'vi' ? 'Tất cả danh mục' : 'All Categories'}</option>
                      {allCategories.map(category => (
                        <option key={category} value={category}>
                          {category}
                        </option>
                      ))}
                    </select>
                  </div>
                )}

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
            {(searchQuery || selectedCategory !== 'all' || fromDate || toDate) && (
              <div className="text-sm text-muted-foreground mb-4">
                {language === 'vi' ? 'Tìm thấy' : 'Found'} {getFilteredBlogPosts().length} {language === 'vi' ? 'bài viết' : 'post'}{getFilteredBlogPosts().length !== 1 ? (language === 'vi' ? '' : 's') : ''}
                {searchQuery && ` ${language === 'vi' ? 'phù hợp với' : 'matching'} "${searchQuery}"`}
                {selectedCategory !== 'all' && ` ${language === 'vi' ? 'trong' : 'in'} ${selectedCategory}`}
                {fromDate && ` ${language === 'vi' ? 'từ' : 'from'} ${fromDate}`}
                {toDate && ` ${language === 'vi' ? 'đến' : 'to'} ${toDate}`}
              </div>
            )}

            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              {getFilteredBlogPosts().map(post => <BlogCard key={post.id} post={post} onClick={handlePostClick} />)}
            </div>

            {getFilteredBlogPosts().length === 0 && <p className="text-center text-muted-foreground py-12">
                {t('noPosts')}
              </p>}
          </div>}

        {view === 'post' && selectedPost && <div className="container mx-auto px-4 py-12">
            <BlogPost post={selectedPost} onBack={handleBackToBlog} />
          </div>}

        {/* Category pages */}
        {(view === 'books' || view === 'movies' || view === 'study' || view === 'ai' || view === 'diary' || view === 'finance') && (
          <CategoryPage 
            posts={getCategoryPosts()} 
            categoryName={getCurrentCategoryName()}
            onPostClick={handlePostClick}
          />
        )}
      </main>

      <Footer socialLinks={socialLinks} />
    </div>;
}
export function App() {
  return <AuthProvider>
      <LanguageProvider>
        <BlogContent />
      </LanguageProvider>
    </AuthProvider>;
}