import React, { useEffect } from "react";
import {
  Editor as BaseEditor,
  EditorProps,
  loader,
  Monaco,
} from "@monaco-editor/react";
import OneDarkTheme from "../themes/onedark.json" assert { type: "json" };
import type { editor } from "https://esm.sh/v117/monaco-editor@0.37.1/esm/vs/editor/editor.api.js";

interface IEditorProps extends
  Pick<
    EditorProps,
    "onChange" | "value" | "path" | "language" | "className" | "onMount"
  > {
  readOnly?: boolean;
}

const Editor = React.forwardRef<editor.IStandaloneCodeEditor, IEditorProps>((
  { onChange, value, language, readOnly, className, path, onMount },
  ref,
) => {
  const handleMount = (
    editor: editor.IStandaloneCodeEditor,
    monaco: Monaco,
  ) => {
    if (ref) {
      if (typeof ref === "function") {
        ref(editor);
      } else {
        ref.current = editor;
      }
    }
    if (onMount) {
      onMount(editor, monaco);
    }
  };

  useEffect(() => {
    const init = async () => {
      const monaco = await loader.init();
      monaco.editor.defineTheme(
        "OneDark",
        OneDarkTheme as editor.IStandaloneThemeData,
      );
    };

    init();
  }, []);

  return (
    <BaseEditor
      onChange={onChange}
      value={value}
      language={language}
      theme="OneDark"
      className={className}
      path={path}
      options={{
        minimap: { enabled: false },
        wordWrap: "on",
        bracketPairColorization: {
          enabled: true,
        },
        scrollbar: {
          vertical: "hidden",
        },
        hideCursorInOverviewRuler: true,
        inlayHints: {
          enabled: "on",
        },
        readOnly,
        renderLineHighlight: "none",
        lineNumbers: "on",
        folding: false,
        lineNumbersMinChars: 3,
        overviewRulerLanes: 0,
        "semanticHighlighting.enabled": true,
      }}
      onMount={handleMount}
    />
  );
});

export default Editor;
