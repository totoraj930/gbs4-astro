import { createEffect, onMount, Show } from 'solid-js';
import { clsx } from 'clsx';
import {
  allFilterIds,
  globalSettings,
  hasFocus,
  initAutoCopy,
  initFocusDetector,
  isCompact,
  setIsCompact,
} from '@gbs/Store/globalSettings';
import { loadGbsList } from '@gbs/Store/gbsList';
import {
  connectReciver,
  getRaidTweetCache,
  setIsInitializing,
} from './Store/tweets/reciver';
import { isMenuVisible, MenuColumn } from './MenuColumn';
import { ColumnGroup } from './Column';
import { initAudioContext } from './utils';
import { twMerge } from 'tailwind-merge';
import { MsMenu } from 'solid-material-symbols/rounded/600';

export function Gbs() {
  onMount(async () => {
    await loadGbsList();
    setIsInitializing(false);
    await getRaidTweetCache(allFilterIds());
    connectReciver();
    initFocusDetector();
    initAutoCopy();
    document.body.addEventListener('click', initAudioContext, { once: true });
    document.body.addEventListener('touchend', initAudioContext, {
      once: true,
    });
    window.addEventListener('resize', () => {
      if (!globalSettings.autoCompact) return;
      if (document.body.clientHeight <= 200) {
        setIsCompact(true);
      } else {
        setIsCompact(false);
      }
    });
  });

  createEffect(() => {
    if (globalSettings.darkMode) {
      document.body.classList.add('dark');
    } else {
      document.body.classList.remove('dark');
    }
  });

  function showMenu() {
    const elm = document.body.querySelector('#gbs-main');
    if (!elm) return;
    try {
      elm.scrollTo({
        left: globalSettings.menuPotision === 'left' ? 0 : 9999,
        behavior: 'smooth',
      });
    } catch {
      /* */
    }
  }

  return (
    <div
      id="gbs-main"
      class={clsx(
        'flex h-full w-full content-start justify-start gap-[5px] overflow-auto p-[5px]',
        'smh:p-0',
        'dark:text-red bg-gray-100 text-gray-800 dark:bg-gray-900',
        {
          'flex-row': globalSettings.columnType === '1line',
          'flex-nowrap': globalSettings.columnType === '1line',
          'flex-col': globalSettings.columnType == '2lines',
          'flex-wrap': globalSettings.columnType == '2lines',
          'min-h-[340px]': globalSettings.columnType == '2lines',
          '[--column-size:270px]': globalSettings.columnSize == 's',
          '[--column-size:320px]': globalSettings.columnSize == 'm',
          '[--column-size:380px]': globalSettings.columnSize == 'l',
          'auto-compact': true,
          'has-focus': hasFocus(),
        }
      )}
    >
      <Show when={globalSettings.menuPotision === 'left'}>
        <MenuColumn />
      </Show>

      <ColumnGroup groupKey={globalSettings.currentGroupKey} />

      <Show when={globalSettings.menuPotision === 'right'}>
        <MenuColumn />
      </Show>

      <button
        onClick={() => showMenu()}
        class={twMerge(
          clsx(
            'absolute grid h-[40px] w-[40px] place-content-center',
            'bottom-[18px] right-[15px] z-[40] rounded-full',
            'bg-sky-500 text-white',
            {
              hidden: isMenuVisible() || isCompact(),
              'shadow-[0_0_5px_#000]': globalSettings.darkMode,
              'shadow-[0_0_5px_rgba(0,0,0,0.5)]': !globalSettings.darkMode,
            }
          )
        )}
      >
        <MsMenu size={26} />
      </button>
    </div>
  );
}
