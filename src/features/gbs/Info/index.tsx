import {
  changeAndSave,
  globalSettings,
  isCompact,
} from '@gbs/Store/globalSettings';
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

function convertLine(info: InfoItem) {
  const target =
    globalSettings.language === 'en' ? info.en ?? info.message : info.message;
  if (Array.isArray(target)) {
    return target;
  } else {
    const res = target.split('\n');
    return res;
  }
}

export function InfoView(props: { info: InfoItem }) {
  const date = createMemo(() => new Date(props.info.date));
  const lines = createMemo(() => {
    return convertLine(props.info);
  });
  return (
    <>
      <time class="text-[14px]">[{getTimeStr(date(), true)}]</time>
      <div>
        <For each={lines()}>
          {(line) => {
            // eslint-disable-next-line solid/no-innerhtml
            return <p innerHTML={line} class="break-words" />;
          }}
        </For>
      </div>
    </>
  );
}

export function ImportantInfo(props: { info: InfoItem }) {
  const date = createMemo(() => new Date(props.info.date));
  const lines = createMemo(() => {
    return convertLine(props.info);
  });
  return (
    // <Show when={!isCompact() && true}>
    <Show when={globalSettings.hideInfo !== props.info.date}>
      <div
        class={clsx(
          'flex flex-wrap items-center',
          'bg-white dark:bg-gray-600 dark:text-white',
          'py-[5px] leading-[1.5]'
        )}
      >
        <button
          class="px-[10px]"
          onClick={() =>
            changeAndSave(produce((s) => (s.hideInfo = props.info.date)))
          }
        >
          <MsClose size={20} />
        </button>
        <time class="text-[14px]">[{getTimeStr(date(), true)}]</time>
        <div class="normal-html flex flex-col gap-[5px] px-[10px]">
          <For each={lines()}>
            {(line) => {
              // eslint-disable-next-line solid/no-innerhtml
              return <p innerHTML={line} class="break-words" />;
            }}
          </For>
        </div>
      </div>
    </Show>
  );
}
