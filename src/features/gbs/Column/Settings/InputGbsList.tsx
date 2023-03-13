import { Radio } from '@gbs/MenuColumn/Radio';
import { Select } from '@gbs/MenuColumn/Select';
import {
  filteredGbsList,
  gbsList,
  searchTag,
  searchText,
  setSearchTag,
  setSearchText,
} from '@gbs/Store/gbsList';
import type { FilterItem } from '@gbs/Store/globalSettings/schema';
import { tagText, text } from '@gbs/Text';
import { uid } from '@gbs/utils';
import clsx from 'clsx';
import {
  For,
  createSignal,
  createMemo,
  startTransition,
  createEffect,
  on,
  Show,
} from 'solid-js';
import { produce, SetStoreFunction } from 'solid-js/store';
import {
  MsBackspace,
  MsDoNotDisturbOff,
  MsDoNotDisturbOn,
  MsRemove,
  MsSearch,
} from 'solid-material-symbols/rounded/600';
import { useColumn } from '../columnContext';
import { FilterItemView, InListEnemy } from './FilterItemView';

type Props = {
  /* */
  localFilters: FilterItem[];
  setLocalFilters: SetStoreFunction<FilterItem[]>;
};
export function InputGbsList(props: Props) {
  const formName = createMemo(() => uid());

  const tagOps = createMemo(() => {
    return [
      { value: 'All', name: text('全て') },
      { value: 'ヒヒイロカネ', name: tagText('ヒヒイロカネ') + '⭐' },
      { value: '刻の流砂', name: tagText('刻の流砂') + '⌛' },
      { value: '六竜', name: tagText('六竜') },
      { value: 'エニアド', name: tagText('エニアド') },
      { value: 'マグナⅡ', name: tagText('マグナⅡ') },
      { value: 'マグナ', name: tagText('マグナ') },
      { value: 'マリス', name: tagText('マリス') },
      { value: '新石', name: tagText('新石') },
      { value: '四大天司', name: tagText('四大天司') },
      { value: 'イベント', name: tagText('イベント') },
      { value: '四象降臨', name: tagText('四象降臨') },
      { value: '古戦場', name: tagText('古戦場') },
      { value: 'ゼノ', name: tagText('ゼノ') },
      { value: 'レヴァンス', name: tagText('レヴァンス') },
      { value: 'その他', name: tagText('その他') },
      { value: '高難易度', name: tagText('高難易度') },
    ];
  });

  function addFilter(id: number) {
    props.setLocalFilters(
      produce((s) => {
        s.push({ id });
      })
    );
  }

  function removeFilter(id: number) {
    props.setLocalFilters((s) => {
      return s.filter((target) => target.id !== id);
    });
  }

  return (
    <div>
      {/* <Radio
        class="min-w-[115px] text-sm"
        options={tagOps()}
        value={tag()}
        onChange={(v) => setTag(v)}
      /> */}
      <div class="flex gap-[5px] leading-none">
        <Select
          class="h-[36px] py-[2px] align-middle"
          options={tagOps()}
          value={searchTag()}
          onChange={(v) => setSearchTag(v)}
        />
        <div class="relative max-w-[240px] flex-1">
          <label
            for={formName()}
            class="absolute left-[5px] top-0 flex h-full w-[20px] cursor-text items-center"
          >
            <MsSearch size={20} />
          </label>
          <input
            id={formName()}
            type="text"
            class="h-[36px] w-full rounded-[4px] border border-solid border-gray-300 pl-[25px]"
            placeholder={text('検索')}
            value={searchText()}
            onInput={(e) => setSearchText(e.currentTarget.value)}
          />
        </div>
      </div>

      <div class="mt-[10px] flex max-w-[500px] flex-col">
        <For each={filteredGbsList()}>
          {(item, index) => {
            const selected = createMemo(
              () =>
                props.localFilters.find((f) => f.id === item.id) !== undefined
            );
            return (
              <div class="relative border-b border-solid border-gray-200 last:border-b-0">
                <button
                  disabled={selected()}
                  class={clsx(
                    'flex w-full items-center p-[5px]',
                    'disabled:opacity-50',
                    {
                      'hover:bg-gray-100': !selected(),
                    }
                  )}
                  onClick={() => {
                    !selected() && addFilter(item.id);
                  }}
                >
                  <InListEnemy data={item.id} />
                  <Show when={item.tags.includes('HL')}>
                    <span
                      class={clsx(
                        'border-2 border-solid border-red-600 bg-gray-800 text-white',
                        'grid h-[28px] w-[28px] place-content-center rounded-full text-[12px] font-bold'
                      )}
                    >
                      <span class="drop-shadow-[0_0_5px_#f00]">HL</span>
                    </span>
                  </Show>
                </button>

                <Show when={selected()}>
                  <button
                    class="absolute top-1/2 left-[3px] -mt-[15px] rounded-full bg-white text-red-600"
                    onClick={() => removeFilter(item.id)}
                  >
                    <MsDoNotDisturbOn size={30} />
                  </button>
                </Show>
              </div>
            );
          }}
        </For>
      </div>
    </div>
  );
}
