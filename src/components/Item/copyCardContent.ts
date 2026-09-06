import type { Item } from '../types';

export async function copyCardContent(
  item: Pick<Item, 'data'>,
  clipboard?: Pick<Clipboard, 'writeText'>
): Promise<void> {
  if (typeof clipboard?.writeText !== 'function') {
    throw new Error('Clipboard is unavailable');
  }

  await clipboard.writeText(item.data.titleRaw);
}
