import { createStore, SetStoreFunction } from 'solid-js/store';
import { GlobalSettings, VERSION, zGlobalSettings } from './schema';

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
