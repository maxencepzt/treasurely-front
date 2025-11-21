import { API_CONFIG } from "../../config/api";

interface TeamProfilePictureProps {
  teamId: number;
  alt?: string;
  size?: "sm" | "md" | "lg";
}

function TeamProfilePicture({ teamId, alt = "Photo de l'équipe", size = "md" }: TeamProfilePictureProps) {
  const sizeClasses = {
    sm: "w-8 h-8",
    md: "w-12 h-12",
    lg: "w-24 h-24",
  };

  const pictureUrl = `${API_CONFIG.baseUrl}/api/teams/${teamId}/picture`;

  return (
    <img
      src={pictureUrl}
      alt={alt}
      className={`${sizeClasses[size]} rounded-full object-cover border-2 border-gray-200`}
      onError={(e) => {
        (e.target as HTMLImageElement).src = "/user_profile_picture_default.png";
      }}
    />
  );
}

export default TeamProfilePicture;

