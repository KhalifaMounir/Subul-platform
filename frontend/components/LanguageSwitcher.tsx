import React, { useState } from 'react';
import { useRouter } from 'next/router';
import { Globe, ChevronDown } from 'lucide-react';
import styles from '@/styles/LanguageSwitcher.module.css';

interface Language {
  code: string;
  name: string;
  flag: string;
}

const languages: Language[] = [
  { code: 'ar', name: 'العربية', flag: '🇸🇦' },
  { code: 'en', name: 'English', flag: '🇺🇸' },
  { code: 'fr', name: 'Français', flag: '🇫🇷' },
];

export default function LanguageSwitcher() {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);

  const currentLanguage = languages.find(lang => lang.code === router.locale) || languages[0];

  const handleLanguageChange = (languageCode: string) => {
    const { pathname, asPath, query } = router;
    router.push({ pathname, query }, asPath, { locale: languageCode });
    setIsOpen(false);
  };

  return (
    <div className={styles.languageSwitcher}>
      <button
        className={styles.languageButton}
        onClick={() => setIsOpen(!isOpen)}
        onBlur={() => setTimeout(() => setIsOpen(false), 150)}
      >
        <Globe className={styles.globeIcon} size={18} />
        <span className={styles.currentLanguage}>
          <span className={styles.flag}>{currentLanguage.flag}</span>
          <span className={styles.languageName}>{currentLanguage.name}</span>
        </span>
        <ChevronDown 
          className={`${styles.chevron} ${isOpen ? styles.chevronOpen : ''}`} 
          size={16} 
        />
      </button>

      {isOpen && (
        <div className={styles.dropdown}>
          {languages.map((language) => (
            <button
              key={language.code}
              className={`${styles.languageOption} ${
                language.code === router.locale ? styles.active : ''
              }`}
              onClick={() => handleLanguageChange(language.code)}
            >
              <span className={styles.flag}>{language.flag}</span>
              <span className={styles.languageName}>{language.name}</span>
              {language.code === router.locale && (
                <span className={styles.checkmark}>✓</span>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}