import { create } from "zt";
interface TState {
  count: number;
  name: string;
  add: () => void;
  sub: () => void;
}
const useAppStore = create<TState>((set) => ({
  count: 10,
  name: "cjl",
  add: () => set((state) => ({ count: state.count + 1 })),
  sub: () => set((state) => ({ count: state.count - 1 })),
}));

export { useAppStore };
