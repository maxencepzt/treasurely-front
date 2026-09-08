import { Link } from "react-router";

import { useUserHuntsList } from '../../hooks/useUserHuntsList';
import type {ParticipateHuntAPI} from '../../types/api';
import { Loading } from '..';
import { submitClasses } from '../settings/fields';
import ResumeHuntCard from './ResumeHuntCard';
import UserHuntCard from './UserHuntCard';

interface UserHuntsListProps {
  participateHunts: ParticipateHuntAPI[];
  isLoading?: boolean;
}

export default function UserHuntsList({ participateHunts, isLoading }: UserHuntsListProps) {
  // Le hook ne gère plus que le tri maintenant
  const {
    sortedHunts,
    mostRecentInProgress,
  } = useUserHuntsList(participateHunts);

  if (isLoading) {
    return <Loading />;
  }

  return (
    <div className="space-y-8">
      {/* Resume hunt section */}
      {mostRecentInProgress && (
        <div>
          <ResumeHuntCard participateHunt={mostRecentInProgress} />
        </div>
      )}

      {/* List of all hunts */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Vos chasses au trésor</h2>

        {sortedHunts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {sortedHunts.map((participateHunt) => (
              <UserHuntCard
                key={participateHunt["@id"]}
                participateHunt={participateHunt}
              />
            ))}
          </div>
        ) : (
          <div className="px-8 py-16 bg-white rounded-2xl border-2 border-gray-200 shadow-md">
            <p className="text-gray-500 text-lg text-center mb-6">
              Vous n'avez participé à aucune chasse au trésor pour le moment
            </p>
            <div className="flex justify-center">
              <Link to="/treasure-hunt" className={`${submitClasses} inline-flex items-center`}>
                Découvrir les chasses au trésor
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}