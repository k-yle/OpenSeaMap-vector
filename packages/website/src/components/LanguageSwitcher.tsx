import { use } from 'react';
import { ActionIcon, Menu, NavLink } from '@mantine/core';
import { IconCheck, IconLanguage } from '@tabler/icons-react';
import { type Locale, TRANSLATIONS } from '../translations/index.js';
import { LocaleContext } from '../context/LocaleContext.js';

const LOCALES = Object.keys(TRANSLATIONS) as Locale[];

/** e.g. `Chinese (中文)` */
function formatLanguage(localeToFormat: string, currentLocale: string) {
  const exonym = new Intl.DisplayNames(currentLocale, {
    type: 'language',
  }).of(localeToFormat);

  const endonym = new Intl.DisplayNames(localeToFormat, {
    type: 'language',
  }).of(localeToFormat);

  return exonym === endonym ? exonym : `${exonym} — ${endonym}`;
}

export const LanguageSwitcher: React.FC<{
  isMobile?: boolean;
}> = ({ isMobile }) => {
  const { $, locale, setLocale } = use(LocaleContext);

  return (
    <Menu position={isMobile ? 'bottom-start' : 'bottom-end'} shadow="md">
      <Menu.Target>
        {isMobile ? (
          <NavLink
            label={$('Navbar.language')}
            bdrs={8}
            my={4}
            leftSection={<IconLanguage />}
          />
        ) : (
          <ActionIcon
            variant="subtle"
            color="gray"
            aria-label={$('Navbar.language')}
          >
            <IconLanguage />
          </ActionIcon>
        )}
      </Menu.Target>
      <Menu.Dropdown>
        {LOCALES.map((item) => (
          <Menu.Item
            key={item}
            onClick={() => setLocale(item)}
            leftSection={
              <IconCheck size={16} opacity={item === locale.matched ? 1 : 0} />
            }
          >
            {formatLanguage(item, locale.original)}
          </Menu.Item>
        ))}
      </Menu.Dropdown>
    </Menu>
  );
};
