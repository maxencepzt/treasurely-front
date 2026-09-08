import { useDecideRequestMutation, useTeamRequestsQuery } from '../../store/slices/api';
import { parseApiError } from '../../utils/api';
import { secondaryClasses, submitClasses } from '../settings/fields';

/** Les demandes en attente d'une équipe, pour son propriétaire : accepter ou refuser. */
export default function PendingRequests({ teamId }: { teamId: number }) {
  const { data, isLoading } = useTeamRequestsQuery({ id: teamId });
  const [decide, { isLoading: deciding, error }] = useDecideRequestMutation();

  if (isLoading || !data) return null;

  return (
    <section aria-labelledby="pending-requests" className="flex flex-col gap-3">
      <h2 id="pending-requests" className="text-xl font-bold text-gray-900">
        Demandes d'adhésion
        {data.member.length > 0 && (
          <span className="ml-2 inline-flex items-center justify-center min-w-6 h-6 px-2 rounded-full bg-green-800 text-white text-sm">
            {data.member.length}
          </span>
        )}
      </h2>
      {data.member.length === 0 ? (
        <p className="text-sm text-gray-600">Aucune demande en attente.</p>
      ) : (
        <ul className="flex flex-col gap-3">
          {data.member.map((joinRequest) => (
            <li key={joinRequest.id} className="flex items-center justify-between gap-3 bg-white rounded-lg border border-gray-200 p-3">
              <span className="font-medium text-gray-900 truncate">{joinRequest.user.nickname}</span>
              <span className="flex gap-2 shrink-0">
                <button
                  type="button"
                  disabled={deciding}
                  onClick={() => void decide({ id: joinRequest.id, teamId, decision: 'refuse' })}
                  className={secondaryClasses}
                >
                  Refuser
                </button>
                <button
                  type="button"
                  disabled={deciding}
                  onClick={() => void decide({ id: joinRequest.id, teamId, decision: 'accept' })}
                  className={`${submitClasses} min-h-11`}
                >
                  Accepter
                </button>
              </span>
            </li>
          ))}
        </ul>
      )}
      {error && <p className="text-sm text-red-700">{parseApiError(error).message}</p>}
    </section>
  );
}
