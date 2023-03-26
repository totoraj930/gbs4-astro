import { createMemo, createSignal, Show, onCleanup } from 'solid-js';
import { produce } from 'solid-js/store';
import { changeAndSave, globalSettings } from '../Store/globalSettings';
import { text } from '../Text';
import { Radio } from './Radio';
import { Settings } from './Settings';
import { clsx } from 'clsx';
import {
  ColumnGroupKey,
  MAX_COLUMN_NUM,
  zColumnOptions,
} from '@gbs/Store/globalSettings/schema';

import {
  MsAddCircle,
  MsBookmarks,
  MsDarkMode,
  MsLightMode,
  MsSettingsFill,
  MsTranslate,
  MsVolumeMute,
  MsVolumeOff,
  MsVolumeUp,
} from 'solid-material-symbols/rounded/600';
import { gbsWs, ping } from '@gbs/Store/tweets/ws';
import { AdsColumn } from '@gbs/ads';
import { twMerge } from 'tailwind-merge';

const langOps = [
  { value: 'ja', name: '日本語' },
  { value: 'en', name: 'English' },
] as const;

const groupOps: readonly { value: ColumnGroupKey; name: string }[] = [
  { value: '1', name: '1' },
  { value: '2', name: '2' },
  { value: '3', name: '3' },
  { value: '4', name: '4' },
] as const;

const c = /*tw*/ {
  mainButton:
    'flex h-[50px] w-full cursor-pointer flex-row items-center select-none',
  subButton: 'flex h-[50px] flex-1 cursor-pointer flex-row items-center',
  hr: 'border-t border-solid border-gray-300 dark:border-gray-600',
};

const [isOpen, setIsOpen] = createSignal(false);

/**
 * メニューが画面内にあるか
 */
const [isMenuVisible, setIsMenuVisible] = createSignal(true);
export { isMenuVisible };

/**
 * メニューが表示されているかを検知する
 */
const observer = new IntersectionObserver(
  (entries) => {
    const target = entries[0];
    if (!target) return;
    if (target.intersectionRatio > 0.5) {
      setIsMenuVisible(true);
    } else {
      // console.log(target);
      setIsMenuVisible(false);
    }
  },
  {
    root: document.querySelector('#gbs-main'),
    threshold: [0, 0.25, 0.5, 0.75, 1],
  }
);

