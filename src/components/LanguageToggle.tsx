import { Language } from '../i18n';

type LanguageToggleProps = {
  currentLanguage: Language;
  onLanguageChange: (lang: Language) => void;
};

export const LanguageToggle = ({ currentLanguage, onLanguageChange }: LanguageToggleProps) => {
  const handleToggle = () => {
    onLanguageChange(currentLanguage === 'en' ? 'he' : 'en');
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleToggle();
    }
  };

  return (
    <button
      onClick={handleToggle}
      onKeyDown={handleKeyDown}
      className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/80 backdrop-blur-sm 
                 border border-slate-200 shadow-sm hover:shadow-md transition-all-smooth
                 text-sm font-medium text-slate-600 hover:text-slate-800 hover:bg-white
                 focus:outline-none focus:ring-2 focus:ring-startech-teal focus:ring-offset-2"
      aria-label={`Switch to ${currentLanguage === 'en' ? 'Hebrew' : 'English'}`}
      tabIndex={0}
    >
      <span className={`transition-opacity ${currentLanguage === 'en' ? 'opacity-100' : 'opacity-50'}`}>
        EN
      </span>
      <div className="relative w-10 h-5 bg-gradient-to-r from-startech-teal to-startech-cyan rounded-full">
        <div 
          className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow-sm transition-all duration-300
                      ${currentLanguage === 'he' ? 'left-0.5' : 'left-5'}`}
        />
      </div>
      <span className={`transition-opacity ${currentLanguage === 'he' ? 'opacity-100' : 'opacity-50'}`}>
        עב
      </span>
    </button>
  );
};

