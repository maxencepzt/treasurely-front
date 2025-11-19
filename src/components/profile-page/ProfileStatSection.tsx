import type { User } from '../../types/api.ts';
import formatDuration from '../../utils/formatDuration.ts';
import ProfileStatCard from './ProfileStatCard.tsx';

export default function ProfileStatSection({ user }: { user: User }) {
  // TODO: Number of enigmes should come from the API
  // TODO: Number of score should come from the API
  return (
    <>
      <h2 className="px-4 pt-2 pb-3 text-lg font-semibold text-gray-800">Stats</h2>
      <div className="flex flex-wrap justify-between px-4 gap-3">
        <ProfileStatCard title="Chasses" emoji="💎" value={user.totalHunt} />
        <ProfileStatCard title="Temps de jeu" emoji="⏲️" value={formatDuration(user.totalTime)} />
        <ProfileStatCard title="Enigmes" emoji="🧩" value={420} />
        <ProfileStatCard title="Score" emoji="🪙" value={8400} />
      </div>
    </>
  );
}