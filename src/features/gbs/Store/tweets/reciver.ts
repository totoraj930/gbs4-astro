import mitt from 'mitt';
import { gbsList } from '@gbs/Store/gbsList';
import { globalTimeDiff, setAllTweets } from '.';
import type { TweetData } from './schema';

type ReceiverEvents = {
  tweet: TweetData;
  connected: void;
  disconnected: void;
};

/**
 * 受信機
 */
export const tweetReciver = mitt<ReceiverEvents>();

export function randomTweet(): TweetData | null {
  const list = gbsList();
  // スパバハ, ジーク, アガスティア, 強バハ
  const enemys = [117, 126, 127, 55];
  const senders = ['totoraj_game', 'hogefuga', 'xYdfs12d__2'];
  const sender = senders[Math.floor(Math.random() * senders.length)];
  const enemyId = enemys[Math.floor(Math.random() * enemys.length)];
  const enemy = list.find((item) => item.id === enemyId);
  if (!enemy) return null;
  const battleId = 'xxxxxxxx'
    .replace(/x/g, () => Math.floor(Math.random() * 16).toString(16))
    .toUpperCase();
  const time = Date.now() - Math.floor(Math.random() * 5000);
  return {
    battleId,
    enemy,
    time,
    firstTime: time,
    language: 'ja',
    sender,
    elapsed: Date.now() + globalTimeDiff() - time,
  };
}

function emitRandomTweet() {
  const tweet = randomTweet();
  if (tweet) emitTweet(tweet);
}

function emitTweet(tweetData: TweetData) {
  tweetReciver.emit('tweet', tweetData);
  setAllTweets((prev) => {
    const res = [...prev];
    let insertPos = 0;
    for (let i = 0; i < res.length; i++) {
      if (res[i].time < tweetData.time) break;
      insertPos = i + 1;
    }
    res.splice(insertPos, 0, tweetData);
    return res;
  });
}

let dummyTimer: number | null = null;
export function connectReciver() {
  disconnectReciver();
  dummyTimer = setInterval(emitRandomTweet, 1000);
}

export function disconnectReciver() {
  if (dummyTimer) {
    clearInterval(dummyTimer);
  }
}
