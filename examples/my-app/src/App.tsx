import * as React from 'react';
import './App.css';

import logo from './logo.svg';

import { actionBar, actionTest, useDispatch, useSelect } from './store';

function App() {
  const foo = useSelect(state => state.asset.foo); // state in the selector function is fully typed.
  const bar = useSelect(state => state.auth.bar);
  const dispatcherFoo = useDispatch(actionTest);
  const dispatcherBar = useDispatch(actionBar);
  const buttonClickHandler = () => dispatcherFoo('test');
  const button2ClickHandler = () => dispatcherBar();
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <h1 className="App-title">Welcome to React</h1>
      </header>
      <p className="App-intro">
        To get started, edit <code>src/App.tsx</code> and save to reload. {foo}{' '}
        {JSON.stringify(bar)}
      </p>
      <p>
        <button onClick={buttonClickHandler}>Click me</button>
        <button onClick={button2ClickHandler}>Click me, too</button>
      </p>
    </div>
  );
}

export default App;
