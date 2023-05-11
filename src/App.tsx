import { Tabs } from "@components/UI/molecules";
import { TitleBar } from "@components/UI/organisms";
import { useEffect } from "react";

import { close_splashscreen } from "./commands.ts";
import { EditorView } from "./components/views/index.ts";
import { useRunStore } from "./store/store.ts";

export default function App() {
  const hasHydrated = useRunStore((state) => state._hasHydrated);
  const [tabs, addTab] = useRunStore((state) => [state.tabs, state.addTab]);
  const [activeTab, setActiveTab] = useRunStore((state) => [
    state.activeTab,
    state.setActiveTab,
  ]);

  const onTabChange = (id: string) => {
    setActiveTab(id);
  };

  const onNewTab = (id: string) => {
    setActiveTab(id);
    addTab(id);
  };

  useEffect(() => {
    if (hasHydrated) {
      setTimeout(() => {
        close_splashscreen();
      }, 100);
    }
  }, [hasHydrated]);

  return (
    <main
      className="flex h-screen flex-col bg-background"
      onContextMenu={(event) => {
        if (import.meta.env.PROD) {
          event.preventDefault();
          return false;
        }
      }}
    >
      {hasHydrated && (
        <>
          <TitleBar>
            <Tabs
              initialTabs={tabs}
              initialActiveTab={activeTab}
              onChange={onTabChange}
              onNewTab={onNewTab}
            />
          </TitleBar>
          <EditorView />
        </>
      )}
    </main>
  );
}
