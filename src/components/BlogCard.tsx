import React from 'react';
import { Calendar, Clock, ArrowRight } from 'lucide-react';
import { BlogPost } from '../types/blog';
import { useLanguage } from '../context/LanguageContext';
interface BlogCardProps {
  post: BlogPost;
  onClick: (post: BlogPost) => void;
}
export function BlogCard({
  post,
  onClick
}: BlogCardProps) {
  const {
    language,
    t
  } = useLanguage();
  return <article className="group flex flex-col rounded-xl border border-border bg-card text-card-foreground shadow-sm transition-all hover:shadow-md hover:border-primary/50 overflow-hidden cursor-pointer" onClick={() => onClick(post)}>
      {post.imageUrl && <div className="aspect-video w-full overflow-hidden bg-muted">
          <img src={post.imageUrl} alt={post.title[language]} className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105" />
        </div>}

      <div className="flex flex-col flex-1 p-6">
        <div className="mb-3 min-h-[3rem] flex flex-col gap-2">
          <div className="flex flex-wrap items-center gap-2">
            {post.categories.map(category => <span key={category} className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80">
                {category}
              </span>)}
          </div>
          <div className="flex items-center gap-4 text-xs text-muted-foreground">
            <div className="flex items-center gap-1">
              <Calendar className="h-3.5 w-3.5" />
              <time dateTime={post.date}>{post.date}</time>
            </div>
            <div className="flex items-center gap-1">
              <Clock className="h-3.5 w-3.5" />
              <span>
                {post.readTime} {t('minRead')}
              </span>
            </div>
          </div>
        </div>

        <h3 className="text-2xl font-bold leading-tight tracking-tight mb-2 group-hover:text-primary transition-colors">
          {post.title[language]}
        </h3>

        <p className="text-muted-foreground mb-6 line-clamp-3 flex-1">
          {post.excerpt[language]}
        </p>

        <div className="mt-auto pt-4 flex items-center text-primary font-medium text-sm group-hover:underline underline-offset-4">
          {t('readMore')}
          <ArrowRight className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-1" />
        </div>
      </div>
    </article>;
}