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
import { globalSettings } from '@gbs/Store/globalSettings';
import { text } from '@gbs/Text';
import { Tweet } from '@gbs/Tweet';
import { tweetReciver } from '@gbs/Store/tweets/reciver';
import { allTweets, copyTweet } from '@gbs/Store/tweets';
import type { TweetData } from '@gbs/Store/tweets/schema';

import type { FilterItem } from '@gbs/Store/globalSettings/schema';
import { useColumn } from './columnContext';
import { twMerge } from 'tailwind-merge';
import clsx from 'clsx';

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

export function FilteredTweets() {
  const { options: col } = useColumn();
  const [filteredTweets, setFilteredTweets] = createSignal<TweetData[]>([]);
  const shortTweets = createMemo(() => {
    return filteredTweets().slice(0, globalSettings.fewerTweets ? 8 : 20);
  });

  const filters = () => col.filters;

  function onTweet(tweetData: TweetData) {
    if (!testFilters(tweetData, col.filters)) return;
    setFilteredTweets((prev) => {
      const res = [...prev];
      let insertPos = 0;
      if (globalSettings.orderByTweetTime) {
        for (let i = 0; i < res.length; i++) {
          if (res[i].time < tweetData.time) break;
          insertPos = i + 1;
        }
      }

      res.splice(insertPos, 0, tweetData);

      if (insertPos === 0 && col.autoCopy) {
        copyTweet(tweetData);
      }
      return res;
    });
  }

  function copyLatest() {
    const latestTweet = filteredTweets()[0];
    if (latestTweet) copyTweet(latestTweet);
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
        allTweets().filter((tweetData) => testFilters(tweetData, filters()))
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
            },
            {
              'overflow-y-hidden':
                globalSettings.compact || globalSettings.noScroll,
            }
          )
        )}
      >
        <ul
          class="flex flex-col items-stretch"
          classList={{
            'border border-solid border-gray-300 dark:border-gray-600 h-full overflow-hidden':
              globalSettings.copyButton === 'overlay',
          }}
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
            class={clsx(
              'grid h-[40px] flex-1 place-items-center text-sm',
              'bg-white dark:bg-gray-700'
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
