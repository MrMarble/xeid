import { useState } from "react";

interface EditableLabelProps {
  text: string;
  onChange: (text: string) => void;
}

export default function EditableLabel({ text, onChange }: EditableLabelProps) {
  const [isInput, setIsInput] = useState(false);

  const updateState = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      onChange((event?.target as HTMLInputElement).value);
      setIsInput(false);
    }
  };

  return isInput ? (
    <input
      type="text"
      className="w-full border-0 bg-transparent outline-none"
      onBlur={() => setIsInput(false)}
      onKeyDown={updateState}
      autoFocus
    />
  ) : (
    <div
      className="flex h-full w-full items-center border-0 bg-transparent outline-none"
      onDoubleClick={() => {
        setIsInput(true);
      }}
    >
      <span>{text}</span>
    </div>
  );
}
