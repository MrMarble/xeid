import React from "react";
import { tw } from "twind";
import WindowControls from "../molecules/window-controls.tsx";

export default function TitleBar({ children }: { children: React.ReactNode }) {
  return (
    <div
      data-tauri-drag-region
      className={tw`bg-backgroundAlt flex w-full select-none overflow-hidden`}
    >
      <div
        className={tw`flex px-2 items-center h-full border(border 0 b-2 t-0) pointer-events-none select-none`}
      >
        <img
          src="/public/32x32.png"
          className={tw`flex h-5 w-5 object-contain `}
        />
      </div>
      {children}
      <WindowControls />
    </div>
  );
}
