const icons = {
  add: <path d="M14 7v1H8v6H7V8H1V7h6V1h1v6h6z" />,
  close: (
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M7.116 8l-4.558 4.558.884.884L8 8.884l4.558 4.558.884-.884L8.884 8l4.558-4.558-.884-.884L8 7.116 3.442 2.558l-.884.884L7.116 8z"
    />
  ),
  maximize: <path d="M3 3v10h10V3H3zm9 9H4V4h8v8z" />,
  minimize: <path d="M14 8v1H3V8h11z" />,
  restore: (
    <g>
      <path d="M3 5v9h9V5H3zm8 8H4V6h7v7z" />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M5 5h1V4h7v7h-1v1h2V3H5v2z"
      />
    </g>
  ),
};

interface IconProps {
  name: keyof typeof icons;
  className?: string;
}

export default function Icon({ name, className }: IconProps) {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 16 16"
      xmlns="http://www.w3.org/2000/svg"
      fill="currentColor"
      className={className}
    >
      {icons[name]}
    </svg>
  );
}
