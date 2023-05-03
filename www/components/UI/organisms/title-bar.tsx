import { React, tw } from "../../../deps.ts";

import WindowControls from "../molecules/window-controls.tsx";

export default function TitleBar({ children }: { children: React.ReactNode }) {
  return (
    <div
      data-tauri-drag-region
      className={tw`bg-backgroundAlt flex justify-between w-full border(b border b-2) select-none`}
    >
      <div className={tw`flex`}>
        <img src="/public/32x32.png" className={tw`h-5 w-5 m-2`} />
        {children}
      </div>
      <WindowControls />
    </div>
  );
}
