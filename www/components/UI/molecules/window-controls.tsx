import React, { useEffect, useState } from "react";
import { tw } from "twind";
import { appWindow } from "tauri-apps/api/window";
import { Button, Icon } from "../atoms/mod.ts";

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
      clearHandler();
    };
  }, []);

  return (
    <div className={tw`h-full flex justify-end border(border 0 b-2 t-0)`}>
      <Button onClick={handleMinimize} className={tw`h-full`}>
        <Icon
          name="minimize"
          className={tw`text-titlebar group-hover:text-white`}
        />
      </Button>
      <Button onClick={handleMaximize} className={tw`h-full`}>
        <Icon
          name={isMaximized ? "restore" : "maximize"}
          className={tw`text-titlebar group-hover:text-white`}
        />
      </Button>
      <Button
        onClick={handleClose}
        className={tw`hover:bg-red-500 h-full`}
      >
        <Icon
          name="close"
          className={tw`text-titlebar group-hover:text-white`}
        />
      </Button>
    </div>
  );
}
