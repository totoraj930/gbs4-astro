import clsx from 'clsx';
import { JSX, Show } from 'solid-js';
import { createMemo } from 'solid-js';
import { twMerge } from 'tailwind-merge';
import { uid } from '../utils';

type CheckboxProps = {
  children?: JSX.Element;
  name?: string;
  value: boolean;
  onChange?: (value: boolean) => void;
  reverse?: boolean;
  class?: string;
  disabled?: boolean;
};

export function Checkbox(props: CheckboxProps) {
  const labelName = createMemo(() => props.name ?? uid());
  return (
    <label
      for={labelName()}
      class={twMerge(
        clsx(
          'relative inline-flex cursor-pointer select-none items-center gap-[3px] p-[2px]',
          'leading-none focus-within:outline focus-within:outline-[1px]',
          'outline-gray-900 dark:outline-white',
          props.class,
          {
            'cursor-not-allowed opacity-50': props.disabled,
          }
        )
      )}
    >
      <Show when={props.reverse}>{props.children}</Show>
      <input
        type="checkbox"
        id={labelName()}
        checked={props.value}
        class="absolute h-1 w-1 opacity-0"
        onInput={(event) => props.onChange?.(event.currentTarget.checked)}
        disabled={props.disabled}
      />
      <span
        class={clsx(
          'flex h-[16px] w-[16px] items-center justify-center rounded-[2px]',
          'border-2 border-solid border-sky-400 p-[2px]'
        )}
      >
        <span
          class="h-full flex-1 rounded-[1px]"
          classList={{
            'bg-sky-400': props.value,
          }}
        >
          {}
        </span>
      </span>
      <Show when={!props.reverse}>{props.children}</Show>
    </label>
  );
}
