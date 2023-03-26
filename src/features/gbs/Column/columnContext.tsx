import type { ColumnOptions } from '@gbs/Store/globalSettings/schema';
import { Accessor, createContext, JSXElement, useContext } from 'solid-js';
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
  index: Accessor<number>;
};

export const ColumnContext = createContext<ColumnContextValue>(
  {} as ColumnContextValue
);

export const useColumn = () => useContext(ColumnContext);

type ProviderProps = {
  initialOptions: ColumnOptions;
  dispatch: Dispatch;
  children?: JSXElement;
  index: Accessor<number>;
};
export function ColumnProvider(props: ProviderProps) {
  const [options, setOptions] = createStore(props.initialOptions);
  return (
    <ColumnContext.Provider
      // eslint-disable-next-line solid/reactivity
      value={{
        options,
        setOptions,
        dispatch: props.dispatch,
        index: props.index,
      }}
    >
      {props.children}
    </ColumnContext.Provider>
  );
}
