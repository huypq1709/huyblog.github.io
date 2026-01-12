import React from 'react';
import { BlogPost } from '../types/blog';
import { Button } from './ui/Button';
import { Pencil, Trash2, Clock, Calendar } from 'lucide-react';
interface PostListProps {
  posts: BlogPost[];
  onEdit: (post: BlogPost) => void;
  onDelete: (postId: string) => void;
}
export function PostList({
  posts,
  onEdit,
  onDelete
}: PostListProps) {
  if (posts.length === 0) {
    return <div className="text-center py-12 bg-muted/10 rounded-lg border border-dashed border-muted-foreground/25">
        <p className="text-muted-foreground">
          No posts found. Create your first post!
        </p>
      </div>;
  }
  return <div className="bg-background rounded-lg border border-border overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left">
          <thead className="bg-muted/50 text-muted-foreground uppercase text-xs">
            <tr>
              <th className="px-6 py-4 font-medium">Title</th>
              <th className="px-6 py-4 font-medium">Category</th>
              <th className="px-6 py-4 font-medium">Date</th>
              <th className="px-6 py-4 font-medium text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {posts.map(post => <tr key={post.id} className="hover:bg-muted/5 transition-colors">
                <td className="px-6 py-4 font-medium text-foreground">
                  <div className="flex flex-col">
                    <span className="font-semibold">{post.title.en}</span>
                    <span className="text-xs text-muted-foreground mt-1">
                      {post.title.vi}
                    </span>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary/10 text-primary">
                    {post.categories[0] || 'Uncategorized'}
                  </span>
                </td>
                <td className="px-6 py-4 text-muted-foreground">
                  <div className="flex flex-col gap-1">
                    <div className="flex items-center gap-2">
                      <Calendar className="h-3 w-3" />
                      <span>{post.date}</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs">
                      <Clock className="h-3 w-3" />
                      <span>{post.readTime} min read</span>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 text-right">
                  <div className="flex items-center justify-end gap-2">
                    <Button variant="ghost" size="icon" onClick={() => onEdit(post)} title="Edit post" className="h-8 w-8">
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => onDelete(post.id)} title="Delete post" className="h-8 w-8 text-destructive hover:text-destructive hover:bg-destructive/10">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </td>
              </tr>)}
          </tbody>
        </table>
      </div>
    </div>;
}