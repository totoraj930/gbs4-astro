import { JSX, Show, splitProps } from 'solid-js';
import { text } from '../Text';

function Button(
  _props: {
    children?: JSX.Element;
  } & JSX.HTMLAttributes<HTMLButtonElement>
) {
  const [props, buttonProps] = splitProps(_props, ['children']);
  return (
    <button
      class="flex flex-row rounded-full bg-sky-400 py-[7px] px-[11px] text-white"
      {...buttonProps}
    >
      <Show when={props}>{props.children}</Show>
    </button>
  );
}

export function Header() {
  return (
    <header class="flex flex-row items-center justify-start py-[5px] px-[8px] shadow-[0_0_5px_rgba(0,0,0,0.5)]">
      <h1 class="font-bold">Granblue Search</h1>

      <nav class="ml-auto">
        <ul class="flex flex-row gap-[10px]">
          <li>
            <Button>{text('設定')}</Button>
          </li>
          <li>
            <Button>{text('カラムを追加')}</Button>
          </li>
          <li>
            <Button>{text('ヘルプ')}</Button>
          </li>
        </ul>
      </nav>
    </header>
  );
}
