import { React } from "../../deps.ts";

export default function Minimize({ className }: { className?: string }) {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 16 16"
      xmlns="http://www.w3.org/2000/svg"
      fill="currentColor"
      className={className}
    >
      <path d="M14 8v1H3V8h11z" />
    </svg>
  );
}
