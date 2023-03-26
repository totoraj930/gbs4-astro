import { createSignal, Show } from 'solid-js';
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

const [showAds, setShowAds] = createSignal(true);
export function deleteAds() {
  setShowAds(false);
}

export function AdsColumn() {
  return (
    <Show when={showAds()}>
      <section class="ad-column">
        <p class="py-[11px] text-[14px] dark:text-white">{text('広告')}</p>
        <div class="ad-wrap bg-gray-200 dark:bg-gray-700">
          <ins
            class="adsbygoogle"
            style={{ display: 'inline-block', width: '300px', height: '250px' }}
            data-ad-client="ca-pub-5994029821720632"
            data-ad-slot="7373836338"
            // data-ad-format="auto"
            // data-full-width-responsive="true"
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
