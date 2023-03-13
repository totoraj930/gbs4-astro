import clsx from 'clsx';
import { createMemo, Index } from 'solid-js';
import { twMerge } from 'tailwind-merge';
import { uid } from '../utils';

type RadioOption = {
  name: string;
  value: string | number;
};
type RadioOptions = readonly RadioOption[];

type RadioProps<T extends RadioOptions, V = T[number]['value']> = {
  value: V;
  options: T;
  name?: string;
  onChange?: (value: V) => void;
  class?: string;
};

export function Radio<T extends RadioOptions = []>(props: RadioProps<T>) {
  const name = createMemo(() => props.name ?? uid());
  return (
    <div class="flex flex-wrap items-center gap-x-[16px] gap-y-[5px]">
      <Index each={props.options}>
        {(item) => {
          const labelName = uid();
          return (
            <label
              for={labelName}
              class={twMerge(
                clsx(
                  'relative flex cursor-pointer select-none items-center gap-[3px] p-[2px]',
                  'leading-none focus-within:outline focus-within:outline-[1px]',
                  'outline-gray-900 dark:outline-white',
                  props.class
                )
              )}
            >
              <input
                id={labelName}
                type="radio"
                name={name()}
                class="absolute h-1 w-1 opacity-0"
                checked={props.value === item().value}
                value={item().value}
                onInput={(event) => {
                  if (event.currentTarget.checked) {
                    props.onChange?.(item().value);
                  }
                }}
              />
              <span class="flex h-[16px] w-[16px] items-center justify-center rounded-full border-2 border-solid border-sky-400 p-[2px]">
                <span
                  class="h-full flex-1 rounded-full"
                  classList={{
                    'bg-sky-400': item().value === props.value,
                  }}
                >
                  {}
                </span>
              </span>
              <span>{item().name}</span>
            </label>
          );
        }}
      </Index>
    </div>
  );
}
