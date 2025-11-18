import type { User } from '../../types/api.ts';
import formatDuration from '../../utils/formatDuration.ts';
import ProfileStatCard from './ProfileStatCard.tsx';

export default function ProfileStatSection({ user }: { user: User }) {
  return (
    <>
      <span className="pl-4">Stats</span>
      <div className="flex flex-wrap justify-between p-4">
        <ProfileStatCard title="Chasses" emoji="💎" value={user.totalHunt} />
        <ProfileStatCard title="Enigmes" emoji="🧩" value={formatDuration(user.totalTime)} />
      </div>
    </>
  );
}