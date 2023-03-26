import { onMount } from 'solid-js';

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
