import { Store } from "tauri-plugin-store-api";
import { NIL, v4 } from 'uuid'
import { create, StateCreator } from 'zustand'
import type { PersistStorage, } from "zustand/middleware";
import { persist, PersistOptions } from 'zustand/middleware'

const DEFAULT_STORE = "xeid.json";
const store = new Store(DEFAULT_STORE);

const storage: PersistStorage<State> = {
  getItem: async (name) => await store.get(name),
  setItem: async (name, value) => await store.set(name, value),
  removeItem: async (name) => { await store.delete(name) }
}


interface State {
  _hasHydrated: boolean
  setHasHydrated: (hasHydrated: boolean) => void

  activeTab: string
  tabs: Array<{ id: string; title: string }>
  setActiveTab: (id: string) => void
  addTab: (id: string) => void
  removeTab: (id: string) => void
}

// Little hack to type the persist middleware. See https://github.com/pmndrs/zustand/issues/650
type MyPersist = (
  config: StateCreator<State>,
  options: PersistOptions<State>
) => StateCreator<State>

export const useRunStore = create(
  (persist as MyPersist)(
    (set) => ({
      _hasHydrated: false,
      setHasHydrated: (hasHydrated) => set({ _hasHydrated: hasHydrated }),

      activeTab: NIL,
      tabs: [{ id: NIL, title: "" }],
      setActiveTab: (id) => set({ activeTab: id }),
      addTab: (id) => set((state) => ({ tabs: [...state.tabs, { id, title: "" }] })),
      removeTab: (id) => set((state) => ({ tabs: state.tabs.filter((tab) => tab.id !== id) }))
    }), {
    name: 'xeid',
    version: 0,
    storage,
    onRehydrateStorage: () => (state) => {
      if (!state) return
      state.setHasHydrated(true)
    }
  })
)



