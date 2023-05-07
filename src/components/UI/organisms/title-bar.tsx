import WindowControls from "../molecules/window-controls.tsx";

export default function TitleBar({ children }: { children: React.ReactNode }) {
  return (
    <div
      data-tauri-drag-region
      className="flex h-10 w-full select-none overflow-hidden bg-backgroundAlt"
    >
      <div className="pointer-events-none flex h-full select-none items-center border-b border-border px-2">
        <img src="/32x32.png" className="flex h-8 w-8 object-contain" />
      </div>
      {children}
      <WindowControls />
    </div>
  );
}
