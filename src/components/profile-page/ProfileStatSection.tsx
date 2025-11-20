import type { User } from '../../types/api.ts';
import formatDuration from '../../utils/formatDuration.ts';
import ProfileStatCard from './ProfileStatCard.tsx';

export default function ProfileStatSection({ user }: { user: User }) {
  // TODO: Number of enigmes should come from the API
  // TODO: Number of score should come from the API
  return (
    <div className="px-4 pt-6 pb-4">
      <h2 className="pb-4 text-xl font-bold text-gray-900 flex items-center gap-2">
        <span className="text-2xl">📊</span>
        <span>Statistiques</span>
      </h2>
      <div className="grid grid-cols-2 gap-4">
        <ProfileStatCard title="Chasses" emoji="💎" value={user.totalHunt} />
        <ProfileStatCard title="Temps de jeu" emoji="⏲️" value={formatDuration(user.totalTime)} />
        <ProfileStatCard title="Énigmes" emoji="🧩" value={420} />
        <ProfileStatCard title="Score" emoji="🪙" value={8400} />
      </div>
    </div>
  );
}