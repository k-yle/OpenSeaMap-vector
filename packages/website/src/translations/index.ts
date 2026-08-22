export const TRANSLATIONS = {
  en: () => import('./en.json', { with: { type: 'json' } }),
  de: () => import('./de.json', { with: { type: 'json' } }),
  'zh-Hans': () => import('./zh-Hans.json', { with: { type: 'json' } }),
};

export type Locale = keyof typeof TRANSLATIONS;

export type TranslationsFile = Awaited<
  ReturnType<(typeof TRANSLATIONS)[Locale]>
>;

export type TranslationKey = keyof TranslationsFile['default'];
