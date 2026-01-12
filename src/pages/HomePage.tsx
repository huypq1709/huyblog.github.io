import { useLanguage } from '../context/LanguageContext';
export function HomePage() {
  const {
    t
  } = useLanguage();
  return <div className="container mx-auto px-4 py-12 max-w-6xl">
      <div className="flex flex-col-reverse md:flex-row gap-12 items-start">
        {/* Left Column: Bio Text */}
        <div className="flex-1 space-y-6 text-lg leading-relaxed text-foreground/90">
          <p>{t('bio1')}</p>

          <p>{t('bio2')}</p>

          <p>
            {t('bio3_1')}
            <a href="#" className="text-blue-500 hover:underline">
              NeMo
            </a>
            {t('bio3_2')}
          </p>

          <p>
            {t('bio4_1')}
            <a href="#" className="text-blue-500 hover:underline">
              Convai
            </a>
            {t('bio4_comma')}
            <a href="#" className="text-blue-500 hover:underline">
              OctoAI
            </a>
            {t('bio4_and')}
            <a href="#" className="text-blue-500 hover:underline">
              Photoroom
            </a>
            {t('bio4_end')}
          </p>

          <p>
            {t('bio5_1')}
            <a href="#" className="text-blue-500 hover:underline">
              {t('bio5_link1')}
            </a>
            {t('bio5_2')}
            <a href="#" className="text-blue-500 hover:underline">
              {t('bio5_link2')}
            </a>
            {t('bio5_3')}
          </p>

          <p>
            {t('bio6_1')}
            <strong>{t('bio6_strong')}</strong>
            {t('bio6_2')}
            <a href="#" className="text-blue-500 hover:underline">
              O'Reilly
            </a>{' '}
            {t('bio6_3')}
            <a href="#" className="text-blue-500 hover:underline">
              Amazon
            </a>{' '}
            {t('bio6_4')}
            <a href="#" className="text-blue-500 hover:underline">
              Kindle
            </a>
            {t('bio6_5')}
          </p>

          <p>
            {t('bio7_1')}
            <a href="#" className="text-blue-500 hover:underline">
              GitHub
            </a>{' '}
            {t('bio7_2')}
            <a href="#" className="text-blue-500 hover:underline">
              Goodreads
            </a>{' '}
            {t('bio7_3')}
            <a href="#" className="text-blue-500 hover:underline">
              Google Scholar
            </a>
            {t('bio7_4')}
            <a href="#" className="text-blue-500 hover:underline">
              {t('bio7_link_events')}
            </a>
            {t('bio7_5')}
          </p>

          <p>
            {t('bio8_1')}
            <a href="#" className="text-blue-500 hover:underline">
              {t('bio8_link')}
            </a>{' '}
            {t('bio8_2')}
          </p>
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
    </div>;
}