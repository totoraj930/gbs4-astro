import { z } from 'zod';
import { zGbsListItem } from '@gbs/Store/gbsList';
import { zRaidTweetMini } from 'gbs-open-lib';

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
  tweetId: z.string(),
});
export type TweetData = z.infer<typeof zTweetData>;

/**
 * キャッシュサーバーのレスポンス
 */
export const zCacheResponse = z.array(
  z.object({
    id: z.number(),
    tweets: z.array(zRaidTweetMini),
  })
);
