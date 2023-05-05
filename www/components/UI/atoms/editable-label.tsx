import React, { useState } from "react";
import { tw } from "twind";

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

  return isInput
    ? (
      <input
        type="text"
        className={tw`bg-transparent border-0 outline-none w-full`}
        onBlur={() => setIsInput(false)}
        onKeyDown={updateState}
        autoFocus
      />
    )
    : (
      <div
        className={tw`bg-transparent border-0 outline-none h-full w-full flex items-center`}
        onDoubleClick={() => {
          setIsInput(true);
        }}
      >
        <span>{text}</span>
      </div>
    );
}
