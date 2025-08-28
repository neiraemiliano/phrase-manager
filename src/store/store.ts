import { Action, AppState } from "@/types";

const devtools = (globalThis as any).__REDUX_DEVTOOLS_EXTENSION__?.connect({
  name: "PhraseManager",
});

export class Store {
  private state: AppState;
  private listeners: Set<() => void> = new Set();
  private reducer: (state: AppState, action: Action) => AppState;

  constructor(
    reducer: (state: AppState, action: Action) => AppState,
    initialState: AppState,
  ) {
    this.reducer = reducer;
    this.state = initialState;
    devtools?.init(this.state);
  }

  getState = (): AppState => {
    return this.state;
  };

  dispatch = (action: Action) => {
    this.state = this.reducer(this.state, action);
    devtools?.send(action.type, this.state);
    this.listeners.forEach((l) => l());
  };

  subscribe = (listener: () => void): (() => void) => {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  };
}
