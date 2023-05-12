import type { Monaco } from "@monaco-editor/react";
import { fs } from "@tauri-apps/api";
import type { editor } from "monaco-editor";
import { useCallback, useRef, useState } from "react";
import { Panel, PanelGroup, PanelResizeHandle } from "react-resizable-panels";
import { useUnmount, useUpdateEffect } from "react-use";

import { evaluate } from "@/commands";
import { Editor } from "@/components/UI/atoms";
import { useDebounce } from "@/hooks";
import { useRunStore } from "@/store/store";

interface Props {
  onMount: () => void;
}

const saveCode = async (code: string | undefined, activeTab: string) => {
  if (!code) return;
  await fs.writeTextFile(activeTab, code, {
    dir: fs.BaseDirectory.AppData,
  });
};

const loadCode = async (activeTab: string) => {
  const file = await fs.readTextFile(activeTab, {
    dir: fs.BaseDirectory.AppData,
  });

  return file;
};

export default function EditorView({ onMount }: Props) {
  const editorRef = useRef<editor.IStandaloneCodeEditor | null>(null);
  const resultRef = useRef<editor.IStandaloneCodeEditor | null>(null);

  const [code, setCode] = useState<string | undefined>();
  const activeTab = useRunStore((state) => state.activeTab);

  const onChange = (value: string | undefined) => {
    setCode(value ?? "");
  };

  const handleMount = (
    editor: editor.IStandaloneCodeEditor,
    monaco: Monaco
  ) => {
    editor.focus();

    loadCode(activeTab)
      .then((code) => {
        editor.setValue(code);
      })
      .catch(console.error)
      .finally(onMount);

    monaco.editor.onDidCreateModel(async (model) => {
      if (model.uri.path.includes("compiled")) return;
      try {
        const code = await loadCode(model.uri.path.slice(1));
        model.setValue(code);
      } catch (error) {
        console.error(error);
      }
    });
  };

  const callEvaluate = useCallback(async () => {
    if (!code) {
      return;
    }

    try {
      await saveCode(code, activeTab);
      const evaluated = await evaluate(code);
      resultRef.current?.setValue(evaluated);
    } catch (error) {
      console.error(error);
      if (typeof error === "string") {
        resultRef.current?.setValue(error.replace(/\s+at.+/gm, ""));
      }
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [code]);

  useDebounce(callEvaluate, 300, [code]);

  useUnmount(async () => {
    await saveCode(code, activeTab);
  });

  useUpdateEffect(() => {
    editorRef.current?.focus();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeTab]);

  return (
    <PanelGroup autoSaveId="layout" direction="horizontal">
      <Panel defaultSize={60}>
        <Editor
          key="editor"
          onChange={onChange}
          path={activeTab}
          onMount={handleMount}
          ref={editorRef}
        />
      </Panel>
      <PanelResizeHandle className="flex w-2 justify-center">
        <div className="h-full w-px bg-border"></div>
      </PanelResizeHandle>
      <Panel>
        <Editor
          key="output"
          path={`${activeTab}/compiled`}
          ref={resultRef}
          readOnly
        />
      </Panel>
    </PanelGroup>
  );
}
