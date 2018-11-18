import { Action } from './action';
import { Reducer } from './reducer';

type CombinedReducer<T, S extends Action> = { [P in keyof T]: Reducer<T[P], S> };

export function combineReducer<T, S extends Action>(
  reducers: CombinedReducer<T, S>
): Reducer<T, S> {
  const reducerKeys = Object.keys(reducers);
  return (state: T = {} as T, action: Action) => {
    let hasChanged = false;
    const nextState = {};
    for (let i = 0; i < reducerKeys.length; i++) {
      const stateKey = reducerKeys[i];
      const reducer = reducers[stateKey];
      const previousStateForKey = state[stateKey];
      const nextStateForKey = reducer(previousStateForKey, action);
      if (typeof nextStateForKey === 'undefined') {
        throw new TypeError('Undefined state');
      }
      nextState[stateKey] = nextStateForKey;
      hasChanged = hasChanged || nextStateForKey !== previousStateForKey;
    }
    return hasChanged ? (nextState as T) : (state as T);
  };
}
