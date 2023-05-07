import { twMerge } from "tailwind-merge";

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement>;

export default function Button({
  children,
  onClick,
  className,
  ...props
}: ButtonProps) {
  return (
    <button
      onClick={onClick}
      className={twMerge(
        "group p-2 transition-colors hover:bg-border focus:outline-none",
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
}
