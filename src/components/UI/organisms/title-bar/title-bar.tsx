import { os } from "@tauri-apps/api";
import type { OsType } from "@tauri-apps/api/os";
import { useEffect, useState } from "react";

import WindowControls from "../../molecules/window-controls/window-controls.tsx";

export default function TitleBar({ children }: { children: React.ReactNode }) {
  const [osType, setOsType] = useState<OsType | undefined>();
  const isMacOS = osType === "Darwin";
  const barHeight = isMacOS ? "h-8" : "h-10";

  useEffect(() => {
    const init = async () => {
      setOsType(await os.type());
    };

    init();
  }, []);
  return (
    <header
      data-tauri-drag-region
      className={`flex ${barHeight} w-full select-none overflow-hidden bg-backgroundAlt `}
    >
      {isMacOS ? (
        <div className="w-20"></div>
      ) : (
        <div className="pointer-events-none flex h-full select-none items-center border-b border-border px-2">
          <img
            src="/32x32.png"
            className="flex h-8 w-8 object-contain"
            alt="XEID logo"
          />
        </div>
      )}
      {children}
      {!isMacOS && <WindowControls />}
    </header>
  );
}
