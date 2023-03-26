import {
  createEffect,
  createMemo,
  createSignal,
  For,
  on,
  onCleanup,
  onMount,
  Show,
} from 'solid-js';
import {
  globalSettings,
  hasFocus,
  isCompact,
  isScreenLock,
} from '@gbs/Store/globalSettings';
import { text } from '@gbs/Text';
import { Tweet } from '@gbs/Tweet';
import { tweetReciver } from '@gbs/Store/tweets/reciver';
import { allTweets, copyTweet } from '@gbs/Store/tweets';
import type { TweetData } from '@gbs/Store/tweets/schema';

import {
  ColumnOptions,
  DuplicateOption,
  ElapsedOption,
  FilterItem,
  SoundData,
} from '@gbs/Store/globalSettings/schema';
import { useColumn } from './columnContext';
import { twMerge } from 'tailwind-merge';
import clsx from 'clsx';
import { playAudio } from '@gbs/utils';

function testFilter(tweetData: TweetData, filter: FilterItem) {
  if (tweetData.enemy.id !== filter.id) return false;
  if (filter.id === -1) {
    let name = new RegExp('.');
    let level = new RegExp('.');
    try {
      name = new RegExp(filter.regex ?? '.');
      level = new RegExp(filter.level ?? '.');
    } catch {
      /* empty */
    }
    return name.test(tweetData.enemy.ja) && level.test(tweetData.enemy.level);
  }
  return true;
}

function testFilters(tweetData: TweetData, filters: FilterItem[]) {
  for (const filter of filters) {
    const res = testFilter(tweetData, filter);
    if (res) return true;
  }
  return false;
}

function strToRegExp(str: string) {
  try {
    return new RegExp(str);
  } catch {
    return str;
  }
}

function testComment(tweetData: TweetData, text: string) {
  if (text.length <= 0) return true;
  const comment = tweetData.comment ?? '';
  const reg = strToRegExp(text);
  return typeof reg === 'string' ? comment.includes(reg) : reg.test(comment);
}

function testElapsed(tweetData: TweetData, elapsed: ElapsedOption) {
  if (elapsed === 'all') return true;
  const diff = tweetData.elapsed;
  const one = 1000;
  switch (elapsed) {
    case '2s': {
      return diff <= one * 2;
    }
    case '3s': {
      return diff <= one * 3;
    }
    case '4s': {
      return diff <= one * 4;
    }
    case '5s': {
      return diff <= one * 5;
    }
  }
  return true;
}

function testDuplicate(tweetData: TweetData, duplicate: DuplicateOption) {
  if (duplicate === 'all') return true;
  if (duplicate === 'latest') return tweetData.firstTime === tweetData.time;
  const diff = tweetData.time - tweetData.firstTime;
  const one = 1000 * 60;
  switch (duplicate) {
    case '1m': {
      return diff >= one;
    }
    case '2m': {
      return diff >= one * 2;
    }
    case '3m': {
      return diff >= one * 3;
    }
    case '5m': {
      return diff >= one * 5;
    }
    case '10m': {
      return diff >= one * 10;
    }
  }
  return true;
}

function testAllOptions(tweetData: TweetData, ops: ColumnOptions) {
  return (
    testComment(tweetData, ops.comment) &&
    testElapsed(tweetData, ops.elapsed) &&
    testDuplicate(tweetData, ops.duplicate) &&
    testFilters(tweetData, ops.filters)
  );
}

