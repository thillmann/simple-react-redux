export interface Store<T, S> {
  getState: () => T;
  dispatch: (action: S) => S;
  subscribe: (listener: Listener) => Unsubscribe;
  replaceReducer: (nextReducer: Reducer<T, S>) => void;
}
