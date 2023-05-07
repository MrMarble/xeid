import { useEffect } from "react";

export default function useDebounce(
  callback: () => void,
  delay: number,
  dependencies: Array<unknown> = []
) {
  useEffect(() => {
    const timeout = setTimeout(() => {
      callback();
    }, delay);

    return () => {
      clearTimeout(timeout);
    };
  }, dependencies);
}
