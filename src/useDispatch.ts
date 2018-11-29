import { Store } from './store';
import { Action } from './action';

type ArgumentTypes<F extends Function> = F extends (...args: infer A) => any
  ? A
  : never;

type ActionCreator = (...args: unknown[]) => any;

// type ActionCreators<S> = {
//   [P in keyof S]: (...args: any[]) => S[P]
// };

export function useDispatch<T, S extends Action, R extends ActionCreator>(
  store: Store<T, S>,
  actionCreator: R
): (...args: ArgumentTypes<R>) => S {
  return (...args: ArgumentTypes<R>) => store.dispatch(actionCreator(...args));
  // if (typeof actionCreators === 'function') {
  //   return (...args: any[]) => store.dispatch(actionCreators(...args));
  // }
  // const actionKeys = Object.keys(actionCreators);
  // return actionKeys.reduce(
  //   (dispatchers: any, key) => ({
  //     ...dispatchers,
  //     [key]: (...args: any[]) => store.dispatch(actionCreators[key](...args))
  //   }),
  //   {}
  // );
}

export function createUseDispatch<T, S extends Action>(store: Store<T, S>) {
  return <R extends ActionCreator>(actionCreators: R) =>
    useDispatch<T, S, R>(store, actionCreators);
}
