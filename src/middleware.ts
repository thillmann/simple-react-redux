import { compose } from './compose';
import { Store } from './store';
import { Enhancer } from './enhancer';

type DispatchFn<T, S> = Store<T, S>['dispatch'];

interface MiddlewareApi<T, S> {
	getState: () => T;
	dispatch: DispatchFn<T, S>;
}

export type Middleware<T, S> = (store: MiddlewareApi<T, S>) => (next: DispatchFn<T, S>) => DispatchFn<T, S>;

export default function applyMiddleware<T, S>(
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
