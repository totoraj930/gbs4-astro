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

export function AdsColumn() {
  return (
    <section class="ad-column dark:text-white">
      <p class="w-full py-[5px] text-center text-[14px]">{text('広告')}</p>
      <div class="ad-wrap bg-gray-200 dark:bg-gray-800">
        <ins
          class="adsbygoogle"
          data-ad-client="ca-pub-5994029821720632"
          data-ad-slot="5710766688"
          style={{ display: 'block', width: '300px', height: '250px' }}
          ref={() => {
            window.adsbygoogle && window.adsbygoogle.push({});
          }}
        >
          {}
        </ins>
      </div>
    </section>
  );
}
