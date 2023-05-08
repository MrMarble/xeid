import MonacoEditor, {
  type Monaco,
  type EditorProps as MonacoEditorProps,
} from "@monaco-editor/react";
import { OneDark } from "../../../themes";
import { type editor } from "monaco-editor";
import { forwardRef } from "react";

interface EditorProps
  extends Pick<MonacoEditorProps, "path" | "onChange" | "onMount" | "value"> {
  readOnly?: boolean;
  theme?: "OneDark" | "vs-dark" | "light";
}

const Editor = forwardRef<editor.IStandaloneCodeEditor, EditorProps>(
  ({ readOnly, theme = "OneDark", path, onChange, onMount, value }, ref) => {
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
        value={value}
        options={{ ...defaultOptions, readOnly }}
        defaultLanguage="typescript"
      />
    );
  }
);

export default Editor;
