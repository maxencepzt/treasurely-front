import { useNavigate } from "react-router";
import { faChevronRight } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import { API_CONFIG } from "../../config/api";
import type { TeamMember } from "../../types/api";
import { getIdFromUrl } from "../../utils/api";

interface TeamMemberItemProps {
  member: TeamMember;
  isLast?: boolean;
}

/**
 * Composant pour afficher un membre d'équipe cliquable
 * @param member - Le membre à afficher
 * @param isLast - Indique si c'est le dernier membre (pas de séparateur)
 */
export default function TeamMemberItem({ member, isLast = false }: TeamMemberItemProps) {
  const navigate = useNavigate();
  const memberId = getIdFromUrl(member["@id"]);

  const handleClick = () => {
    navigate(`/profile/${memberId}`);
  };

  return (
    <>
      <button
        type="button"
        onClick={handleClick}
        className="w-full flex items-center gap-3 py-3 px-2 hover:bg-gray-50 active:bg-gray-100 transition-colors cursor-pointer"
      >
        {/* Photo de profil */}
        <img
          src={`${API_CONFIG.baseUrl}/api/users/${memberId}/picture`}
          alt={`Photo de ${member.nickname}`}
          className="w-12 h-12 rounded-full border-2 border-green-200 object-cover"
          onError={(e) => {
            e.currentTarget.src = "/user_profile_picture_default.png";
          }}
        />

        {/* Pseudo */}
        <span className="flex-1 text-left text-gray-900 font-medium">
          {member.nickname}
        </span>

        {/* Icône chevron */}
        <FontAwesomeIcon icon={faChevronRight} className="text-gray-400 text-sm" />
      </button>

      {/* Séparateur (sauf pour le dernier membre) */}
      {!isLast && <div className="border-b border-gray-200" />}
    </>
  );
}

