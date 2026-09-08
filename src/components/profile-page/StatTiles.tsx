import { faCoins, faMap, faPuzzlePiece, faStopwatch } from '@fortawesome/free-solid-svg-icons';

import type { User } from '../../types/api.ts';
import formatDuration from '../../utils/formatDuration.ts';
import ProfileStatCard from './ProfileStatCard.tsx';

/** Les quatre totaux d'un joueur, tels que le serveur les tient à jour. */
export default function StatTiles({ user, className = 'grid-cols-2' }: { user: User; className?: string }) {
  return (
    <div className={`grid gap-4 ${className}`}>
      <ProfileStatCard title="Chasses" icon={faMap} value={user.totalHunt} />
      <ProfileStatCard title="Temps de jeu" icon={faStopwatch} value={formatDuration(user.totalTime)} />
      <ProfileStatCard title="Énigmes" icon={faPuzzlePiece} value={user.totalRiddles} />
      <ProfileStatCard title="Score" icon={faCoins} value={user.totalScore} />
    </div>
  );
}
