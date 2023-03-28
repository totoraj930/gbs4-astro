import { z } from 'zod';

const zInfoItem = z.object({
  date: z.string(),
  message: z.union([z.string(), z.array(z.string())]),
});
export type InfoItem = z.infer<typeof zInfoItem>;

const zInfo = z.object({
  important: zInfoItem,
  history: z.array(zInfoItem),
});
export type Info = z.infer<typeof zInfo>;

export async function getInfo() {
  const url = 'https://gbs-dev.eriri.net/info/info.json';
  const res = await fetch(url);
  const info = zInfo.parse(await res.json());
  console.log(info);
}