export function MenuColumn() {
  const canAddColumn = createMemo(() => {
    return (
      globalSettings.columnGroup[globalSettings.currentGroupKey].columns
        .length < MAX_COLUMN_NUM
    );
  });

  const themeOps = createMemo(() => {
    return [
      { value: 'dark', name: text('ダーク') },
      { value: 'light', name: text('ライト') },
    ] as const;
  });

  const [pingFlash, setPingFlash] = createSignal('');

  function onPing() {
    setPingFlash('');
    setTimeout(() => setPingFlash('ping-flash'), 50);
  }
  gbsWs.on('ping', onPing);
  onCleanup(() => {
    gbsWs.off('ping', onPing);
  });
  return (
    <section
      ref={(elm) => {
        requestAnimationFrame(() => {
          observer.observe(elm);
        });
        onCleanup(() => observer.unobserve(elm));
      }}
      class={clsx(
        'flex h-full min-w-[320px] max-w-[320px] shrink-0 flex-col',
        'm-[5px]',
        'bg-white dark:bg-gray-700 dark:text-white'
      )}
    >
      <header
        class={clsx(
          'flex min-h-[36px] flex-row items-center border-b border-solid px-[5px]',
          'border-gray-300 dark:border-gray-600'
        )}
      >
        <h1 class="font-bold">Granblue Search 4</h1>
        <span class={clsx('flex items-center gap-[5px]', 'ml-auto p-[5px]')}>
          <span
            class={clsx(
              pingFlash(),
              'opacity-0',
              'h-[12px] w-[12px] rounded-full',
              'bg-lime-500'
            )}
          />
          <span class="text-[14px]">{ping()}ms</span>
        </span>
      </header>

      <div class="w-[320px] flex-1 overflow-y-scroll">
        <div>
          <p class="bg-white p-[10px] text-center font-bold text-red-600">
            現在広告のテスト中
          </p>
        </div>
        {/* <div class="flex">
          <Checkbox
            value={isColumnMoveMode()}
            onChange={(v) => setIsColumnMoveMode(v)}
            reverse={true}
            class={clsx(c.subButton, 'gap-0')}
          >
            <span class="p-[10px]">
              <RiDesignDragMove2Line size={20} />
            </span>
            <span class="mr-[20px]">{text('カラム移動')}</span>
          </Checkbox>
          <hr />
        </div>

        <hr /> */}

        <button
          class={clsx(
            c.mainButton,
            'disabled:cursor-not-allowed disabled:opacity-50'
          )}
          disabled={!canAddColumn()}
          onClick={() =>
            changeAndSave(
              'columnGroup',
              globalSettings.currentGroupKey,
              produce((s) => {
                if (globalSettings.menuPotision === 'right') {
                  s.columns.push(zColumnOptions.parse({}));
                } else {
                  s.columns.unshift(zColumnOptions.parse({}));
                }
              })
            )
          }
        >
          <span class="p-[10px]">
            {/* <RiSystemAddCircleLine size={20} /> */}
            <MsAddCircle size={24} />
          </span>
          <span>{text('カラムを追加')}</span>
        </button>

        <hr class={c.hr} />

        <details
          class="group"
          onToggle={(e) => setIsOpen(e.currentTarget.open)}
          open={isOpen()}
        >
          <summary class={c.mainButton}>
            <span class="p-[10px]">
              {/* <RiSystemSettings4Fill size={20} /> */}
              <MsSettingsFill size={24} />
            </span>
            <span>{text('設定')}</span>
          </summary>
          <div
            class={clsx(
              'px-[5px] py-[10px] shadow-inner',
              'bg-gray-50 dark:bg-[rgba(0,0,0,0.4)] dark:text-white'
            )}
          >
            <Settings />
          </div>
        </details>

        <hr class={c.hr} />

        <div class="flex h-[50px] flex-row items-center">
          <span class="p-[10px]" title={text('マイセット')}>
            {/* <RiDocumentBookMarkLine size={20} /> */}
            <MsBookmarks size={24} />
          </span>
          <div class="text-sm">
            <Radio
              value={globalSettings.currentGroupKey}
              options={groupOps}
              name="s-currentGroupKey"
              onChange={(value) =>
                changeAndSave(produce((s) => (s.currentGroupKey = value)))
              }
            />
          </div>
        </div>

        <hr class={c.hr} />

        <div class="flex h-[50px] items-center">
          <button
            class="p-[10px]"
            title={text('ミュート切り替え')}
            onClick={() => changeAndSave(produce((s) => (s.mute = !s.mute)))}
          >
            <Show
              when={globalSettings.mute}
              fallback={
                <Show
                  when={globalSettings.volume <= 0 && !globalSettings.mute}
                  fallback={<MsVolumeUp size={24} />}
                >
                  <MsVolumeMute size={24} class="translate-x-[-4px]" />
                </Show>
              }
            >
              <MsVolumeOff size={24} />
            </Show>
          </button>
          <input
            type="range"
            class="w-[175px]"
            title={text('音量')}
            min={0}
            max={1}
            step={0.01}
            value={globalSettings.volume}
            disabled={globalSettings.mute}
            onInput={(e) => {
              const v = Number.parseFloat(e.currentTarget.value);
              if (v <= 1 && v >= 0) {
                changeAndSave(produce((s) => (s.volume = v)));
              }
            }}
          />
        </div>

        <hr class={c.hr} />

        {/* <div class="flex h-[50px] flex-row items-center">
          <button
            class="p-[10px]"
            title={text('テーマ')}
            onClick={() =>
              changeAndSave(produce((s) => (s.darkMode = !s.darkMode)))
            }
          >
            <Show
              when={globalSettings.darkMode}
              fallback={<MsLightMode size={24} />}
            >
              <MsDarkMode size={24} />
            </Show>
          </button>
          <div class="text-sm">
            <Radio
              value={globalSettings.darkMode ? 'dark' : 'light'}
              options={themeOps()}
              name="s-theme"
              onChange={(value) =>
                changeAndSave(produce((s) => (s.darkMode = value === 'dark')))
              }
            />
          </div>
        </div> */}

        {/* <hr class={c.hr} /> */}

        <div class="flex h-[50px] flex-row items-center">
          <button
            class="py-[10px] px-[10px]"
            title={text('テーマ')}
            onClick={() =>
              changeAndSave(produce((s) => (s.darkMode = !s.darkMode)))
            }
          >
            <Show
              when={globalSettings.darkMode}
              fallback={<MsLightMode size={24} />}
            >
              <MsDarkMode size={24} />
            </Show>
          </button>

          <hr class={twMerge(clsx(c.hr, 'h-full border-0 border-r'))} />

          <span class="p-[10px]" title={text('言語')}>
            {/* <RiEditorTranslate2 size={20} /> */}
            <MsTranslate size={24} />
          </span>
          <div class="text-sm">
            <Radio
              value={globalSettings.language}
              options={langOps}
              name="s-language"
              onChange={(value) =>
                changeAndSave(produce((s) => (s.language = value)))
              }
            />
          </div>
        </div>

        <hr class={c.hr} />

        <div class="mt-[50px]" />
        <AdsColumn />
      </div>
    </section>
  );
}
