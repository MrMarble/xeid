import { React } from "../../deps.ts";

export default function Maximize({ className }: { className?: string }) {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 16 16"
      xmlns="http://www.w3.org/2000/svg"
      fill="currentColor"
      className={className}
    >
      <path d="M3 3v10h10V3H3zm9 9H4V4h8v8z" />
    </svg>
  );
}
