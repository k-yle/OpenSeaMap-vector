import { use } from 'react';
import { Button, Flex, Group, Modal, Title } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import iconUrl from '../../../../data/public/icon.svg?url';
import { LocaleContext } from '../context/LocaleContext.js';

export const AppTitle: React.FC = () => {
  const { $, $$ } = use(LocaleContext);
  const [disclaimerOpen, { toggle: toggleDisclaimer }] = useDisclosure();

  return (
    <Group h="100%">
      <img src={iconUrl} alt="Logo" style={{ height: '60%' }} />
      <Flex direction="column" align="flex-start">
        <Title order={4} fw={500} size="1.25rem">
          OpenSeaMap-vector
        </Title>
        <Button
          variant="transparent"
          onClick={toggleDisclaimer}
          size="0.5rem"
          pl={0}
          bdrs={0}
          style={{ cursor: 'help' }}
          color="gray"
        >
          {$('AppTitle.disclaimer.short')}
        </Button>
      </Flex>
      <Modal
        opened={disclaimerOpen}
        onClose={toggleDisclaimer}
        title={<strong>{$('AppTitle.disclaimer.short')}</strong>}
      >
        {$$('AppTitle.disclaimer.long')}
      </Modal>
    </Group>
  );
};
