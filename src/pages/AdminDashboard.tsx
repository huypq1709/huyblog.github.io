import { useState } from 'react';
import { BlogPost, SocialLink } from '../types/blog';
import { PostList } from '../components/PostList';
import { PostEditor } from '../components/PostEditor';
import { SocialLinkList } from '../components/SocialLinkList';
import { SocialLinkEditor } from '../components/SocialLinkEditor';
import { Button } from '../components/ui/Button';
import { ConfirmationDialog } from '../components/ui/ConfirmationDialog';
import { ToastContainer } from '../components/ui/Toast';
import { useToast } from '../hooks/useToast';
import { Plus, LayoutDashboard, FileText, Settings, Link as LinkIcon, Search, Filter, Calendar } from 'lucide-react';
interface AdminDashboardProps {
  posts: BlogPost[];
  socialLinks: SocialLink[];
  onCreatePost: (post: Omit<BlogPost, 'id'>) => void;
  onUpdatePost: (post: BlogPost) => void;
  onDeletePost: (postId: string) => void;
  onCreateSocialLink: (link: Omit<SocialLink, 'id'>) => void;
  onUpdateSocialLink: (link: SocialLink) => void;
  onDeleteSocialLink: (linkId: string) => void;
}
type DashboardView = 'posts-list' | 'posts-create' | 'posts-edit' | 'social-list' | 'social-create' | 'social-edit';
export function AdminDashboard({
  posts,
  socialLinks,
  onCreatePost,
  onUpdatePost,
  onDeletePost,
  onCreateSocialLink,
  onUpdateSocialLink,
  onDeleteSocialLink
}: AdminDashboardProps) {
  const [view, setView] = useState<DashboardView>('posts-list');
  const [editingPost, setEditingPost] = useState<BlogPost | undefined>(undefined);
  const [editingLink, setEditingLink] = useState<SocialLink | undefined>(undefined);
  
  // Toast notifications
  const { toasts, success, error, removeToast } = useToast();
  
  // Confirmation dialog state
  const [confirmDialog, setConfirmDialog] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    onConfirm: () => void;
    variant?: 'danger' | 'warning' | 'info';
  }>({
    isOpen: false,
    title: '',
    message: '',
    onConfirm: () => {},
    variant: 'danger'
  });
  
  // Search and Filter State
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');
  // Get unique categories from all posts
  const allCategories = Array.from(new Set(posts.flatMap(post => post.categories)));
  // Filter posts based on search, category, and date range
  const filteredPosts = posts.filter(post => {
    const matchesSearch = searchQuery === '' || post.title.en.toLowerCase().includes(searchQuery.toLowerCase()) || post.title.vi.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || post.categories.includes(selectedCategory);
    const matchesFromDate = fromDate === '' || post.date >= fromDate;
    const matchesToDate = toDate === '' || post.date <= toDate;
    return matchesSearch && matchesCategory && matchesFromDate && matchesToDate;
  });
  // Post Handlers
  const handleCreatePostClick = () => {
    setEditingPost(undefined);
    setView('posts-create');
  };
  const handleEditPostClick = (post: BlogPost) => {
    setEditingPost(post);
    setView('posts-edit');
  };
  const handleSavePost = async (postData: Omit<BlogPost, 'id'> & {
    id?: string;
  }) => {
    try {
      if (postData.id) {
        await onUpdatePost(postData as BlogPost);
        success('Post updated successfully!');
      } else {
        await onCreatePost(postData);
        success('Post created successfully!');
      }
      setView('posts-list');
    } catch (err: any) {
      error(err?.message || 'Failed to save post. Please try again.');
    }
  };
  // Social Link Handlers
  const handleCreateLinkClick = () => {
    setEditingLink(undefined);
    setView('social-create');
  };
  const handleEditLinkClick = (link: SocialLink) => {
    setEditingLink(link);
    setView('social-edit');
  };
  const handleSaveLink = async (linkData: Omit<SocialLink, 'id'> & {
    id?: string;
  }) => {
    try {
      if (linkData.id) {
        await onUpdateSocialLink(linkData as SocialLink);
        success('Social link updated successfully!');
      } else {
        // Remove id if it exists (shouldn't for new links, but just in case)
        const { id, ...newLinkData } = linkData;
        await onCreateSocialLink(newLinkData);
        success('Social link created successfully!');
      }
      // Wait a bit for realtime sync to update before changing view
      setTimeout(() => {
        setView('social-list');
      }, 100);
    } catch (err: any) {
      error(err?.message || 'Failed to save social link. Please try again.');
      // Keep user on the form if there's an error
    }
  };
  
  // Delete handlers with confirmation
  const handleDeletePost = (postId: string) => {
    const post = posts.find(p => p.id === postId);
    setConfirmDialog({
      isOpen: true,
      title: 'Delete Post',
      message: `Are you sure you want to delete "${post?.title.en || post?.title.vi || 'this post'}"? This action cannot be undone.`,
      variant: 'danger',
      onConfirm: async () => {
        try {
          await onDeletePost(postId);
          success('Post deleted successfully!');
        } catch (err: any) {
          error(err?.message || 'Failed to delete post. Please try again.');
        }
      }
    });
  };
  
  const handleDeleteSocialLink = (linkId: string) => {
    const link = socialLinks.find(l => l.id === linkId);
    setConfirmDialog({
      isOpen: true,
      title: 'Delete Social Link',
      message: `Are you sure you want to delete the ${link?.platform || 'social link'} link? This action cannot be undone.`,
      variant: 'danger',
      onConfirm: async () => {
        try {
          await onDeleteSocialLink(linkId);
          success('Social link deleted successfully!');
        } catch (err: any) {
          error(err?.message || 'Failed to delete social link. Please try again.');
        }
      }
    });
  };
  const handleCancel = () => {
    if (view.startsWith('posts')) {
      setView('posts-list');
      setEditingPost(undefined);
    } else if (view.startsWith('social')) {
      setView('social-list');
      setEditingLink(undefined);
    }
  };
  return <div className="min-h-screen bg-muted/10">
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Sidebar */}
          <aside className="w-full md:w-64 shrink-0 space-y-6">
            <div className="flex items-center gap-2 px-2">
              <LayoutDashboard className="h-6 w-6 text-primary" />
              <h2 className="text-xl font-bold tracking-tight">Admin Panel</h2>
            </div>

            <nav className="space-y-1">
              <button onClick={() => setView('posts-list')} className={`w-full flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-md transition-colors ${view.startsWith('posts') ? 'bg-primary/10 text-primary' : 'text-muted-foreground hover:bg-muted hover:text-foreground'}`}>
                <FileText className="h-4 w-4" />
                Blog Posts
              </button>

              <button onClick={() => setView('social-list')} className={`w-full flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-md transition-colors ${view.startsWith('social') ? 'bg-primary/10 text-primary' : 'text-muted-foreground hover:bg-muted hover:text-foreground'}`}>
                <LinkIcon className="h-4 w-4" />
                Social Links
              </button>

              <button className="w-full flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-md text-muted-foreground hover:bg-muted hover:text-foreground transition-colors">
                <Settings className="h-4 w-4" />
                Settings
              </button>
            </nav>
          </aside>

          {/* Main Content */}
          <main className="flex-1 space-y-6">
            {/* Posts Views */}
            {view === 'posts-list' && <div className="space-y-6 animate-in fade-in duration-300">
                <div className="flex items-center justify-between">
                  <div>
                    <h1 className="text-3xl font-bold tracking-tight">Posts</h1>
                    <p className="text-muted-foreground mt-1">
                      Manage your blog posts and content.
                    </p>
                  </div>
                  <Button onClick={handleCreatePostClick} className="gap-2">
                    <Plus className="h-4 w-4" />
                    New Post
                  </Button>
                </div>

                {/* Search and Filter Section */}
                <div className="flex flex-col xl:flex-row gap-4 bg-background rounded-lg border border-border p-4">
                  <div className="flex-1 relative min-w-[200px]">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <input type="text" placeholder="Search posts by title..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)} className="flex h-10 w-full rounded-md border border-input bg-background pl-10 pr-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring" />
                  </div>

                  <div className="flex flex-col sm:flex-row gap-4">
                    <div className="sm:w-48 relative">
                      <Filter className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
                      <select value={selectedCategory} onChange={e => setSelectedCategory(e.target.value)} aria-label="Filter by category" className="flex h-10 w-full rounded-md border border-input bg-background pl-10 pr-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring appearance-none cursor-pointer">
                        <option value="all">All Categories</option>
                        {allCategories.map(category => <option key={category} value={category}>
                            {category}
                          </option>)}
                      </select>
                    </div>

                    <div className="flex items-center gap-2 p-1.5 border-2 border-primary/20 rounded-xl bg-card shadow-sm hover:border-primary/40 transition-colors">
                      <div className="relative group">
                        <Calendar className="absolute left-3.5 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground/70 group-hover:text-primary transition-colors pointer-events-none" />
                        <input type="date" value={fromDate} onChange={e => setFromDate(e.target.value)} className="flex h-10 w-full sm:w-auto rounded-lg border border-input/60 bg-background pl-12 pr-4 py-2 text-sm shadow-sm ring-offset-background transition-all hover:border-primary/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:border-primary cursor-pointer" placeholder="From Date" />
                      </div>
                      <span className="text-muted-foreground font-medium px-1">
                        -
                      </span>
                      <div className="relative group">
                        <Calendar className="absolute left-3.5 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground/70 group-hover:text-primary transition-colors pointer-events-none" />
                        <input type="date" value={toDate} onChange={e => setToDate(e.target.value)} className="flex h-10 w-full sm:w-auto rounded-lg border border-input/60 bg-background pl-12 pr-4 py-2 text-sm shadow-sm ring-offset-background transition-all hover:border-primary/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:border-primary cursor-pointer" placeholder="To Date" />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Results count */}
                {(searchQuery || selectedCategory !== 'all' || fromDate || toDate) && <div className="text-sm text-muted-foreground">
                    Found {filteredPosts.length} post
                    {filteredPosts.length !== 1 ? 's' : ''}
                    {searchQuery && ` matching "${searchQuery}"`}
                    {selectedCategory !== 'all' && ` in ${selectedCategory}`}
                    {fromDate && ` from ${fromDate}`}
                    {toDate && ` to ${toDate}`}
                  </div>}

                <PostList posts={filteredPosts} onEdit={handleEditPostClick} onDelete={handleDeletePost} />
              </div>}

            {(view === 'posts-create' || view === 'posts-edit') && <div className="animate-in slide-in-from-right-4 duration-300">
                <PostEditor post={editingPost} onSave={handleSavePost} onCancel={handleCancel} />
              </div>}

            {/* Social Links Views */}
            {view === 'social-list' && <div className="space-y-6 animate-in fade-in duration-300">
                <div className="flex items-center justify-between">
                  <div>
                    <h1 className="text-3xl font-bold tracking-tight">
                      Social Links
                    </h1>
                    <p className="text-muted-foreground mt-1">
                      Manage your social media profiles in the footer.
                    </p>
                  </div>
                  <Button onClick={handleCreateLinkClick} className="gap-2">
                    <Plus className="h-4 w-4" />
                    Add Link
                  </Button>
                </div>

                <SocialLinkList links={socialLinks} onEdit={handleEditLinkClick} onDelete={handleDeleteSocialLink} />
              </div>}

            {(view === 'social-create' || view === 'social-edit') && <div className="animate-in slide-in-from-right-4 duration-300">
                <SocialLinkEditor socialLink={editingLink} onSave={handleSaveLink} onCancel={handleCancel} />
              </div>}

          </main>
        </div>
      </div>
      
      {/* Confirmation Dialog */}
      <ConfirmationDialog
        isOpen={confirmDialog.isOpen}
        onClose={() => setConfirmDialog({ ...confirmDialog, isOpen: false })}
        onConfirm={confirmDialog.onConfirm}
        title={confirmDialog.title}
        message={confirmDialog.message}
        variant={confirmDialog.variant}
        confirmText="Delete"
        cancelText="Cancel"
      />
      
      {/* Toast Notifications */}
      <ToastContainer toasts={toasts} onClose={removeToast} />
    </div>;
}