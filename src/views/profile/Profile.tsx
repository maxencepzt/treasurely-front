import { Loading } from "../../components";
import { useUser } from "../../contexts/user";
import { useProfileUser } from "../../hooks/useProfileUser.ts";
import { parseApiError } from "../../utils/api.ts";
import ErrorView from "../Error.tsx";
import { ProfilePrivate } from './ProfilePrivate.tsx';
import { ProfilePublic } from './ProfilePublic.tsx';

export default function Profile() {
  const { user: currentUser } = useUser();
  const { user, isLoading, error } = useProfileUser();

  if (isLoading) return <Loading />;
  if (error) {
    const { status, message } = parseApiError(error);
    return <ErrorView status={status} message={message} />;
  }
  if (!user) return <ErrorView status={404} message="Utilisateur non trouvé" />;

  const isOwner = currentUser?.id === user.id;

  if (!user.public) return <ProfilePrivate user={user} />;

  return <ProfilePublic user={user} isOwner={isOwner} />;
}
