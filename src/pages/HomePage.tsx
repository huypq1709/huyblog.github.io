import { useLanguage } from '../context/LanguageContext';

// Renders text and converts [text](url) into links
function renderBioParagraph(text: string) {
  const parts: React.ReactNode[] = [];
  const linkRe = /\[([^\]]+)\]\(([^)]+)\)/g;
  let lastIndex = 0;
  let match: RegExpExecArray | null;
  while ((match = linkRe.exec(text)) !== null) {
    parts.push(text.slice(lastIndex, match.index));
    parts.push(
      <a
        key={match.index}
        href={match[2]}
        target="_blank"
        rel="noopener noreferrer"
        className="text-blue-500 hover:underline"
      >
        {match[1]}
      </a>
    );
    lastIndex = match.index + match[0].length;
  }
  parts.push(text.slice(lastIndex));
  return parts;
}

export function HomePage() {
  const { t } = useLanguage();
  const bioText = t('bio') || '';
  const paragraphs = bioText.split(/\n\n+/).filter((p) => p.trim());

  return (
    <div className="container mx-auto px-4 py-12 max-w-6xl">
      <div className="flex flex-col-reverse md:flex-row gap-12 items-start">
        {/* Left Column: Bio Text */}
        <div className="flex-1 space-y-6 text-lg leading-relaxed text-foreground/90">
          {paragraphs.map((para, i) => (
            <p key={i}>{renderBioParagraph(para.trim())}</p>
          ))}
        </div>

        {/* Right Column: Profile Image */}
        <div className="w-full md:w-1/3 flex justify-center md:justify-end">
          <div className="relative w-64 h-64 md:w-72 md:h-72 shrink-0">
            <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-blue-100 to-blue-50 dark:from-blue-900/20 dark:to-blue-800/20 animate-in fade-in zoom-in duration-700" />
            <div className="absolute inset-0 rounded-full flex items-center justify-center bg-muted border-2 border-border shadow-xl overflow-hidden">
              <img
                src="/avt.jpg"
                alt="Avatar"
                className="w-full h-full object-cover rounded-full"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
