import type { editor } from "monaco-editor";
import { useCallback, useRef, useState } from "react";
import { Panel, PanelGroup, PanelResizeHandle } from "react-resizable-panels";

import { evaluate } from "@/commands";
import { Editor } from "@/components/UI/atoms";
import { useDebounce } from "@/hooks";
import { useRunStore } from "@/store/store";

export default function EditorView() {
  const editorRef = useRef<editor.IStandaloneCodeEditor | null>(null);
  const [code, setCode] = useState("");
  const [result, setResult] = useState("");

  const { activeTab } = useRunStore((state) => ({
    activeTab: state.activeTab,
  }));

  const onChange = (value: string | undefined) => {
    setCode(value ?? "");
  };

  const onMount = (editor: editor.IStandaloneCodeEditor) => {
    editor.focus();
  };

  const callEvaluate = useCallback(async () => {
    if (!code) {
      return;
    }

    try {
      const evaluated = await evaluate(code);
      setResult(evaluated);
    } catch (error) {
      console.error(error);
      if (typeof error === "string") {
        setResult(error.replace(/\s+at.+/gm, ""));
      }
    }
  }, [code]);

  useDebounce(callEvaluate, 300, [code]);

  return (
    <PanelGroup autoSaveId="layout" direction="horizontal">
      <Panel defaultSize={60}>
        <Editor
          key="editor"
          onChange={onChange}
          value={code}
          path={activeTab}
          onMount={onMount}
          ref={editorRef}
        />
      </Panel>
      <PanelResizeHandle className="flex w-2 justify-center">
        <div className="h-full w-px bg-border"></div>
      </PanelResizeHandle>
      <Panel>
        <Editor
          key="output"
          value={result}
          path={`${activeTab}/compiled`}
          readOnly
        />
      </Panel>
    </PanelGroup>
  );
}
