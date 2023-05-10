import { Button, EditableLabel, Icon } from "@components/UI/atoms";
import { twMerge } from "tailwind-merge";

interface TabProps extends ITab {
  active?: boolean;
  onClose?: () => void;
  onClick?: () => void;
  onDoubleClick: (text: string) => void;
  canClose?: boolean;
}

export interface ITab {
  title: string;
  id: string;
}

export default function Tab({
  title = "",
  onClose,
  onClick,
  active,
  canClose,
  onDoubleClick,
}: TabProps) {
  return (
    <div
      className={twMerge(
        "group flex h-full w-44 cursor-pointer flex-nowrap items-center justify-between border-b border-l border-border bg-background px-2 pt-0.5 text-foreground transition-colors",
        active && "-mb-0.5 border-b-0 pt-0",
        !active && "hover:bg-border"
      )}
      onClick={onClick}
    >
      <div className="flex h-full w-32 items-center overflow-hidden overflow-ellipsis whitespace-nowrap text-xs text-foreground">
        <span className="mr-2 flex h-full items-center">❯</span>
        <EditableLabel text={title} onChange={onDoubleClick} />
      </div>

      {canClose && (
        <Button
          className={twMerge(
            "invisible h-5 w-5 rounded p-1 group-hover:visible",
            active && "visible"
          )}
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            onClose?.();
          }}
        >
          <Icon
            name="close"
            className="h-3 w-3 text-titlebar group-hover:text-white"
          />
        </Button>
      )}
    </div>
  );
}
