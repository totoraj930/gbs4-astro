import { z } from 'zod';
import { zGbsListItem } from '@gbs/Store/gbsList';

/**
 * アプリ上で扱うツイートデータ
 */
export const zTweetData = z.object({
  battleId: z.string(),
  language: z.enum(['en', 'ja']),
  time: z.number(),
  firstTime: z.number(),
  sender: z.string(),
  comment: z.string().optional(),
  enemy: zGbsListItem,
  elapsed: z.number(),
});
export type TweetData = z.infer<typeof zTweetData>;

/**
 * サーバーから送られてくるデータ
 */
export const zRawTweetData = z.object({
  id: z.string(), // battleId
  t: z.number(), // time
  ft: z.number(), // firstTime
  s: z.string(), // sender
  l: z.string(), // language
  e: z.number(), // enemyNum
  en: z.string().optional(), // enemyName
  el: z.string().optional(), // enemyLevel
  i: z.string().optional(), // enemyImage
});
