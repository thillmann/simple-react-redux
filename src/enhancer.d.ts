import { Action } from './action';
import { Reducer } from './reducer';
import { Store } from './store';

type StoreCreator<T, S extends Action> = (
  reducer: Reducer<T, S>,
  initialState?: T | Enhancer<T, S>,
  enhancer?: Enhancer<T, S>
) => Store<T, S>;

export type Enhancer<T, S extends Action> = (
  storeCreator: StoreCreator<T, S>
) => StoreCreator<T, S>;
