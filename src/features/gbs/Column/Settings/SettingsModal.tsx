import { Select } from '@gbs/MenuColumn/Select';
import {
  globalSettings,
  saveSettingsToStorage,
} from '@gbs/Store/globalSettings';
import clsx from 'clsx';
import { RiSystemDeleteBin2Line } from 'solid-icons/ri';
import { onCleanup, Show, createEffect, createMemo } from 'solid-js';
import { createStore, produce } from 'solid-js/store';
import { Portal } from 'solid-js/web';
import {
  MsBadge,
  MsFilterList,
  MsMusicNote,
  MsSwapVert,
} from 'solid-material-symbols/rounded/600';
import { text } from '../../Text';
import { useColumn } from '../columnContext';
import { FiltersView } from './FiltersView';
import { InputGbsList } from './InputGbsList';

type Props = {
  open: boolean;
  onClose: () => void;
};

const c = /*tw*/ {
  title: 'font-bold flex items-center mb-[5px]',
  wrap: '',
  hr: 'w-full my-[10px] border-t border-solid border-gray-300 dark:border-gray-500',
} as const;

export function SettingsModal(props: Props) {
  const { options: col, setOptions: setCol, dispatch } = useColumn();

  const [localFilters, setLocalFilters] = createStore([...col.filters]);

  const soundOps = createMemo(() => {
    const en = globalSettings.language === 'en';
    return [
      { value: '0', name: en ? 'Onepoint 22' : 'ワンポイント22' },
      { value: '1', name: en ? 'Onepoint 26' : 'ワンポイント26' },
      { value: '2', name: en ? 'System 35' : 'システム35' },
      { value: '3', name: en ? 'System 46' : 'システム46' },
    ] as const;
  });

  const delCol = () => dispatch({ type: 'Delete' });

  createEffect(() => {
    setLocalFilters([...col.filters]);
  });

  function saveAndClose() {
    setCol(
      produce((s) => {
        s.filters = [...localFilters];
      })
    );
    saveSettingsToStorage();
    props.onClose();
  }

  function onDelete() {
    const res = window.confirm(text('カラムを削除しますか？'));
    if (!res) return;
    delCol();
    props.onClose();
  }

  function onCancel() {
    setLocalFilters([...col.filters]);
    props.onClose();
  }

  return (
    <Show when={props.open}>
      <Portal>
        <div class="fixed top-0 left-0 z-50 flex h-full w-full items-stretch overflow-auto bg-[rgba(0,0,0,0.7)] p-[10px]">
          <section
            ref={(elm) => {
              closeModal(elm, saveAndClose);
              focusTrap(elm);
            }}
            class={clsx(
              'm-auto flex h-full min-h-[400px] w-full min-w-[300px] max-w-[800px] flex-col',
              'bg-white dark:bg-gray-700 dark:text-white'
            )}
            tabindex="-1"
            role="dialog"
            aria-modal="true"
          >
            <header
              class={clsx(
                'z-10 flex flex-shrink-0 flex-grow-0 flex-row items-center',
                'py-[5px] px-[10px] shadow-[0_0_5px_rgba(0,0,0,0.5)]',
                'dark:shadow-[0_0_5px_rgba(0,0,0,1)]'
              )}
            >
              <p class="mr-auto font-bold uppercase">{text('カラム設定')}</p>
              <button
                onClick={() => onDelete()}
                class="flex items-center text-red-600 dark:text-red-400"
              >
                <RiSystemDeleteBin2Line size={20} class="mr-[3px]" />
                <span class="text-[14px]">{text('カラムを削除')}</span>
              </button>
            </header>

            <div class="flex-1 overflow-auto p-[5px]">
              <div class="my-[5px] flex max-w-[500px] flex-wrap gap-[5px]">
                <div class="min-w-[120px] flex-1">
                  <p class="mb-[2px] flex items-center text-[14px] font-bold">
                    <MsBadge size={20} class="mr-[5px] -translate-y-[2px]" />
                    {text('表示名')}
                  </p>
                  <input
                    type="text"
                    class={clsx(
                      'h-[32px] w-full rounded-[4px] border border-solid px-[5px] leading-none',
                      'border-gray-300 bg-white dark:border-gray-900 dark:bg-gray-600',
                      'text-[14px] text-gray-900 dark:text-white'
                    )}
                    value={col.name}
                    placeholder={text('自動')}
                    onInput={(e) =>
                      setCol(produce((s) => (s.name = e.currentTarget.value)))
                    }
                  />
                </div>

                <div class="min-w-[120px] flex-1">
                  <p class="mb-[2px] flex items-center text-[14px] font-bold">
                    <MsMusicNote
                      size={20}
                      class="mr-[5px] -translate-y-[1px]"
                    />
                    {text('通知音')}
                    <a
                      class={clsx('ml-auto font-normal text-sky-500')}
                      href="https://maou.audio/category/se/"
                      target="_blank"
                    >
                      &copy; 魔王魂
                    </a>
                  </p>
                  <Select
                    options={soundOps()}
                    value={col.sound.type}
                    class="h-[32px] w-full text-[14px]"
                    onChange={(v) =>
                      setCol(
                        'sound',
                        produce((s) => (s.type = v))
                      )
                    }
                  />
                </div>
              </div>

              <hr class={c.hr} />

              <div class={c.wrap}>
                <p class={c.title}>
                  <MsFilterList size={24} class="mr-[5px]" />
                  {text('フィルタ')}
                </p>
                <FiltersView
                  filters={localFilters}
                  setFilters={setLocalFilters}
                />
              </div>

              <hr class={c.hr} />

              <div class={c.wrap}>
                <p class={c.title}>
                  {/* <MsPlaylistAdd size={24} class="mr-[5px] translate-x-[2px]" /> */}
                  <MsSwapVert size={24} class="mr-[5px] translate-x-[2px]" />
                  {text('リストから追加')}
                </p>
                <InputGbsList
                  localFilters={localFilters}
                  setLocalFilters={setLocalFilters}
                />
              </div>
            </div>

            <footer
              class={clsx(
                'z-10 flex flex-shrink-0 flex-grow-0 flex-row',
                'py-[5px] px-[10px] shadow-[0_0_5px_rgba(0,0,0,0.5)]',
                'dark:shadow-[0_0_5px_rgba(0,0,0,1)]'
              )}
            >
              <button
                class={clsx(
                  'flex items-center justify-center',
                  'h-[40px] px-[10px]',
                  'hover:underline'
                )}
                onClick={() => onCancel()}
              >
                {text('キャンセル')}
              </button>
              <button
                class={clsx(
                  'flex items-center justify-center rounded-full',
                  'ml-auto h-[40px] min-w-[150px]',
                  'bg-sky-500 text-white'
                )}
                onClick={() => saveAndClose()}
              >
                {text('OK')}
              </button>
            </footer>
          </section>
        </div>
      </Portal>
    </Show>
  );
}

