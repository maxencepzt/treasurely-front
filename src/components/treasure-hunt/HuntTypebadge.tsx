import type {ReactNode} from "react";

export default function HuntTypeBadge({ children }: { children: ReactNode }) {
  return (
    <span className="whitespace-nowrap bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium border border-green-200">
      {children}
    </span>
  );
}