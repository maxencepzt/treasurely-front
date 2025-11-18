import type {ReactNode} from "react";

export default function THButton({ onClick, children }: { onClick: () => void; children: ReactNode }) {
  return (
    <button
      type="button"
      className="w-full mt-6 mb-4 py-3 px-6 rounded-lg bg-green-700 text-white text-lg font-semibold hover:bg-green-800 transition-colors shadow-lg cursor-pointer"
      onClick={onClick}
    >
      {children}
    </button>
  );
}
