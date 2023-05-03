import { css, React, tw } from "../../../deps.ts";
import { Button } from "./mod.ts";
import { Close } from "../../icons/mod.ts";

interface TabProps extends ITab {
  active?: boolean;
  onClose?: () => void;
  onClick?: () => void;
  onDoubleClick?: () => void;
  canClose?: boolean;
}

export interface ITab {
  title: string;
  id: string;
}

const style = css({
  "&+&": { "border-left": "none" },
});

export default function Tab(
  { title = "", onClose, onClick, active, canClose, onDoubleClick }: TabProps,
) {
  return (
    <div
      className={tw(
        style,
        `w-44 border(border 2 b-0 t-0) bg-background px-2 pt-0.5 text-foreground flex justify-between transition-colors content-center flex-wrap group`,
        active && "-mb-0.5 pt-0",
        !active && "hover:bg-border",
      )}
      onClick={onClick}
      onDoubleClick={(e) => onDoubleClick?.()}
    >
      <p
        className={tw`text-xs h-5 text-foreground w-32 overflow-ellipsis overflow-hidden whitespace-nowrap`}
      >
        <span className={tw`mr-2`}>❯</span>
        {title}
      </p>

      {canClose && (
        <Button
          className={tw(
            `rounded h-5 w-5 p-1 invisible group-hover:visible`,
            active && "visible",
          )}
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            onClose?.();
          }}
        >
          <Close
            className={tw`text-titlebar group-hover:text-white w-3 h-3`}
          />
        </Button>
      )}
    </div>
  );
}
