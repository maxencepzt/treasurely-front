import {type ReactNode} from "react";

interface ButtonFilterProps {
  label: ReactNode;
  active: boolean;
  onClick: () => void;
  className?: string;
  emoji?: ReactNode;
}

export default function ButtonFilter({ label, active, onClick, className, emoji }: ButtonFilterProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`px-3 py-1.5 text-sm rounded-lg font-medium transition-all ${
        active ? "bg-green-600 text-white shadow-sm" : "bg-gray-100 text-gray-600 hover:bg-gray-200"
      } ${className || ""}`}
    >
      {emoji && <span className="inline-block mr-1">{emoji}</span>}
      {label}
    </button>
  );
};
