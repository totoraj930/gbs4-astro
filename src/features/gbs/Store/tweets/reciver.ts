import mitt from 'mitt';
import { gbsList } from '@gbs/Store/gbsList';
import { globalTimeDiff, setAllTweets, setGlobalTimeDiff } from '.';
import type { TweetData } from './schema';
import { connect, gbsWs, sendMessage } from './ws';
import { allFilterIds } from '../globalSettings';
import { createEffect, on } from 'solid-js';
import type { RaidTweetMini } from 'gbs-open-lib';

type ReceiverEvents = {
  tweet: TweetData;
  connected: void;
  disconnected: void;
  ping: number;
};

/**
 * 受信機
 */
export const tweetReciver = mitt<ReceiverEvents>();

/**
 * フィルタ更新のタイムアウト(連続で変更されないように)
 */
let updateFilterTimeout: number | null = null;
createEffect(
  on(allFilterIds, () => {
    if (updateFilterTimeout) {
      clearTimeout(updateFilterTimeout);
    }
    console.log();
    updateFilterTimeout = setTimeout(() => {
      sendFilters(allFilterIds());
    }, 1000);
  })
);

/**
 * WebSocketクライアントからのイベント処理
 */
gbsWs.on('tweet', (mini) => {
  try {
    emitTweetFromMiniData(mini);
  } catch {
    /* */
  }
});

/**
 * 初回のフィルタ更新
 */
gbsWs.on('open', () => {
  sendFilters(allFilterIds());
});

/**
 * サーバーとの時間のずれを確認
 */
gbsWs.on('time', (time) => {
  setGlobalTimeDiff(Date.now() - time);
});

gbsWs.on('ping', (num) => {
  tweetReciver.emit('ping', num);
});

gbsWs.on('error', (msg) => {
  console.log(msg);
});

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

function emitTweetFromMiniData(mini: RaidTweetMini) {
  const enemy = gbsList().find((item) => item.id === mini.ei);
  const tweet: TweetData = {
    battleId: mini.bi,
    language: mini.l,
    // elapsed: Date.now() + globalTimeDiff() - mini.t,
    elapsed: mini.et,
    time: mini.t,
    firstTime: mini.ft,
    sender: mini.sn,
    comment: mini.c,
    enemy: enemy ?? {
      attr: 0,
      en: mini.en ?? '?????',
      ja: mini.en ?? '?????',
      level: mini.lv ?? '???',
      id: mini.ei,
      image: null,
      tags: [],
    },
  };
  emitTweet(tweet);
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

// let dummyTimer: number | null = null;
export function connectReciver() {
  connect();
  disconnectReciver();
  // dummyTimer = setInterval(emitRandomTweet, 1000);
}

export function disconnectReciver() {
  // if (dummyTimer) {
  //   clearInterval(dummyTimer);
  // }
}

/**
 * サーバーにフィルターを送信
 */
export function sendFilters(filters: number[]) {
  sendMessage({
    type: 'filters',
    data: filters,
  });
}
