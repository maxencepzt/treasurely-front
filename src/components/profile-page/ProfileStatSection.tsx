import type { User } from '../../types/api.ts';
import formatDuration from '../../utils/formatDuration.ts';
import ProfileStatCard from './ProfileStatCard.tsx';

export default function ProfileStatSection({ user }: { user: User }) {
  // TODO: Number of enigmes should come from the API
  // TODO: Number of score should come from the API
  return (
    <>
      <span className="pl-4">Stats</span>
      <div className="flex flex-wrap justify-between p-4 gap-y-6">
        <ProfileStatCard title="Chasses" emoji="💎" value={user.totalHunt} />
        <ProfileStatCard title="Temps de jeu" emoji="⏲️" value={formatDuration(user.totalTime)} />
        <ProfileStatCard title="Enigmes" emoji="🧩" value={420} />
        <ProfileStatCard title="Score" emoji="🪙" value={8400} />
      </div>
    </>
  );
}