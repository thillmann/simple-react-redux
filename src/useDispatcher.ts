import { Store } from './store';

type ArgumentTypes<F extends Function> = F extends (...args: infer A) => any
  ? A
  : never;

type ActionCreator<S> = (...args: unknown[]) => S;

function test(a: string, b: boolean): void {}

type b = ArgumentTypes<typeof test>;

// type ActionCreators<S> = {
//   [P in keyof S]: (...args: any[]) => S[P]
// };

export function useDispatcher<T, S, R extends ActionCreator<S>>(
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

export function createUseDispatcher<T, S>(store: Store<T, S>) {
  return <R extends ActionCreator<S>>(actionCreators: R) =>
    useDispatcher<T, S, R>(store, actionCreators);
}
