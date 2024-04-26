import React from "react";
import "./defaults.css";

function create(initState) {
  let state = initState;
  let listeners = new Set();

  function getState() {
    return state;
  }

  function setState(newState) {
    state = newState;
    listeners.forEach((listener) => listener());
  }

  function subscribe(listener) {
    listeners.add(listener);
    return () => listeners.delete(listener);
  }

  return { getState, setState, subscribe };
}

const countStore = create({ count: 0 });

export default function App() {
  return (
    <div id="wrapper">
      <Counter1 />
      <Counter2 />
    </div>
  );
}

function Counter1() {
  const [state, setState] = React.useState(countStore.getState());

  React.useEffect(() => {
    return countStore.subscribe(() => {
      setState(countStore.getState());
    });
  });

  const inc = () => {
    countStore.setState({ count: state.count + 1 });
  };

  return (
    <div>
      <h4>Counter1</h4>
      <hr />
      <div>Count: {state.count}</div>
      <button onClick={inc}>Increment</button>
    </div>
  );
}

function Counter2() {
  const [state, setState] = React.useState(countStore.getState());

  React.useEffect(() => {
    return countStore.subscribe(() => {
      setState(countStore.getState());
    });
  });

  const inc = () => {
    countStore.setState({ count: state.count + 1 });
  };

  return (
    <div>
      <h4>Counter2</h4>
      <hr />
      <div>Count: {state.count}</div>
      <button onClick={inc}>Increment</button>
    </div>
  );
}
