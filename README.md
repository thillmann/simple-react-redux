# Simple React Redux Store

The store is largely based on [react-redux](https://github.com/reduxjs/react-redux/). It makes use of the proposed [React Hooks API](https://github.com/reduxjs/react-redux/issues/1063) and is fully typed.

## Installation

```
npm install --save simple-react-redux
```

It depends on `react@16.7.0-alpha.0` and `@types/react@16.7.0-alpha.0`.

## useSelect

A custom hook that makes the state accessible through a selector function.

```typescript
import { createStore, useSelect } from 'simple-react-redux';

interface AssetState {
  foo: string;
}

const reducer = (state: AssetState, action: ReturnType<typeof actionTest>) => {
  return state;
};

const store = createStore(reducer);

// In a component:
const foo = useSelect(store, state => state.foo); // foo has type string
```

It is also possible to create a custom hook with your store already injected:

```typescript
import { createUseSelect } from 'simple-react-redux';

const myUseSelect = createUseSelect(store);

// In a component:
const foo = myUseSelect(state => state.foo); // foo has type string
```

Or to use a context:

```typescript
const StoreContext = React.createContext(store);

// In a component:
const store = useContext(StoreContext);
const foo = useSelect(store, state => state.foo); // foo has type 
```

## useDispatch

The useDispatch hook works similarly:

```typescript
function testAction(test: string) {
  return {
    type: 'TEST',
    value: test
  };
}

// In a component:
const dispatcher = useDispatch(store, testAction); // dispatcher has the same type as testAction
dispatcher('foo'); // will dispatch the test action with value 'foo'
```

Using createUseDispatch:

```typescript
import { createUseDispatch } from 'simple-react-redux';

const myUseDispatch = createUseDispatch(store);

// In a component:
const dispatcher = myUseDispatch(testAction); // dispatcher has the same type as testAction 
```

Or to use a context:

```typescript
const StoreContext = React.createContext(store);

// In a component:
const store = useContext(StoreContext);
const dispatcher = useDispatch(store, testAction); // dispatcher has the same type as testAction 
```

## Examples

Check out the examples folder for more information. 