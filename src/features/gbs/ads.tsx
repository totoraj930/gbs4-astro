import clsx from 'clsx';
import { onMount } from 'solid-js';
import { twMerge } from 'tailwind-merge';
import { globalSettings } from './Store/globalSettings';

declare global {
  interface Window {
    adsbygoogle?: {
      loaded: boolean;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      push: (v: any) => void;
    };
  }
}

export function Ads() {
  onMount(() => {
    window.adsbygoogle && window.adsbygoogle.push({});
  });
  return (
    <>
      {/* gbs4-レスポンシブ */}
      <ins
        class="adsbygoogle block"
        data-ad-client="ca-pub-5994029821720632"
        data-ad-slot="1281137909"
        data-ad-format="auto"
        data-full-width-responsive="true"
      />
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
          'grid place-content-center',
          {
            'min-w-[var(--column-size)]': globalSettings.columnSize !== 's',
            'min-w-[300px]': globalSettings.columnSize === 's',
            'h-[calc(50%-3px)]': globalSettings.columnType === '2lines',
          }
        )
      )}
    >
      <div>
        <p class="mb-[5px] text-[14px]">広告</p>
        <Ads />
      </div>
    </section>
  );
}
