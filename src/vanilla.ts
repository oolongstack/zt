export type SetStateInternal<T> = {
  (
    partial: T | Partial<T> | { (state: T): T | Partial<T> },
    replace?: boolean | undefined
  ): void;
};

export interface StoreApi<T> {
  setState: SetStateInternal<T>;
  getState: () => T;
  subscribe: (listener: (state: T, prevState: T) => void) => () => void;
  /**
   * @deprecated Use `unsubscribe` returned by `subscribe`
   */
  destroy: () => void;
}
export type StateCreator<T, Mis, Mos, U = T> = (
  setState: SetStateInternal<T>,
  getState: () => T,
  store: StoreApi<T>
) => U;

export const createStore = <T>(
  createState: StateCreator<T, [], []>
): StoreApi<T> => {
  type TState = ReturnType<typeof createState>;

  type Listener = (state: TState, prevState: TState) => void;

  let state: TState;
  const listeners: Set<Listener> = new Set();

  const setState: StoreApi<TState>["setState"] = (partial) => {
    const nextState =
      typeof partial === "function"
        ? (partial as (state: TState) => TState)(state)
        : partial;

    if (!Object.is(nextState, state)) {
      const prevState = state;

      state = Object.assign({}, state, nextState);

      listeners.forEach((listener) => listener(state, prevState));
    }
  };

  const getState: StoreApi<TState>["getState"] = () => {
    return state;
  };

  const subscribe: StoreApi<TState>["subscribe"] = (listener: Listener) => {
    listeners.add(listener);
    return () => {
      listeners.delete(listener);
    };
  };

  const destroy: StoreApi<TState>["destroy"] = () => {
    listeners.clear();
  };

  const api = { setState, getState, subscribe, destroy };
  state = createState(setState, getState, api);
  return api;
};
