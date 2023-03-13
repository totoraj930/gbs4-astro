import type { Component, ComponentProps, JSX } from 'solid-js';
import { Dynamic } from 'solid-js/web';

export function twStyled<
  T extends
    | keyof JSX.IntrinsicElements
    | Component<{ children?: JSX.Element; class?: string }>,
  P extends ComponentProps<T> & { children?: JSX.Element },
  R extends (props: P) => JSX.Element
>(tag: T, cls: string): R {
  const res = (props: P) => {
    return (
      <Dynamic component={tag} {...props} class={cls}>
        {props.children}
      </Dynamic>
    );
  };
  return res as R;
}
