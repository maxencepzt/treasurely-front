import { useSelector } from "react-redux";

import { API_CONFIG } from "../config/api";
import type { rootState } from "../store";

interface ProfilePictureProps {
  type: "user" | "team";
  id: number;
  alt?: string;
  size?: "sm" | "md" | "lg" | number;
}

function ProfilePicture({ type, id, alt, size = "md" }: ProfilePictureProps) {
  // Gestion de la taille
  const getSizeStyle = () => {
    if (typeof size === "number") {
      return { width: size, height: size, borderRadius: '50%' };
    }
    return undefined;
  };

  const getSizeClass = () => {
    if (typeof size === "string") {
      const sizeMap = {
        sm: "w-8 h-8",
        md: "w-12 h-12",
        lg: "w-24 h-24",
      };
      return sizeMap[size];
    }
    return "";
  };

  const sizeStyle = getSizeStyle();
  const sizeClass = getSizeClass();

  // Construction de l'URL en fonction du type ; la version change à chaque photo envoyée ou
  // supprimée, sinon le navigateur garderait l'ancienne image à la même adresse
  const version = useSelector((state: rootState) => state.pictures.version);
  const pictureUrl = `${API_CONFIG.baseUrl}/api/${type === "user" ? "users" : "teams"}/${id}/picture${version ? `?v=${version}` : ""}`;

  // Alt text par défaut
  const altText = alt || (type === "user" ? "Photo de profil" : "Photo de l'équipe");

  return (
    <img
      src={pictureUrl}
      alt={altText}
      className={`${sizeClass} rounded-full object-cover border-2 border-gray-200`}
      style={sizeStyle}
      onError={(e) => {
        (e.target as HTMLImageElement).src = "/user_profile_picture_default.png";
      }}
    />
  );
}

export default ProfilePicture;

