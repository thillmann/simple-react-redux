import { Reducer } from './reducer';
import { Action } from './action';

type Listener = () => void;

type Unsubscribe = () => void;

export interface Store<T, S extends Action> {
  getState: () => T;
  dispatch: (action: S) => S;
  subscribe: (listener: Listener) => Unsubscribe;
  replaceReducer: (nextReducer: Reducer<T, S>) => void;
}
