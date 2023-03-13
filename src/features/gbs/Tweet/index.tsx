import { createMemo, Show } from 'solid-js';
import { globalSettings } from '../Store/globalSettings';
import { text } from '../Text';
import { copiedIds, copyTweet, globalTime } from '@gbs/Store/tweets';
import type { TweetData } from '@gbs/Store/tweets/schema';
import clsx from 'clsx';

type Props = {
  tweet: TweetData;
};

export function Tweet(props: Props) {
  const viewTime = createMemo(() => {
    const now = Math.max(globalTime(), Date.now());
    const seconds = Math.round((now - props.tweet.time) / 1000);
    const minutes = ~~(seconds / 60);
    const time = minutes > 0 ? minutes + text('分') : seconds + text('秒');
    return time;
  });

  const enemyName = createMemo(() => {
    return props.tweet.enemy[globalSettings.language];
  });

  const enemyLevel = createMemo(() => {
    return 'Lv.' + props.tweet.enemy.level;
  });

  const copied = createMemo(() => {
    return copiedIds().includes(props.tweet.battleId);
  });

  const image = createMemo(() => {
    return globalSettings.showImage && props.tweet.enemy.image
      ? `url(https://pbs.twimg.com/media/${props.tweet.enemy.image})`
      : 'none';
  });

  return (
    <button
      class={clsx(
        'relative block w-full select-none',
        'bg-white dark:bg-gray-700',
        'text-left [-webkit-tap-highlight-color:transparent]'
      )}
      classList={{
        'tweet-copied': copied(),
      }}
      onMouseDown={() => copyTweet(props.tweet)}
      onTouchEnd={() => copyTweet(props.tweet)}
    >
      <span
        class="tweet-bg-img"
        data-elm={props.tweet.enemy.attr ?? 0}
        style={{
          'background-image': image(),
        }}
      >
        {}
      </span>
      <span class="tweet-flash">{}</span>
      <span class="relative z-[5] block p-[8px]">
        <span
          class={clsx(
            'absolute top-[5px] right-[5px] z-[1] min-w-[60px] rounded-full',
            'bg-[rgba(0,0,0,0.7)] pt-[4px] pb-[3px] text-center text-[14px] text-white'
          )}
        >
          {viewTime()}
        </span>
        <span
          class={clsx(
            'tweet-outline-text relative z-[0] mb-[2px] block max-w-full',
            'overflow-hidden text-ellipsis whitespace-nowrap font-bold leading-[1.5]'
          )}
        >
          <span class="block text-[0.8em]">{enemyLevel()}</span>
          <span class="inline text-ellipsis text-[0.9em]">{enemyName()}</span>
        </span>
        <span class="tweet-outline-text relative z-[2] block text-[14px]">
          @{props.tweet.sender}
        </span>

        <Show
          when={
            typeof props.tweet.comment === 'string' &&
            props.tweet.comment.length > 0
          }
        >
          <span class="tweet-comment" title={props.tweet.comment}>
            {props.tweet.comment}
          </span>
        </Show>
        <span
          class={clsx(
            'tweet-battle-id absolute right-[5px] bottom-[6px] text-[14px] font-[700]',
            'text-white'
          )}
        >
          {props.tweet.battleId}
        </span>
      </span>
    </button>
  );
}
