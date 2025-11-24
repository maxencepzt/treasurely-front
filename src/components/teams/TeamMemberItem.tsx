import { useNavigate } from "react-router";
import { faChevronRight } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import type { TeamMember } from "../../types/api";
import { getIdFromUrl } from "../../utils/api";
import ProfilePicture from "../ProfilePicture";

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
        <ProfilePicture type="user" id={memberId} size="md" alt={`Photo de ${member.nickname}`} />

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
