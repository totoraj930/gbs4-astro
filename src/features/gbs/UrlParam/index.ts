import { deleteAds } from '@gbs/ads';
// import { putLog } from '@gbs/Store/logs';

export function initUrlParams() {
  try {
    const params = new URL(location.href).searchParams;
    const n = 'totorachankawaii';
    if (localStorage.getItem(n)) {
      deleteAds();
    }

    if (params.has(n)) {
      deleteAds();
      localStorage.setItem(n, 'ok');
    }

    window.history.replaceState('', '', '/');
  } catch (err) {
    // putLog('error', err);
  }
}
