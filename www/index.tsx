import React from "react";
import { createRoot } from "react-dom/client";
import { setup, strict } from "twind";

import App from "./App.tsx";

setup({
  mode: strict,
  hash: true,
  theme: {
    extend: {
      colors: {
        background: "#282c34",
        backgroundAlt: "#21252b",
        border: "#3e4452",
        foreground: "#c7ccd6",
        titlebar: "#6b717d",
      },
    },
  },
});

const root = createRoot(document.getElementById("root") as HTMLElement);
root.render(<App />);

if (!IS_PRODUCTION) {
  new EventSource("/esbuild").addEventListener(
    "change",
    () => location.reload(),
  );
}

declare global {
  // deno-lint-ignore no-var
  var IS_PRODUCTION: boolean;
}
