import { Reducer as ReactReducer } from "react";

export type Reducer<T, S extends Action> = ReactReducer<T, S>;
