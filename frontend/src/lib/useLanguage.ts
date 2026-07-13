import { useEffect, useState } from "react";
import {
  applyDocumentLanguage,
  getStoredLanguage,
  LanguageCode,
  setStoredLanguage,
  translate,
} from "@/lib/i18n";

export function useLanguage() {
  const [language, setLanguageState] = useState<LanguageCode>(() => getStoredLanguage());

  useEffect(() => {
    applyDocumentLanguage(language);
  }, [language]);

  useEffect(() => {
    const syncLanguage = () => setLanguageState(getStoredLanguage());
    window.addEventListener("languagechange", syncLanguage);
    window.addEventListener("storage", syncLanguage);
    return () => {
      window.removeEventListener("languagechange", syncLanguage);
      window.removeEventListener("storage", syncLanguage);
    };
  }, []);

  const setLanguage = (nextLanguage: LanguageCode) => {
    setStoredLanguage(nextLanguage);
    setLanguageState(nextLanguage);
  };

  return {
    language,
    setLanguage,
    t: (key: string) => translate(key, language),
  };
}
