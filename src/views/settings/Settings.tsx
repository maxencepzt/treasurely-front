import { Loading } from "../../components";
import { useUser } from "../../contexts/user";
import { useProfileUser } from "../../hooks/useProfileUser.ts";
import { parseApiError } from "../../utils/api.ts";
import ErrorView from "../Error.tsx";
import UserSettings from "./UserSettings.tsx";

export default function Settings() {
  const { user: currentUser } = useUser();
  const { user, isLoading, error } = useProfileUser();

  if (isLoading) return <Loading />;

  if (error) {
    const { status, message } = parseApiError(error);
    return <ErrorView status={status} message={message} />;
  }

  if (!user) return <ErrorView status={404} message="Utilisateur non trouvé" />;

  const isOwner = currentUser?.id === user.id;

  if (!isOwner) {
    return <ErrorView status={403} message="Accès interdit : vous ne pouvez pas modifier ce profil" />;
  }

  return <UserSettings user={user} />;
}
