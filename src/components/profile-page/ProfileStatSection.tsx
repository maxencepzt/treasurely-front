import type { User } from '../../types/api.ts';
import StatTiles from './StatTiles.tsx';

export default function ProfileStatSection({ user }: { user: User }) {
  return (
    <div className="px-4 pt-6 pb-4">
      <h2 className="pb-4 text-xl font-bold text-gray-900">Statistiques</h2>
      <StatTiles user={user} />
    </div>
  );
}
