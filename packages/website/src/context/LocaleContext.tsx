import {
  type PropsWithChildren,
  createContext,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import {
  Alert,
  Center,
  Code,
  Loader,
  Stack,
  Text,
  deepMerge,
} from '@mantine/core';
import { IconAlertTriangle } from '@tabler/icons-react';
import { MessageFormat } from 'messageformat';
import * as Diplomat from '@americana/diplomat';
import {
  type Locale,
  TRANSLATIONS,
  TRANSLATIONS_IDTS,
  type TranslationKey,
  type TranslationsFile,
  type TranslationsFileIDTS,
} from '../translations/index.js';
import { QS } from '../util/qs.js';
import type { PresetId } from '../data/legend.js';

/** the original might be `de-CH-u-co-phonebk`, while the matched is `de`.json */
export interface LocaleMatch {
  original: string;
  matched: Locale;
}

export const DEFAULT_LOCALE = 'en';

export function getDefaultLocale(): LocaleMatch {
  const candidates = Object.keys(TRANSLATIONS).map((key) => ({
    key: key as Locale,
    expanded: new Intl.Locale(key).maximize(),
  }));

  for (const original of Diplomat.getLocales()) {
    const locale = new Intl.Locale(original).maximize();

    // TODO: import from diplomat?
    const matched = candidates.find(
      (c) =>
        c.expanded.baseName === locale.baseName ||
        c.expanded.language === locale.language,
    )?.key;

    if (matched) {
      return { original, matched };
    }
  }
  return { original: DEFAULT_LOCALE, matched: DEFAULT_LOCALE };
}

export type I$ = (
  key: TranslationKey,
  params?: Record<string, unknown>,
) => string;

export type I$IDTS = (key: PresetId) => string;

export interface ILocaleContext {
  $: I$;
  $idts: I$IDTS;
  locale: LocaleMatch;
  setLocale(locale: Locale): void;
}
export const LocaleContext = createContext<ILocaleContext>(undefined!);
LocaleContext.displayName = 'LocaleContext';

export const LocaleWrapper: React.FC<PropsWithChildren> = ({ children }) => {
  const [locale, setLocale] = useState<LocaleMatch>(getDefaultLocale);
  const [translations, setTranslations] = useState<TranslationsFile>();
  const [translationsIDTS, setTranslationsIDTS] =
    useState<TranslationsFileIDTS>();
  const [error, setError] = useState<unknown>();
  const mf2CacheRef = useRef(
    new WeakMap<LocaleMatch, { [value: string]: MessageFormat }>(),
  );

  useEffect(() => {
    // sync to <html> element
    document.documentElement.lang = locale.matched;
  }, [locale]);

  useEffect(() => {
    // when the locale changes, download the new translations
    const controller = new AbortController();

    Promise.all([
      TRANSLATIONS[locale.matched](),
      TRANSLATIONS_IDTS[locale.matched](),
      TRANSLATIONS_IDTS.en(),
    ] as const)
      .then(([file, fileIDTS, fileIDTSDefault]) => {
        if (controller.signal.aborted) return;
        setTranslations(file);
        setTranslationsIDTS(deepMerge(fileIDTSDefault, fileIDTS));
      })
      .catch((ex) => {
        if (controller.signal.aborted) return;
        setError(ex);
      });

    return () => controller.abort();
  }, [locale]);

  const $ = useCallback<I$>(
    (key, params) => {
      const value = translations!.default[key];

      // TS will catch this at build time, so no need for a runtime error
      if (!value) return '❓';

      // MessageFormat() is expensive, avoid it for trivial strings
      if (!value.includes('{')) return value;

      if (!mf2CacheRef.current.has(locale)) {
        mf2CacheRef.current.set(locale, {});
      }
      const cachedMF2s = mf2CacheRef.current.get(locale)!;

      // no try…catch, we check for invalid MF2 syntax at build time
      cachedMF2s[value] ||= new MessageFormat(locale.original, value);
      return cachedMF2s[value].format(params);
    },
    [locale, translations],
  );

  const $idts = useCallback<I$IDTS>(
    (key) => translationsIDTS?.[key]?.name || '❓',
    [translationsIDTS],
  );

  const setLocalePublic = useCallback((newValue: Locale) => {
    QS.update((qs) => qs.set('language', newValue));
    setLocale({ matched: newValue, original: newValue });
  }, []);

  const ctx = useMemo<ILocaleContext>(
    () => ({ locale, setLocale: setLocalePublic, $, $idts }),
    [locale, setLocalePublic, $, $idts],
  );

  if (error) {
    return (
      <Center h="100vh" p="md">
        <Alert
          variant="light"
          color="red"
          icon={<IconAlertTriangle />}
          title="Failed to load the app"
          w="100%"
          maw={500}
        >
          <Stack>
            <Text>
              The <Code>{locale.matched}</Code> translations could not be
              downloaded.
            </Text>
            <Code block>{`${error}`}</Code>
          </Stack>
        </Alert>
      </Center>
    );
  }

  if (!translations) {
    return (
      <Center h="100vh">
        <Stack align="center" gap="sm">
          <Loader size="lg" />
        </Stack>
      </Center>
    );
  }

  return <LocaleContext value={ctx}>{children}</LocaleContext>;
};
