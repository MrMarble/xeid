import React, { useEffect, useState } from "https://esm.sh/react@18";
import { setup, strict, tw } from "https://cdn.skypack.dev/twind";
import Editor, { loader } from "https://esm.sh/@monaco-editor/react";
import { invoke } from "https://esm.sh/@tauri-apps/api/tauri";
import OneDarkTheme from "./public/theme.json" assert { type: "json" };
import { editor } from "https://esm.sh/v117/monaco-editor@0.37.1/esm/vs/editor/editor.api";
import { useDebounce } from "https://esm.sh/react-use";

setup({
  mode: strict,
  hash: true,
  theme: {
    extend: {
      colors: {
        background: "#282c34",
        border: "#3e4452",
      },
    },
  },
});

export default function App() {
  const [state, setState] = useState<string | undefined>(`const limit = 15;
let count = 1;
Array(limit).fill(0).reduce((acc, _, index) => {
  const spaces = ' '.repeat(
    Math.abs(limit - count) / 2
  );
  const stars = '*'.repeat(count) + '\\n';
  index >= Math.floor(limit / 2)
    ? count -= 2
    : count += 2;
  return \`\${acc}\${spaces}\${stars}\`;
}, '\\n');`);
  const [compiled, setCompiled] = useState<string | undefined>("");
  const updateState = (value: string | undefined) => {
    setState(value);
  };

  useDebounce(
    () => {
      invoke<Array<{ start: number; output: string }>>("evaluate", {
        javascript: state,
      }).then((result) => {
        console.log(result);
        let parsed = "";
        let lines = 0;
        result.forEach((line) => {
          parsed += "\n".repeat(line.start - lines) + line.output +
            "\n";
          lines = line.start + 1;
        });
        console.log(parsed.trimEnd());
        setCompiled(parsed.trimEnd());
      });
    },
    500,
    [state],
  );

  useEffect(() => {
    loader.init().then((monaco) => {
      monaco.editor.defineTheme(
        "OneDark",
        OneDarkTheme as editor.IStandaloneThemeData,
      );
    });
  }, []);

  return (
    <main className={tw`h-screen w-screen bg-background flex overflow-hidden`}>
      <div className={tw`w-2/3 border-r border-border`}>
        <Editor
          key="typescript"
          onChange={updateState}
          value={state}
          language="typescript"
          theme="OneDark"
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
          }}
        />
      </div>
      <div className={tw`w-1/3 px-3`}>
        <Editor
          key="compiled"
          value={compiled}
          language="javascript"
          theme="OneDark"
          options={{
            minimap: { enabled: false },
            wordWrap: "on",
            bracketPairColorization: {
              enabled: true,
            },
            scrollbar: {
              vertical: "hidden",
            },
            readOnly: true,
            renderLineHighlight: "none",
            hideCursorInOverviewRuler: true,
          }}
        />
      </div>
    </main>
  );
}
