import React, { useEffect, useRef, useState } from "react";
import { css, tw } from "twind/css";
import Editor from "./components/Editor.tsx";
import { Panel, PanelGroup, PanelResizeHandle } from "./deps.ts";
import { close_splashscreen, evaluate } from "./commands.ts";
import { useDebounce, useStore } from "./hooks/mod.ts";
import TitleBar from "./components/UI/organisms/title-bar.tsx";
import Tabs from "./components/UI/molecules/tabs.tsx";
import { ITab } from "./components/UI/atoms/tab.tsx";
import { editor } from "https://esm.sh/v117/monaco-editor@0.37.1/esm/vs/editor/editor.api.js";

export default function App() {
  const [state, setState] = useState("");
  const [compiled, setCompiled] = useState("");
  const [storedTabs, setStoredTabs] = useState<Array<ITab>>();
  const [activeTab, setActiveTab] = useState("");
  const { get, set } = useStore();
  const editorRef = useRef<editor.IStandaloneCodeEditor>(null);
  const updateState = (value: string | undefined) => {
    setState(value ?? "");
  };

  useEffect(() => {
    (async () => {
      let tabs = await get("tabs");
      let activeTab = await get("activeTab");
      if (!tabs) {
        tabs = [{ id: "first", title: "" }];
      }
      if (!activeTab) {
        activeTab = tabs[0].id;
      }
      setStoredTabs(tabs);
      setActiveTab(activeTab);
      editorRef.current?.focus();
      setTimeout(() => {
        close_splashscreen();
      }, 100);
    })();
  }, []);

  useEffect(() => {
    editorRef.current?.focus();
  }, [activeTab]);

  useDebounce(
    async () => {
      if (!state) {
        return;
      }
      try {
        const result = await evaluate(state);
        setCompiled(result);
        await set(["code", activeTab + ""], state);
        await set(["compiled", activeTab + ""], result);
      } catch (error) {
        setCompiled(error.split("\n")[0]);
      }
    },
    300,
    [state],
  );

  return (
    <main
      className={tw`bg-background flex flex-col h-screen`}
      onContextMenu={(event) => {
        if (IS_PRODUCTION) {
          event.preventDefault();
          return false;
        }
      }}
    >
      <TitleBar>
        {storedTabs && (
          <Tabs
            initialTabs={storedTabs}
            initialActiveTab={activeTab}
            onChange={async (_, activeTab) => {
              const code = await get(["code", activeTab + ""]);
              const compiled = await get(["compiled", activeTab + ""]);
              setState(code ?? "");
              setCompiled(compiled ?? "");
              setActiveTab(activeTab);
            }}
          />
        )}
      </TitleBar>
      <PanelGroup
        autoSaveId="layout"
        direction="horizontal"
      >
        <Panel defaultSize={60} className={tw`pt-3`}>
          <Editor
            key="editor"
            onChange={updateState}
            value={state}
            language="typescript"
            path={activeTab + ".ts"}
            ref={editorRef}
          />
        </Panel>
        <PanelResizeHandle
          className={tw`w-2 flex justify-center`}
        >
          <div className={tw`h-full w-[2px] bg-border`}></div>
        </PanelResizeHandle>
        <Panel className={tw`pt-3`}>
          <Editor
            key="output"
            value={compiled}
            language="javascript"
            path={activeTab + ".compiled.ts"}
            className={tw(
              css({
                ".monaco-editor-overlaymessage": { display: "none !important" },
              }),
            )}
            readOnly
          />
        </Panel>
      </PanelGroup>
    </main>
  );
}
