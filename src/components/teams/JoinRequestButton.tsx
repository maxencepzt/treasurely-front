import { faCheck } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { useMyTeamRequestsQuery, useRequestToJoinMutation, useWithdrawRequestMutation } from '../../store/slices/api';
import { parseApiError } from '../../utils/api';
import { secondaryClasses, submitClasses } from '../settings/fields';

type JoinRequestButtonProps = {
  teamId: number;
  teamIri: string;
  isMember: boolean;
};

/**
 * L'adhésion à une équipe de joueurs vue de l'extérieur : demander, ou l'état de la demande
 * déjà faite. Un membre lit qu'il l'est.
 */
export default function JoinRequestButton({ teamId, teamIri, isMember }: JoinRequestButtonProps) {
  const { data: requests } = useMyTeamRequestsQuery();
  const [request, { isLoading: requesting, error }] = useRequestToJoinMutation();
  const [withdraw, { isLoading: withdrawing }] = useWithdrawRequestMutation();
  const mine = requests?.member.find((joinRequest) => joinRequest.team['@id'] === teamIri);

  if (isMember || mine?.status === 'accepted') {
    return (
      <p className="inline-flex items-center gap-2 text-sm font-medium text-green-800">
        <FontAwesomeIcon icon={faCheck} aria-hidden="true" />
        Vous en êtes membre
      </p>
    );
  }

  if (mine?.status === 'pending') {
    return (
      <div className="flex items-center justify-between gap-3">
        <span className="text-sm font-medium text-gray-700">Demande envoyée</span>
        <button type="button" onClick={() => void withdraw({ id: mine.id })} disabled={withdrawing} className={secondaryClasses}>
          {withdrawing ? 'Retrait…' : 'Retirer'}
        </button>
      </div>
    );
  }

  if (mine?.status === 'refused') {
    return <p className="text-sm font-medium text-gray-700">Demande refusée</p>;
  }

  return (
    <div className="flex flex-col gap-2">
      <button type="button" onClick={() => void request({ id: teamId })} disabled={requesting} className={`${submitClasses} w-full`}>
        {requesting ? 'Envoi…' : 'Demander à rejoindre'}
      </button>
      {error && <p className="text-sm text-red-700">{parseApiError(error).message}</p>}
    </div>
  );
}