export function closeModal(elm: HTMLElement, accessor: () => void) {
  const onClick = (event: MouseEvent) => {
    if (event.target instanceof Node && !elm.contains(event.target)) {
      accessor?.();
    }
  };
  const onKeydown = (event: KeyboardEvent) => {
    if (event.key.toLowerCase() === 'escape') {
      accessor?.();
    }
  };

  document.body.addEventListener('click', onClick);
  document.addEventListener('keydown', onKeydown);

  onCleanup(() => {
    document.body.removeEventListener('click', onClick);
    document.removeEventListener('keydown', onKeydown);
  });
}

export function focusTrap(elm: HTMLElement) {
  const focusedElm = document.activeElement as HTMLElement | null;
  const query = `button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])`;

  setTimeout(() => (elm.querySelector(query) as HTMLElement | null)?.focus());

  const onKeydown = (event: KeyboardEvent) => {
    if (event.key.toLocaleLowerCase() == 'tab') {
      event.preventDefault();

      const focusableElms = Array.from(
        elm.querySelectorAll(query)
      ) as HTMLElement[];

      const focusedElm = document.activeElement as HTMLElement | null;

      if (focusedElm) {
        const diff = event.shiftKey ? -1 : 1;
        const index = focusableElms.indexOf(focusedElm);
        const targetElm =
          focusableElms[
            (index + diff + focusableElms.length) % focusableElms.length
          ];
        targetElm?.focus();
      } else {
        focusableElms[0]?.focus();
      }
    }
  };

  document.addEventListener('keydown', onKeydown);

  onCleanup(() => {
    focusedElm?.focus();
    document.removeEventListener('keydown', onKeydown);
  });
}
