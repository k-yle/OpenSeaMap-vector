import md5 from 'md5';
import type {
  Item,
  ItemId,
  SnakWithValue,
  WbGetEntitiesResponse,
} from 'wikibase-sdk';

enum P {
  FlagImage = 'P41',
}

const isItemId = (value: string | undefined): value is ItemId =>
  !!value && /^Q\d+$/.test(value);

export async function getBurgee(
  qId: string | undefined,
): Promise<HTMLImageElement | undefined> {
  if (!isItemId(qId)) return undefined;

  const item: WbGetEntitiesResponse = await fetch(
    `https://www.wikidata.org/wiki/Special:EntityData/${qId}.json`,
  ).then((r) => r.json());

  const fileName = (<SnakWithValue>(
    (<Item>item.entities[qId])?.claims?.[P.FlagImage]?.[0]?.mainsnak
  ))?.datavalue?.value;

  if (typeof fileName !== 'string') return undefined;

  // fetch the image
  const fileId = fileName.replaceAll(' ', '_');
  const [h0, h1] = md5(fileId);
  let imageUrl = `https://upload.wikimedia.org/wikipedia/commons/thumb/${h0}/${h0}${h1}/${fileId}/250px-${fileId}`;
  if (imageUrl.endsWith('.svg')) imageUrl += '.png';

  const img = new Image();
  img.crossOrigin = 'anonymous';
  await new Promise((resolve, reject) => {
    img.addEventListener('load', resolve);
    img.addEventListener('error', reject);
    img.src = imageUrl;
  });
  return img;
}
