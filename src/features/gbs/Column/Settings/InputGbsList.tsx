import { Select } from '@gbs/MenuColumn/Select';
import {
  filteredGbsList,
  searchTag,
  searchText,
  setSearchTag,
  setSearchText,
} from '@gbs/Store/gbsList';
import { globalSettings } from '@gbs/Store/globalSettings';
import type { FilterItem } from '@gbs/Store/globalSettings/schema';
import { tagText, text } from '@gbs/Text';
import { uid } from '@gbs/utils';
import clsx from 'clsx';
import { For, createMemo, Show, createSignal } from 'solid-js';
import { produce, SetStoreFunction } from 'solid-js/store';
import {
  MsAdd,
  MsDoNotDisturbOn,
  MsSearch,
} from 'solid-material-symbols/rounded/600';
import { InListEnemy } from './FilterItemView';

type Props = {
  /* */
  localFilters: FilterItem[];
  setLocalFilters: SetStoreFunction<FilterItem[]>;
};
export function InputGbsList(props: Props) {
  const formName = createMemo(() => uid());

  const [manualName, setManualName] = createSignal('');
  const [manualLevel, setManualLevel] = createSignal('');

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
      { value: 'Manual', name: text('手動入力') + '📝' },
    ];
  });

  function addFilter(id: number) {
    if (id === -1) {
      props.setLocalFilters(
        produce((s) => {
          s.push({
            id,
            regex: manualName(),
            level: manualLevel(),
          });
        })
      );
    } else {
      props.setLocalFilters(
        produce((s) => {
          s.push({ id });
        })
      );
    }
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
      <div class="flex max-w-[500px] gap-[5px] leading-none">
        <Select
          class="h-[36px] py-[2px] align-middle"
          options={tagOps()}
          value={searchTag()}
          onChange={(v) => setSearchTag(v)}
        />
        <div class="relative flex-1">
          <label
            for={formName()}
            class="absolute left-[5px] top-0 flex h-full w-[20px] cursor-text items-center"
          >
            <MsSearch size={20} />
          </label>
          <input
            name={formName()}
            id={formName()}
            type="text"
            class={clsx(
              'h-[36px] w-full rounded-[4px] border border-solid pr-[5px] pl-[25px]',
              'border-gray-300 dark:border-gray-900 dark:bg-gray-600'
            )}
            placeholder={text('検索')}
            value={searchText()}
            onInput={(e) => setSearchText(e.currentTarget.value)}
          />
        </div>
      </div>

      <div class="mt-[10px] flex max-w-[500px] flex-col">
        <Show when={searchTag() === 'Manual'}>
          <div class="text-[14px] font-bold leading-[1.5] text-red-600 dark:text-red-400">
            <Show when={globalSettings.language === 'ja'}>
              <p class="leading-[1.5]">
                リストに存在しない敵を対象に検索します。
              </p>
              <p class="leading-[1.5]">
                空欄で追加するとリスト外の敵が全て表示されます。
              </p>
            </Show>
            <Show when={globalSettings.language === 'en'}>
              <p>Enemies not present in the list will be searched for.</p>
              <p>
                Adding in a blank field will show all enemies that is not on the
                list.
              </p>
            </Show>
          </div>
          <div class="py-[5px]">
            <label
              class="mb-[2px] block text-[14px] font-bold"
              for={formName() + 'manual_name'}
            >
              {text('名前')}
            </label>
            <input
              name={formName() + 'manual_name'}
              id={formName() + 'manual_name'}
              type="text"
              class={clsx(
                'h-[36px] w-full rounded-[4px] border border-solid px-[10px]',
                'border-gray-300 dark:border-gray-900 dark:bg-gray-600'
              )}
              placeholder={text('例') + ': ジョヤ'}
              value={manualName()}
              onInput={(e) => setManualName(e.currentTarget.value)}
            />
          </div>
          <div class="py-[5px]">
            <label
              class="mb-[2px] block text-[14px] font-bold"
              for={formName() + 'manual_level'}
            >
              {text('レベル')}
            </label>
            <input
              name={formName() + 'manual_level'}
              id={formName() + 'manual_level'}
              type="text"
              class={clsx(
                'h-[36px] w-full rounded-[4px] border border-solid px-[10px]',
                'border-gray-300 dark:border-gray-900 dark:bg-gray-600'
              )}
              placeholder={text('例') + ': 100'}
              value={manualLevel()}
              onInput={(e) => setManualLevel(e.currentTarget.value)}
            />
          </div>
          <button
            class={clsx(
              'mt-[5px] flex items-center self-start py-[4px] pl-[4px] pr-[10px]',
              'rounded-full border border-solid'
            )}
            onClick={() => {
              addFilter(-1);
              setManualName('');
              setManualLevel('');
            }}
          >
            <MsAdd size={24} class="mr-[3px]" />
            {text('追加')}
          </button>
        </Show>

        <For each={filteredGbsList()}>
          {(item) => {
            const selected = createMemo(
              () =>
                props.localFilters.find((f) => f.id === item.id) !== undefined
            );
            return (
              <div
                class={clsx(
                  'relative border-b border-solid last:border-b-0',
                  'border-gray-200 dark:border-gray-600'
                )}
              >
                <button
                  disabled={selected()}
                  class={clsx(
                    'flex w-full items-center p-[5px]',
                    'disabled:opacity-50',
                    {
                      'hover:bg-gray-100 dark:hover:bg-gray-900': !selected(),
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
                    class={clsx(
                      'absolute top-1/2 left-[3px] -mt-[15px] rounded-full',
                      'bg-white text-red-600 dark:bg-gray-700 dark:text-red-400'
                    )}
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
