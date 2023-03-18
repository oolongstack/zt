import { useState, useEffect } from "react";
import { StateCreator, createStore } from "./vanilla";
import type { StoreApi } from "./vanilla";
function useSyncInternalState<T>(
  subscribe: StoreApi<T>["subscribe"],
  getSnapshot: StoreApi<T>["getState"]
) {
  const [state, setState] = useState(getSnapshot());
  useEffect(() => {
    const unsubscribe = subscribe((state) => {
      setState(state);
    });
    return () => unsubscribe();
  }, []);

  return state;
}
const useStore = <T>(api: StoreApi<T>) => {
  const value = useSyncInternalState<T>(api.subscribe, api.getState);
  return value;
};

const createImpl = <T>(createState: StateCreator<T, [], []>) => {
  const api =
    typeof createState === "function"
      ? createStore<T>(createState)
      : createState;

  const useBoundStore = () => useStore<T>(api);

  // 这个函数要在函数组件中调用
  return useBoundStore;
};

const create = <T>(createState: StateCreator<T, [], []>) =>
  createState ? createImpl<T>(createState) : createState;

export { create };
