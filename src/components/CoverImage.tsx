import type { ReactNode } from "react";

import { API_CONFIG } from "../config/api";

interface CoverImageProps {
  type: "team" | "treasure-hunt";
  id: number;
  alt: string;
  backButton?: ReactNode;
  actionButton?: ReactNode;
}

/**
 * Composant pour afficher une image de couverture en haut de page
 * Utilisé pour les équipes et les chasses au trésor
 */
export default function CoverImage({ type, id, alt, backButton, actionButton }: CoverImageProps) {
  const imageUrl = type === "team"
    ? `${API_CONFIG.baseUrl}/api/teams/${id}/picture`
    : `${API_CONFIG.baseUrl}/api/treasure_hunts/${id}/picture`;

  return (
    <div className="relative">
      <img
        src={imageUrl}
        alt={alt}
        className="w-full h-64 object-cover"
        onError={(e) => {
          (e.target as HTMLImageElement).src = "/user_profile_picture_default.png";
        }}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />

      {/* Bouton retour */}
      {backButton && (
        <div className="absolute top-4 left-4">
          {backButton}
        </div>
      )}

      {/* Bouton d'action (éditer, etc.) */}
      {actionButton && (
        <div className="absolute top-4 right-4">
          {actionButton}
        </div>
      )}
    </div>
  );
}

