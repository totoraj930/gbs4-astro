import { saveSettingsToStorage } from '@gbs/Store/globalSettings';
import clsx from 'clsx';
import { RiSystemDeleteBin2Line } from 'solid-icons/ri';
import {
  onCleanup,
  Show,
  createSignal,
  createEffect,
  Index,
  For,
} from 'solid-js';
import { createStore, produce } from 'solid-js/store';
import { Portal } from 'solid-js/web';
import {
  MsFilter,
  MsFilterList,
  MsPlaylistAdd,
  MsSwapVert,
  MsSyncAlt,
} from 'solid-material-symbols/rounded/600';
import { text } from '../../Text';
import { useColumn } from '../columnContext';
import { FilterItemView } from './FilterItemView';
import { InputGbsList } from './InputGbsList';

type Props = {
  open: boolean;
  onClose: () => void;
};

const c = /*tw*/ {
  title: 'font-bold flex items-center mb-[5px]',
  wrap: '',
  hr: 'w-full my-[10px] border-t border-solid border-gray-300',
} as const;

export function SettingsModal(props: Props) {
  const { options: col, setOptions: setCol, dispatch } = useColumn();

  const [localFilters, setLocalFilters] = createStore([...col.filters]);

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

  function addFilter(num: number) {
    setLocalFilters((s) => {
      if (s.find(({ id }) => id === num)) return s;
      return [...s, { id: num }];
    });
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
            class="m-auto flex h-full min-h-[400px] w-full min-w-[300px] max-w-[800px] flex-col bg-white"
            tabindex="-1"
            role="dialog"
            aria-modal="true"
          >
            <header class="z-10 flex flex-shrink-0 flex-grow-0 flex-row items-center py-[5px] px-[10px] shadow-[0_0_5px_rgba(0,0,0,0.5)]">
              <p class="mr-auto font-bold uppercase">{text('カラム設定')}</p>
              <button
                onClick={() => onDelete()}
                class="flex items-center text-red-600"
              >
                <RiSystemDeleteBin2Line size={20} class="mr-[3px]" />
                <span class="text-[14px]">{text('カラムを削除')}</span>
              </button>
            </header>

            <div class="flex-1 overflow-auto p-[5px]">
              <div class={c.wrap}>
                <p class={c.title}>
                  <MsFilterList size={24} class="mr-[5px]" />
                  {text('フィルタ')}
                </p>
                {/* <div>
                  <For each={[117, 126, 127, 54]}>
                    {(num) => {
                      return (
                        <button onClick={() => addFilter(num)}>{num}</button>
                      );
                    }}
                  </For>
                </div> */}
                <ul class="flex max-w-[500px] flex-col">
                  <Show when={localFilters.length === 0}>
                    <li class="flex h-[50px] items-center bg-gray-100 pl-[20px] font-bold text-gray-500">
                      {text('設定なし')}
                    </li>
                  </Show>
                  <Index each={localFilters}>
                    {(filter, index) => (
                      <li class="border-b border-solid border-gray-200 p-[5px] last:border-b-0">
                        <FilterItemView
                          data={filter()}
                          onDelete={() => {
                            setLocalFilters((prev) => {
                              const filters = [...prev];
                              filters.splice(index, 1);
                              return filters;
                            });
                          }}
                        />
                      </li>
                    )}
                  </Index>
                </ul>
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
                'flex flex-shrink-0 flex-grow-0 flex-row',
                'py-[5px] px-[10px] shadow-[0_0_5px_rgba(0,0,0,0.5)]'
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
