import { Reducer as ReactReducer } from 'react';
import { Action } from './action';

export type Reducer<T, S extends Action> = ReactReducer<T, S>;
