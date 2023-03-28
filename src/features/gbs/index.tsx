import { createEffect, onMount, Show } from 'solid-js';
import { clsx } from 'clsx';
import {
  allFilterIdStrs,
  globalSettings,
  hasFocus,
  initAutoCopy,
  initFocusDetector,
  isCompact,
  isScreenLock,
  setIsCompact,
  setIsScreenLock,
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
import { MsLock, MsLockOpen, MsMenu } from 'solid-material-symbols/rounded/600';
import { ToastArea } from './Store/toast';
import { AdsAndMenu } from './ads';
import { LogColumn } from './Store/logs';
import { getInfo } from './Info';

export function scrollToElm(query: string) {
  const elm = document.body.querySelector('#gbs-main');
  const menuElm = document.body.querySelector(query);
  if (!elm || !menuElm) return;
  try {
    const { x } = menuElm.getBoundingClientRect();
    console.log(x, elm.scrollLeft);
    elm.scrollTo({
      left: x + elm.scrollLeft,
      behavior: 'smooth',
    });
  } catch {
    /* */
  }
}

export function Gbs() {
  onMount(async () => {
    detectWindowSize();
    await loadGbsList();
    setIsInitializing(false);
    await getRaidTweetCache(allFilterIdStrs());
    getInfo();
    connectReciver();
    initFocusDetector();
    initAutoCopy();
    document.body.addEventListener('click', initAudioContext, { once: true });
    document.body.addEventListener('touchend', initAudioContext, {
      once: true,
    });
    window.addEventListener('resize', () => {
      detectWindowSize();
    });
  });

  createEffect(() => {
    if (globalSettings.darkMode) {
      document.body.classList.add('dark');
    } else {
      document.body.classList.remove('dark');
    }
  });

  function detectWindowSize() {
    if (!globalSettings.autoCompact) return;
    if (document.body.clientHeight <= 300) {
      setIsCompact(true);
    } else {
      setIsCompact(false);
    }
  }

  return (
    <main
      id="gbs-main"
      data-type={globalSettings.columnType}
      class={twMerge(
        clsx(
          'no-pull-to-refresh',
          'flex h-full min-h-full w-full flex-row',
          'items-stretch overflow-x-scroll',
          'dark:text-red bg-gray-100 text-gray-800 dark:bg-gray-900',
          'p-[5px] smh:p-[3px]',
          {
            'has-focus': hasFocus(),
            'overflow-hidden': isScreenLock(),
          }
        )
      )}
    >
      <ToastArea />

      <Show when={globalSettings.log}>
        <div class="mr-[5px] min-w-[320px] max-w-[320px] shrink-0 grow-0 p-[2px]">
          <LogColumn />
        </div>
      </Show>

      <Show when={globalSettings.menuPotision === 'left'}>
        <div class="mr-[5px] min-w-[320px] shrink-0 grow-0 p-[2px]">
          <MenuColumn />
        </div>
      </Show>

      <ColumnGroup groupKey={globalSettings.currentGroupKey} />

      <AdsAndMenu />

      <div
        class={clsx(
          'absolute bottom-0 gap-[10px] p-[18px]',
          'pointer-events-none flex flex-col',
          'z-[40]',
          'right-0',
          {
            // 'right-0': globalSettings.menuPotision === 'left',
            // 'left-0': globalSettings.menuPotision === 'right',
          }
        )}
      >
        <button
          onClick={() => scrollToElm('#gbs-menu')}
          class={twMerge(
            clsx(
              'h-[40px] w-[40px] place-content-center',
              'pointer-events-auto grid rounded-full',
              'bg-sky-500 text-white',
              {
                hidden:
                  isMenuVisible() ||
                  isCompact() ||
                  isScreenLock() ||
                  !globalSettings.menuButton,
                'shadow-[0_0_5px_#000]': globalSettings.darkMode,
                'shadow-[0_0_5px_rgba(0,0,0,0.5)]': !globalSettings.darkMode,
              }
            )
          )}
        >
          <MsMenu size={26} />
        </button>
        <button
          onClick={() => setIsScreenLock((prev) => !prev)}
          class={twMerge(
            clsx(
              'h-[40px] w-[40px] place-content-center',
              'pointer-events-auto grid rounded-full',
              'bg-sky-500 text-white',
              {
                hidden: !globalSettings.lockButton,
                'shadow-[0_0_5px_#000]': globalSettings.darkMode,
                'shadow-[0_0_5px_rgba(0,0,0,0.5)]': !globalSettings.darkMode,
                'bg-red-600': isScreenLock(),
              }
            )
          )}
        >
          <Show
            when={isScreenLock()}
            fallback={<MsLockOpen size={26} class="-translate-y-[1px]" />}
          >
            <MsLock size={26} class="-translate-y-[1px]" />
          </Show>
        </button>
      </div>
    </main>
  );
}
