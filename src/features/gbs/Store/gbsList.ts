import { createSignal, createMemo, createEffect } from 'solid-js';
import { z } from 'zod';

export const EnemyElement = {
  None: 0,
  Fire: 1,
  Water: 2,
  Earch: 3,
  Wind: 4,
  Light: 5,
  Dark: 6,
} as const;

export const zGbsListItem = z.object({
  id: z.number(),
  attr: z.nativeEnum(EnemyElement),
  ja: z.string(),
  en: z.string(),
  image: z.string().nullable(),
  level: z.string(),
  tags: z.array(z.string()),
});
export type GbsListItem = z.infer<typeof zGbsListItem>;

export const zGbsList = z.array(zGbsListItem);
export type GbsList = z.infer<typeof zGbsList>;

export const [gbsList, setGbsList] = createSignal<GbsList>([]);

export async function loadGbsList() {
  const url = 'https://gbs.eriri.net/list/';
  try {
    const res = await fetch(url);
    const rawJson = await res.json();
    const list = zGbsList.parse(rawJson);
    setGbsList(
      list
        .sort((a, b) => {
          const aNum = Number.parseInt(a.level);
          const bNum = Number.parseInt(b.level);
          if (!Number.isFinite(bNum)) return -1;
          if (aNum < bNum) return -1;
          else if (aNum > bNum) return 1;
          return 0;
        })
        .sort((a, b) => a.attr - b.attr)
    );
  } catch (err) {
    console.error(err);
  }
}

export const [searchText, setSearchText] = createSignal('');
export const [searchTag, setSearchTag] = createSignal('All');

export const filteredGbsList = createMemo(() => {
  return gbsList().filter((item) => {
    if (item.tags.includes('hide')) return false;
    if (searchTag() !== 'All' && !item.tags.includes(searchTag())) return false;
    if (
      !item.ja.toLowerCase().includes(searchText().toLowerCase()) &&
      !item.en.toLowerCase().includes(searchText().toLowerCase())
    )
      return false;
    return true;
  });
});
