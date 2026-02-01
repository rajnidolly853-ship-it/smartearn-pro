import { useCallback } from 'react';
import { useLanguage as useLanguageContext } from '../context/LanguageContext';

interface UseLanguageReturn {
  language: 'en' | 'hi';
  isHindi: boolean;
  isEnglish: boolean;
  t: (key: string, fallback?: string) => string;
  setLanguage: (lang: 'en' | 'hi') => void;
  toggleLanguage: () => void;
  languageName: string;
}

export const useLang = (): UseLanguageReturn => {
  const { language, setLanguage, t } = useLanguageContext();

  // Toggle between English and Hindi
  const toggleLanguage = useCallback(() => {
    setLanguage(language === 'en' ? 'hi' : 'en');
  }, [language, setLanguage]);

  // Translation with fallback
  const translate = useCallback((key: string, fallback?: string): string => {
    const translated = t(key);
    // If translation returns the key itself, use fallback
    if (translated === key && fallback) {
      return fallback;
    }
    return translated;
  }, [t]);

  return {
    language,
    isHindi: language === 'hi',
    isEnglish: language === 'en',
    t: translate,
    setLanguage,
    toggleLanguage,
    languageName: language === 'en' ? 'English' : 'हिंदी'
  };
};

// Additional helper hook for specific translations
export const useTranslation = (namespace: string) => {
  const { t } = useLang();

  const translate = useCallback((key: string, fallback?: string): string => {
    return t(`${namespace}.${key}`, fallback);
  }, [t, namespace]);

  return { t: translate };
};

export default useLang;
