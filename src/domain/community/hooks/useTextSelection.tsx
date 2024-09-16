import { useState } from "react";

export const useTextSelection = (
  containerRef: React.RefObject<HTMLDivElement>
) => {
  const [selectedText, setSelectedText] = useState<string | null>(null);
  const [menuPosition, setMenuPosition] = useState<{
    top: number;
    left: number;
  } | null>(null);

  const handleTextSelection = () => {
    if (!containerRef.current) return;

    const selectedText = window.getSelection()?.toString();
    const containerRect = containerRef.current.getBoundingClientRect();

    if (selectedText && containerRect) {
      const rect = window.getSelection()?.getRangeAt(0).getBoundingClientRect();
      if (rect) {
        const isWithinContainer =
          rect.top >= containerRect.top &&
          rect.left >= containerRect.left &&
          rect.bottom <= containerRect.bottom &&
          rect.right <= containerRect.right;

        if (isWithinContainer) {
          setMenuPosition({
            top: rect.top - containerRect.top + rect.height + 10,
            left: rect.left - containerRect.left,
          });
          setSelectedText(selectedText);
        } else {
          setMenuPosition(null);
          setSelectedText(null);
        }
      }
    } else {
      setMenuPosition(null);
      setSelectedText(null);
    }
  };

  return { selectedText, menuPosition, setMenuPosition, handleTextSelection };
};
