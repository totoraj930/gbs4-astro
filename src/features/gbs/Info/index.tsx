import { changeAndSave, globalSettings } from '@gbs/Store/globalSettings';
import { getTimeStr } from '@gbs/utils';
import clsx from 'clsx';
import { createMemo, createSignal, For, Show } from 'solid-js';
import { createStore, produce } from 'solid-js/store';
import { MsClose } from 'solid-material-symbols/rounded/600';
import { z } from 'zod';

const zInfoItem = z.object({
  date: z.string(),
  message: z.union([z.string(), z.array(z.string())]),
  en: z.union([z.string(), z.array(z.string())]).optional(),
});
export type InfoItem = z.infer<typeof zInfoItem>;

const zInfoResponse = z.object({
  important: zInfoItem,
  history: z.array(zInfoItem),
});
export type InfoResponse = z.infer<typeof zInfoResponse>;

export const [infoRes, setInfoRes] = createSignal<InfoResponse>();
export const [importantInfo, setImportantInfo] = createSignal<InfoItem>();

export async function getInfo() {
  const url = 'https://gbs-dev.eriri.net/info/info.json';
  const res = await fetch(url);
  const info = zInfoResponse.parse(await res.json());
  setInfoRes(info);
  setImportantInfo(info.important);
}

export function ImportantInfo(props: { info: InfoItem }) {
  const date = createMemo(() => new Date(props.info.date));
  const lines = createMemo(() => {
    const target =
      globalSettings.language === 'en'
        ? props.info.en ?? props.info.message
        : props.info.message;
    if (Array.isArray(target)) {
      return target;
    } else {
      return target.split('\n');
    }
  });
  return (
    <Show when={globalSettings.hideInfo !== props.info.date}>
      <div
        class={clsx(
          'flex items-center gap-[5px] p-[5px]',
          'bg-white dark:bg-gray-600 dark:text-white',
          'leading-[1.5]'
        )}
      >
        <button
          class="p-[3px]"
          onClick={() =>
            changeAndSave(produce((s) => (s.hideInfo = props.info.date)))
          }
        >
          <MsClose size={20} />
        </button>
        <time>[{getTimeStr(date(), true)}]</time>
        <div>
          <For each={lines()}>
            {(line) => {
              return <p>{line}</p>;
            }}
          </For>
        </div>
      </div>
    </Show>
  );
}
