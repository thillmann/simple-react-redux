import {
  Action,
  applyMiddleware,
  combineReducer,
  createStore,
  createUseDispatch,
  createUseSelect,
  Middleware
} from 'simple-react-redux';

interface ITestState {
  foo: string;
}

interface IAnotherTestState {
  bar: boolean;
}

const reducer = (state: ITestState, action: ReturnType<typeof actionTest>) => {
  switch (action.type) {
    case 'TEST':
      return { ...state, foo: action.value };
  }
  return state;
};

export function actionTest(test: string): Action<'TEST', string> {
  return {
    type: 'TEST',
    value: test
  };
}

const reducer2 = (
  state: IAnotherTestState,
  action: ReturnType<typeof actionBar>
) => {
  switch (action.type) {
    case 'BAR':
      return { ...state, bar: !state.bar };
  }
  return state;
};

export function actionBar(): Action<'BAR', undefined> {
  return {
    type: 'BAR'
  };
}

// tslint:disable-next-line:no-console
console.warn(combineReducer);
const rootReducer = combineReducer({
  asset: reducer,
  auth: reducer2
});

function logger<T, S extends Action>(): Middleware<T, S> {
  return () => next => action => {
    return next(action);
  };
}

const store = createStore(
  rootReducer,
  { asset: { foo: '' }, auth: { bar: false } },
  applyMiddleware(logger())
);

export const useSelect = createUseSelect(store);
export const useDispatch = createUseDispatch(store);
