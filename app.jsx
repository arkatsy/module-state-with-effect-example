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

const identity = (state) => state;

const useStore = (store, selector = identity) => {
  const [state, set] = React.useState(selector(store.getState()));

  React.useEffect(() => {
    const cb = () => set(selector(store.getState()));
    const unsub = store.subscribe(cb);
    cb();
    return () => unsub();
  }, [store, selector]);

  return [state, store.setState];
};

const countStore = create({ count: 0, step: 1 });

export default function App() {
  return (
    <div id="wrapper">
      <div id="counters">
        <Counter1 />
        <hr />
        <Counter2 />
      </div>
      <Controls />
    </div>
  );
}

function Counter1() {
  const [state, setState] = useStore(
    countStore,
    React.useCallback((state) => state.count, [])
  );
  console.log("[render] Counter1");

  const inc = () => countStore.setState((state) => ({ ...state, count: state.count + state.step }));
  const dec = () => countStore.setState((state) => ({ ...state, count: state.count - state.step }));

  return (
    <div>
      <h4>Synced Counter1</h4>
      <hr />
      <div>Count: {state}</div>
      <div id="actions">
        <button onClick={inc}>Increment</button>
        <button onClick={dec}>Decrement</button>
      </div>
    </div>
  );
}

function Counter2() {
  const [state, setState] = useStore(
    countStore,
    React.useCallback((state) => state.count, [])
  );
  console.log("[render] Counter2");

  const inc = () => countStore.setState((state) => ({ ...state, count: state.count + state.step }));
  const dec = () => countStore.setState((state) => ({ ...state, count: state.count - state.step }));

  return (
    <div>
      <h4>Synced Counter2</h4>
      <hr />
      <div>Count: {state}</div>
      <div id="actions">
        <button onClick={inc}>Increment</button>
        <button onClick={dec}>Decrement</button>
      </div>
    </div>
  );
}

function Controls() {
  const [state, setState] = useStore(
    countStore,
    React.useCallback((state) => state.step, [])
  );
  console.log("[render] Controls");

  const incStep = () => countStore.setState((state) => ({ ...state, step: state.step + 1 }));
  const decStep = () => countStore.setState((state) => ({ ...state, step: state.step - 1 }));

  return (
    <div>
      <h4>Controls</h4>
      <hr />
      <div>Step: {state}</div>
      <div id="controls">
        <button onClick={incStep}>Increment Step</button>
        <button onClick={decStep}>Decrement Step</button>
      </div>
    </div>
  );
}
