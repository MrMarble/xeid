import { Button, Icon } from "@components/UI/atoms";
import { appWindow } from "@tauri-apps/api/window";
import { useEffect, useState } from "react";

export default function WindowControls() {
  const [isMaximized, setIsMaximized] = useState(false);

  const handleClose = () => {
    appWindow.close();
  };

  const handleMaximize = () => {
    appWindow.toggleMaximize();
  };

  const handleMinimize = () => {
    appWindow.minimize();
  };

  useEffect(() => {
    let clearHandler: () => void;
    const handleResize = async () => {
      clearHandler = await appWindow.onResized(async () => {
        setIsMaximized(await appWindow.isMaximized());
      });
    };

    handleResize();
    return () => {
      clearHandler?.();
    };
  }, []);

  return (
    <div
      className="flex h-full justify-end border-b border-border"
      data-testid="window-controls"
    >
      <Button onClick={handleMinimize} className="h-full px-3" name="minimize">
        <Icon
          name="minimize"
          className="text-titlebar group-hover:text-white"
        />
      </Button>
      <Button onClick={handleMaximize} className="h-full px-3" name="maximize">
        <Icon
          name={isMaximized ? "restore" : "maximize"}
          className="text-titlebar group-hover:text-white"
        />
      </Button>
      <Button
        onClick={handleClose}
        className="h-full px-3 hover:bg-red-500"
        name="close"
      >
        <Icon name="close" className="text-titlebar group-hover:text-white" />
      </Button>
    </div>
  );
}
