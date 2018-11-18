import { useState, useEffect } from 'react';
import { Store } from './store';
import { Action } from './action';

type SelectorFn<T, R> = (state: T) => R;

export function useSelect<T, S extends Action, R>(
  store: Store<T, S>,
  selector: SelectorFn<T, R>
): R {
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

export function createUseSelect<T, S extends Action>(
  store: Store<T, S>
): <R>(selector: SelectorFn<T, R>) => R {
  return <R>(selector: SelectorFn<T, R>) => useSelect(store, selector);
}
