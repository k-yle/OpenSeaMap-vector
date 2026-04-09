import { Button, Flex, Group, Modal, Title } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import iconUrl from '../../../../data/public/icon.svg?url';

export const AppTitle: React.FC = () => {
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
          Not for Navigation!
        </Button>
      </Flex>
      <Modal
        opened={disclaimerOpen}
        onClose={toggleDisclaimer}
        title={<strong>Not for Navigation!</strong>}
      >
        Data from this map or from OpenStreetMap{' '}
        <b>should never be used for marine navigation</b>. The contributors of
        this project take no responsibility for the accuracy of the data. Always
        use official nautical charts.
      </Modal>
    </Group>
  );
};