export function FilteredTweets() {
  const { options: col } = useColumn();
  const [filteredTweets, setFilteredTweets] = createSignal<TweetData[]>([]);
  const shortTweets = createMemo(() => {
    return filteredTweets().slice(0, globalSettings.fewerTweets ? 8 : 20);
  });
  const soundUrl = createMemo(() => {
    return '/gbs/sound/' + SoundData[col.sound.type].file;
  });

  const filters = () => col.filters;

  function onTweet(tweetData: TweetData) {
    // 各種フィルタの確認
    const isAllowed = testAllOptions(tweetData, col);
    if (!isAllowed) return;

    // 有効なツイートなら処理する
    setFilteredTweets((prev) => {
      // 追加済みならなにもしない
      if (prev.find((target) => target.tweetId === tweetData.tweetId)) {
        return prev;
      }
      const res = [...prev];
      let insertPos = 0;
      if (globalSettings.orderByTweetTime) {
        for (let i = 0; i < res.length; i++) {
          if (res[i].time < tweetData.time) break;
          insertPos = i + 1;
        }
      }

      res.splice(insertPos, 0, tweetData);

      // 最新なら処理する
      if (insertPos === 0) {
        // 自動コピー
        if (col.autoCopy) copyTweet(tweetData);

        // ミュート確認
        if (!col.sound.mute && !globalSettings.mute) {
          // フォーカス確認
          if (!globalSettings.focusOnlySound || hasFocus()) {
            playAudio(soundUrl(), globalSettings.volume);
          }
        }
      }
      return res;
    });
  }

  // ボタンからのコピー
  async function copyLatest() {
    const latestTweet = filteredTweets()[0];
    if (latestTweet) {
      copyTweet(latestTweet, globalSettings.clickAction);
    }
  }

  onMount(() => {
    tweetReciver.on('tweet', onTweet);
  });

  onCleanup(() => {
    tweetReciver.off('tweet', onTweet);
  });

  createEffect(
    on(filters, () => {
      setFilteredTweets(
        allTweets().filter((tweetData) => testAllOptions(tweetData, col))
      );
    })
  );

  return (
    <>
      <Show when={globalSettings.copyButton === 'top'}>
        <button
          class={clsx(
            'grid h-[60px] w-full place-items-center border-b border-solid',
            'border-gray-300 dark:border-gray-600'
          )}
          onMouseDown={copyLatest}
          onTouchEnd={copyLatest}
        >
          {text('最新をコピー')}
        </button>
      </Show>

      <div
        class={twMerge(
          clsx(
            'flex-1',
            {
              'overflow-y-scroll': globalSettings.copyButton !== 'overlay',
              'overflow-y-clip p-[10px] pb-[40px]':
                globalSettings.copyButton === 'overlay',
              'p-[5px] pb-[24px]':
                globalSettings.copyButton === 'overlay' && isCompact(),
            },
            {
              'overflow-y-hidden':
                globalSettings.compact ||
                globalSettings.noScroll ||
                isScreenLock(),
            }
          )
        )}
      >
        <ul
          class={twMerge(
            clsx('flex flex-col items-stretch', {
              'h-full overflow-hidden border border-solid border-gray-300 dark:border-gray-600':
                globalSettings.copyButton === 'overlay',
            })
          )}
        >
          <For each={shortTweets()}>
            {(item) => {
              return (
                <li class="w-full">
                  <Tweet tweet={item} />
                  <hr class="relative z-[5] border-t border-solid border-gray-300 dark:border-gray-600" />
                </li>
              );
            }}
          </For>
        </ul>
      </div>

      <Show when={globalSettings.copyButton === 'overlay'}>
        <button
          class="absolute z-30 flex h-full w-full items-end"
          onMouseDown={copyLatest}
          onTouchEnd={copyLatest}
        >
          <span
            class={twMerge(
              clsx(
                'grid h-[40px] flex-1 place-items-center text-[14px]',
                'bg-white dark:bg-gray-700',
                {
                  'h-[24px] text-[12px]': isCompact(),
                }
              )
            )}
          >
            {text('最新をコピー')}
          </span>
        </button>
      </Show>

      <Show when={globalSettings.copyButton === 'bottom'}>
        <button
          class={clsx(
            'grid h-[60px] w-full place-items-center border-t border-solid',
            'border-gray-300 dark:border-gray-600'
          )}
          onMouseDown={copyLatest}
          onTouchEnd={copyLatest}
        >
          {text('最新をコピー')}
        </button>
      </Show>
    </>
  );
}
