import React from "react";
import { apply, tw } from "twind/css";

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement>;

export default function Button(
  { children, onClick, className, ...props }: ButtonProps,
) {
  return (
    <button
      onClick={onClick}
      className={tw(
        apply`p-2 hover:bg-border focus:outline-none transition-colors group`,
        className,
      )}
      {...props}
    >
      {children}
    </button>
  );
}
