import { useState } from 'react';
import { Button } from './ui/Button';
import { Save, Globe } from 'lucide-react';
interface BioEditorProps {
  initialTranslations: Record<string, {
    en: string;
    vi: string;
  }>;
  onSave: (translations: Record<string, {
    en: string;
    vi: string;
  }>) => void;
  onCancel: () => void;
}
// Define the structure of bio sections for the editor
const BIO_SECTIONS = [{
  id: 'intro',
  title: 'Introduction',
  keys: ['bio1'],
  description: 'The opening paragraph about who you are.'
}, {
  id: 'focus',
  title: 'Current Focus',
  keys: ['bio2'],
  description: 'What you are currently working on.'
}, {
  id: 'history',
  title: 'Work History',
  keys: ['bio3_1', 'bio3_2'],
  description: 'Previous work experience (NVIDIA, etc).'
}, {
  id: 'startup',
  title: 'Startup Experience',
  keys: ['bio4_1', 'bio4_comma', 'bio4_and', 'bio4_end'],
  description: 'Experience with startups and founding.'
}, {
  id: 'education',
  title: 'Education & Book 1',
  keys: ['bio5_1', 'bio5_link1', 'bio5_2', 'bio5_link2', 'bio5_3'],
  description: 'Stanford education and "Designing ML Systems" book.'
}, {
  id: 'book2',
  title: 'New Book',
  keys: ['bio6_1', 'bio6_strong', 'bio6_2', 'bio6_3', 'bio6_4', 'bio6_5'],
  description: '"AI Engineering" book details.'
}, {
  id: 'social',
  title: 'Social Presence',
  keys: ['bio7_1', 'bio7_2', 'bio7_3', 'bio7_4', 'bio7_link_events', 'bio7_5'],
  description: 'Social media and speaking events.'
}, {
  id: 'contact',
  title: 'Contact',
  keys: ['bio8_1', 'bio8_link', 'bio8_2'],
  description: 'Closing statement and contact link.'
}];
export function BioEditor({
  initialTranslations,
  onSave,
  onCancel
}: BioEditorProps) {
  const [translations, setTranslations] = useState<Record<string, {
    en: string;
    vi: string;
  }>>(initialTranslations);
  const [activeTab, setActiveTab] = useState<'en' | 'vi'>('en');
  const handleChange = (key: string, value: string, lang: 'en' | 'vi') => {
    setTranslations(prev => ({
      ...prev,
      [key]: {
        ...prev[key],
        [lang]: value
      }
    }));
  };
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(translations);
  };
  return <form onSubmit={handleSubmit} className="space-y-8 bg-background rounded-lg border border-border p-6">
      <div className="flex items-center justify-between border-b border-border pb-6">
        <h2 className="text-2xl font-bold tracking-tight">Edit Bio Content</h2>
        <div className="flex items-center gap-2">
          <Button type="button" variant="ghost" onClick={onCancel}>
            Cancel
          </Button>
          <Button type="submit" className="gap-2">
            <Save className="h-4 w-4" />
            Save Changes
          </Button>
        </div>
      </div>

      <div className="space-y-6">
        {/* Language Toggle */}
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold">Content</h3>
          <div className="flex bg-muted rounded-lg p-1">
            <button type="button" onClick={() => setActiveTab('en')} className={`px-3 py-1 text-sm font-medium rounded-md transition-colors ${activeTab === 'en' ? 'bg-background text-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground'}`}>
              English
            </button>
            <button type="button" onClick={() => setActiveTab('vi')} className={`px-3 py-1 text-sm font-medium rounded-md transition-colors ${activeTab === 'vi' ? 'bg-background text-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground'}`}>
              Vietnamese
            </button>
          </div>
        </div>

        {/* Bio Sections */}
        {BIO_SECTIONS.map(section => <div key={section.id} className="space-y-4">
            <div className="flex items-center gap-2">
              <h4 className="text-base font-semibold">{section.title}</h4>
              <span className="text-xs text-muted-foreground">
                {section.description}
              </span>
            </div>

            <div className="grid gap-6 p-6 border border-border rounded-lg bg-muted/5">
              {section.keys.map(key => <div key={key} className="space-y-2">
                  <label className="text-sm font-medium flex items-center gap-2">
                    <Globe className="h-4 w-4 text-muted-foreground" />
                    <span className="font-mono text-xs text-muted-foreground bg-muted px-2 py-0.5 rounded">
                      {key}
                    </span>
                  </label>
                  <textarea rows={key.includes('comma') || key.includes('and') ? 1 : 3} value={translations[key]?.[activeTab] || ''} onChange={e => handleChange(key, e.target.value, activeTab)} className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring" placeholder={`Enter ${activeTab === 'en' ? 'English' : 'Vietnamese'} content for ${key}...`} />
                </div>)}
            </div>
          </div>)}
      </div>
    </form>;
}