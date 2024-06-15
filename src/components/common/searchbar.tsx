import { MagnifyingGlass } from "@phosphor-icons/react";

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

const Searchbar = ({
  value,
  gap = 10,
  onChange,
  height = 44,
  placeholder,
  iconSize = 16,
  maxWidth = 420,
  borderWeight = 1,
}: SearchbarProps) => {
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
        type="text"
        value={value}
        onChange={onChange && ((e) => onChange(e.target.value))}
        placeholder={placeholder || "Search for tokens, creator and more"}
      />
    </div>
  );
};

export default Searchbar;
