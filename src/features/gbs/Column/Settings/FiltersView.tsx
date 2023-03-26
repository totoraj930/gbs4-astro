import { Select } from '@gbs/MenuColumn/Select';
import type { FilterItem } from '@gbs/Store/globalSettings/schema';
import { text } from '@gbs/Text';
import { uid } from '@gbs/utils';
import clsx from 'clsx';
import { Show, Index, createMemo } from 'solid-js';
import { produce, SetStoreFunction } from 'solid-js/store';
import { MsFileCopy, MsSms, MsTimer } from 'solid-material-symbols/rounded/600';
import { useColumn } from '../columnContext';
import { FilterItemView } from './FilterItemView';

const c = /*tw*/ {
  border: clsx(
    'border-b border-solid p-[5px] last:border-b-0',
    'border-gray-200 dark:border-gray-600'
  ),
  inputWrap: 'min-w-[160px] flex-1 py-[5px] flex-shrink-0',
  label: clsx(
    'ml-[2px] mb-[2px] gap-[2px] flex items-center',
    'text-[14px] font-bold'
  ),
};

type Props = {
  filters: FilterItem[];
  setFilters: SetStoreFunction<FilterItem[]>;
};
export function FiltersView(props: Props) {
  const { options: col, setOptions: setCol } = useColumn();
  const formName = uid();
  const ops = createMemo(() => {
    return {
      duplicate: [
        { value: 'all', name: text('全て') },
        { value: 'latest', name: text('最新のものだけ') },
        { value: '1m', name: text('{n}分以上前からあるものだけ', { n: 1 }) },
        { value: '2m', name: text('{n}分以上前からあるものだけ', { n: 2 }) },
        { value: '3m', name: text('{n}分以上前からあるものだけ', { n: 3 }) },
        { value: '5m', name: text('{n}分以上前からあるものだけ', { n: 5 }) },
        { value: '10m', name: text('{n}分以上前からあるものだけ', { n: 10 }) },
      ] as const,
      elapsed: [
        { value: 'all', name: text('全て') },
        { value: '2s', name: text('{n}秒以内', { n: 2 }) },
        { value: '3s', name: text('{n}秒以内', { n: 3 }) },
        { value: '4s', name: text('{n}秒以内', { n: 4 }) },
        { value: '5s', name: text('{n}秒以内', { n: 5 }) },
      ] as const,
    };
  });
  return (
    <ul class="flex max-w-[500px] flex-col">
      <Show when={props.filters.length === 0}>
        <li
          class={clsx(
            'flex h-[51px] items-center pl-[20px] font-bold',
            'bg-gray-100 text-gray-500 dark:bg-gray-900 dark:text-gray-500'
          )}
        >
          {text('設定なし')}
        </li>
      </Show>

      <Index each={props.filters}>
        {(filter, index) => {
          const onDelete = () => {
            props.setFilters(produce((s) => s.splice(index, 1)));
          };
          return (
            <li class={c.border}>
              <FilterItemView data={filter()} onDelete={onDelete} />
            </li>
          );
        }}
      </Index>

      <li class={clsx(c.border)}>
        <ul class="flex flex-wrap gap-x-[5px]">
          <li class={c.inputWrap}>
            <label class={c.label} for={'duplicate' + formName}>
              <MsFileCopy size={16} />
              {text('重複制限')}
            </label>
            <Select
              name={'duplicate' + formName}
              class="h-[32px] w-full text-[14px]"
              options={ops().duplicate}
              value={col.duplicate}
              onChange={(v) => setCol(produce((s) => (s.duplicate = v)))}
            />
          </li>

          <li class={c.inputWrap}>
            <label class={c.label} for={'elapsed' + formName}>
              <MsTimer size={16} />
              {text('経過時間')}
            </label>
            <Select
              name={'elapsed' + formName}
              class="h-[32px] w-full text-[14px]"
              options={ops().elapsed}
              value={col.elapsed}
              onChange={(v) => setCol(produce((s) => (s.elapsed = v)))}
            />
          </li>

          <li class={c.inputWrap}>
            <label class={c.label} for={'comment' + formName}>
              <MsSms size={16} />
              {text('コメント')}
            </label>
            <input
              name={'comment' + formName}
              id={'comment' + formName}
              type="text"
              class={clsx(
                'h-[32px] rounded-[4px] border border-solid px-[5px] leading-none',
                'border-gray-300 bg-white dark:border-gray-900 dark:bg-gray-600',
                'text-gray-900 dark:text-white',
                'w-full text-[14px]'
              )}
              placeholder={text('例') + ': 新品'}
              value={col.comment}
              onInput={(e) =>
                setCol(produce((s) => (s.comment = e.currentTarget.value)))
              }
            />
          </li>
        </ul>
      </li>
    </ul>
  );
}
