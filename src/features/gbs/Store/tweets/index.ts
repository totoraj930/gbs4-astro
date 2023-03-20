import { copyText } from '@gbs/utils';
import { createSignal, createEffect } from 'solid-js';
import { putLog } from '@gbs/Store/logs';
import type { TweetData } from './schema';

/**
 * 全ツイート
 */
export const [allTweets, setAllTweets] = createSignal<TweetData[]>([]);

/**
 * コピーしたツイート
 */
export const [copiedTweets, setCopiedTweets] = createSignal<TweetData[]>([]);

/**
 * コピーしたID
 */
export const copiedIds = () => {
  return copiedTweets().map((tweetData) => tweetData.battleId);
};

/**
 * 時間のズレ
 */
const [globalTimeDiff, setGlobalTimeDiff] = createSignal(0);
export { globalTimeDiff };

/**
 * 現在時刻
 */
const [globalTime, setGlobalTime] = createSignal(Date.now());
export { globalTime };
setInterval(() => setGlobalTime(Date.now() + globalTimeDiff()), 1000);
createEffect(() => {
  setGlobalTime(Date.now() + globalTimeDiff());
});

let prevTime = Date.now();
export async function copyTweet(tweetData: TweetData) {
  if (Date.now() - prevTime < 100) return;
  // putLog('info', 'copy', tweetData.battleId);
  const copyRes = await copyText(tweetData.battleId);
  if (copyRes) {
    prevTime = Date.now();
    putLog('info', 'copied', tweetData.battleId);
    setCopiedTweets((prev) => {
      return [...prev, tweetData];
    });
  }
  return copyRes;
}
