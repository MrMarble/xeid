import { Tabs } from "@components/UI/molecules";
import { TitleBar } from "@components/UI/organisms";

import { close_splashscreen } from "./commands.ts";
import { EditorView } from "./components/views/index.ts";
import { useRunStore } from "./store/store.ts";

export default function App() {
  const hasHydrated = useRunStore((state) => state._hasHydrated);

  const onMount = () => {
    if (hasHydrated) {
      close_splashscreen();
    }
  };

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
            <Tabs />
          </TitleBar>
          <EditorView onMount={onMount} />
        </>
      )}
    </main>
  );
}
