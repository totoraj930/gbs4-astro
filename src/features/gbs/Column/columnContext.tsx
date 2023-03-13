import type { ColumnOptions } from '@gbs/Store/globalSettings/schema';
import { createContext, JSXElement, useContext } from 'solid-js';
import { createStore, SetStoreFunction } from 'solid-js/store';

export type Action =
  | {
      type: 'Delete';
    }
  | {
      type: 'Move';
      diff: number;
    }
  | {
      type: 'Move';
      num: number;
    };

export type Dispatch = (action: Action) => void;

export type ColumnContextValue = {
  options: ColumnOptions;
  setOptions: SetStoreFunction<ColumnOptions>;
  dispatch: Dispatch;
};

export const ColumnContext = createContext<ColumnContextValue>(
  {} as ColumnContextValue
);

export const useColumn = () => useContext(ColumnContext);

type ProviderProps = {
  initialOptions: ColumnOptions;
  dispatch: Dispatch;
  children?: JSXElement;
};
export function ColumnProvider(props: ProviderProps) {
  const [options, setOptions] = createStore(props.initialOptions);
  return (
    <ColumnContext.Provider
      // eslint-disable-next-line solid/reactivity
      value={{ options, setOptions, dispatch: props.dispatch }}
    >
      {props.children}
    </ColumnContext.Provider>
  );
}
