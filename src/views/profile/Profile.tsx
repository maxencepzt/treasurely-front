import { useParams } from "react-router";

import { getErrorMessage, useUserByIdQuery } from "../../store/slices/api.ts";
import { ProfilePrivate } from './ProfilePrivate.tsx';
import { ProfilePublic } from './ProfilePublic.tsx';

export default function Profile() {
  const params = useParams();
  if (!params.id) {
    throw new Error('No id provided.');
  }
  const { data: user, isLoading, error } = useUserByIdQuery({id: parseInt(params.id)});

  if (isLoading) return <div>Chargement...</div>;
  if (error) return <div>Erreur: {getErrorMessage(error)}</div>;
  if (!user) return <div>Utilisateur non trouvé</div>;
  if (!user.public) return <ProfilePrivate user={user} />;

  return (
    <ProfilePublic user={user} />
  );
}