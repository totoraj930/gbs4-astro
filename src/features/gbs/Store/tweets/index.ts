import { copyText, openGbfPage } from '@gbs/utils';
import { createSignal, createEffect } from 'solid-js';
import { putLog } from '@gbs/Store/logs';
import type { TweetData } from './schema';
import type { ClickAction } from '../globalSettings/schema';
import { addToast } from '../toast';
import { text } from '@gbs/Text';

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
export const [globalTimeDiff, setGlobalTimeDiff] = createSignal(0);

/**
 * 現在時刻
 */
const [globalTime, setGlobalTime] = createSignal(Date.now());
export { globalTime };
setInterval(() => {
  setGlobalTime(Date.now() + globalTimeDiff());
}, 1000);
createEffect(() => {
  setGlobalTime(Date.now() + globalTimeDiff());
});

let prevTime = Date.now();
export async function copyTweet(tweetData: TweetData, action?: ClickAction) {
  // if (Date.now() - prevTime < 100) return;
  // putLog('info', 'copy', tweetData.battleId);
  const copyRes = await copyText(tweetData.battleId);
  if (copyRes) {
    prevTime = Date.now();
    putLog('info', 'copied', tweetData.battleId);
    setCopiedTweets((prev) => {
      return [...prev, tweetData];
    });
    addToast({
      type: 'info',
      duration: 2000,
      message: text('コピー: {id}', { id: tweetData.battleId }),
    });
    if (action && action !== 'copy') {
      openGbfPage(action);
    }
  }
  return copyRes;
}
