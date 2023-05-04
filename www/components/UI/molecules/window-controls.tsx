import { appWindow, React, tw, useEffect, useState } from "../../../deps.ts";
import { Button } from "../atoms/mod.ts";
import { Close, Maximize, Minimize, Restore } from "../../icons/mod.ts";

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
        <Minimize className={tw`text-titlebar group-hover:text-white`} />
      </Button>
      <Button onClick={handleMaximize} className={tw`h-full`}>
        {isMaximized
          ? <Restore className={tw`text-titlebar group-hover:text-white`} />
          : <Maximize className={tw`text-titlebar group-hover:text-white`} />}
      </Button>
      <Button
        onClick={handleClose}
        className={tw`hover:bg-red-500 h-full`}
      >
        <Close className={tw`text-titlebar group-hover:text-white`} />
      </Button>
    </div>
  );
}
