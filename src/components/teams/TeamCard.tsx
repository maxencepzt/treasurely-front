import { type ReactNode } from 'react';
import { Link } from 'react-router';
import { faUsers } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import type { TeamType } from '../../types/api';

const typeLabels = {
  player: { label: 'Joueurs', color: 'bg-blue-100 text-blue-800' },
  designer: { label: 'Concepteurs', color: 'bg-green-100 text-green-800' },
};

type TeamCardProps = {
  id: number;
  name: string;
  type: TeamType;
  description?: string;
  memberCount?: number;
  /** L'action du pied de carte, par exemple le bouton de demande d'adhésion. */
  children?: ReactNode;
};

/** Une équipe en carte : le nom mène à sa page, le type se lit en étiquette. */
export default function TeamCard({ id, name, type, description, memberCount, children }: TeamCardProps) {
  return (
    <div className="h-full bg-white rounded-lg shadow-md p-4 border border-gray-200 flex flex-col gap-3">
      <div className="flex justify-between items-start gap-2">
        <h3 className="text-lg font-semibold text-gray-900 line-clamp-2">
          <Link to={`/teams/${id}`} className="rounded focus:outline-none focus-visible:ring-2 focus-visible:ring-green-700">
            {name}
          </Link>
        </h3>
        <span className={`px-2 py-1 rounded-full text-xs font-medium whitespace-nowrap ${typeLabels[type].color}`}>
          {typeLabels[type].label}
        </span>
      </div>
      {description && <p className="text-sm text-gray-600 line-clamp-2">{description}</p>}
      {memberCount !== undefined && (
        <p className="text-sm text-gray-700 flex items-center gap-1.5">
          <FontAwesomeIcon icon={faUsers} className="text-gray-500" aria-hidden="true" />
          {memberCount} membre{memberCount > 1 ? 's' : ''}
        </p>
      )}
      {children && <div className="mt-auto pt-1">{children}</div>}
    </div>
  );
}
