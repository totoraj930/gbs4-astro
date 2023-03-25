import { uid } from '@gbs/utils';
import clsx from 'clsx';
import { For, Show } from 'solid-js';
import { createStore, produce } from 'solid-js/store';

const [toastStore, setToastStore] = createStore<
  {
    id: string;
    data: ToastData;
    timer: number;
    fadeoutRun: boolean;
  }[]
>([]);

export function ToastArea() {
  return (
    <div
      class={clsx(
        'fixed bottom-0 flex w-full justify-center',
        'pointer-events-none z-[200]'
      )}
    >
      <div
        class={clsx('gap-[5px] p-[10px]', 'flex w-[300px] max-w-full flex-col')}
      >
        <For each={toastStore}>
          {(data, index) => {
            return (
              <>
                <Show when={index() >= toastStore.length - 3}>
                  <Toast data={data.data} fadeoutRun={data.fadeoutRun} />
                </Show>
              </>
            );
          }}
        </For>
      </div>
    </div>
  );
}

function Toast(props: { data: ToastData; fadeoutRun: boolean }) {
  return (
    <div
      class={clsx(
        'w-full text-center text-white',
        'rounded-[5px] py-[14px] px-[10px]',
        {
          'bg-red-600/90': props.data.type === 'error',
          'bg-sky-600/90': props.data.type === 'info',
          'bg-lime-500/90': props.data.type === 'success',
          'bg-orange-600/90': props.data.type === 'warn',
          shadow: true,
          'toast-fadeout': props.fadeoutRun,
        }
      )}
    >
      {props.data.message}
    </div>
  );
}

export type ToastData = {
  type: 'warn' | 'error' | 'info' | 'success';
  duration?: number;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  message: any;
};

export function addToast(data: ToastData) {
  const id = uid();
  const timer = setTimeout(() => {
    setToastStore(
      produce((list) => {
        const i = list.findIndex((t) => t.id === id);
        list.splice(i, 1);
      })
    );
  }, data.duration ?? 5000);

  setTimeout(() => {
    setToastStore(
      produce((list) => {
        const i = list.findIndex((t) => t.id === id);
        list[i].fadeoutRun = true;
      })
    );
  }, (data.duration ?? 5000) - 400);

  setToastStore(
    produce((list) => {
      list.push({
        id,
        data,
        timer,
        fadeoutRun: false,
      });
    })
  );
}
