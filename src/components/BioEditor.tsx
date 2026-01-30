import { useState } from 'react';
import { Button } from './ui/Button';
import { Save } from 'lucide-react';

type BioTranslations = Record<string, { en: string; vi: string }>;

interface BioEditorProps {
  initialTranslations: BioTranslations;
  onSave: (translations: BioTranslations) => void;
  onCancel: () => void;
}

export const BIO_KEYS = ['bio'];

export function BioEditor({
  initialTranslations,
  onSave,
  onCancel,
}: BioEditorProps) {
  const [activeTab, setActiveTab] = useState<'en' | 'vi'>('en');
  const [bioEn, setBioEn] = useState(
    initialTranslations.bio?.en ?? ''
  );
  const [bioVi, setBioVi] = useState(
    initialTranslations.bio?.vi ?? ''
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      bio: { en: bioEn, vi: bioVi },
    });
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-6 bg-background rounded-lg border border-border p-6"
    >
      <div className="flex items-center justify-between border-b border-border pb-6">
        <h2 className="text-2xl font-bold tracking-tight">Chỉnh sửa giới thiệu</h2>
        <div className="flex items-center gap-2">
          <Button type="button" variant="ghost" onClick={onCancel}>
            Hủy
          </Button>
          <Button type="submit" className="gap-2">
            <Save className="h-4 w-4" />
            Lưu
          </Button>
        </div>
      </div>

      <p className="text-sm text-muted-foreground">
        Mỗi ngôn ngữ một ô. Xuống dòng hai lần (để trống một dòng) để tạo đoạn mới. Dùng{' '}
        <code className="bg-muted px-1 rounded">[chữ hiển thị](url)</code> để thêm link.
      </p>

      <div className="flex bg-muted rounded-lg p-1 w-fit">
        <button
          type="button"
          onClick={() => setActiveTab('en')}
          className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
            activeTab === 'en'
              ? 'bg-background text-foreground shadow-sm'
              : 'text-muted-foreground hover:text-foreground'
          }`}
        >
          Tiếng Anh
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('vi')}
          className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
            activeTab === 'vi'
              ? 'bg-background text-foreground shadow-sm'
              : 'text-muted-foreground hover:text-foreground'
          }`}
        >
          Tiếng Việt
        </button>
      </div>

      {activeTab === 'en' ? (
        <textarea
          value={bioEn}
          onChange={(e) => setBioEn(e.target.value)}
          rows={18}
          className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          placeholder="Viết phần giới thiệu bằng tiếng Anh. Xuống dòng 2 lần để tách đoạn."
        />
      ) : (
        <textarea
          value={bioVi}
          onChange={(e) => setBioVi(e.target.value)}
          rows={18}
          className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          placeholder="Viết phần giới thiệu bằng tiếng Việt. Xuống dòng 2 lần để tách đoạn."
        />
      )}
    </form>
  );
}
