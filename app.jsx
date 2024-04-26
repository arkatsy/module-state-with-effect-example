import React from "react";
import "./defaults.css";

function create(initState) {
  let state = initState;
  let listeners = new Set();

  function getState() {
    return state;
  }

  function setState(newState) {
    state = typeof newState === "function" ? newState(state) : newState;
    listeners.forEach((listener) => listener());
  }

  function subscribe(listener) {
    listeners.add(listener);
    return () => listeners.delete(listener);
  }

  return { getState, setState, subscribe };
}

const countStore = create({ count: 0 });

const useStore = (store) => {
  const [state, set] = React.useState(store.getState());

  React.useEffect(() => {
    const cb = () => set(store.getState());
    const unsub = store.subscribe(cb);
    cb();
    return () => unsub();
  }, [store]);

  return [state, store.setState];
};

export default function App() {
  return (
    <div id="wrapper">
      <Counter1 />
      <hr />
      <Counter2 />
    </div>
  );
}

function Counter1() {
  const [state, setState] = useStore(countStore);

  const inc = () => countStore.setState((state) => ({ count: state.count + 1 }));
  const dec = () => countStore.setState((state) => ({ count: state.count - 1 }));

  return (
    <div>
      <h4>Counter1</h4>
      <hr />
      <div>Count: {state.count}</div>
      <div id="actions">
        <button onClick={inc}>Increment</button>
        <button onClick={dec}>Decrement</button>
      </div>
    </div>
  );
}

function Counter2() {
  const [state, setState] = useStore(countStore);

  const inc = () => countStore.setState((state) => ({ count: state.count + 1 }));
  const dec = () => countStore.setState((state) => ({ count: state.count - 1 }));

  return (
    <div>
      <h4>Counter2</h4>
      <hr />
      <div>Count: {state.count}</div>
      <div id="actions">
        <button onClick={inc}>Increment</button>
        <button onClick={dec}>Decrement</button>
      </div>
    </div>
  );
}
