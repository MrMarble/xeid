import { Tabs } from "@components/UI/molecules";
import { TitleBar } from "@components/UI/organisms";
import { useDebounce, useStore } from "@hooks";
import type { Monaco } from "@monaco-editor/react/dist/index";
import type { editor } from "monaco-editor";
import { useEffect, useRef, useState } from "react";
import { Panel, PanelGroup, PanelResizeHandle } from "react-resizable-panels";

import { close_splashscreen, evaluate, isLintError, lint } from "./commands.ts";
import { Editor } from "./components/UI/atoms";
import { ITab } from "./components/UI/molecules/tab/tab.tsx";

export default function App() {
  const [state, setState] = useState("");
  const [compiled, setCompiled] = useState("");
  const [storedTabs, setStoredTabs] = useState<Array<ITab>>();
  const [activeTab, setActiveTab] = useState("");
  const { get, set } = useStore();
  const editorRef = useRef<editor.IStandaloneCodeEditor | null>(null);
  const monacoRef = useRef<Monaco | null>(null);
  const updateState = (value: string | undefined) => {
    setState(value ?? "");
  };

  useEffect(() => {
    (async () => {
      let tabs = await get("tabs");
      let activeTab = await get("activeTab");
      if (!tabs) {
        tabs = [{ id: "first", title: "" }];
        await set(
          ["code", tabs[0].id],
          `/*
        * 👋 Bienvenido a RunTS 🚀
        *
        * Para comenzar, intente escribir algo de código
        *
        * Por ejemplo, aquí hay una función que devuelve una cadena:
        */
        const holaMundo = () => '¡Hola, Mundo! 🌎'
        
        // Cuando se llama a la función, el resultado se muestra a la derecha 👉
        holaMundo()`
        );
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

      const model = editorRef?.current?.getModel();
      if (!model) {
        return;
      }
      try {
        monacoRef.current?.editor.setModelMarkers(model, "deno", []);
        const linted = await lint(state);
        if (linted.length) {
          console.log(linted);
          monacoRef.current?.editor.setModelMarkers(model, "deno", linted);
        }
        const result = await evaluate(state);
        setCompiled(result);
        await set(["code", activeTab], state);
        await set(["compiled", activeTab], result);
      } catch (error) {
        console.error(error);
        if (Array.isArray(error) && isLintError(error?.[0])) {
          monacoRef.current?.editor.setModelMarkers(model, "deno", error);
          setCompiled(
            "\n".repeat(error[0].startLineNumber - 1) + error[0].message
          );
        } else if (typeof error === "string") {
          setCompiled(error.replace(/\s+at.+/gm, ""));
        }
      }
    },
    300,
    [state]
  );

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
      <PanelGroup autoSaveId="layout" direction="horizontal">
        <Panel defaultSize={60}>
          <Editor
            key="editor"
            onChange={updateState}
            value={state}
            path={activeTab + ".ts"}
            onMount={(editor) => {
              editor.focus();
            }}
            ref={editorRef}
          />
        </Panel>
        <PanelResizeHandle className="flex w-2 justify-center">
          <div className="h-full w-px bg-border"></div>
        </PanelResizeHandle>
        <Panel>
          <Editor
            key="output"
            value={compiled}
            path={activeTab + ".compiled.ts"}
            readOnly
          />
        </Panel>
      </PanelGroup>
    </main>
  );
}
