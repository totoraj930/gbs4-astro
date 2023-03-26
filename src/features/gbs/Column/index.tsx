// import { RiSystemFilter3Fill } from 'solid-icons/ri';
import { Header } from './Header';
import {
  globalSettings,
  isCompact,
  saveSettingsToStorage,
  setGlobalSettings,
} from '@gbs/Store/globalSettings';
import { FilteredTweets } from './FilteredTweets';
import type {
  ColumnGroupKey,
  ColumnOptions,
} from '@gbs/Store/globalSettings/schema';
import { createMemo, For, Show } from 'solid-js';
import { produce } from 'solid-js/store';
import { ColumnProvider, Dispatch, useColumn } from './columnContext';
import {
  MsKeyboardArrowLeft,
  MsKeyboardArrowRight,
} from 'solid-material-symbols/rounded/600';
import clsx from 'clsx';
import { twMerge } from 'tailwind-merge';

export function ColumnGroup(props: { groupKey: ColumnGroupKey }) {
  const columns = () => globalSettings.columnGroup[props.groupKey].columns;

  const width = createMemo(() => {
    if (is1line()) {
      return colSize() * columns().length;
    } else {
      return colSize() * Math.round(columns().length / 2);
    }
  });

  function deleteColumn(index: number) {
    setGlobalSettings(
      'columnGroup',
      props.groupKey,
      'columns',
      produce((s) => s.splice(index, 1))
    );
  }

  return (
    <div
      style={{ width: width() + 'px', 'min-width': width() + 'px' }}
      class={clsx('relative')}
    >
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
            <ColumnProvider
              initialOptions={columnOptions}
              dispatch={dispatch}
              index={index}
            >
              <Column />
            </ColumnProvider>
          );
        }}
      </For>
    </div>
  );
}

export function colSize() {
  switch (globalSettings.columnSize) {
    case 'l': {
      return 380;
    }
    case 'm': {
      return 320;
    }
    case 's': {
      return 280;
    }
    default: {
      return 320;
    }
  }
}

export function is1line() {
  return globalSettings.columnType === '1line';
}

export function Column() {
  const { dispatch, index } = useColumn();
  const pos = createMemo(() => {
    const w = colSize();
    const xNum = is1line() ? index() : Math.floor(index() / 2);
    const yNum = is1line() ? 0 : index() % 2;
    const left = w * xNum + 'px';
    const top = 50 * yNum + '%';
    return {
      width: w + 'px',
      height: is1line() ? '100%' : '50%',
      left,
      top,
    };
  });
  return (
    <div
      style={{
        width: pos().width,
        height: pos().height,
        left: pos().left,
        top: pos().top,
      }}
      class={twMerge(clsx('absolute p-[2px]'))}
    >
      <div
        class={clsx(
          'flex h-full w-full flex-col',
          'bg-white text-gray-700 dark:bg-gray-700 dark:text-white'
        )}
      >
        <Header />

        <Show when={globalSettings.showMoveButton && !isCompact()}>
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
      </div>
    </div>
  );
}
