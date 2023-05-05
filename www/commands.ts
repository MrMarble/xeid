import { invoke } from "tauri-apps/api/tauri";

export async function evaluate(code: string) {
  return await invoke<string>("evaluate", { javascript: code });
}

export async function close_splashscreen(): Promise<never> {
  return await invoke("close_splashscreen");
}
