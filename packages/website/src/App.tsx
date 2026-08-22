import { use } from 'react';
import {
  ActionIcon,
  AppShell,
  Burger,
  Button,
  Group,
  NavLink,
  Title,
} from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { IconBrandGithub, IconInfoCircle, IconMap } from '@tabler/icons-react';
import { LegendPage } from './pages/LegendPage.js';
import { AppTitle } from './components/AppTitle.js';
import { LayerSwitcher } from './components/LayerSwitcher.js';
import { BasemapSwitcher } from './components/BasemapSwitcher.js';
import { MapPage } from './pages/MapPage.js';
import { AppContext } from './context/AppContext.js';
import { LocaleContext } from './context/LocaleContext.js';
import { LanguageSwitcher } from './components/LanguageSwitcher.js';

export const App: React.FC = () => {
  const { map } = use(AppContext);
  const { $ } = use(LocaleContext);

  const [isNavbarOpen, { toggle: toggleNavbar }] = useDisclosure();
  const [isLegendOpen, { toggle: toggleLegend }] = useDisclosure();

  return (
    // eslint-disable-next-line @eslint-react/no-useless-fragment -- to preserve git blame
    <>
      <AppShell
        header={{ height: 50 }}
        navbar={{
          width: 0,
          breakpoint: 'sm',
          collapsed: { mobile: !isNavbarOpen },
        }}
        padding="md"
      >
        <AppShell.Header>
          <Group h="100%" px="md" hiddenFrom="sm" justify="space-between">
            <AppTitle />
            <Burger opened={isNavbarOpen} onClick={toggleNavbar} size="sm" />
          </Group>
          <Group h="100%" px="md" visibleFrom="sm" justify="space-between">
            <AppTitle />
            <Group gap={10}>
              {map && <LayerSwitcher />}
              {map && <BasemapSwitcher />}
              <Button
                variant="subtle"
                color="gray"
                component="a"
                leftSection={<IconInfoCircle />}
                onClick={toggleLegend}
              >
                {$('Navbar.legend')}
              </Button>
              |
              <LanguageSwitcher />
              <ActionIcon
                variant="subtle"
                color="gray"
                component="a"
                href="https://github.com/k-yle/OpenSeaMap-vector"
                target="_blank"
                rel="noopener noreferrer"
                aria-label={$('Navbar.source_code')}
              >
                <IconBrandGithub />
              </ActionIcon>
            </Group>
          </Group>
        </AppShell.Header>
        <AppShell.Navbar p="md" hiddenFrom="sm">
          <Title order={4} mb={4}>
            {$('Navbar.sections.pages')}
          </Title>
          <NavLink
            label={$('Navbar.map')}
            active
            bdrs={8}
            my={4}
            leftSection={<IconMap />}
            onClick={toggleNavbar}
          />
          <NavLink
            label={$('Navbar.legend')}
            bdrs={8}
            my={4}
            leftSection={<IconInfoCircle />}
            onClick={() => {
              toggleNavbar();
              toggleLegend();
            }}
          />
          <NavLink
            href="https://github.com/k-yle/OpenSeaMap-vector"
            target="_blank"
            rel="noopener noreferrer"
            label={$('Navbar.source_code')}
            bdrs={8}
            my={4}
            leftSection={<IconBrandGithub />}
          />

          <Title order={4} mt={8} mb={4}>
            {$('Navbar.sections.settings')}
          </Title>
          {map && <LayerSwitcher isMobile />}
          {map && <BasemapSwitcher isMobile />}
          <LanguageSwitcher isMobile />
        </AppShell.Navbar>
        <AppShell.Main p={0}>
          <MapPage />
          <LegendPage isOpen={isLegendOpen} onClose={toggleLegend} />
        </AppShell.Main>
      </AppShell>
    </>
  );
};
