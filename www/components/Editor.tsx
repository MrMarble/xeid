import {
  editor,
} from "https://esm.sh/v117/monaco-editor@0.37.1/esm/vs/editor/editor.api";
import {
  Editor as BaseEditor,
  EditorProps,
  loader,
  React,
  useEffect,
} from "../deps.ts";
import OneDarkTheme from "../themes/onedark.json" assert { type: "json" };

interface IEditorProps extends
  Pick<
    EditorProps,
    "onChange" | "value" | "path" | "language" | "className"
  > {
  readOnly?: boolean;
}

function Editor(
  { onChange, value, language, readOnly, className, path }: IEditorProps,
) {
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
    />
  );
}

export default Editor;
