import React from 'react';
import { Facebook, Instagram, Github, Twitter, Linkedin, Youtube, Link as LinkIcon } from 'lucide-react';
import { SocialLink } from '../types/blog';
interface FooterProps {
  socialLinks?: SocialLink[];
}
export function Footer({
  socialLinks = []
}: FooterProps) {
  const getIcon = (platform: string) => {
    switch (platform) {
      case 'Facebook':
        return <Facebook className="h-4 w-4" />;
      case 'Instagram':
        return <Instagram className="h-4 w-4" />;
      case 'Github':
        return <Github className="h-4 w-4" />;
      case 'Twitter':
        return <Twitter className="h-4 w-4" />;
      case 'LinkedIn':
        return <Linkedin className="h-4 w-4" />;
      case 'Youtube':
        return <Youtube className="h-4 w-4" />;
      default:
        return <LinkIcon className="h-4 w-4" />;
    }
  };
  return <footer className="border-t border-border mt-16 py-12 bg-background">
      <div className="container mx-auto px-4">
        {/* Contact & Social */}
        <div className="flex flex-wrap justify-center gap-6 sm:gap-8">
          {socialLinks.length > 0 ? socialLinks.map(link => <a key={link.id} href={link.url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-blue-500 hover:underline transition-colors">
                {getIcon(link.platform)}
                <span>{link.username}</span>
              </a>) :
        // Fallback if no links provided (though app should provide defaults)
        <span className="text-muted-foreground text-sm">
              No social links configured
            </span>}
        </div>

        <div className="mt-12 pt-8 border-t border-border text-center text-sm text-muted-foreground">
          <p>© {new Date().getFullYear()} Blog's Huy. All rights reserved.</p>
        </div>
      </div>
    </footer>;
}