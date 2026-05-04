import ptDict from "@/dictionaries/pt.json";
import enDict from "@/dictionaries/en.json";

export type Locale = "pt" | "en";
export const locales: Locale[] = ["pt", "en"];
export const defaultLocale: Locale = "pt";

const dictionaries = {
  pt: () => Promise.resolve(ptDict),
  en: () => Promise.resolve(enDict),
} as const;

export type Dictionary = typeof ptDict;

export const hasLocale = (locale: string): locale is Locale =>
  (locales as string[]).includes(locale);

export const getDictionary = async (locale: Locale): Promise<Dictionary> =>
  dictionaries[locale]();
