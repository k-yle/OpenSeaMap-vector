import type { PresetId } from '../data/legend.js';

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

///

export const TRANSLATIONS_IDTS: Record<
  Locale,
  () => Promise<TranslationsFileIDTS>
> = {
  /* eslint-disable import-x/no-extraneous-dependencies -- bc this is temporary */
  en: () =>
    import('@openstreetmap/id-tagging-schema/dist/translations/en.json', {
      with: { type: 'json' },
    }).then((r) => r.default.en.presets.presets),
  de: () =>
    import('@openstreetmap/id-tagging-schema/dist/translations/de.json', {
      with: { type: 'json' },
    }).then((r) => r.default.de.presets.presets),
  'zh-Hans': () =>
    import('@openstreetmap/id-tagging-schema/dist/translations/zh.json', {
      with: { type: 'json' },
    }).then((r) => r.default.zh.presets.presets),
};

export type TranslationsFileIDTS = { [T in PresetId]?: { name: string } };
