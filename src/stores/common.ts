import { ExtractState, StoreApi, useStore } from 'zustand'

type ReadonlyStoreApi<T> = Pick<StoreApi<T>, 'getState' | 'getInitialState' | 'subscribe'>;

export const wrapUseStore = <S extends ReadonlyStoreApi<unknown>>(state: S) =>
  <U>(selector: (state: ExtractState<S>) => U) =>
    useStore(state, selector)