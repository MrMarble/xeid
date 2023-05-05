import React from "react";
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./styles.ts";

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
