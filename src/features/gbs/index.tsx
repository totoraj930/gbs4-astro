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
import { AdsColumn } from './ads';

export function Gbs() {
  onMount(async () => {
    detectWindowSize();
    await loadGbsList();
    setIsInitializing(false);
    await getRaidTweetCache(allFilterIdStrs());
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
    // <Portal mount={document.body} useShadow={false}>
    <main
      id="gbs-main"
      data-type={globalSettings.columnType}
      class={twMerge(
        clsx(
          'no-pull-to-refresh',
          'flex h-full min-h-full w-full flex-row',
          'items-stretch overflow-x-scroll',
          'dark:text-red bg-gray-100 text-gray-800 dark:bg-gray-900',
          {
            'has-focus': hasFocus(),
            'overflow-hidden': isScreenLock(),
          }
        )
      )}
    >
      <ToastArea />

      <Show when={globalSettings.menuPotision === 'left'}>
        <MenuColumn />
      </Show>

      <ColumnGroup groupKey={globalSettings.currentGroupKey} />

      <AdsColumn />

      <Show when={globalSettings.menuPotision === 'right'}>
        <MenuColumn />
      </Show>

      <div
        class={clsx(
          'absolute bottom-0 gap-[10px] p-[18px]',
          'pointer-events-none flex flex-col',
          'right-0 z-[40]',
          {
            // 'right-0': globalSettings.menuPotision === 'left',
            // 'left-0': globalSettings.menuPotision === 'right',
          }
        )}
      >
        <button
          onClick={() => showMenu()}
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
