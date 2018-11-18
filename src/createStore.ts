import $$observable from 'symbol-observable';
import { ObservableLike, ObserverLike, SubscriptionLike } from './observableLike';
import { Store } from './store';
import { Reducer } from './reducer';
import { Action } from './action';
import { Enhancer } from './enhancer';

type Listener = () => void;

type Unsubscribe = () => void;

const ActionTypes = {
  INIT: '@@Init',
  REPLACE: '@@Replace'
};

function ensureIsFunction(candidate: any, name: string): candidate is Function {
  if (typeof candidate !== 'function') {
    throw new TypeError(`Expected the ${name} to be a function.`);
  }
  return true;
}

function _createStore<T, S extends Action>(
  reducer: Reducer<T, S>,
  initialState?: T | Enhancer<T, S>,
  enhancer?: Enhancer<T, S>
): Store<T, S> {
  if (typeof initialState === 'function' && typeof enhancer === 'undefined') {
    enhancer = initialState as Enhancer<T, S>;
    initialState = undefined;
  }

  if (typeof enhancer !== 'undefined') {
    ensureIsFunction(enhancer, 'enhancer');
    return enhancer(createStore)(reducer, initialState);
  }

  ensureIsFunction(reducer, 'reducer');

  let currentReducer = reducer;
  let currentListeners: Listener[] = [];
  let nextListeners = currentListeners;
  let currentState = initialState as T;
  let isDispatching = false;

  function ensureCanMutateNextListeners(): void {
    if (nextListeners === currentListeners) {
      nextListeners = currentListeners.slice();
    }
  }

  function getState(): T {
    if (isDispatching) {
      throw new Error(
        'Cannot call store.getState() while reducer is executing'
      );
    }

    return currentState;
  }

  function replaceReducer(nextReducer: Reducer<T, S>): void {
    ensureIsFunction(nextReducer, 'nextReducer');

    currentReducer = nextReducer;
    dispatch({ type: ActionTypes.REPLACE } as S);
  }

  function dispatch(action: S): S {
    if (typeof action.type === 'undefined') {
      throw new TypeError('Action cannot be undefined');
    }

    if (isDispatching) {
      throw new Error('Reducers may not dispatch actions');
    }

    try {
      isDispatching = true;
      currentState = currentReducer(currentState, action);
    } finally {
      isDispatching = false;
    }

    const listeners = (currentListeners = nextListeners);
    for (let i = 0; i < listeners.length; i++) {
      const listener = listeners[i];
      listener();
    }

    return action;
  }

  function subscribe(listener: Listener): Unsubscribe {
    ensureIsFunction(listener, 'listener');

    if (isDispatching) {
      throw new Error(
        'Cannot call store.subscribe() while reducer is executing'
      );
    }

    let isSubscribed = true;
    ensureCanMutateNextListeners();
    nextListeners.push(listener);

    return () => {
      if (!isSubscribed) {
        return;
      }

      if (isDispatching) {
        throw new Error(
          'Cannot unsubscribe from a store listener while reducer is executing'
        );
      }

      isSubscribed = false;
      ensureCanMutateNextListeners();
      const listenerIndex = nextListeners.indexOf(listener);
      nextListeners.splice(listenerIndex, 1);
    };
  }

  function observable(): ObservableLike<T> {
    const outerSubscribe = subscribe;
    return {
      subscribe(observer: ObserverLike<T>): SubscriptionLike {
        if (typeof observer !== 'object' || observer === null) {
          throw new TypeError('Expected the observer to be an object.');
        }

        function observerState(): void {
          if (observer.next) {
            observer.next(getState());
          }
        }
        observerState();
        const unsubscribe = outerSubscribe(observerState);
        return { unsubscribe };
      },
      [$$observable](): ObservableLike<T> {
        return this;
      }
    };
  }

  return {
    getState,
    dispatch,
    subscribe,
    replaceReducer,
    [$$observable]: observable
  };
}

export function createStore<T, S extends Action>(
  reducer: Reducer<T, S>,
  initialState?: T | Enhancer<T, S>,
  enhancer?: Enhancer<T, S>
): Store<T, S> {
  const store = _createStore<T, S>(reducer, initialState, enhancer);
  store.dispatch({ type: ActionTypes.INIT } as S);
  return store;
}
