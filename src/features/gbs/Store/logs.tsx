import { createSignal, For } from 'solid-js';
import { getTimeStr } from '@gbs/utils';

type LogType = 'error' | 'info';
type LogItem = {
  type: LogType;
  date: number;
  args: unknown[];
  text: string;
};

const [logs, setLogs] = createSignal<LogItem[]>([]);
export { logs };

export function putLog(type: LogType, msg: unknown, ...args: unknown[]) {
  setLogs((prev) => {
    return [
      {
        date: Date.now(),
        text: msg + '',
        type,
        args,
      },
      ...prev,
    ];
  });
}

export function LogColumn() {
  return (
    <div class="flex h-full w-[var(--column-size)] flex-shrink-0 flex-col bg-white">
      <header class="flex h-[36px] items-center border-b border-solid border-gray-200 px-[5px]">
        <p class="text-[14px] font-bold">ログ</p>
      </header>
      <ul class="flex flex-1 flex-col gap-[10px] overflow-y-scroll p-[5px] leading-none">
        <For each={logs()}>
          {(item) => {
            return (
              <li
                onClick={() => {
                  console.log(item);
                  for (const v of item.args) {
                    console.log(v);
                  }
                }}
              >
                <p
                  class="text-sm"
                  classList={{
                    'text-green-500': item.type === 'info',
                    'text-red-500': item.type === 'error',
                  }}
                >
                  <span>{getTimeStr(new Date(item.date))} </span>
                  <span>{item.type}:</span>
                </p>
                <p class="pl-[10px] text-sm">
                  <span class="whitespace-pre-line">{item.text}</span>
                </p>
              </li>
            );
          }}
        </For>
      </ul>
    </div>
  );
}
