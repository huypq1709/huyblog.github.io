import React, { useEffect, useState } from 'react';
import { SocialLink, SocialPlatform } from '../types/blog';
import { Button } from './ui/Button';
import { Save, X } from 'lucide-react';
interface SocialLinkEditorProps {
  socialLink?: SocialLink;
  onSave: (link: Omit<SocialLink, 'id'> & {
    id?: string;
  }) => void | Promise<void>;
  onCancel: () => void;
}
const PLATFORMS: SocialPlatform[] = ['Facebook', 'Instagram', 'Github', 'Twitter', 'LinkedIn', 'Youtube', 'Other'];
export function SocialLinkEditor({
  socialLink,
  onSave,
  onCancel
}: SocialLinkEditorProps) {
  const [platform, setPlatform] = useState<SocialPlatform>('Facebook');
  const [username, setUsername] = useState('');
  const [url, setUrl] = useState('');
  const [errors, setErrors] = useState<{
    [key: string]: string;
  }>({});
  useEffect(() => {
    if (socialLink) {
      setPlatform(socialLink.platform);
      setUsername(socialLink.username);
      setUrl(socialLink.url);
    }
  }, [socialLink]);
  const validate = () => {
    const newErrors: {
      [key: string]: string;
    } = {};
    if (!username.trim()) newErrors.username = 'Username is required';
    if (!url.trim()) newErrors.url = 'URL is required';
    // Basic URL validation
    try {
      // Allow relative URLs or verify protocol
      if (url.startsWith('http') || url.startsWith('https')) {
        new URL(url);
      }
    } catch (e) {
      newErrors.url = 'Invalid URL format';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    try {
      // Only include id if we're editing an existing link
      const linkData: Omit<SocialLink, 'id'> & { id?: string } = {
        platform,
        username,
        url
      };
      if (socialLink?.id) {
        linkData.id = socialLink.id;
      }
      await onSave(linkData);
    } catch (error) {
      console.error('Error submitting form:', error);
    }
  };
  return <form onSubmit={handleSubmit} className="space-y-6 max-w-xl bg-card p-6 rounded-lg border shadow-sm">
      <div className="space-y-4">
        <div>
          <h3 className="text-lg font-medium">
            {socialLink ? 'Edit Social Link' : 'Add New Social Link'}
          </h3>
          <p className="text-sm text-muted-foreground">
            Add your social media profiles to the footer.
          </p>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
            Platform
          </label>
          <select value={platform} onChange={e => setPlatform(e.target.value as SocialPlatform)} className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50">
            {PLATFORMS.map(p => <option key={p} value={p}>
                {p}
              </option>)}
          </select>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
            Username / Label
          </label>
          <input type="text" value={username} onChange={e => setUsername(e.target.value)} placeholder="@username" className={`flex h-10 w-full rounded-md border bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${errors.username ? 'border-red-500' : 'border-input'}`} />
          {errors.username && <p className="text-sm text-red-500">{errors.username}</p>}
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
            URL
          </label>
          <input type="text" value={url} onChange={e => setUrl(e.target.value)} placeholder="https://..." className={`flex h-10 w-full rounded-md border bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${errors.url ? 'border-red-500' : 'border-input'}`} />
          {errors.url && <p className="text-sm text-red-500">{errors.url}</p>}
        </div>
      </div>

      <div className="flex justify-end gap-3">
        <Button type="button" variant="outline" onClick={onCancel}>
          <X className="h-4 w-4 mr-2" />
          Cancel
        </Button>
        <Button type="submit">
          <Save className="h-4 w-4 mr-2" />
          {socialLink ? 'Update Link' : 'Create Link'}
        </Button>
      </div>
    </form>;
}