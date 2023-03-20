import { createStore, SetStoreFunction } from 'solid-js/store';
import { createSignal } from 'solid-js';
import { GlobalSettings, VERSION, zGlobalSettings } from './schema';
import { hasClipboardPermission } from '@gbs/utils';

/**
 * 全体で使う設定ストア
 */

export const [globalSettings, setGlobalSettings] = createStore<GlobalSettings>(
  getSettingsFromStorage()
);

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
