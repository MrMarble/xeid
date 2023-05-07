import { useEffect, useRef, useState } from "react";
import Editor from "./components/Editor.tsx";
import { Panel, PanelGroup, PanelResizeHandle } from "react-resizable-panels";
import { close_splashscreen, evaluate, isLintError, lint } from "./commands.ts";
import { useDebounce, useStore } from "./hooks/mod.ts";
import TitleBar from "./components/UI/organisms/title-bar.tsx";
import Tabs from "./components/UI/molecules/tabs.tsx";
import { ITab } from "./components/UI/atoms/tab.tsx";
import type { Monaco } from "@monaco-editor/react/dist/index";
export default function App() {
  const [state, setState] = useState("");
  const [compiled, setCompiled] = useState("");
  const [storedTabs, setStoredTabs] = useState<Array<ITab>>();
  const [activeTab, setActiveTab] = useState("");
  const { get, set } = useStore();
  const editorRef = useRef<monaco.editor.IStandaloneCodeEditor>(null);
  const monacoRef = useRef<Monaco>(null);
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
      try {
        monacoRef.current?.editor.setModelMarkers(
          editorRef?.current?.getModel()!,
          "deno",
          []
        );
        const linted = await lint(state);
        if (linted.length) {
          console.log(linted);
          monacoRef.current?.editor.setModelMarkers(
            editorRef?.current?.getModel()!,
            "deno",
            linted
          );
        }
        const result = await evaluate(state);
        setCompiled(result);
        await set(["code", activeTab], state);
        await set(["compiled", activeTab], result);
      } catch (error) {
        console.error(error);
        if (Array.isArray(error) && isLintError(error?.[0])) {
          monacoRef.current?.editor.setModelMarkers(
            editorRef?.current?.getModel()!,
            "deno",
            error
          );
          setCompiled(
            "\n".repeat(error[0].startLineNumber - 1) + error[0].message
          );
        } else if (typeof error === "string") {
          setCompiled(error.replace(/\s*at.+/gm, ""));
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
        <Panel defaultSize={60} className="pt-3">
          <Editor
            key="editor"
            onChange={updateState}
            value={state}
            language="typescript"
            path={activeTab + ".ts"}
            ref={editorRef}
            onMount={(editor, monaco) => {
              editor.focus();
              monacoRef.current = monaco;
            }}
          />
        </Panel>
        <PanelResizeHandle className="flex w-2 justify-center">
          <div className="h-full w-px bg-border"></div>
        </PanelResizeHandle>
        <Panel className="pt-3">
          <Editor
            key="output"
            value={compiled}
            language="javascript"
            path={activeTab + ".compiled.ts"}
            readOnly
          />
        </Panel>
      </PanelGroup>
    </main>
  );
}
