import clsx from 'clsx';
import { createMemo } from 'solid-js';
import { gbsList, GbsListItem } from '@gbs/Store/gbsList';
import { globalSettings } from '@gbs/Store/globalSettings';
import type { FilterItem } from '@gbs/Store/globalSettings/schema';
import { RiSystemDeleteBack2Line } from 'solid-icons/ri';
import { MsEdit, MsPersonAdd } from 'solid-material-symbols/rounded/600';

export function EnemyElement(props: { element: GbsListItem['attr'] }) {
  return (
    <span
      class={clsx(
        {
          '[--element-color:var(--c-elm-0)]': props.element === 0,
          '[--element-color:var(--c-elm-1)]': props.element === 1,
          '[--element-color:var(--c-elm-2)]': props.element === 2,
          '[--element-color:var(--c-elm-3)]': props.element === 3,
          '[--element-color:var(--c-elm-4)]': props.element === 4,
          '[--element-color:var(--c-elm-5)]': props.element === 5,
          '[--element-color:var(--c-elm-6)]': props.element === 6,
        },
        'relative h-[25px] w-[25px] min-w-[25px] overflow-hidden rounded-full',
        'border border-solid bg-[var(--element-color)]',
        'border-gray-300 dark:border-gray-900',
        'before:bg-[linear-gradient(to_right_bottom,#000,#fff)]',
        'before:absolute before:block before:h-full before:w-full before:opacity-50',
        'after:bg-[linear-gradient(180deg,#fff_5%,transparent_40%)]',
        'after:absolute after:block after:h-full after:w-full after:opacity-90'
      )}
    >
      {}
    </span>
  );
}

export function Enemy(props: {
  level: string;
  name: string;
  subName: string;
  element: GbsListItem['attr'];
}) {
  return (
    <span class="flex flex-1 flex-row items-center gap-[5px] leading-none">
      <EnemyElement element={props.element} />
      <span class="relative h-[40px] flex-1 text-left">
        <span class="items-flex-start absolute flex h-full w-full flex-col justify-center">
          <span class="min-w-full overflow-hidden text-ellipsis whitespace-nowrap text-[16px] font-bold leading-[1.3]">
            Lv.{props.level} {props.name}
          </span>
          <span class="min-w-full overflow-hidden text-ellipsis whitespace-nowrap text-[14px] leading-[1.3]">
            {props.subName}
          </span>
        </span>
      </span>
    </span>
  );
}

export function InListEnemy(props: { data: number }) {
  const enemyProps = createMemo(() => {
    const enemy = gbsList().find(({ id }) => id == props.data);
    const res: Parameters<typeof Enemy>[0] = {
      level: enemy?.level ?? '　　',
      name: enemy?.[globalSettings.language] ?? '　　　　　　　　　',
      subName:
        enemy?.[globalSettings.language === 'ja' ? 'en' : 'ja'] ?? '　　　　　',
      element: enemy?.attr ?? 0,
    };
    return res;
  });
  return <Enemy {...enemyProps()} />;
}

export function ManualEnemy(props: { name?: string; level?: string }) {
  const level = createMemo(() => {
    if (!props.level || props.level.length <= 0) return '???';
    return props.level;
  });
  return (
    <span class="flex h-[40px] flex-1 items-center gap-[5px] leading-none">
      <span class="grid h-[25px] w-[25px] place-content-center">
        {/* <MsEdit size={25} /> */}
        <MsPersonAdd size={22} class="translate-x-[2px]" />
      </span>
      <span class="relative h-[40px] flex-1 text-left">
        <span class="items-flex-start absolute flex h-full w-full flex-col justify-center">
          <span class="min-w-full overflow-hidden text-ellipsis whitespace-nowrap text-[16px] font-bold leading-[1.3]">
            Lv.{level()} {props.name ?? ''}
          </span>
        </span>
      </span>
    </span>
  );
}

type Props = {
  data: FilterItem;
  onDelete: () => void;
};

export function FilterItemView(props: Props) {
  const filterName = createMemo(() => {
    if (props.data.id >= 0) {
      return <InListEnemy data={props.data.id} />;
    } else {
      return <ManualEnemy name={props.data.regex} level={props.data.level} />;
    }
  });
  return (
    <div class="flex flex-row items-center">
      {filterName()}
      <button
        class="ml-auto flex-shrink-0 flex-grow-0 text-red-600 dark:text-red-400"
        onClick={() => props.onDelete()}
      >
        <RiSystemDeleteBack2Line size={25} />
      </button>
    </div>
  );
}
