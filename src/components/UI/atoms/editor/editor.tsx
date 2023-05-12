import MonacoEditor, {
  type EditorProps as MonacoEditorProps,
  type Monaco,
} from "@monaco-editor/react";
import { type editor } from "monaco-editor";
import { forwardRef } from "react";

import { OneDark } from "../../../../themes";

interface EditorProps
  extends Pick<
    MonacoEditorProps,
    "path" | "onChange" | "onMount" | "value" | "defaultValue"
  > {
  readOnly?: boolean;
  theme?: "OneDark" | "vs-dark" | "light";
}

const Editor = forwardRef<editor.IStandaloneCodeEditor, EditorProps>(
  (
    {
      readOnly,
      theme = "OneDark",
      path,
      onChange,
      onMount,
      value,
      defaultValue,
    },
    ref
  ) => {
    const onBeforeMount = (monaco: Monaco) => {
      monaco.editor.defineTheme("OneDark", OneDark);
    };

    const handleMount = (
      editor: editor.IStandaloneCodeEditor,
      monaco: Monaco
    ) => {
      if (onMount) {
        onMount(editor, monaco);
      }
      if (ref) {
        if (typeof ref === "function") {
          ref(editor);
        } else {
          ref.current = editor;
        }
      }
    };

    const defaultOptions: editor.IStandaloneEditorConstructionOptions = {
      minimap: {
        enabled: false,
      },
      scrollbar: {
        vertical: "hidden",
      },
      hideCursorInOverviewRuler: true,
      padding: {
        top: 10,
      },
      folding: false,
      lineNumbersMinChars: 3,
      scrollBeyondLastLine: false,
      overviewRulerLanes: 0,
      renderLineHighlight: "none",
      "semanticHighlighting.enabled": true,
      wordWrap: "on",
      bracketPairColorization: {
        enabled: true,
      },
      fontLigatures: true,
    };

    return (
      <MonacoEditor
        beforeMount={onBeforeMount}
        onMount={handleMount}
        onChange={onChange}
        theme={theme}
        path={path}
        loading={<div></div>}
        value={value}
        defaultValue={defaultValue}
        options={{ ...defaultOptions, readOnly }}
        defaultLanguage="typescript"
      />
    );
  }
);

export default Editor;
