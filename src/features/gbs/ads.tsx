import clsx from 'clsx';
import { Show } from 'solid-js';
import { MenuColumn } from './MenuColumn';
import { globalSettings, setShowAds, showAds } from './Store/globalSettings';
import { putLog } from './Store/logs';
import { text } from './Text';

declare global {
  interface Window {
    adsbygoogle?: {
      loaded: boolean;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      push: (v: any) => void;
    };
  }
}

export function deleteAds() {
  setShowAds(false);
}

/**
 * insの数だけ実行する(初回のページロード時しかやっちゃダメ)
 */
function initAds() {
  putLog('info', 'init ads.');
  setTimeout(() => {
    if (!showAds()) return;
    try {
      window.adsbygoogle && window.adsbygoogle.push({});
    } catch (err) {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      putLog('error', err);
      console.error(err);
    }
  }, 200);
}

export function AdsAndMenu() {
  return (
    <div class={clsx('ad-and-menu')}>
      <div class="ad-title">
        <AdsColumn />
      </div>

      <Show when={globalSettings.menuPotision === 'right'}>
        <div class="relative w-[320px] flex-1">
          <div class="absolute top-0 left-0 h-full w-full">
            <MenuColumn />
          </div>
        </div>
      </Show>
    </div>
  );
}

export function AdsColumn() {
  return (
    <Show when={showAds()}>
      <section class="ad-column">
        <p class="py-[3px] text-[14px] dark:text-white">{text('広告')}</p>
        <div
          class={clsx(
            'ad-wrap ad-slot-pc',
            'bg-white text-center dark:bg-gray-700 dark:text-white'
          )}
        >
          <ins
            class="adsbygoogle ad-slot-pc"
            data-ad-client="ca-pub-5994029821720632"
            data-ad-slot="7493107324"
            data-ad-format="rectangle"
            data-full-width-responsive="false"
            ref={() => initAds()}
          />
        </div>
        <div
          class={clsx(
            'ad-wrap ad-slot-mobile',
            'bg-white text-center dark:bg-gray-700 dark:text-white'
          )}
        >
          <ins
            class="adsbygoogle ad-slot-mobile"
            data-ad-client="ca-pub-5994029821720632"
            data-ad-slot="7493107324"
            data-ad-format="horizontal"
            data-full-width-responsive="false"
            ref={() => initAds()}
          />
        </div>
      </section>
      {/* <section class="ml-[5px] mt-[5px] text-center dark:text-white">
        <p class=" w-full py-[11px] text-[14px]">{text('広告')}</p>
        <div class="inline-block bg-gray-100 dark:bg-gray-800">
          <ins
            class="adsbygoogle slot_1"
            style={{ display: 'inline-block', width: '300px', height: '250px' }}
            data-ad-client="ca-pub-5994029821720632"
            data-ad-slot="1281137909"
            // data-ad-format="auto"
            // data-full-width-responsive="true"
          />
        </div>
      </section> */}
    </Show>
  );
}
