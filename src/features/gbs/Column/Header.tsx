import { createMemo, createSignal, Show } from 'solid-js';
import { produce } from 'solid-js/store';
import { gbsList } from '@gbs/Store/gbsList';
import {
  canAutoCopy,
  globalSettings,
  hasFocus,
  isCompact,
  isScreenLock,
  saveSettingsToStorage,
} from '@gbs/Store/globalSettings';
import { text } from '@gbs/Text';
import { SettingsModal } from './Settings/SettingsModal';
import { clsx } from 'clsx';
import { useColumn } from './columnContext';
import {
  MsAutorenew,
  MsNotificationsFill,
  MsNotificationsOffFill,
  MsSearch,
} from 'solid-material-symbols/rounded/600';
import { twMerge } from 'tailwind-merge';
import { addToast } from '@gbs/Store/toast';

export function Header() {
  const { options: col, setOptions: setCol } = useColumn();
  const [open, setOpen] = createSignal(false);

  const saveCol = () => saveSettingsToStorage();

  const displayInfo = createMemo(() => {
    if (col.name && col.name.length > 0)
      return {
        name: col.name,
      };
    if (col.filters[0]) {
      const f = col.filters[0];
      if (f.id !== -1) {
        const enemy = gbsList().find((target) => target.id === f.id);
        return {
          level: enemy?.level ?? '　　',
          name: enemy?.[globalSettings.language] ?? '　　　　　',
        };
      } else {
        return {
          level: f.level,
          name: f.regex ?? text('設定なし'),
        };
      }
    }
    return {
      name: text('設定なし'),
    };
  });

  return (
    <Show when={col !== null}>
      <SettingsModal open={open()} onClose={() => setOpen(false)} />

      <header
        class={twMerge(
          clsx(
            'z-40 flex flex-row items-center justify-start gap-[2px] border-b border-solid',
            'border-gray-300 dark:border-gray-600',
            {
              hidden: isCompact(),
            }
          )
        )}
      >
        <button
          class="flex flex-1 flex-row items-center justify-start gap-[5px] text-left leading-none active:translate-y-[1px]"
          onClick={() => {
            if (isScreenLock()) {
              addToast({
                type: 'warn',
                duration: 2000,
                message: text('画面ロック中'),
              });
              return;
            }
            setOpen(true);
          }}
        >
          <span class="ml-[5px]">
            {/* <RiSystemFilter3Fill size={22} /> */}
            {/* <RiSystemSettings4Fill size={22} /> */}
            {/* <RiSystemSearchLine size={22} /> */}
            <MsSearch size={22} />
          </span>
          <span class="relative h-[36px] flex-1">
            <span class="absolute top-0 left-0 flex h-full w-full flex-col justify-center overflow-hidden">
              <Show when={displayInfo()?.level}>
                <span class="text-[11px] font-bold">
                  Lv.{displayInfo()?.level}
                </span>
              </Show>
              <span class="overflow-hidden text-ellipsis whitespace-nowrap text-[14px] font-bold leading-tight">
                {displayInfo()?.name}
              </span>
            </span>
          </span>
        </button>

        <button
          onClick={() => {
            setCol(
              produce((s) => {
                s.autoCopy = !s.autoCopy;
              })
            );
            saveCol();
          }}
          class={twMerge(
            clsx(
              'mr-1 flex flex-row items-center gap-[3px] rounded-full py-[4px] px-[8px]',
              'text-white active:translate-y-[1px] dark:text-gray-800',
              {
                'bg-gray-800 dark:bg-white': !col.autoCopy,
                'bg-sky-400 dark:text-white': col.autoCopy,
                'opacity-50': col.autoCopy && !hasFocus(),
                hidden: !canAutoCopy(),
              }
            )
          )}
        >
          <span class="-ml-[2px]">
            <MsAutorenew
              size={14}
              class={clsx({
                'animate-spin': col.autoCopy && hasFocus(),
              })}
            />
          </span>
          <span class="text-[10px] font-bold">AUTO</span>
        </button>

        <button
          class={clsx(
            'grid h-[30px] w-[30px] place-content-center active:translate-y-[1px]',
            {
              'text-sky-400': !col.sound.mute,
              'text-gray-800 dark:text-white': col.sound.mute,
              'opacity-50':
                globalSettings.mute ||
                (!col.sound.mute &&
                  !hasFocus() &&
                  globalSettings.focusOnlySound),
            }
          )}
          onClick={() => {
            setCol(produce((s) => (s.sound.mute = !s.sound.mute)));
            saveCol();
          }}
        >
          <Show when={col.sound.mute}>
            <MsNotificationsOffFill size={22} />
          </Show>
          <Show when={!col.sound.mute}>
            <MsNotificationsFill size={22} />
          </Show>
        </button>
      </header>
    </Show>
  );
}
