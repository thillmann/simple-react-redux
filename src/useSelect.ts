import { useState, useEffect, useMemo } from 'react';
import { Store } from './store';

type SelectorFn<T, R> = (state: T) => R;

export function useSelect<T, S, R>(store: Store<T, S>, selector: SelectorFn<T, R>): R {
  const initialState = selector(store.getState());
  const [state, setState] = useState(initialState);
  useEffect(
    () =>
      store.subscribe(() => {
        const nextState = selector(store.getState());
        if (nextState !== state) {
          setState(nextState);
        }
      }),
    [selector]
  );
  return state;
}

export function createUseSelect<T, S>(store: Store<T, S>): <R>(selector: SelectorFn<T, R>) => R {
  return <R>(selector: SelectorFn<T, R>) => useSelect(store, selector);
}