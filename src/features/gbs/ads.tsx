import clsx from 'clsx';
import { onCleanup, Show, createSignal } from 'solid-js';
import { twMerge } from 'tailwind-merge';
import { globalSettings, isCompact } from './Store/globalSettings';

declare global {
  interface Window {
    adsbygoogle?: {
      loaded: boolean;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      push: (v: any) => void;
    };
  }
}

/**
 * gbs-footer
 */
export function UnitGbsFooter() {
  const [w, setW] = createSignal(Math.min(970, document.body.clientWidth));

  return (
    <ins
      class="adsbygoogle"
      style={{ display: 'inline-block', width: `${w()}px`, height: '100px' }}
      data-ad-client="ca-pub-5994029821720632"
      data-ad-slot="8366255152"
    />
  );
}

export function UnitGbs300x250() {
  return (
    <ins
      class="adsbygoogle"
      style={{ display: 'inline-block', width: '300px', height: '250px' }}
      data-ad-client="ca-pub-5994029821720632"
      data-ad-slot="5710766688"
    />
  );
}

export function Ads(props: { unit: '300x250' | 'footer' }) {
  const timer = setTimeout(() => {
    window.adsbygoogle && window.adsbygoogle.push({});
  }, 1000);

  onCleanup(() => {
    clearTimeout(timer);
  });

  return (
    <>
      <Show when={props.unit === '300x250'}>
        <div class="relative mx-auto h-[250px] w-[300px]">
          <div
            class="absolute top-0 left-0"
            style={{ width: '300px', height: '200px' }}
          >
            <UnitGbs300x250 />
          </div>
        </div>
      </Show>
      <Show when={props.unit === 'footer'}>
        <div class="h-[100px] max-w-[970px]">
          <UnitGbsFooter />
        </div>
      </Show>
    </>
  );
}

export function AdsColumn() {
  return (
    <section
      class={twMerge(
        clsx(
          'relative flex h-full shrink-0 flex-col leading-none',
          'text-gray-700 dark:text-white',
          // 'bg-white, dark:bg-gray-700',
          {
            'min-w-[var(--column-size)]': globalSettings.columnSize !== 's',
            'min-w-[300px]': globalSettings.columnSize === 's',
            'h-[calc(50%-3px)]': globalSettings.columnType === '2lines',
          }
        )
      )}
    >
      {/* <div class="absolute top-0 left-0 h-full w-full overflow-hidden text-center"> */}
      <div class="w-full text-center">
        <p class="mb-[5px] mt-[5px] text-center text-[14px]">広告</p>
        <Ads unit="300x250" />
      </div>
    </section>
  );
}

export const [adsFooterH, setAdsFooterH] = createSignal(0);

export function AdsFooter() {
  return (
    <footer
      class={clsx(
        'h-[100px] max-h-[100px] min-h-[100px] w-full flex-shrink-0 flex-grow-0',
        'bg-white dark:bg-gray-800',
        {
          hidden: isCompact(),
        }
      )}
    >
      <Ads unit="footer" />
    </footer>
  );
}
