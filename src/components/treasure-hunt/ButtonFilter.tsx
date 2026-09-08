interface ButtonFilterProps {
  label: string;
  active: boolean;
  onClick: () => void;
}

/** Une puce de filtre : 44 px de haut, état enfoncé annoncé par `aria-pressed`. */
export default function ButtonFilter({ label, active, onClick }: ButtonFilterProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={`min-h-11 px-4 rounded-lg text-base font-medium transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-green-700 ${
        active ? "bg-green-800 text-white" : "bg-white border border-gray-300 text-gray-700 hover:bg-gray-50"
      }`}
    >
      {label}
    </button>
  );
}
