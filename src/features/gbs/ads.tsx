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
      <section class="w-full dark:text-white">
        <p class="w-full py-[5px] text-center text-[14px]">{text('広告')}</p>
        <div class="ad-wrap mx-auto bg-gray-100 dark:bg-gray-800">
          <ins
            class="adsbygoogle"
            style={{ display: 'inline-block', width: '300px', height: '250px' }}
            data-ad-client="ca-pub-5994029821720632"
            data-ad-slot="5710766688"
          />
        </div>
      </section>
    </Show>
  );
}
