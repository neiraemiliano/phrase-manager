import { Locale } from "@/types";
import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";

interface TextContextValue {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: (key: string, params?: Record<string, any>) => string;
  texts: Record<string, any>;
}

const TextContext = createContext<TextContextValue | null>(null);

export const TextProvider: React.FC<{
  children: React.ReactNode;
  defaultLocale?: Locale;
}> = ({ children, defaultLocale = "es" }) => {
  const [locale, setLocaleState] = useState<Locale>(() => {
    const saved = localStorage.getItem("app_locale");
    return (saved as Locale) || defaultLocale;
  });

  const [texts, setTexts] = useState<Record<string, any>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadTranslations = async () => {
      try {
        const response = await fetch(`/locales/${locale}.json`);
        const data = await response.json();
        setTexts(data);
      } catch (error) {
        console.error("Error loading translations:", error);
        setTexts(locale === "es" ? spanishTexts : englishTexts);
      } finally {
        setLoading(false);
      }
    };

    loadTranslations();
  }, [locale]);

  const setLocale = useCallback((newLocale: Locale) => {
    setLocaleState(newLocale);
    localStorage.setItem("app_locale", newLocale);
    document.documentElement.lang = newLocale;
  }, []);

  const t = useCallback(
    (key: string, params?: Record<string, any>): string => {
      const keys = key.split(".");
      let value: any = texts;

      for (const k of keys) {
        value = value?.[k];
        if (value === undefined) {
          console.warn(`Translation key not found: ${key}`);
          return key;
        }
      }

      if (typeof value !== "string") {
        console.warn(`Translation value is not a string: ${key}`);
        return key;
      }

      if (params) {
        return value.replace(/\{\{(\w+)\}\}/g, (match, param) => {
          return params[param]?.toString() || match;
        });
      }

      return value;
    },
    [texts],
  );

  if (loading) {
    return <div>Loading translations...</div>;
  }

  return (
    <TextContext.Provider value={{ locale, setLocale, t, texts }}>
      {children}
    </TextContext.Provider>
  );
};

export const useText = () => {
  const context = useContext(TextContext);
  if (!context) {
    throw new Error("useText must be used within TextProvider");
  }
  return context;
};

const spanishTexts = {
  common: {
    appName: "Gestor de Frases",
    loading: "Cargando...",
  },
};

const englishTexts = {
  common: {
    appName: "Phrase Manager",
    loading: "Loading...",
  },
};
