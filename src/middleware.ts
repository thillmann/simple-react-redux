import { compose } from './compose';
import { Store } from './store';
import { Enhancer } from './enhancer';
import { Action } from './action';

type DispatchFn<T, S extends Action> = Store<T, S>['dispatch'];

interface MiddlewareApi<T, S extends Action> {
	getState: () => T;
	dispatch: DispatchFn<T, S>;
}

export type Middleware<T, S extends Action> = (store: MiddlewareApi<T, S>) => (next: DispatchFn<T, S>) => DispatchFn<T, S>;

export function applyMiddleware<T, S extends Action>(
  ...middlewares: Middleware<T, S>[]
): Enhancer<T, S> {
  return createStore => (...args) => {
    const store = createStore(...args);
    let dispatch: DispatchFn<T, S> = () => {
      throw new Error('Cannot dispatch while constructing middleware');
    };
    const middlewareApi: MiddlewareApi<T, S> = {
      getState: store.getState,
      dispatch: (...args) => dispatch(...args)
    };
    const chain = middlewares.map(middleware => middleware(middlewareApi));
    dispatch = compose(...chain)(store.dispatch);
    return {
      ...store,
      dispatch
    };
  };
}
