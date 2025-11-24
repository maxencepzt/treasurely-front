import { useNavigate } from "react-router";
import { faChevronLeft } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

interface BackButtonProps {
  variant?: "light" | "dark";
}

/**
 * Bouton de retour arrière réutilisable
 * @param variant - "light" pour fond clair (texte sombre), "dark" pour fond sombre (texte clair)
 */
export default function BackButton({ variant = "dark" }: BackButtonProps) {
  const navigate = useNavigate();

  const baseClasses = "w-10 h-10 rounded-full flex items-center justify-center transition-colors cursor-pointer";
  const variantClasses = variant === "light"
    ? "bg-white/90 hover:bg-white text-gray-700 shadow-md"
    : "bg-gray-800/70 hover:bg-gray-800 text-white";

  return (
    <button
      type="button"
      className={`${baseClasses} ${variantClasses}`}
      onClick={() => navigate(-1)}
      aria-label="Retour"
      title="Retour à la page précédente"
    >
      <FontAwesomeIcon icon={faChevronLeft} className="text-xl" />
    </button>
  );
}


