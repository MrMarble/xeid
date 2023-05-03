import { React, setup, strict } from "./deps.ts";
import * as colors from "https://cdn.skypack.dev/twind/colors";
import { createRoot } from "https://esm.sh/react-dom@18.2.0/client";

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
        ...colors,
      },
    },
  },
});

const root = createRoot(document.getElementById("root") as HTMLElement);
root.render(<App />);

if (!window.IS_PRODUCTION) {
  new EventSource("/esbuild").addEventListener(
    "change",
    () => location.reload(),
  );
}

declare global {
  interface Window {
    IS_PRODUCTION: boolean;
  }
}
