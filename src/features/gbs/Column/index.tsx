// import { RiSystemFilter3Fill } from 'solid-icons/ri';
import { Header } from './Header';
import {
  globalSettings,
  saveSettingsToStorage,
  setGlobalSettings,
} from '@gbs/Store/globalSettings';
import { FilteredTweets } from './FilteredTweets';
import type { ColumnGroupKey } from '@gbs/Store/globalSettings/schema';
import { For, Show } from 'solid-js';
import { produce } from 'solid-js/store';
import { ColumnProvider, Dispatch, useColumn } from './columnContext';
import {
  MsKeyboardArrowLeft,
  MsKeyboardArrowRight,
} from 'solid-material-symbols/rounded/600';
import clsx from 'clsx';

export function ColumnGroup(props: { groupKey: ColumnGroupKey }) {
  const columns = () => globalSettings.columnGroup[props.groupKey].columns;

  function deleteColumn(index: number) {
    setGlobalSettings(
      'columnGroup',
      props.groupKey,
      'columns',
      produce((s) => s.splice(index, 1))
    );
  }

  return (
    <For each={columns()}>
      {(columnOptions, index) => {
        const dispatch: Dispatch = (action) => {
          switch (action.type) {
            case 'Delete': {
              deleteColumn(index());
              break;
            }
            case 'Move': {
              if ('num' in action) {
                setGlobalSettings(
                  'columnGroup',
                  props.groupKey,
                  produce((s) => {
                    const targetItem = s.columns[index()];
                    const currentIndex = index();
                    const resArr = s.columns.map((target, i) =>
                      i === currentIndex ? null : target
                    );
                    resArr.splice(action.num, 0, targetItem);
                    s.columns = resArr.flatMap((target) =>
                      target !== null ? [target] : []
                    );
                  })
                );
              } else {
                setGlobalSettings(
                  'columnGroup',
                  props.groupKey,
                  produce((s) => {
                    const targetIndex = index() + action.diff;
                    const target = s.columns[targetIndex];
                    if (!target) return;
                    s.columns[index()] = target;
                    s.columns[targetIndex] = columnOptions;
                  })
                );
              }
              break;
            }
          }
          saveSettingsToStorage();
        };
        return (
          <ColumnProvider initialOptions={columnOptions} dispatch={dispatch}>
            <Column />
          </ColumnProvider>
        );
      }}
    </For>
  );
}

export function Column() {
  const { dispatch } = useColumn();

  return (
    <section
      class={clsx(
        'relative flex h-full w-[var(--column-size)] shrink-0 flex-col leading-none',
        'bg-white text-gray-700 dark:bg-gray-700 dark:text-white'
      )}
      classList={{
        'h-[calc(50%-3px)]': globalSettings.columnType === '2lines',
      }}
    >
      <Header />

      <Show when={globalSettings.showMoveButton}>
        <div
          class={clsx(
            'z-50 flex h-[36px] w-full items-stretch justify-center border-b border-solid',
            'border-gray-300 dark:border-gray-600'
          )}
        >
          <button
            class="flex-1"
            onClick={() => dispatch({ type: 'Move', diff: -1 })}
          >
            {/* <RiSystemArrowLeftSLine size={30} class="m-auto" /> */}
            <MsKeyboardArrowLeft size={30} class="m-auto" />
          </button>
          <hr class="h-full w-0 border-l border-solid border-gray-200 dark:border-gray-600" />
          <button
            class="flex-1"
            onClick={() => dispatch({ type: 'Move', diff: 1 })}
          >
            {/* <RiSystemArrowRightSLine size={30} class="m-auto" /> */}
            <MsKeyboardArrowRight size={30} class="m-auto" />
          </button>
        </div>
      </Show>

      <FilteredTweets />
    </section>
  );
}
