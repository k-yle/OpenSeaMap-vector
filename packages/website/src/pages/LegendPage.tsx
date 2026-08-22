import { Fragment, use } from 'react';
import { FocusTrap, Modal, Table, Title } from '@mantine/core';
import type { Tags } from 'osm-api';
import { useMediaQuery } from '@mantine/hooks';
import { LEGEND } from '../data/legend.js';
import { LocaleContext } from '../context/LocaleContext.js';

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
  const { $ } = use(LocaleContext);
  const isNarrowScreen = useMediaQuery('(max-width: 700px)');
  return (
    <Modal
      opened={isOpen}
      onClose={onClose}
      title={<strong>{$('Navbar.legend')}</strong>}
      size="80vw"
      fullScreen={isNarrowScreen}
      transitionProps={isNarrowScreen ? { transition: 'fade' } : undefined}
    >
      <FocusTrap.InitialFocus />

      <Table>
        {LEGEND.map((category, categoryIndex) => {
          return (
            // eslint-disable-next-line @eslint-react/no-array-index-key -- it's stable
            <Fragment key={categoryIndex}>
              <Table.Thead>
                <Table.Tr>
                  <Table.Th colSpan={3}>
                    <Title order={5} mt={categoryIndex && 32}>
                      {category.categoryName($)}
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
                              {$('LegendPage.altTags', { count: altTagsCount })}
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
                              {$('LegendPage.labelAttributes', {
                                count: item.labelAttributes.length,
                              })}
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
                              {$('LegendPage.hiddenIf', {
                                count: item.hiddenIf.length,
                              })}
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
