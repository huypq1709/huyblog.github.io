import React from 'react';
import { ArrowLeft, Calendar, Clock } from 'lucide-react';
import { BlogPost as BlogPostType } from '../types/blog';
import { useLanguage } from '../context/LanguageContext';
import { Button } from './ui/Button';
interface BlogPostProps {
  post: BlogPostType;
  onBack: () => void;
}
export function BlogPost({
  post,
  onBack
}: BlogPostProps) {
  const {
    language,
    t
  } = useLanguage();
  return <article className="max-w-3xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
      <Button variant="ghost" onClick={onBack} className="mb-8 pl-0 hover:pl-2 transition-all">
        <ArrowLeft className="mr-2 h-4 w-4" />
        {t('backToHome')}
      </Button>

      <header className="mb-8">
        <div className="flex flex-wrap items-center gap-2 mb-4">
          {post.categories.map(category => <span key={category} className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors border-transparent bg-primary text-primary-foreground">
              {category}
            </span>)}
        </div>

        <h1 className="text-3xl md:text-5xl font-bold tracking-tight mb-6 text-foreground">
          {post.title[language]}
        </h1>

        <div className="flex flex-wrap items-center gap-6 text-sm text-muted-foreground border-b border-border pb-8">
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            <time dateTime={post.date}>{post.date}</time>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4" />
            <span>
              {post.readTime} {t('minRead')}
            </span>
          </div>
        </div>
      </header>

      <div className="prose prose-lg dark:prose-invert max-w-none prose-headings:font-bold prose-headings:tracking-tight prose-a:text-primary prose-img:rounded-xl" dangerouslySetInnerHTML={{
      __html: post.content[language]
    }} />

      <div className="mt-12 pt-8 border-t border-border">
        <Button onClick={onBack} variant="outline">
          <ArrowLeft className="mr-2 h-4 w-4" />
          {t('backToHome')}
        </Button>
      </div>
    </article>;
}