import { invoke } from "@tauri-apps/api/tauri";
import type { editor } from "monaco-editor";

export async function evaluate(code: string) {
  const result = await invoke<[[number, string]]>("evaluate", {
    javascript: code,
  });
  console.log({ result });
  let lines = 0;
  let text = "";
  for (let i = 0; i < result.length; i++) {
    text += "\n".repeat(Math.abs(lines - result[i][0]) - 1) + result[i][1];
    lines += Math.abs(lines - result[i][0]) - 1;
  }
  return text;
}

export async function close_splashscreen(): Promise<never> {
  return await invoke("close_splashscreen");
}

export async function lint(code: string): Promise<Array<editor.IMarkerData>> {
  return await invoke<Array<editor.IMarkerData>>("lint", { javascript: code });
}

export function isLintError(error: unknown): error is editor.IMarkerData {
  if (typeof error !== "object" || error === null) {
    return false;
  }
  return (
    "startLineNumber" in error && "endLineNumber" in error && "message" in error
  );
}
