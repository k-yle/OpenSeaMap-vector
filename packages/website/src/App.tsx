import {
  ActionIcon,
  AppShell,
  Burger,
  Button,
  Group,
  MantineProvider,
  NavLink,
  Title,
  createTheme,
} from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { IconBrandGithub, IconInfoCircle, IconMap } from '@tabler/icons-react';
import { LegendPage } from './pages/LegendPage.js';
import { AppTitle } from './components/AppTitle.js';
import { MapPage } from './pages/MapPage.js';

const theme = createTheme({});

export const App: React.FC = () => {
  const [isNavbarOpen, { toggle: toggleNavbar }] = useDisclosure();
  const [isLegendOpen, { toggle: toggleLegend }] = useDisclosure();

  return (
    <MantineProvider theme={theme}>
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
            <Group>
              <Button
                variant="subtle"
                color="gray"
                component="a"
                leftSection={<IconInfoCircle />}
                onClick={toggleLegend}
              >
                Legend
              </Button>
              |
              <ActionIcon
                variant="subtle"
                color="gray"
                component="a"
                href="https://github.com/k-yle/OpenSeaMap-vector"
                target="_blank"
                rel="noopener noreferrer"
              >
                <IconBrandGithub />
              </ActionIcon>
            </Group>
          </Group>
        </AppShell.Header>
        <AppShell.Navbar p="md" hiddenFrom="sm">
          <Title order={4} mb={4}>
            Pages
          </Title>
          <NavLink
            label="Map"
            active
            bdrs={8}
            my={4}
            leftSection={<IconMap />}
            onClick={toggleNavbar}
          />
          <NavLink
            label="Legend"
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
            label="Source Code"
            bdrs={8}
            my={4}
            leftSection={<IconBrandGithub />}
          />
          {/*
          <Title order={4} mt={8} mb={4}>
            Settings
          </Title>
          */}
        </AppShell.Navbar>
        <AppShell.Main p={0}>
          <MapPage />
          <LegendPage isOpen={isLegendOpen} onClose={toggleLegend} />
        </AppShell.Main>
      </AppShell>
    </MantineProvider>
  );
};
