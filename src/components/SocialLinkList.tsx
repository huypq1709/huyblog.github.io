import React from 'react';
import { SocialLink } from '../types/blog';
import { Button } from './ui/Button';
import { Pencil, Trash2, ExternalLink } from 'lucide-react';
import { Facebook, Instagram, Github, Twitter, Linkedin, Youtube, Link as LinkIcon } from 'lucide-react';
interface SocialLinkListProps {
  links: SocialLink[];
  onEdit: (link: SocialLink) => void;
  onDelete: (id: string) => void;
}
export function SocialLinkList({
  links,
  onEdit,
  onDelete
}: SocialLinkListProps) {
  const getIcon = (platform: string) => {
    switch (platform) {
      case 'Facebook':
        return <Facebook className="h-5 w-5" />;
      case 'Instagram':
        return <Instagram className="h-5 w-5" />;
      case 'Github':
        return <Github className="h-5 w-5" />;
      case 'Twitter':
        return <Twitter className="h-5 w-5" />;
      case 'LinkedIn':
        return <Linkedin className="h-5 w-5" />;
      case 'Youtube':
        return <Youtube className="h-5 w-5" />;
      default:
        return <LinkIcon className="h-5 w-5" />;
    }
  };
  return <div className="bg-card rounded-lg border shadow-sm overflow-hidden">
      <div className="divide-y divide-border">
        {links.length === 0 ? <div className="p-8 text-center text-muted-foreground">
            No social links added yet. Click "Add New Link" to get started.
          </div> : links.map(link => <div key={link.id} className="p-4 flex items-center justify-between hover:bg-muted/50 transition-colors">
              <div className="flex items-center gap-4">
                <div className="p-2 bg-muted rounded-full text-foreground">
                  {getIcon(link.platform)}
                </div>
                <div>
                  <h4 className="font-medium text-foreground">
                    {link.platform}
                  </h4>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <span>{link.username}</span>
                    <span className="text-xs">•</span>
                    <a href={link.url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 hover:text-primary hover:underline">
                      {link.url}
                      <ExternalLink className="h-3 w-3" />
                    </a>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-end gap-2">
                <Button variant="ghost" size="icon" onClick={() => onEdit(link)} title="Edit link" className="h-8 w-8">
                  <Pencil className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="icon" onClick={() => onDelete(link.id)} title="Delete link" className="h-8 w-8 text-destructive hover:text-destructive hover:bg-destructive/10">
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>)}
      </div>
    </div>;
}