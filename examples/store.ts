import createStore from '../createStore';
import combineReducer from '../combineReducers';
import applyMiddleware, { Middleware } from '../middleware';
import { createUseSelect } from '../useSelect';
import { createUseDispatch } from '../useDispatch';
import { Action } from '../action';

interface AssetState {
	foo: string;
}

interface AuthState {
	bar: boolean;
}

const reducer = (state: AssetState, action: ReturnType<typeof actionTest>) => {
	return state;
};

function actionTest(test: string): Action<'TEST', string> {
	return {
		type: 'TEST',
		value: test
	};
}

const reducer2 = (state: AuthState, action: Action) => {
	return state;
}

const rootReducer = combineReducer({
	asset: reducer,
	auth: reducer2
});

function logger<T, S>(): Middleware<T, S> {
	return () => next => action => {
		return next(action);
	};
}

const store = createStore(rootReducer, applyMiddleware(logger()));

const myUseSelect = createUseSelect(store);
const myUseDispatch = createUseDispatch(store);

const dispatcher = myUseDispatch(actionTest);

const test = myUseSelect(state => state.asset.foo);
const test2 = myUseSelect(state => state.auth.bar);