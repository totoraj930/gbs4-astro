import { createStore, SetStoreFunction } from 'solid-js/store';
import { createMemo, createSignal } from 'solid-js';
import { GlobalSettings, VERSION, zGlobalSettings } from './schema';
import { hasClipboardPermission } from '@gbs/utils';

/**
 * 全体で使う設定ストア
 */

export const [globalSettings, setGlobalSettings] = createStore<GlobalSettings>(
  getSettingsFromStorage()
);

export const allFilterIds = createMemo(() => {
  const cols =
    globalSettings.columnGroup[globalSettings.currentGroupKey].columns;
  const ids = new Set<number>();
  for (const col of cols) {
    for (const f of col.filters) {
      ids.add(f.id);
    }
  }
  return [...ids];
});

export const allFilterIdStrs = createMemo(() => {
  return allFilterIds()
    .sort((a, b) => a - b)
    .join(',');
});

export const changeAndSave: SetStoreFunction<GlobalSettings> = (
  // @ts-expect-error setStoreと同じ実装のためエラーは出ない
  ...args
) => {
  // @ts-expect-error setStoreと同じ実装のためエラーは出ない
  setGlobalSettings(...args);
  saveSettingsToStorage();
};

/**
 * windowにfocusがあるか
 */
const [hasFocus, setHasFocus] = createSignal(true);
export { hasFocus };
const onFocus = () => setHasFocus(true);
const onBlur = () => setHasFocus(false);
export function initFocusDetector() {
  window.removeEventListener('focus', onFocus);
  window.removeEventListener('blur', onBlur);
  window.addEventListener('focus', onFocus);
  window.addEventListener('blur', onBlur);
}

/**
 * Permissions APIでclipboard-writeが許可されているか
 */
const [canAutoCopy, setCanAutoCopy] = createSignal(false);
export { canAutoCopy };
export async function initAutoCopy() {
  setCanAutoCopy(await hasClipboardPermission());
}

/**
 * コンパクトモードを使用するか
 */
export const [isCompact, setIsCompact] = createSignal(false);

/**
 * 画面ロックを使用するか
 */
export const [isScreenLock, setIsScreenLock] = createSignal(false);

export const [isOpenAbout, setIsOpenAbout] = createSignal(false);

export const [isOpenMenu, setIsOpenMenu] = createSignal(false);

export const [showAds, setShowAds] = createSignal(true);

/**
 * カラム移動モードのON/OFF
 */
// export const [isColumnMoveMode, setIsColumnMoveMode] = createSignal(false);

/**
 * localStorageから設定を取得
 */
function getSettingsFromStorage() {
  try {
    const name = `gbs4-${VERSION}`;
    const rawOptions = localStorage.getItem(name);
    if (!rawOptions) throw new Error('options not found.');
    return zGlobalSettings.parse(JSON.parse(rawOptions));
  } catch (err) {
    console.error(err);
    return zGlobalSettings.parse({});
  }
}

/**
 * 全体設定をlocalStorageに保存
 */
export function saveSettingsToStorage() {
  const name = `gbs4-${VERSION}`;
  localStorage.setItem(name, JSON.stringify(globalSettings));
}
