import { useUserProfile } from '../../hooks/useUserProfile.ts';
import { ProfilePrivate } from './ProfilePrivate.tsx';
import { ProfilePublic } from './ProfilePublic.tsx';

export default function Profile() {
  const { user, loading, error } = useUserProfile();

  if (loading) return <div>Chargement...</div>;
  if (error) return <div>Erreur: {error}</div>;
  if (!user) return <div>Utilisateur non trouvé</div>;
  if (!user.public) return <ProfilePrivate user={user} />;

  return (
    <ProfilePublic user={user} />
  );
}