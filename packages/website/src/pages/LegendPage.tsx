import { Fragment } from 'react';
import { FocusTrap, Modal, Table, Title } from '@mantine/core';
import type { Tags } from 'osm-api';
import { useMediaQuery } from '@mantine/hooks';
import { LEGEND } from '../data/legend.js';

export const RenderTag: React.FC<{ k: string; v?: string }> = ({ k, v }) => {
  return (
    <code>
      <a
        href={`https://osm.wiki/Key:${k}`}
        target="_blank"
        rel="noopener noreferrer"
      >
        {k}
      </a>
      =
      {v && v !== '*' ? (
        <a
          href={`https://osm.wiki/Tag:${k}=${v}`}
          target="_blank"
          rel="noopener noreferrer"
        >
          {v}
        </a>
      ) : (
        '*'
      )}
    </code>
  );
};

export const RenderTags: React.FC<{ tags: Tags }> = ({ tags }) => {
  return (
    <>
      {Object.entries(tags).map(([k, v], index) => (
        <span key={k}>
          {!!index && ' + '}
          <RenderTag k={k} v={v} />
        </span>
      ))}
    </>
  );
};

export const LegendPage: React.FC<{ isOpen: boolean; onClose(): void }> = ({
  isOpen,
  onClose,
}) => {
  const isNarrowScreen = useMediaQuery('(max-width: 700px)');
  return (
    <Modal
      opened={isOpen}
      onClose={onClose}
      title={<strong>Legend</strong>}
      size="80vw"
      fullScreen={isNarrowScreen}
      transitionProps={isNarrowScreen ? { transition: 'fade' } : undefined}
    >
      <FocusTrap.InitialFocus />

      <Table>
        {LEGEND.map((category, categoryIndex) => {
          return (
            <Fragment key={category.categoryName}>
              <Table.Thead>
                <Table.Tr>
                  <Table.Th colSpan={3}>
                    <Title order={5} mt={categoryIndex && 32}>
                      {category.categoryName}
                    </Title>
                  </Table.Th>
                </Table.Tr>
              </Table.Thead>
              <Table.Tbody>
                {category.items.map((item) => {
                  const altTagsCount = item.tags.length - 1;
                  return (
                    <Table.Tr key={item.label}>
                      <Table.Td>
                        {item.icon && (
                          <img
                            src={item.icon}
                            alt="icon"
                            style={{
                              height: 20,
                              maxWidth: 40,
                              verticalAlign: 'middle',
                            }}
                          />
                        )}
                      </Table.Td>
                      <Table.Td>{item.label}</Table.Td>
                      <Table.Td>
                        <RenderTags tags={item.tags[0]} />
                        {!!altTagsCount && (
                          <details>
                            <summary>
                              {altTagsCount} alternative tag
                              {altTagsCount === 1 ? ' is' : 's are'} also
                              accepted:
                            </summary>
                            <ul style={{ marginLeft: 18 }}>
                              {item.tags.slice(1).map((tags, index) => (
                                // eslint-disable-next-line @eslint-react/no-array-index-key -- safe, static data
                                <li key={index}>
                                  <RenderTags tags={tags} />
                                </li>
                              ))}
                            </ul>
                          </details>
                        )}
                        {!!item.labelAttributes?.length && (
                          <details>
                            <summary>
                              The label is affected by{' '}
                              {item.labelAttributes.length} tags:
                            </summary>
                            <ul style={{ marginLeft: 18 }}>
                              {item.labelAttributes.map((key) => (
                                <li key={key}>
                                  <RenderTag k={key} />
                                </li>
                              ))}
                            </ul>
                          </details>
                        )}
                        {item.hiddenIf && (
                          <details>
                            <summary>
                              This feature is hidden if any of these{' '}
                              {item.hiddenIf.length} tag
                              {item.hiddenIf.length === 1 ? '' : 's'} exist:
                            </summary>
                            <ul style={{ marginLeft: 18 }}>
                              {item.hiddenIf.map((tags, index) => (
                                // eslint-disable-next-line @eslint-react/no-array-index-key -- safe, static data
                                <li key={index}>
                                  <RenderTags tags={tags} />
                                </li>
                              ))}
                            </ul>
                          </details>
                        )}
                        {item.note}
                      </Table.Td>
                    </Table.Tr>
                  );
                })}
              </Table.Tbody>
            </Fragment>
          );
        })}
      </Table>
    </Modal>
  );
};
