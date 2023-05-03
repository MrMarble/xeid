import { React } from "../../deps.ts";

export default function Restore({ className }: { className?: string }) {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 16 16"
      xmlns="http://www.w3.org/2000/svg"
      fill="currentColor"
      className={className}
    >
      <path d="M3 5v9h9V5H3zm8 8H4V6h7v7z" />
      <path
        fill-rule="evenodd"
        clip-rule="evenodd"
        d="M5 5h1V4h7v7h-1v1h2V3H5v2z"
      />
    </svg>
  );
}
