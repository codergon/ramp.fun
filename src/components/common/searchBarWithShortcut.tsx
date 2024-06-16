import { useEffect, useRef, useState } from "react";
import { MagnifyingGlass } from "@phosphor-icons/react";
import { isMobile } from "react-device-detect";

interface SearchbarProps {
  gap?: number;
  value?: string;
  height?: number;
  maxWidth?: number;
  iconSize?: number;
  placeholder?: string;
  borderWeight?: number;
  onChange?: (value: string) => void;
}

const SearchbarWithShortcut = ({
  value,
  gap = 10,
  onChange,
  height = 44,
  placeholder,
  iconSize = 16,
  maxWidth = 420,
  borderWeight = 1,
}: SearchbarProps) => {
  const ref = useRef<HTMLInputElement>(null);
  const [focused, setFocused] = useState(false);

  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      const activeElement = document?.activeElement?.tagName.toLowerCase();

      if (event.key === "/" && activeElement !== "input") {
        event.preventDefault();
        ref?.current?.focus();
      } else if (event.key === "Escape" && focused) {
        event.preventDefault();
        ref?.current?.blur();
      }
    };
    window.addEventListener("keydown", handleKeyPress);
    return () => {
      window.removeEventListener("keydown", handleKeyPress);
    };
  }, [focused]);
  return (
    <div
      className="search-bar"
      style={{
        gap: `${gap}px`,
        height: `${height}px`,
        maxWidth: `${maxWidth}px`,
        borderWidth: `${borderWeight}px`,
      }}
    >
      <div className="search-bar__icon">
        <MagnifyingGlass size={iconSize} weight="bold" />
      </div>
      <input
        ref={ref}
        type="text"
        value={value}
        onChange={onChange && ((e) => onChange(e.target.value))}
        placeholder={placeholder || "Search for tokens, creators and more"}
      />

      {!isMobile && (
        <div className="search-bar__shortcut">
          {!focused ? <span>/</span> : <span>ESC</span>}
        </div>
      )}
    </div>
  );
};

export default SearchbarWithShortcut;
