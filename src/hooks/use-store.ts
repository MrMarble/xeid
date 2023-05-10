import { useEffect } from "react";
import { Store } from "tauri-plugin-store-api";

const DEFAULT_STORE = "xeid.dat";
const store = new Store(DEFAULT_STORE);

type storeKey = keyof StoreValue | ["code" | "compiled", ...string[]];

interface StoreValue {
  activeTab: string;
  tabs: Array<{ id: string; title: string }>;
}

export default function useStore() {
  useEffect(() => {
    return () => {
      store.save();
    };
  }, []);

  return {
    get: async <T extends storeKey>(key: T) => {
      let k: string;
      if (Array.isArray(key)) {
        k = key.join("_");
      } else {
        k = key;
      }

      return await store.get<
        T extends keyof StoreValue ? StoreValue[T] : string
      >(k);
    },
    set: async <T extends storeKey>(key: T, value: unknown) => {
      let k: string;
      if (Array.isArray(key)) {
        k = key.join("_");
      } else {
        k = key;
      }
      await store.set(k, value);
    },
    save: async () => await store.save(),
  };
}
