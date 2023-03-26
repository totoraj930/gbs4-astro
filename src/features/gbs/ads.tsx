import { text } from './Text';

declare global {
  interface Window {
    adsbygoogle?: {
      loaded: boolean;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      push: (v: any) => void;
    };
    google_ad_client?: string;
    google_ad_slot?: string;
    google_ad_width?: number;
    google_ad_height?: number;
  }
}

export function AdsColumn() {
  window.google_ad_client = 'ca-pub-5994029821720632';
  window.google_ad_slot = '7373836338';
  window.google_ad_width = 300;
  window.google_ad_height = 250;

  return (
    <section class="ad-column dark:text-white">
      <p class="w-full py-[5px] text-center text-[14px]">{text('広告')}</p>
      <div class="ad-wrap bg-gray-200 dark:bg-gray-800">
        <script
          type="text/javascript"
          src="//pagead2.googlesyndication.com/pagead/show_ads.js"
        />
      </div>
    </section>
  );
}
