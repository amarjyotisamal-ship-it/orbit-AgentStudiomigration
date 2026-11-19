import { useEffect } from "react";

export function useKeyboardShortcuts({ onSearch, onEscape }) {
  useEffect(() => {
    function handleKeyDown(e) {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        onSearch?.();
      } else if (e.key === "Escape") {
        onEscape?.();
      }
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onSearch, onEscape]);
}
