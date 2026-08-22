import {
  type PropsWithChildren,
  createContext,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { Alert, Center, Code, Loader, Stack, Text } from '@mantine/core';
import { IconAlertTriangle } from '@tabler/icons-react';
import { MessageFormat } from 'messageformat';
import * as Diplomat from '@americana/diplomat';
import {
  type Locale,
  TRANSLATIONS,
  type TranslationKey,
  type TranslationsFile,
} from '../translations/index.js';
import { QS } from '../util/qs.js';

/** the original might be `de-CH-u-co-phonebk`, while the matched is `de`.json */
export interface LocaleMatch {
  original: string;
  matched: Locale;
}

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
  return { original: 'en', matched: 'en' };
}

export type I$ = (
  key: TranslationKey,
  params?: Record<string, unknown>,
) => string;

export interface ILocaleContext {
  $: I$;
  locale: LocaleMatch;
  setLocale(locale: Locale): void;
}
export const LocaleContext = createContext<ILocaleContext>(undefined!);
LocaleContext.displayName = 'LocaleContext';

export const LocaleWrapper: React.FC<PropsWithChildren> = ({ children }) => {
  const [locale, setLocale] = useState<LocaleMatch>(getDefaultLocale);
  const [translations, setTranslations] = useState<TranslationsFile>();
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

    TRANSLATIONS[locale.matched]()
      .then((file) => {
        if (controller.signal.aborted) return;
        setTranslations(file);
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

  const setLocalePublic = useCallback((newValue: Locale) => {
    QS.update((qs) => qs.set('language', newValue));
    setLocale({ matched: newValue, original: newValue });
  }, []);

  const ctx = useMemo<ILocaleContext>(
    () => ({ locale, setLocale: setLocalePublic, $ }),
    [locale, setLocalePublic, $],
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
