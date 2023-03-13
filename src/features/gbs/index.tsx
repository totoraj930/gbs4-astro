import { createEffect, onMount, Show } from 'solid-js';
import { clsx } from 'clsx';
import { globalSettings } from '@gbs/Store/globalSettings';
import { loadGbsList } from '@gbs/Store/gbsList';
import { connectReciver } from './Store/tweets/reciver';
import { MenuColumn } from './MenuColumn';
import { ColumnGroup } from './Column';

export function Gbs() {
  onMount(() => {
    loadGbsList();
    connectReciver();
  });

  createEffect(() => {
    if (globalSettings.darkMode) {
      document.body.classList.add('dark');
    } else {
      document.body.classList.remove('dark');
    }
  });

  return (
    <div
      class={clsx(
        'flex h-full w-full content-start justify-start gap-[5px] overflow-auto p-[5px]',
        'smh:p-0',
        'dark:text-red bg-gray-100 text-gray-800 dark:bg-gray-900',
        {
          'flex-row': globalSettings.columnType === '1line',
          'flex-nowrap': globalSettings.columnType === '1line',
          'flex-col': globalSettings.columnType == '2lines',
          'flex-wrap': globalSettings.columnType == '2lines',
          'min-h-[340px]': globalSettings.columnType == '2lines',
          '[--column-size:270px]': globalSettings.columnSize == 's',
          '[--column-size:320px]': globalSettings.columnSize == 'm',
          '[--column-size:380px]': globalSettings.columnSize == 'l',
        }
      )}
    >
      <Show when={globalSettings.menuPotision === 'left'}>
        <MenuColumn />
      </Show>

      <ColumnGroup groupKey={globalSettings.currentGroupKey} />

      <Show when={globalSettings.menuPotision === 'right'}>
        <MenuColumn />
      </Show>
    </div>
  );
}
